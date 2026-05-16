# Repo Workflow

Este repositorio se trabaja por slices estrechos.

Workflow estándar:

```txt
1 issue
-> 1 rama nueva desde origin/main
-> 1 slice estrecho
-> 1 commit claro
-> push
-> PR con plantilla
-> revisión/aprobación
-> merge
-> limpieza local y remota
```

## 1. Reglas obligatorias

- No se trabaja directo en `main`.
- No se mezcla más de un objetivo por rama.
- Cada rama debe salir de `origin/main`.
- Cada rama debe corresponder a un solo slice.
- La PR debe referenciar un issue.
- No se toca lógica, schema o dependencias fuera del alcance definido del slice.
- La regla por defecto es `1 commit claro por slice`.
- Si durante el trabajo se necesitan commits temporales, se limpian antes de merge para dejar un historial intencional, salvo acuerdo explícito en contra.

## 2. Flujo paso a paso

Antes de empezar un slice:

```sh
git checkout main
git pull origin main
git checkout -b tipo/scope-descripcion
```

Secuencia estándar:

1. Crear o confirmar el issue del slice.
2. Actualizar `main` desde `origin/main`.
3. Crear una rama nueva con nombre acotado al objetivo.
4. Implementar solo el alcance aprobado.
5. Validar localmente.
6. Crear un commit claro.
7. Hacer push de la rama.
8. Abrir PR usando la plantilla del repo.
9. Esperar revisión y aprobación.
10. Hacer merge.
11. Limpiar rama local y remota.

## 3. Naming de ramas

Formato:

```txt
tipo/scope-descripcion
```

Ejemplos:

```txt
docs/atomic-adaptation-strategy
ui/clientes-visible-surface
domain/clientes-fields
domain/orders-entity
domain/catalog-links
domain/appointments
dashboard/yoli-v1
```

Reglas:

- `tipo` debe describir la naturaleza del cambio.
- `scope-descripcion` debe reflejar un único objetivo.
- Evitar nombres genéricos como `fix/stuff`, `misc/changes` o `wip/all`.

## 4. Formato de issues

Antes de tocar código, crear o confirmar un issue con esta estructura:

```md
# Slice X — título claro

## Objetivo
-

## Alcance
-

## No incluye
-

## Archivos esperados
-

## Validación
-

## Riesgos
-
```

Reglas:

- Un issue por slice.
- El issue debe definir alcance y fuera de alcance.
- Si el alcance cambia, se actualiza el issue antes de seguir.

## 5. Formato de commits

Un commit por slice si el cambio es pequeño:

```sh
git add .
git commit -m "docs: add atomic adaptation strategy"
```

o:

```sh
git commit -m "ui: simplify CRM navigation for clientes V1"
```

Reglas:

- El mensaje debe explicar el cambio, no la intención vaga.
- No mezclar documentación, UI, dominio y refactors sin relación.
- Si el slice crece demasiado para un commit claro, el slice probablemente está mal cortado.

## 6. Validación local

Antes de abrir PR:

```sh
npm run build
git diff --check
```

Además:

- revisar navegación si el slice toca rutas, menús o layouts
- revisar auth/session si el slice toca login, guards, permisos o callbacks
- revisar que no existan archivos temporales, logs o cambios accidentales
- revisar `git status` para confirmar que no hay ficheros fuera de alcance

## 7. Reglas de merge

No se hace merge si:

- `build` falla
- hay archivos fuera de alcance
- la PR no referencia issue
- no está revisado/aprobado
- el slice se ha contaminado con cambios ajenos

Checklist mínimo antes de merge:

- PR abierta con plantilla completa
- issue referenciado
- validación local hecha
- diff revisado
- aprobación obtenida

## 8. Limpieza post-merge

Después del merge:

```sh
git checkout main
git pull origin main
git branch -d nombre/de-rama
git push origin --delete nombre/de-rama
git fetch --prune
```

La limpieza es parte del flujo, no una tarea opcional.

## 9. Qué hacer si la rama se contamina

Una rama está contaminada si:

- aparecen cambios de otro objetivo
- entran archivos no previstos
- se mezclan fixes oportunistas no aprobados
- hay cambios locales generados por herramientas que no pertenecen al slice

Acción recomendada:

1. Parar.
2. Comparar alcance real vs issue.
3. Revisar `git status` y el diff de la rama.
4. Separar el trabajo válido del ajeno.
5. Si hace falta, abrir una rama limpia desde `origin/main` y mover solo el cambio correcto.

Regla:

- No abrir PR con contaminación “porque ya está hecho”.

## 10. Qué hacer si `main` tiene cambios locales

No arrancar un slice sobre un `main` sucio.

Si `main` tiene cambios locales:

1. revisar si pertenecen a trabajo real o a residuos temporales
2. si pertenecen a otro trabajo, moverlos a una rama propia
3. si todavía no están listos, usar una solución temporal segura como `git stash`
4. volver a dejar `main` limpio
5. recién entonces hacer `git pull origin main`

Reglas:

- no mezclar cambios previos con el nuevo slice
- no crear ramas nuevas desde un `main` contaminado

## 11. Push y PR

Push de la rama:

```sh
git push -u origin nombre/de-rama
```

La PR debe usar `.github/pull_request_template.md`.

Contenido esperado:

- issue referenciado
- objetivo
- cambios realizados
- archivos modificados
- fuera de alcance
- validación local
- riesgos
- siguiente slice lógico

## 12. Regla operativa para IDEs y agentes

Cualquier IDE, agente o automatización que trabaje en este repositorio debe seguir estas normas:

- nunca trabajar directo en `main`
- nunca mezclar más de un objetivo por rama
- nunca abrir PR sin issue
- nunca hacer merge sin revisión/aprobación
- nunca introducir cambios fuera del alcance declarado
- nunca tocar schema o dependencias si el slice no lo pide de forma explícita

Si hay conflicto entre velocidad y limpieza de slice, gana la limpieza del slice.
