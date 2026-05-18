# Claridad CRM — Product README

> Claridad CRM no es un CRM B2B clásico.
> Es un workspace operativo visual para negocios relacionales humanos que
> ya viven en WhatsApp y Google Workspace.

---

## Lo que es y lo que no es

**Lo que SÍ es:**
Una capa organizativa que pone contexto encima de la operación diaria de una vendedora relacional. Le dice qué requiere acción HOY y le lleva a WhatsApp en dos toques.

**Lo que NO es:**
Un mini Salesforce. Un mini HubSpot. Un ERP. Un reemplazo de Google Workspace. Un chatbot de IA. Un sistema de inventario. Un dashboard corporativo.

Si en algún momento alguna decisión te empuja hacia cualquiera de las cosas de la lista "NO es", releer este documento.

---

## La arquitectura de cuatro capas

```
┌──────────────────────────────────────────────────────────────┐
│                                                                │
│   CLARIDAD   ·  capa de contexto e inteligencia operativa      │
│   ─────────                                                    │
│   · pantalla "Hoy"                                             │
│   · timeline unificado por clienta                             │
│   · cohortes (clientas frías, oportunidades calientes)         │
│   · plantillas con variables                                   │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│   WHATSAPP   ·  capa de acción                                 │
│   ────────                                                     │
│   · canal real de comunicación                                 │
│   · destino de casi todas las acciones                         │
│   · ejecuta lo que Claridad organiza                           │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│   GOOGLE WORKSPACE   ·  capa de ejecución                      │
│   ─────────────────                                            │
│   · Calendar ejecuta las citas                                 │
│   · Drive guarda los catálogos y archivos                      │
│   · Sheets es el on-ramp de datos (no fuente de verdad viva)   │
│   · Gmail cuando haga falta correo                             │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│   ATOMIC CRM   ·  shell técnico                                │
│   ───────────                                                  │
│   · React + shadcn-admin-kit + Supabase                        │
│   · entidades base (contacts, tasks, deals, notes)             │
│   · auth, storage, infra                                       │
│   · NO se reinventa: se adapta                                 │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**Cada feature debe vivir en una sola capa.**
Si una propuesta vive en dos capas a la vez (ejemplo: "mensajería propia dentro de Claridad"), es señal de que se está invadiendo una capa que no le corresponde. Rechazar o reformular.

---

## Los cuatro compromisos

Estos compromisos están escritos para protegerse a uno mismo del scope creep durante los próximos 60-90 días. No son aspiraciones — son reglas.

### 1. No abro un editor de código hasta tener la pantalla "Hoy" dibujada en papel y validada con la primera usuaria real.

El wireframe está en `01-today-screen-wireframe.md`. Antes de implementar cualquier slice, mostrárselo a Yoli y registrar su reacción en `improvement_notes` o equivalente.

### 2. No añado una tabla nueva hasta que `customer_events` esté implementada y alimentada por al menos una entidad existente.

La migración está en `supabase/migrations/20260518120000_customer_events.sql`. La razón: si construyes catalog_links, orders, message_templates antes de tener el timeline funcionando, vas a tener N timelines distintos al final y vas a sufrir.

### 3. No considero "completada" la fase 1 hasta que Yoli haya usado Claridad durante 14 días consecutivos sin que yo le recuerde abrirla.

La métrica madre del proyecto es: **¿cuántos días a la semana abre Claridad antes que WhatsApp?**. Sin este hábito, el producto no existe, aunque tenga 30 features.

### 4. Si en algún momento siento la tentación de añadir gráficos, dashboards, forecasting, KPIs corporativos o "ERP-light", releo este documento.

Esta tentación va a aparecer. Cada vez. La regla es no ceder.

---

## El producto en una pantalla

```
Abrir Claridad
→ ver qué requiere acción hoy
→ tocar botón
→ estar en WhatsApp con el mensaje correcto
→ marcar seguimiento
```

Eso es el producto. Todo lo demás es soporte para que ese flujo funcione.

**Regla absoluta de UX:** cualquier elemento accionable debe llegar a WhatsApp en **≤2 toques**.

---

## Roadmap

| Fase | Contenido | Duración objetivo |
| ---- | --------- | ----------------- |
| 0 | Adaptación de superficie de Atomic (terminología, tags, copy) | ya iniciada |
| 0.5 | **Aplicar migraciones pendientes** (`contact_profile_fields`, `appointments_entity`, `customer_events`) | 1 día |
| 1 | **Pantalla "Hoy" + Timeline unificado** (corazón del producto) | 3-4 semanas |
| 2 | Appointments (vista en "Hoy" + sync ligero con Calendar) | 2 semanas |
| 3 | Catalog_links (vista + botón WhatsApp con plantilla) | 2 semanas |
| 4 | Opportunities pulidas para In Cruises (vista kanban ligera) | 2-3 semanas |
| 5 | Orders ligeros (con límites duros: NO ERP) | 3 semanas |
| 6 | Importador CSV visual desde Sheets | 2 semanas |
| 7 | Automatización ligera (recordatorios condicionales) | 2-3 semanas |
| 8 | IA (resumen de clienta, sugerencia de seguimiento) | cuando todo lo anterior esté validado |

**Antes de pasar de fase, las dos preguntas obligatorias:**

1. ¿Yoli usó la fase actual durante 14 días seguidos por iniciativa propia?
2. ¿Qué evidencia tengo de que esta fase resuelve un dolor real, no uno imaginado?

Si la respuesta a cualquiera de las dos es ambigua, no se pasa de fase. Se itera.

---

## Decisiones técnicas fijadas

**Orders ≠ Deals**
Orders son registros transaccionales históricos. Deals son procesos comerciales abiertos. NO se mezclan, NO se convierten unos en otros.

**Business line como dimensión transversal**
Una clienta puede estar interesada en varias líneas (Mary Kay + In Cruises). En V1 se resuelve con la columna `contacts.business_lines_interest text[]` que ya añade la migración `20260516183000_contact_profile_fields.sql` — es un array de líneas de interés por clienta. Si en el futuro el modelo crece (e.g. necesita metadata por relación: prioridad, fecha de interés, estado), se promueve a tabla `contact_business_lines` (many-to-many). Por ahora el array es suficiente y NO se usa `contacts.company_id` como única dimensión.

**Google Sheets = on-ramp, no fuente viva**
Sheets sirve para importar/exportar/backup. Una vez que un dato entra en Claridad, Claridad manda. NO sincronización bidireccional viva.

**WhatsApp = `wa.me` links, no API de Meta**
V1-V2 usan deep links `wa.me/<telefono>?text=...`. WhatsApp Business API NO se considera hasta validar producto y modelo de negocio.

**Append-only para customer_events**
Eventos no se editan ni se borran. Para corregir un evento erróneo se inserta uno compensatorio.

**Atomic CRM = shell, no se reescribe**
Si una decisión te empuja a reescribir Atomic, es señal de que estás haciendo algo mal. Adaptar, no reescribir.

---

## Lo que NO se construye en esta fase

Lista explícita de prohibiciones. Si alguien (incluido yo) propone construir algo de esta lista en Fase 1-3, responder con el link a este documento.

- ❌ Dashboards de revenue, forecast, KPIs
- ❌ Pipeline view enterprise (kanban de deals con múltiples columnas configurables)
- ❌ Sistema de inventario / stock
- ❌ Facturación / pagos / cobros
- ❌ Logística / envíos / tracking
- ❌ Notificaciones push masivas
- ❌ Email marketing / newsletter
- ❌ Integración con redes sociales (Instagram, Facebook ads)
- ❌ Chatbot IA, asistente conversacional, copiloto
- ❌ Multi-idioma (V1 es solo español)
- ❌ Multi-tenancy automático con onboarding (V1 es single-tenant: Yoli)
- ❌ Roles complejos / permisos granulares
- ❌ Exportación a sistemas contables
- ❌ Generación de reportes PDF
- ❌ Tema oscuro / temas personalizables
- ❌ Tour onboarding in-app

Si en Fase 7-8 alguna de estas tiene sentido, se reabre la conversación. Hasta entonces, no.

---

## Workflow de desarrollo

Tomado del documento de decisiones del proyecto, no negociable:

```
1 issue → 1 rama → 1 PR → 1 intención técnica
```

- No merge sin revisión.
- Limpieza de ramas tras merge.
- PR con plantilla.
- Slices estrechos. Si un PR toca >15 archivos, probablemente debió ser dos PRs.
- Evitar refactors masivos en PRs de feature.
- Build y tests verdes antes de merge.
- Cada PR de feature actualiza la documentación relevante si cambia el modelo.

---

## La métrica madre

Una sola métrica define éxito o fracaso de Claridad:

> **¿Cuántos días a la semana Yoli abre Claridad antes que WhatsApp?**

- 0 días → el producto no existe.
- 1–2 días → es archivo, no herramienta.
- 4–5 días → ganaste.

Esta métrica no se mide con analytics complejos. Se mide preguntando a Yoli cada viernes durante el piloto. Una pregunta. Una respuesta. Toda la información que necesitas.

---

## Test de aceptación de la Fase 1

A los 30 días de Yoli usándolo, hacerle estas tres preguntas sin contexto ni guía:

1. "Si mañana borrara Claridad de tu móvil, ¿lo echarías de menos?"
2. "¿Hay algo que antes hacías en WhatsApp o en notas que ahora haces en Claridad?"
3. "¿Le recomendarías Claridad a otra persona como tú?"

Si las tres respuestas son "sí" sin titubear → Fase 1 completada, avanzar a Fase 2.
Si alguna titubea → identificar qué falla y corregir antes de avanzar.
Si las tres son "no" → tienes información más valiosa que cualquier feature: el modelo mental no encajó. Pausar y reconsiderar antes de seguir construyendo.

---

## Estructura de la documentación

```
doc/claridad/
├── 01-today-screen-wireframe.md       ← Wireframe de la home
├── 02-customer-events-schema.md       ← Núcleo técnico
├── 03-claridad-product-readme.md      ← Este documento
└── (futuros)
    ├── 04-business-lines-model.md     ← Cuando se ataque many-to-many
    ├── 05-whatsapp-integration.md     ← Cuando se implementen botones
    └── 06-orders-limits.md            ← Antes de tocar Fase 5
```

La documentación del shell técnico (Atomic CRM original) sigue en `doc/src/content/docs/`. No se mezcla.

---

## Referencias

- **Sistema base:** https://marmelab.com/atomic-crm-demo
- **Repositorio base:** https://github.com/marmelab/atomic-crm
- **Repositorio Claridad:** https://github.com/Whiteks1/claridad-crm
- **Migración core:** `supabase/migrations/20260518120000_customer_events.sql`

---

## Cierre

Claridad CRM no compite contra Salesforce. No compite contra HubSpot. No compite contra Odoo. **Compite contra el caos mental de una vendedora relacional que vive en WhatsApp y no recuerda quién quería qué.**

Ese nicho está mal atendido por la industria SaaS. Si Claridad lo atiende bien para una usuaria, lo atiende bien para miles. Esa es la apuesta.

Mientras tanto: una pantalla, un hábito, una métrica. Lo demás viene después.
