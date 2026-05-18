# `customer_events` — diseño del núcleo del producto

> Esta tabla es el corazón técnico de Claridad CRM.
> Si está bien diseñada hoy, la pantalla "Hoy" y el timeline unificado
> se vuelven queries triviales. Si está mal diseñada, todo lo demás duele.

Migración SQL: `supabase/migrations/20260518120000_customer_events.sql`

---

## Prerrequisitos de migración

`customer_events` asume que estas dos migraciones se aplicaron antes
(corren automáticamente por orden de timestamp):

| Migración | Aporta | Estado actual en producción |
|-----------|--------|------------------------------|
| `20260516183000_contact_profile_fields.sql` | `contacts.birthday`, `contacts.whatsapp`, `contacts.city`, `contacts.preferences`, `contacts.allergies_or_needs`, `contacts.business_lines_interest text[]` | **Pendiente de aplicar** |
| `20260516201500_appointments_entity.sql` | tabla `appointments` | **Pendiente de aplicar** |

Si por alguna razón se aplica `customer_events` antes que `appointments`,
el trigger y el backfill de appointments se omiten silenciosamente
(la migración usa `DO` blocks defensivos con `information_schema.tables`).
Cuando luego se aplique `appointments_entity`, hay que volver a correr
manualmente el trigger y el backfill — o reaplicar `customer_events`.

**Recomendación operativa:** aplica las tres migraciones de golpe en
orden de timestamp. No las separes.

---

## Por qué existe esta tabla

Atomic CRM ya tenía una vista `activity_log` (migración `20260314120000_activity_log_view.sql`) que aglutina eventos vía UNIONs entre `companies`, `contacts`, `contact_notes`, `deals`, `deal_notes`.

Esa vista **funciona para auditoría**, pero no sirve como núcleo del producto Claridad porque:

1. Es **read-only**. No puedes registrar eventos manuales como `whatsapp.opened`, `catalog.shared`, `birthday.celebrated` — y esos son exactamente los eventos que más le importan a Yoli.
2. No tiene **payload flexible**. Cada UNION devuelve un row entero de la tabla original; no hay espacio para metadatos específicos del evento.
3. Los UNIONs **no escalan**. Cada vez que añadas una fuente nueva (appointments, orders, catalog_shares) tienes que reescribir la vista. Y los planes de ejecución degradan.
4. No hay **índice por `(contact_id, occurred_at)`** — la query más frecuente del producto.

Por eso `customer_events` es una **tabla real, append-only**, alimentada por triggers desde las tablas operativas. Es la pieza que convierte Claridad en un workspace event-driven.

---

## Modelo de datos

```
customer_events
├── id               bigint PK
├── contact_id       bigint  → contacts(id)  (NOT NULL)
├── business_line_id bigint  → companies(id) (nullable)
├── type             text    (enum lógico, ver más abajo)
├── occurred_at      timestamptz  (cuándo pasó realmente)
├── payload          jsonb   (datos específicos del tipo)
├── source           text    (manual | system | calendar_sync | csv_import | whatsapp_link)
├── sales_id         bigint  → sales(id)
├── related_table    text    (nombre de la tabla origen, e.g. 'contact_notes')
├── related_id       bigint  (id en la tabla origen)
└── created_at       timestamptz  (cuándo se insertó la fila)
```

### Decisiones de diseño explícitas

**`occurred_at` vs `created_at`**
Dos timestamps distintos a propósito. `occurred_at` es cuándo pasó el evento desde el punto de vista del negocio (puede ser pasado o futuro). `created_at` es cuándo se insertó la fila. Importa porque un evento puede registrarse retroactivamente ("Yoli marca: hablé con Laura ayer").

**`payload` como `jsonb`**
No quiero columnas específicas por tipo de evento (eso es lo que la vista `activity_log` hace mal). Cada tipo guarda lo que necesita, validado en aplicación. Si en el futuro un tipo crece lo suficiente para justificar columnas propias, se promueve.

**`type` con `CHECK constraint`**
Lista cerrada de tipos válidos. Añadir un tipo nuevo requiere migración explícita. Esto es deliberado: previene que cada desarrollador invente su propio `type` y rompa los consumidores.

**`source` separado de `type`**
Un mismo tipo (`note.created`) puede venir de varias fuentes (manual, importación CSV, sistema). Diferenciarlo permite responder "¿cuántas notas creó Yoli manualmente esta semana?" sin trampas.

**`related_table` + `related_id`**
Para volver al registro original sin joins frágiles. Ejemplo: si un evento `task.created` apunta a `tasks.id = 42`, abrir la tarea desde el timeline es directo.

**Append-only enforced por policies, no triggers**
No se crean policies de `UPDATE` ni `DELETE` para usuarios autenticados. Si necesitas "corregir" un evento, insertas uno compensatorio. Esto preserva la historia real y simplifica el modelo mental.

---

## Tipos de eventos

### Activos en la migración backbone

| Tipo                        | Cuándo se dispara                         | Fuente típica |
| --------------------------- | ----------------------------------------- | ------------- |
| `note.created`              | Insert en `contact_notes`                 | system        |
| `task.created`              | Insert en `tasks`                         | system        |
| `task.completed`            | `tasks.done_date` pasa de null a valor    | system        |
| `appointment.created`       | Insert en `appointments`                  | system        |
| `appointment.completed`     | Cambio de cita a completada               | system        |
| `appointment.cancelled`     | Cambio de cita a cancelada                | system        |
| `opportunity.created`       | Insert en `deals`                         | system        |
| `opportunity.stage_changed` | Cambio en `deals.stage`                   | system        |

### Reservados para fases posteriores

| Tipo                      | Uso previsto |
| ------------------------- | ------------ |
| `note.updated`            | editar notas |
| `whatsapp.opened`         | CTA WhatsApp |
| `session.opened`          | métrica madre |
| `email.sent`              | email futuro |
| `task.snoozed`            | posponer seguimiento |
| `opportunity.won`         | cierre comercial |
| `opportunity.lost`        | cierre comercial |
| `order.created`           | pedidos |
| `order.paid`              | pedidos |
| `order.delivered`         | pedidos |
| `catalog.shared`          | compartir catálogo |
| `birthday.celebrated`     | CTA cumpleaños |
| `reactivation.attempted`  | reactivación |

Añadir tipos nuevos = migración + actualizar este documento. No se inventan tipos sobre la marcha.

---

## Triggers automáticos (en la migración)

Ya implementados:

- `contact_notes INSERT` → `note.created`
- `tasks INSERT` → `task.created`
- `tasks UPDATE` (done_date) → `task.completed`
- `appointments INSERT` → `appointment.created` / `.completed` / `.cancelled` según status
- `deals INSERT` → `opportunity.created` (un evento por cada contact_id del array)
- `deals UPDATE` (stage) → `opportunity.stage_changed`

Eventos **NO automáticos** (se insertan desde la aplicación):

- `whatsapp.opened` — desde el botón en la UI
- `catalog.shared` — desde el botón "compartir catálogo"
- `birthday.celebrated` — desde el botón "felicitar"
- `task.snoozed` — desde acción "posponer"
- `reactivation.attempted` — desde acción "contactar clienta fría"

---

## Backfill

La migración incluye `INSERT ... SELECT ... ON CONFLICT DO NOTHING` para poblar eventos a partir de:

- Todas las `contact_notes` existentes → `note.created`
- Todas las `tasks` existentes → `task.created`
- Todas las `tasks` con `done_date` → `task.completed`
- Todas las `appointments` existentes
- Todas las `deals` existentes → `opportunity.created` (un evento por contact_id en el array)

**Importante:** el backfill se ejecuta una sola vez al aplicar la migración. Si en el futuro hay que reescribir el histórico (por bugs), se hace con un script de mantenimiento separado, no editando esta migración.

---

## Queries clave del producto

### Timeline de un contacto

```sql
select *
from public.customer_events
where contact_id = $1
order by occurred_at desc
limit 50;
```

Usa el índice `customer_events_contact_id_occurred_at_idx`. Lectura instantánea incluso con millones de eventos.

### Pantalla "Hoy" — seguimientos vencidos

Esta sigue viviendo en `tasks` (no en `customer_events`), porque tasks tiene estado actual.
Para el botón "Abrir WhatsApp" preferimos `contacts.whatsapp` (columna dedicada,
añadida por la migración `contact_profile_fields`); si está null, caemos al primer
teléfono de `contacts.phone_jsonb`:

```sql
select
    t.id, t.text, t.due_date, t.type,
    c.id as contact_id, c.first_name, c.last_name, c.company_id,
    coalesce(
        c.whatsapp,
        c.phone_jsonb->0->>'number'
    ) as whatsapp_number
from public.tasks t
join public.contacts c on c.id = t.contact_id
where t.done_date is null
  and t.due_date <= current_date
  and t.sales_id = $1
order by t.due_date asc
limit 10;
```

**Forma del campo `phone_jsonb`:**
```json
[
  {"number": "+34 600 000 000", "type": "Work"},
  {"number": "+34 611 111 111", "type": "Home"}
]
```

### Pantalla "Hoy" — última actividad por clienta (cohorte de frías)

```sql
select c.id, c.first_name, c.last_name,
       max(e.occurred_at) as last_activity
from public.contacts c
left join public.customer_events e on e.contact_id = c.id
where c.sales_id = $1
group by c.id
having max(e.occurred_at) < now() - interval '30 days'
   or max(e.occurred_at) is null
order by last_activity asc nulls first
limit 20;
```

### Cumpleaños hoy

Independiente de `customer_events`. Requiere la migración
`contact_profile_fields` aplicada (añade la columna `birthday`):

```sql
select
    id, first_name, last_name, birthday,
    coalesce(whatsapp, phone_jsonb->0->>'number') as whatsapp_number
from public.contacts
where birthday is not null
  and to_char(birthday, 'MM-DD') = to_char(current_date, 'MM-DD')
  and sales_id = $1;
```

### Citas de hoy

```sql
select a.*, c.first_name, c.last_name
from public.appointments a
join public.contacts c on c.id = a.contact_id
where a.scheduled_at >= current_date
  and a.scheduled_at < current_date + interval '1 day'
order by a.scheduled_at asc;
```

### Métrica madre: ¿abrió Claridad antes que WhatsApp?

Se materializa eventualmente como:

```sql
-- Eventos whatsapp.opened originados desde Claridad por día
select date_trunc('day', occurred_at) as day, count(*)
from public.customer_events
where type = 'whatsapp.opened'
  and source = 'whatsapp_link'
  and sales_id = $1
group by 1
order by 1 desc;
```

Si `whatsapp.opened` aparece en un día = Claridad fue el origen del contacto ese día = la clave del producto.

---

## Consideraciones futuras

### Particionamiento

A partir de ~10M de filas, particionar por `occurred_at` mensual o trimestralmente. Esto es trivial añadirlo después si se ha mantenido `occurred_at` como columna clave en los índices. Hoy NO se particiona — overkill prematuro.

### Migración cuando llegue multi-tenant

Si en el futuro hay `tenant_id`, esta tabla debe tenerlo. Añadir como columna y reindexar. El diseño actual no lo bloquea.

### Cuando appointments / orders crezcan

Pueden tener tablas hijas con detalles (líneas de pedido, recurrencias). `customer_events` sigue teniendo una fila por evento de alto nivel — los detalles viven en sus tablas. No se duplica el árbol.

### Reemplazar la vista `activity_log`

A medio plazo, `customer_events` debería sustituir la vista `activity_log`. No se hace en esta migración para no romper consumidores actuales. Cuando el producto esté validado, se reescribe `activity_log` como `select * from customer_events`.

---

## Lo que NO hace esta tabla (importante)

- **NO almacena mensajes literales de WhatsApp.** Solo registra que se abrió. Los mensajes viven en WhatsApp.
- **NO almacena contenido de notas.** Solo un `preview` de 200 caracteres. Las notas completas siguen en `contact_notes`.
- **NO sustituye a `tasks`, `appointments`, `deals`, `orders`.** Esas tablas siguen siendo la fuente de verdad de su estado actual. `customer_events` es solo la **bitácora**.
- **NO es para analytics corporativo.** Si en algún momento necesitas BI, se exporta a un warehouse. Esta tabla es operacional, no analítica.

---

## Test de aceptación de la migración

Antes de marcar la fase como completa:

1. Aplicar migración en local: `make supabase-reset` o equivalente.
2. Verificar que el backfill creó al menos N eventos (donde N = filas de `contact_notes` + tareas + citas + deals×contactos).
3. Crear una nota nueva manualmente → verificar que aparece evento `note.created`.
4. Completar una tarea → verificar `task.completed`.
5. Cambiar stage de un deal → verificar `opportunity.stage_changed`.
6. Query del timeline de un contacto retorna en <50ms con 10K eventos.

Si los 6 pasos pasan, la migración está lista para producción.

---

## Próximo paso

Una vez aplicada esta migración, la fase 1 puede empezar:

**Slice 1.1** — Construir la vista de Timeline en la página de un contacto.
**Slice 1.2** — Construir la sección "Seguimientos vencidos" de la pantalla "Hoy".
**Slice 1.3** — Botón "Abrir WhatsApp" que inserta evento `whatsapp.opened`.

Cada slice = 1 PR. Ver `03-claridad-product-readme.md` para las reglas.
