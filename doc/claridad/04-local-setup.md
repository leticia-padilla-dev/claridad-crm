# Fase 0.5 — setup local y verificación de migraciones

Este documento deja el procedimiento reproducible para validar localmente la base de Claridad CRM después de introducir:

- `20260516183000_contact_profile_fields.sql`
- `20260516201500_appointments_entity.sql`
- `20260518120000_customer_events.sql`

El objetivo de esta fase no es construir UI nueva. Es asegurar que la base local:

- aplica las migraciones sin error
- expone `customer_events`
- soporta backfill
- deja una ruta clara para depurar la Fase 1

## Prerrequisitos

- Docker levantado
- Node.js disponible
- CLI de Supabase funcionando vía `npx supabase`

## Reset estándar desde cero

Desde la raíz del repo:

```powershell
npx supabase start
npx supabase db reset
```

Este reset aplica todas las migraciones locales en orden de timestamp.

## Queries de aceptación

Estas son las queries mínimas que se usan para validar el estado:

```powershell
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select count(*) from customer_events;"
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select type, count(*) from customer_events group by type order by 2 desc, 1 asc;"
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select * from customer_events where contact_id = (select id from contacts limit 1) order by occurred_at desc limit 10;"
```

## Interpretación correcta del resultado

Con el `seed.sql` actual del repo, un reset completamente limpio puede dejar:

- `customer_events` creada correctamente
- `count(*) = 0`

Eso no implica un fallo de migración. Significa que el seed no crea todavía suficientes filas en:

- `contact_notes`
- `tasks`
- `appointments`
- `deals`

para que el backfill produzca eventos históricos.

## Rehearsal de backfill sobre datos preexistentes

Para verificar de verdad el backfill de `customer_events`, hay que aplicar la migración sobre una base que ya contenga notas, tareas, citas y oportunidades.

La validación local usada en este slice fue esta:

### 1. Quitar temporalmente la migración final del directorio local

```powershell
Move-Item supabase\migrations\20260518120000_customer_events.sql supabase\migrations\20260518120000_customer_events.sql.bak
```

### 2. Resetear la base solo hasta `appointments`

```powershell
npx supabase db reset
```

La CLI ignorará el archivo `.bak`, así que la base quedará sin `customer_events`.

### 3. Crear datos de humo previos al backfill

```powershell
@'
with new_company as (
  insert into public.companies (name, city, country)
  values ('Mary Kay Demo', 'Madrid', 'ES')
  returning id
), contact_1 as (
  insert into public.contacts (first_name, last_name, city, status, company_id, whatsapp, business_lines_interest)
  select 'Laura', 'Demo', 'Madrid', 'warm', id, '+34600111222', array['Mary Kay']::text[] from new_company
  returning id, company_id
), contact_2 as (
  insert into public.contacts (first_name, last_name, city, status, company_id, whatsapp, business_lines_interest)
  select 'Marta', 'Demo', 'Alcala de Henares', 'cold', id, '+34600333444', array['In Cruises']::text[] from new_company
  returning id, company_id
), note_1 as (
  insert into public.contact_notes (contact_id, text, date)
  select id, 'Primera nota de seguimiento', now() - interval '3 days' from contact_1
), note_2 as (
  insert into public.contact_notes (contact_id, text, date)
  select id, 'Consulta inicial sobre viaje', now() - interval '2 days' from contact_2
), task_1 as (
  insert into public.tasks (contact_id, type, text, due_date, done_date)
  select id, 'follow_up', 'Enviar rutina recomendada', now() - interval '1 day', now() - interval '12 hours' from contact_1
), task_2 as (
  insert into public.tasks (contact_id, type, text, due_date)
  select id, 'follow_up', 'Preparar propuesta In Cruises', now() + interval '2 days' from contact_2
), appointment_1 as (
  insert into public.appointments (contact_id, type, status, scheduled_at, notes)
  select id, 'Asesoria belleza', 'completed', now() - interval '6 hours', 'Sesion completada por videollamada' from contact_1
), deal_1 as (
  insert into public.deals (name, company_id, contact_ids, stage, amount, created_at, updated_at)
  select 'Viaje demo In Cruises', c2.company_id, array[c2.id]::bigint[], 'opportunity', 180000, now() - interval '4 days', now() - interval '4 days' from contact_2 c2
)
select 'ok';
'@ | docker exec -i supabase_db_atomic-crm-demo psql -U postgres -d postgres
```

### 4. Restaurar la migración y aplicarla como pendiente

```powershell
Move-Item supabase\migrations\20260518120000_customer_events.sql.bak supabase\migrations\20260518120000_customer_events.sql
npx supabase migration up
```

### 5. Verificar el backfill

```powershell
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select count(*) from customer_events;"
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select type, count(*) from customer_events group by type order by 2 desc, 1 asc;"
docker exec supabase_db_atomic-crm-demo psql -U postgres -d postgres -c "select c.first_name, c.last_name, ce.type, ce.source, ce.related_table, ce.related_id, ce.occurred_at from customer_events ce join contacts c on c.id = ce.contact_id order by c.id, ce.occurred_at desc, ce.id desc;"
```

## Resultado verificado en este slice

El rehearsal anterior produjo:

```txt
count(*) = 7
```

Distribución por tipo:

```txt
note.created          2
task.created          2
appointment.completed 1
opportunity.created   1
task.completed        1
```

Y un timeline coherente para dos clientas de humo:

- Marta Demo: `opportunity.created` -> `note.created` -> `task.created`
- Laura Demo: `note.created` -> `task.created` -> `task.completed` -> `appointment.completed`

## Dejar la base limpia otra vez

Después del rehearsal, conviene volver al estado normal del repo:

```powershell
npx supabase db reset
```

## Checklist rápido

- [ ] `npx supabase db reset` termina sin error
- [ ] `customer_events` existe
- [ ] el resultado `0 eventos` en reset limpio se interpreta correctamente
- [ ] el rehearsal manual demuestra backfill real
- [ ] `activity_log` sigue accesible
- [ ] la base vuelve a quedar limpia al terminar
