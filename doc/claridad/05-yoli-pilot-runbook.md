# Runbook del piloto con Yoli

> Este documento define cómo arrancar, observar y cerrar el primer piloto real de
> Claridad CRM con Yoli. No añade features. No cambia arquitectura. Solo fija el
> comportamiento operativo mínimo para validar si el producto genera hábito real.

---

## Objetivo del piloto

Validar durante 14 días si Yoli usa Claridad por iniciativa propia como capa
operativa antes de irse a WhatsApp.

La pregunta que manda es esta:

> **¿Cuántos días a la semana Yoli abre Claridad antes que WhatsApp?**

Si esa conducta no aparece, el producto todavía no existe como hábito.

---

## Alcance del piloto

### Sí incluye

- una sola usuaria real: Yoli
- clientas reales
- seguimientos reales
- citas reales
- CTA real de WhatsApp
- revisión semanal corta
- decisión explícita al día 14

### No incluye

- nuevas features durante el piloto
- segundo cliente piloto
- automatizaciones nuevas
- cambios de arquitectura
- importador masivo nuevo
- dashboards complejos

Toda petición nueva que salga del piloto entra como **issue separada**.

---

## Precondiciones

Antes del kickoff deben estar validadas estas piezas:

- `Today` operativo
- `Seguimientos vencidos` reales
- botón `Abrir WhatsApp`
- tracking básico de la métrica madre
- modelo de clienta mínimo ya activo
- entidad `appointments` ya disponible

---

## Qué datos se cargan al principio

No se promete importación global.

Para el piloto, la carga inicial debe ser **mínima y fiable**:

- `20` a `50` clientas reales
- `5` a `15` seguimientos vencidos o pendientes cercanos
- `3` a `10` citas reales de la semana

### Fuente de verdad para la carga inicial

Usar las plantillas ya definidas en:

- [Plantillas CSV/Sheets para Yoli](./06-yoli-csv-sheets-template.md)

### Regla de carga

Si hay dudas, priorizar:

1. menos datos
2. más calidad
3. nombres consistentes
4. teléfonos correctos

Mejor una base pequeña correcta que una base grande rota.

---

## Checklist de acceso

Antes del kickoff:

- [ ] Crear cuenta de Yoli
- [ ] Confirmar acceso desde móvil y desktop
- [ ] Verificar login correcto
- [ ] Verificar que aterriza en `/today`
- [ ] Verificar que puede abrir `Clientes`
- [ ] Verificar que puede abrir una clienta real
- [ ] Verificar que puede marcar un seguimiento como `Hecho`
- [ ] Verificar que puede pulsar `Abrir WhatsApp`

---

## Checklist de datos mínimos

Antes del kickoff:

- [ ] clientas iniciales cargadas
- [ ] todas tienen nombre visible correcto
- [ ] al menos `10` tienen número usable para WhatsApp
- [ ] al menos `5` tienen línea de interés informada
- [ ] seguimientos visibles en `Today`
- [ ] citas de prueba o reales visibles si aplica

---

## Script de kickoff

Duración recomendada: `20-30 min`

### Parte 1 — posicionamiento

Decir esto, sin tecnicismos:

> Claridad no sustituye WhatsApp.  
> Claridad te dice a quién tocar hoy y te abre el camino para actuar mejor.

### Parte 2 — recorrido mínimo

Mostrar solo este flujo:

1. abrir `Hoy`
2. mirar `Seguimientos vencidos`
3. abrir una clienta
4. pulsar `Abrir WhatsApp`
5. volver a Claridad
6. marcar `Hecho`

### Parte 3 — regla de uso

Pedir solo este hábito:

> Antes de empezar a escribir por WhatsApp, abre Claridad.

No enseñar:

- configuraciones avanzadas
- tabs secundarios
- rutas que no estén en el flujo diario
- explicaciones del schema

---

## Qué observar durante el piloto

### Señales positivas

- abre `Hoy` sin recordatorio
- vacía el rojo de seguimientos
- usa el botón WhatsApp desde Claridad
- vuelve a la app después de actuar
- entiende solas las tarjetas

### Señales de alerta

- entra directo a WhatsApp sin pasar por Claridad
- pregunta “¿y ahora qué hago?” al abrir `Hoy`
- no distingue seguimiento, cita y clienta
- usa Claridad como archivo, no como punto de arranque
- deja el rojo crecer varios días

---

## Loop semanal de feedback

Frecuencia: `1 vez por semana`, idealmente viernes.

Duración: `10-15 min`.

No convertirlo en entrevista larga.

### Preguntas obligatorias

1. ¿Cuántos días esta semana abriste Claridad antes que WhatsApp?
2. ¿Qué te resultó más útil?
3. ¿Qué te molestó o te frenó?
4. ¿Qué hiciste fuera de Claridad que te habría gustado hacer dentro?

### Dónde registrarlo

Usar:

- [Yoli Weekly Feedback Log](./templates/yoli_weekly_feedback_log.md)

---

## Regla de cambio durante el piloto

Solo se puede tocar durante el piloto:

- bugs bloqueantes
- copy confuso
- fricción crítica del flujo principal

No se mete durante el piloto:

- ideas “nice to have”
- expansión de scope
- nuevos módulos
- automatización extra

Todo eso entra como issue nueva y se decide después del feedback semanal.

---

## Decisión a los 14 días

Al día 14 hay que dejar una decisión escrita. No vale “seguir viendo”.

### Continuar

Si pasan estas tres cosas:

- Yoli abre Claridad varios días por iniciativa propia
- el flujo `Hoy -> WhatsApp -> Hecho` ya existe de verdad
- el feedback indica utilidad real, no solo simpatía

### Ajustar y repetir

Si hay uso intermitente, pero se entiende dónde está la fricción.

### Pausar

Si Claridad no consigue colocarse antes de WhatsApp en el hábito diario.

La decisión se registra en el mismo log semanal, en la sección `Decision Day 14`.

---

## Definition of Done operacional para `#32`

Este slice queda listo cuando existen y se usan estos artefactos:

- runbook del piloto
- checklist de acceso
- checklist de datos mínimos
- script de kickoff
- log semanal de feedback
- bloque de decisión de día 14

La ejecución real del piloto ocurre fuera del PR, pero ya queda enmarcada y
sin ambigüedad.
