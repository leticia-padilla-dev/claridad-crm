# Modelo de pedidos (`orders`)

## Qué representa

Un pedido es una **salida transaccional confirmada** entre Yoli y una clienta. Implica un intercambio económico real: producto entregado a cambio de pago.

Aplica únicamente a:

- **Mary Kay** — pedidos de catálogo físico
- **Beyond Beauty** — solo cuando existe transacción real (no simple interés)

**No aplica a In Cruises.** Los cruceros son procesos comerciales de largo ciclo sin transacción inmediata → pertenecen al modelo de [oportunidades](./opportunities-model.md).

---

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `bigint` identity | sí | PK autoincremental |
| `contact_id` | `bigint` FK → `contacts` | sí | Clienta que hace el pedido |
| `business_line` | `text` check | sí | `'mary-kay'` \| `'beyond-beauty'` |
| `status` | `text` check | sí | Ver estados más abajo |
| `total_amount` | `numeric(10,2)` | no | Monto total en la moneda configurada del sistema. Null si no se captura al crear |
| `notes` | `text` | no | Observaciones libres (qué pidió, acordado, etc.) |
| `catalog_link_id` | `bigint` FK → `catalog_links` | no | Catálogo o enlace de campaña que originó el pedido. Null si el pedido llega por otro canal |
| `sales_id` | `bigint` FK → `sales` | no | Vendedora que registra. Null = sin asignar |
| `created_at` | `timestamptz` default `now()` | sí | Fecha de creación del registro |
| `updated_at` | `timestamptz` default `now()` | sí | Última modificación |

### Campos fuera de scope V1

- Líneas de detalle (`order_items`) — no hay inventario real en V1
- SKU / referencia de producto — se captura en `notes` si se necesita
- Dirección de entrega — se usa la del contacto
- Método de pago — no hay integración de pagos

---

## Estados y transiciones

```
nuevo → confirmado → pendiente_de_pago → pagado → entregado
                                       ↘
                                        cancelado
  (cualquier estado puede → cancelado)
```

| Estado | Significado |
|---|---|
| `nuevo` | Pedido registrado, aún no confirmado con la clienta |
| `confirmado` | Clienta confirmó qué quiere, pendiente de surtir |
| `pendiente_de_pago` | Producto listo o entregado, esperando pago |
| `pagado` | Pago recibido |
| `entregado` | Producto en manos de la clienta y pago completo |
| `cancelado` | Pedido cancelado en cualquier punto |

---

## Relaciones

```
contacts 1 ──< orders >── 0..1 catalog_links
                  │
                  └── business_line: 'mary-kay' | 'beyond-beauty'
                  └── sales_id → sales
```

- Un contacto puede tener múltiples pedidos (historial de compras).
- Un pedido pertenece a exactamente un contacto.
- El `catalog_link_id` es opcional: un pedido puede existir sin enlace asociado (llegó por referido, WhatsApp directo, etc.).
- `business_line` es `text` con check constraint, no FK a una tabla separada — igual que en `catalog_links`.

---

## Separación respecto a `opportunities`

| Dimensión | `orders` | `opportunities` |
|---|---|---|
| Naturaleza | Transaccional | Comercial no transaccional |
| Líneas de negocio | Mary Kay, Beyond Beauty | In Cruises, asesorías |
| Implica pago inmediato | Sí | No |
| Ciclo típico | Días | Semanas / meses |
| Termina en entrega física | Sí | No necesariamente |
| Puede generar un `order` | No aplica | Sí, si la oportunidad se gana y hay transacción |

---

## Separación respecto a `deals`

`deals` es la entidad Kanban heredada de Atomic CRM. En Claridad V1 no se usa para pedidos ni oportunidades — tiene su propia UI de pipeline y stage configurables. Si en el futuro se decide migrar, se evaluará en un slice separado. Por ahora `orders` y `deals` coexisten sin relación.

---

## Integración con `customer_events`

Los eventos ya están definidos en el check constraint de `customer_events.type`:

| Evento | Cuándo se emite |
|---|---|
| `order.created` | Al crear el pedido (status `nuevo`) |
| `order.paid` | Al pasar a status `pagado` |
| `order.delivered` | Al pasar a status `entregado` |

El campo `customer_events.related_table = 'orders'` y `related_id = orders.id` vincula el evento al pedido específico.

---

## Implicaciones técnicas futuras

- **Schema**: nueva tabla `public.orders` + migración. Vista `contacts_summary` deberá incluir `orders_count` y `last_order_at`.
- **Provider**: nuevo resource `orders` en `dataProvider`. En FakeRest: generador en `dataGenerator/orders.ts`.
- **Resources**: nueva sección en el CRM — accesible desde el perfil del contacto (tab "Pedidos") y opcionalmente como lista global.
- **Trigger**: al cambiar `status` a `pagado` o `entregado`, emitir el `customer_event` correspondiente vía trigger o desde el frontend.
- **No requiere** tabla de `order_items` en V1 — si se necesita desglose de productos, se añade en un slice posterior.
