# Modelo de oportunidades (`opportunities`)

## Qué representa

Una oportunidad es un **proceso comercial no transaccional** de ciclo largo. Hay interés real de la clienta, pero no hay un intercambio económico inmediato ni un producto físico a entregar.

Aplica a:

- **In Cruises** — interés en un crucero, cotización, seguimiento hasta reserva
- **Asesorías** — proceso consultivo o de acompañamiento
- **Procesos de largo ciclo** — cualquier línea de negocio donde la conversión tarda semanas o meses

**No aplica a pedidos transaccionales de Mary Kay ni Beyond Beauty.** Esos son [pedidos](./orders-model.md).

---

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `bigint` identity | sí | PK autoincremental |
| `contact_id` | `bigint` FK → `contacts` | sí | Clienta o prospecto |
| `business_line` | `text` check | sí | `'incruises'` \| `'mary-kay'` \| `'beyond-beauty'` \| `'other'` |
| `title` | `text` | sí | Descripción corta de la oportunidad ("Crucero Caribe nov 2026", "Asesoría nutrición") |
| `status` | `text` check | sí | Ver estados más abajo |
| `notes` | `text` | no | Observaciones de seguimiento libre |
| `expected_close_date` | `date` | no | Fecha estimada de cierre o decisión |
| `sales_id` | `bigint` FK → `sales` | no | Vendedora responsable |
| `created_at` | `timestamptz` default `now()` | sí | Fecha de creación |
| `updated_at` | `timestamptz` default `now()` | sí | Última modificación |

### Campos fuera de scope V1

- `amount` — en V1 no se captura valor económico estimado de la oportunidad (puede añadirse en V2)
- `related_order_id` — si una oportunidad termina en pedido, se vinculará cuando `orders` esté implementado
- Pipeline kanban — en V1 la vista es lista + estado, no tablero; el tablero de `deals` es independiente

---

## Estados y transiciones

```
nueva → activa → en_evaluación → ganada
                              ↘
                               perdida
                               pausada

  (activa y en_evaluación también pueden → pausada o perdida)
```

| Estado | Significado |
|---|---|
| `nueva` | Interés detectado, aún no hay seguimiento activo |
| `activa` | Seguimiento en curso, hay contacto reciente |
| `en_evaluación` | La clienta está considerando activamente, cerca de decidir |
| `pausada` | Interés existe pero la clienta pidió esperar o no hay respuesta |
| `ganada` | Oportunidad cerrada positivamente (reserva, contrato, acuerdo) |
| `perdida` | Oportunidad cerrada negativamente (no le interesó, eligió otra opción) |

**Criterios de cierre:** `ganada`, `perdida`, `pausada` son estados terminales en V1 — una oportunidad pausada puede reactivarse (→ `activa`) pero se registra como nuevo ciclo.

---

## Relaciones

```
contacts 1 ──< opportunities
                  │
                  └── business_line: 'incruises' | 'mary-kay' | 'beyond-beauty' | 'other'
                  └── sales_id → sales
```

- Un contacto puede tener múltiples oportunidades abiertas simultáneamente (una por crucero, una por asesoría, etc.).
- No hay relación directa con `catalog_links` en V1 — si el origen fue un catálogo compartido, se captura en `notes`.
- La relación futura con `orders` ("oportunidad ganada → genera pedido") se modelará cuando `orders` esté implementado, via `related_order_id`.

---

## Separación respecto a `tasks` y `appointments`

| Entidad | Qué es |
|---|---|
| `tasks` | Acción puntual pendiente ("llamar el martes", "enviar cotización") |
| `appointments` | Reunión/cita agendada con fecha y hora |
| `opportunities` | Proceso comercial completo que agrupa múltiples tasks y citas |

Una oportunidad **no reemplaza** tasks ni citas — las contiene conceptualmente. En V1 no hay FK explícita entre tasks/appointments y opportunities; el vínculo es a través del `contact_id` compartido y el timeline de `customer_events`.

---

## Separación respecto a `deals`

`deals` es la entidad Kanban heredada de Atomic CRM con stages configurables. En Claridad V1 `opportunities` es una entidad separada orientada al flujo de negocio real de Yoli. Coexisten sin relación. Si en el futuro se decide unificar, se evaluará en un slice de refactor.

---

## Integración con `customer_events`

Los eventos ya están definidos en el check constraint de `customer_events.type`:

| Evento | Cuándo se emite |
|---|---|
| `opportunity.created` | Al crear la oportunidad |
| `opportunity.stage_changed` | Al cambiar `status` (excepto cierre) |
| `opportunity.won` | Al pasar a `ganada` |
| `opportunity.lost` | Al pasar a `perdida` |

El campo `customer_events.related_table = 'opportunities'` y `related_id = opportunities.id` vincula el evento a la oportunidad específica.

---

## Implicaciones técnicas futuras

- **Schema**: nueva tabla `public.opportunities` + migración. Vista `contacts_summary` deberá incluir `open_opportunities_count` y `last_opportunity_at`.
- **Provider**: nuevo resource `opportunities` en `dataProvider`. En FakeRest: generador en `dataGenerator/opportunities.ts`.
- **Resources**: accesible desde el perfil del contacto (tab "Oportunidades") y como lista global con filtro por `status` y `business_line`.
- **Trigger**: al cambiar `status`, emitir el `customer_event` correspondiente.
- **Futura vinculación con `orders`**: cuando una oportunidad de Mary Kay o Beyond Beauty termina en transacción, un campo `related_order_id` en `orders` apuntará a la oportunidad origen.
