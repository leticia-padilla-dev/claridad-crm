# Pantalla "Hoy" — Wireframe v1

> Esta es la **home** de Claridad CRM. No es una feature: es el producto.
> Si esta pantalla no funciona, ninguna entidad del backend importa.

---

## Principio rector

```
Yoli abre Claridad
→ ve qué requiere acción HOY
→ toca un botón
→ está en WhatsApp con el mensaje correcto
→ marca seguimiento
```

**Regla absoluta:** cualquier elemento accionable debe llegar a WhatsApp en **≤2 toques**.

---

## Layout móvil (prioridad principal)

```
┌──────────────────────────────────────┐
│  Hoy · lunes 18 may                  │  ← Header
│                                       │
│  Buenos días, Yoli ✦                  │
│                                       │
├──────────────────────────────────────┤
│                                       │
│  🔴  SEGUIMIENTOS VENCIDOS  (3)       │  ← Sección 1 (la más urgente)
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Laura Pérez · Mary Kay          │ │
│  │ Pendiente desde hace 4 días     │ │
│  │ "Quería rutina noche"           │ │
│  │ [📱 Abrir WhatsApp]  [✓ Hecho]  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Marta Ruiz · In Cruises         │ │
│  │ Esperaba propuesta el viernes   │ │
│  │ [📱 Abrir WhatsApp]  [✓ Hecho]  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Carla Díaz · Beyond Beauty      │ │
│  │ Sin contacto hace 12 días       │ │
│  │ [📱 Abrir WhatsApp]  [✓ Hecho]  │ │
│  └─────────────────────────────────┘ │
│                                       │
├──────────────────────────────────────┤
│                                       │
│  🎂  CUMPLEAÑOS HOY  (1)              │  ← Sección 2
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Patricia Mora                    │ │
│  │ Cumple 38 · cliente desde 2022  │ │
│  │ [🎂 Felicitar por WhatsApp]      │ │
│  └─────────────────────────────────┘ │
│                                       │
├──────────────────────────────────────┤
│                                       │
│  📅  CITAS DE HOY  (1)                │  ← Sección 3
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 16:00 · Andrea Lema             │ │
│  │ Videollamada In Cruises          │ │
│  │ [▶ Abrir en Calendar]            │ │
│  └─────────────────────────────────┘ │
│                                       │
├──────────────────────────────────────┤
│                                       │
│  ✨  TOCA ESTA SEMANA                 │  ← Sección 4 (colapsable)
│                                       │
│  · 8 clientas sin contacto >30 días  │
│  · 2 oportunidades calientes          │
│  · 3 cumpleaños esta semana           │
│                                       │
│  [Ver detalles →]                     │
│                                       │
├──────────────────────────────────────┤
│                                       │
│  [+ Nota rápida]                      │  ← Acción flotante secundaria
│                                       │
└──────────────────────────────────────┘
       Hoy   Clientas   Catálogos
       ───
       Nav inferior siempre visible
```

---

## Layout desktop (vista secundaria)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Claridad · Hoy                              lunes 18 may · Buenos días Yoli│
├──────────────────────────────────┬─────────────────────────────────────────┤
│                                   │                                          │
│ 🔴 SEGUIMIENTOS VENCIDOS (3)     │  🎂 CUMPLEAÑOS HOY (1)                  │
│                                   │                                          │
│ ┌─ Laura Pérez · Mary Kay ────┐  │  ┌─ Patricia Mora ──────────────────┐  │
│ │ Hace 4 días · "rutina noche"│  │  │ Cumple 38 · cliente desde 2022    │  │
│ │ [📱 WhatsApp]  [✓ Hecho]    │  │  │ [🎂 Felicitar]                    │  │
│ └─────────────────────────────┘  │  └───────────────────────────────────┘  │
│                                   │                                          │
│ ┌─ Marta Ruiz · In Cruises ───┐  │  📅 CITAS DE HOY (1)                    │
│ │ Esperaba propuesta viernes  │  │                                          │
│ │ [📱 WhatsApp]  [✓ Hecho]    │  │  ┌─ 16:00 · Andrea Lema ─────────────┐ │
│ └─────────────────────────────┘  │  │ Videollamada In Cruises             │ │
│                                   │  │ [▶ Calendar]                        │ │
│ ┌─ Carla Díaz · Beyond Beauty┐  │  └─────────────────────────────────────┘ │
│ │ Sin contacto 12 días        │  │                                          │
│ │ [📱 WhatsApp]  [✓ Hecho]    │  │  ✨ TOCA ESTA SEMANA                    │
│ └─────────────────────────────┘  │  · 8 clientas frías (>30 días)          │
│                                   │  · 2 oportunidades calientes             │
│                                   │  · 3 cumpleaños esta semana              │
│                                   │  [Ver lista completa →]                  │
└──────────────────────────────────┴─────────────────────────────────────────┘
```

---

## Sección por sección — qué muestra, qué consulta, qué acciona

### 1. Seguimientos vencidos (rojo)

**Qué muestra**

- Tareas (`tasks`) cuyo `due_date <= hoy` Y `done_date IS NULL`.
- Máximo 5 visibles. Si hay más, botón "Ver todos (12)".

**Por qué primero**

Es lo único en la pantalla que genera **culpa operativa**. Yoli quiere ese rojo a cero. Eso es el anzuelo diario.

**Acciones por elemento**

- `📱 Abrir WhatsApp` → `wa.me/<telefono>?text=<plantilla>` con la plantilla "seguimiento" rellenada.
- `✓ Hecho` → marca la tarea como completada y dispara evento `task.completed` en `customer_events`.

**Estado vacío**

```
✓ No hay seguimientos pendientes.
  Buen trabajo.
```

(Importante: el vacío se siente como recompensa, no como ausencia.)

---

### 2. Cumpleaños hoy

**Qué muestra**

- Contactos cuyo `birthday MM-DD` coincide con hoy.
- Calcula edad si se conoce el año.
- Antigüedad como clienta ("desde 2022").

**Por qué importa**

Para negocio relacional, felicitar cumpleaños es **conversión disfrazada de gesto humano**. Yoli no lo va a olvidar nunca más.

**Acciones**

- `🎂 Felicitar por WhatsApp` → plantilla "cumpleaños" precargada.

**Estado vacío**

No se muestra la sección si no hay cumpleaños. (No mostrar secciones vacías es parte de la disciplina visual.)

---

### 3. Citas de hoy

**Qué muestra**

- `appointments` con `scheduled_at` entre las 00:00 y 23:59 de hoy.
- Hora, contacto, tipo de cita, línea de negocio.

**Acciones**

- `▶ Abrir en Calendar` → enlace al evento de Google Calendar (usa `event_id` guardado).
- Si la cita es en <30 min y es videollamada: muestra `▶ Unirse a Meet` directamente.

**Estado vacío**

No se muestra la sección si no hay citas.

---

### 4. Toca esta semana (sección colapsable)

**Qué muestra**

Tres contadores únicamente. No detalle.

- Clientas sin contacto en >30 días (cohorte de reactivación).
- Oportunidades con `last_activity > 7 días` y `status = activa`.
- Cumpleaños en los próximos 7 días.

**Por qué colapsada**

Si abre así expandida, Yoli ve demasiada acción y se paraliza. **Hoy debe sentirse abarcable.** Esta sección existe para que sepa "hay más" sin abrumarla.

**Acción**

`Ver detalles →` lleva a una vista filtrada.

---

## Reglas visuales no negociables

**Tipografía:**
- Nombres de clientas en bold, tamaño grande (≥16px móvil).
- Contexto ("Mary Kay", "hace 4 días") en gris medio, ≥13px.

**Colores:**
- Rojo = seguimiento vencido. Solo eso. No usar rojo para nada más.
- Verde = cumpleaños / acción completada.
- Azul = enlaces y botones primarios.

**Botones:**
- Botón primario = mínimo 44×44pt (estándar Apple HIG para área táctil).
- Iconos siempre acompañados de texto. Nada de iconos solos.

**Densidad:**
- Una tarjeta por elemento. Nada de filas comprimidas.
- Si caben 3 tarjetas en pantalla móvil, ese es el límite visual.

---

## Comportamiento del botón "WhatsApp"

Cada botón `📱 Abrir WhatsApp` hace una sola cosa:

```js
const number =
  contact.whatsapp ??
  contact.phone_jsonb?.[0]?.number ??
  null;

if (number) {
  window.open(
    `https://wa.me/${normalize(number)}?text=${encodeURIComponent(template)}`,
    '_blank'
  );
}
```

**Resolución del número** (prioridad de fallback):

1. `contacts.whatsapp` — columna dedicada (añadida en migración `contact_profile_fields`).
2. Primer elemento de `contacts.phone_jsonb` (forma `[{number, type}, ...]`).
3. Si ninguno existe, el botón se muestra deshabilitado con tooltip "Sin número registrado".

`normalize()` elimina espacios, guiones y paréntesis; mantiene el `+` inicial.

**Plantillas con variables del contacto:**

- `{{nombre}}` → `contacts.first_name`
- `{{ultima_compra}}` → último `customer_events.type = 'order.created'` (Fase 5+)
- `{{linea}}` → primera entrada de `contacts.business_lines_interest` o nombre de `companies` vía `contacts.company_id`

Antes de abrir, se registra un evento en `customer_events` con `type = 'whatsapp.opened'` y `source = 'whatsapp_link'`. Esto sirve para el timeline y para medir la **métrica madre** ("¿abrió Claridad antes que WhatsApp?").

**No hay edición de plantilla en la pantalla "Hoy".** Si quiere editar, pasa por la vista de contacto. La fricción aquí está prohibida.

---

## Estados de carga y error

**Cargando:**
- Skeleton de 2 tarjetas grises por sección. NO spinner de pantalla completa.
- La pantalla "Hoy" debe sentirse instantánea aunque tarde 800ms.

**Sin conexión:**
- Mostrar última versión cacheada con banner amarillo: `⚠ Sin conexión · datos del momento de tu última apertura`.
- El botón WhatsApp sigue funcionando offline (es solo un deep link).

**Error de carga:**
- Banner rojo: `No pude cargar tus seguimientos. [Reintentar]`.
- NO bloquear el resto de secciones si una falla.

---

## Qué NO va en la pantalla "Hoy" (lista de prohibiciones)

Esta lista es tan importante como la de qué SÍ va. Para protegerse del scope creep:

- ❌ Gráficos de ningún tipo
- ❌ Revenue, ventas del mes, KPIs corporativos
- ❌ Pipeline / forecast
- ❌ Notificaciones de "novedades de la app"
- ❌ Recomendaciones IA en V1
- ❌ Onboarding tutorials en el body principal
- ❌ Banner de upsell o features pagadas
- ❌ Más de 4 secciones

Si en algún momento alguien (incluyendo tú) propone meter algo de esa lista, releer este documento.

---

## Validación con Yoli — script de la primera vez

Antes de tocar código, enseña este wireframe (impreso o en pantalla) y pregunta:

1. "Si abres tu móvil mañana a las 8am y ves esto, ¿qué tocas primero?"
2. "¿Qué falta aquí que SÍ necesitas?"
3. "¿Qué sobra aquí que NO usarías?"
4. "Si tuvieras que abrir esto o WhatsApp directamente, ¿cuál abrirías?"

La respuesta a la pregunta 4 es el verdadero veredicto del producto.

---

## Métricas que importan (y cuáles no)

**Sí medir:**

- ¿Cuántos días por semana abre Claridad antes que WhatsApp? (la métrica madre)
- ¿Cuántos toques al botón `WhatsApp` por sesión?
- ¿Cuánto tarda en llegar a cero seguimientos vencidos?

**NO medir todavía:**

- DAU / MAU / retention curves
- Funnels de conversión
- A/B tests
- Cohort analysis

Estas vendrán cuando el producto esté validado. En la fase 1 son ruido.

---

## Próximos pasos después de aprobar este wireframe

1. Implementar el modelo `customer_events` (ver `02-customer-events-schema.md`).
2. Backfillar eventos desde notas y tareas existentes.
3. Construir el componente `<TodayScreen />` con datos reales de un solo usuario (Yoli).
4. Probar 7 días con datos reales antes de añadir cualquier sección nueva.
5. Solo después: cumpleaños, citas, toca-esta-semana.

**Slice 1.1 mínimo viable:** solo la sección "Seguimientos vencidos" funcionando con el botón WhatsApp. Si eso ya cambia el día de Yoli, lo demás vendrá rodado.
