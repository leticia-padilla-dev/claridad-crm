# Plantillas CSV/Sheets para Yoli

> Estas plantillas están preparadas para que Yoli las rellene en Google Sheets o Excel
> y para que luego puedan mapearse a la base de datos real de Claridad CRM sin inventar
> entidades que todavía no existen.

---

## Descargas

- [Clientes](C:/clarida-digital/atomic-crm/doc/claridad/templates/yoli_clientes_template.csv)
- [Citas](C:/clarida-digital/atomic-crm/doc/claridad/templates/yoli_citas_template.csv)

---

## Qué está soportado hoy en la DB

**Listo ahora**

- `contacts`
- `appointments`

**Todavía no como entidad propia en la DB**

- `catalog_links`
- `orders`
- `message_templates`
- `improvement_notes`

Por eso, la plantilla que se puede mandar hoy a Yoli como fuente viva de captura
es la de **Clientes** y la de **Citas**.

---

## Reglas de captura para Yoli

- Un contacto por fila.
- Una cita por fila.
- No mezclar varias personas en la misma fila.
- Usar siempre el mismo nombre de clienta para evitar ambiguedades al importar.
- En `Lineas de interes`, separar varios valores con coma.
- En `Newsletter`, usar solo `true` o `false`.
- En `Cumpleanos`, usar formato `YYYY-MM-DD`.
- En `Fecha`, usar formato `YYYY-MM-DD`.
- En `Hora`, usar formato `HH:MM` en 24h.

---

## Mapeo exacto: Clientes

| Columna en plantilla | Destino DB | Observaciones |
| --- | --- | --- |
| `Nombre` | `contacts.first_name` | Separado para encajar con la DB real. |
| `Apellidos` | `contacts.last_name` | Separado para encajar con la DB real. |
| `WhatsApp` | `contacts.whatsapp` | Numero preferido para botones `wa.me`. |
| `Telefono principal` | `contacts.phone_jsonb[0].number` | Telefono fallback si no hay WhatsApp. |
| `Ciudad` | `contacts.city` | Texto libre. |
| `Cumpleanos` | `contacts.birthday` | Fecha `YYYY-MM-DD`. |
| `Estado cliente` | `contacts.status` | Recomendado: `cold`, `warm`, `hot`, `in-contract`. |
| `Lineas de interes` | `contacts.business_lines_interest` | Valores soportados: `mary-kay`, `beyond-beauty`, `incruises`. |
| `Preferencias` | `contacts.preferences` | Texto libre. |
| `Alergias o necesidades` | `contacts.allergies_or_needs` | Texto libre. |
| `Notas importantes` | `contacts.background` | Nota general de perfil. |
| `Newsletter` | `contacts.has_newsletter` | Solo `true` o `false`. |

### Campos del CSV antiguo de Yoli que NO son verdad funcional todavia

Estos dos campos no tienen hoy una columna propia ni deben modelarse como verdad de dominio
hasta que exista `orders`:

- `Productos favoritos`
- `Ultima compra`

Si Yoli necesita conservarlos temporalmente, lo correcto es tratarlos como:

- texto dentro de `Preferencias`
- o texto dentro de `Notas importantes`

pero **no** como campos transaccionales canonicos.

---

## Mapeo exacto: Citas

| Columna en plantilla | Destino DB | Observaciones |
| --- | --- | --- |
| `Cliente (nombre exacto)` | `appointments.contact_id` | Se resuelve por nombre exacto contra `contacts`. |
| `Tipo de cita` | `appointments.type` | Valores soportados: `consultation`, `delivery`, `demonstration`, `follow_up`, `video_call`. |
| `Fecha` | `appointments.scheduled_at` | Se combina con `Hora`. |
| `Hora` | `appointments.scheduled_at` | Se combina con `Fecha`. |
| `Estado` | `appointments.status` | Valores soportados: `pending`, `confirmed`, `completed`, `cancelled`. |
| `Notas` | `appointments.notes` | Texto libre. |

### Importante sobre `Linea de negocio`

La DB actual de `appointments` **no** tiene una columna `business_line`.

Hoy esa informacion solo puede venir por una de estas vias:

- inferida desde `contacts.business_lines_interest`
- inferida desde `contacts.company_id` si se sigue usando
- escrita dentro de `appointments.notes` como referencia manual

Por eso la plantilla de Citas **no** incluye `Linea de negocio` como columna canonica.

---

## Valores recomendados para Yoli

### Estados de cliente

- `cold`
- `warm`
- `hot`
- `in-contract`

### Lineas de interes

- `mary-kay`
- `beyond-beauty`
- `incruises`

### Tipos de cita

- `consultation`
- `delivery`
- `demonstration`
- `follow_up`
- `video_call`

### Estados de cita

- `pending`
- `confirmed`
- `completed`
- `cancelled`

---

## Lo que queda para despues

Estas plantillas no se incluyen todavia porque la DB aun no tiene su entidad final:

- Pedidos
- Catalogos y enlaces
- Mensajes frecuentes
- Problemas y mejoras

Cuando existan sus modelos reales, se crea una plantilla por entidad siguiendo la misma regla:

```txt
primero existe la entidad
despues existe la plantilla
despues existe el importador
```

---

## Recomendacion para C-010

Para la sesion de kickoff de `C-010`, yo usaria estas dos plantillas asi:

1. `Clientes` como hoja viva principal de carga inicial.
2. `Citas` como hoja de agenda manual hasta que Today screen este operativo.

Y dejaria fuera del kickoff:

- pedidos
- catalogos
- mensajes
- mejoras

porque todavia no tienen caja propia estable en la DB.
