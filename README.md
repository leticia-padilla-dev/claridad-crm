# Claridad CRM

> **Workspace operativo visual para negocios relacionales humanos que ya viven en WhatsApp y Google Workspace.**
>
> Claridad CRM no es un CRM B2B clásico. Es una capa de contexto e inteligencia operativa construida sobre [Atomic CRM](https://github.com/marmelab/atomic-crm) como shell técnico.

## Arquitectura de cuatro capas

```
Claridad     →  contexto e inteligencia operativa (pantalla "Hoy", timeline, cohortes)
WhatsApp     →  capa de acción (canal real de comunicación)
Google       →  capa de ejecución (Calendar, Drive, Sheets, Gmail)
Atomic CRM   →  shell técnico (React + Supabase, no se reescribe — se adapta)
```

## Documentación del producto

La definición de producto, principios, roadmap y compromisos viven en `doc/claridad/`:

- [`01-today-screen-wireframe.md`](./doc/claridad/01-today-screen-wireframe.md) — Wireframe de la pantalla "Hoy", el corazón del producto.
- [`02-customer-events-schema.md`](./doc/claridad/02-customer-events-schema.md) — Diseño del núcleo técnico: `customer_events`.
- [`03-claridad-product-readme.md`](./doc/claridad/03-claridad-product-readme.md) — Visión, compromisos, roadmap y reglas no negociables.
- [`04-local-setup.md`](./doc/claridad/04-local-setup.md) — Procedimiento local para verificar migraciones y backfill de Fase 0.5.
- [`05-yoli-pilot-runbook.md`](./doc/claridad/05-yoli-pilot-runbook.md) — Runbook operativo para el piloto real con Yoli.
- [`06-yoli-csv-sheets-template.md`](./doc/claridad/06-yoli-csv-sheets-template.md) — Plantillas de captura inicial para clientes y citas.

## Los cuatro compromisos

1. No abro un editor de código hasta tener la pantalla "Hoy" validada con la primera usuaria real.
2. No añado tablas nuevas hasta que `customer_events` esté implementada y alimentada.
3. No considero la Fase 1 completada hasta 14 días de uso autónomo por Yoli.
4. Si me tienta añadir dashboards, KPIs o "ERP-light", releo el product README.

## La métrica madre

> ¿Cuántos días a la semana Yoli abre Claridad antes que WhatsApp?

Esa es la única métrica que importa en Fase 1.

---

# Atomic CRM (shell técnico)

A full-featured CRM built with React, shadcn-admin-kit, and Supabase.

<https://github.com/user-attachments/assets/0d7554b5-49ef-41c6-bcc9-a76214fc5c99>

Atomic CRM is free and open-source. You can test it online at <https://marmelab.com/atomic-crm-demo>.

## Features

- 📇 **Organize Contacts**: Keep all your contacts in one easily accessible place.
- ⏰ **Create Tasks & Set Reminders**: Never miss a follow-up or deadline.
- 📝 **Take Notes**: Capture important details and insights effortlessly.
- ✉️ **Capture Emails**: CC Atomic CRM to automatically save communications as notes.
- 📊 **Manage Deals**: Visualize and track your sales pipeline in a Kanban board.
- 🔄 **Import & Export Data**: Easily transfer contacts in and out of the system.
- 🔐 **Control Access**: Log in with Google, Azure, Keycloak, and Auth0.
- 📜 **Track Activity History**: View all interactions in aggregated activity logs.
- 🔗 **Integrate via API**: Connect seamlessly with other systems using our API.
- 🛠️ **Customize Everything**: Add custom fields, change the theme, and replace any component to fit your needs.

## Installation

To run this project locally, you will need the following tools installed on your computer:

- Make
- Node 22 LTS
- Docker (required by Supabase)

Fork the [`marmelab/atomic-crm`](https://github.com/marmelab/atomic-crm) repository to your user/organization, then clone it locally:

```sh
git clone https://github.com/[username]/atomic-crm.git
```

Install dependencies:

```sh
cd atomic-crm
make install
```

This will install the dependencies for the frontend and the backend, including a local Supabase instance.

Once your app is configured, start the app locally with the following command:

```sh
make start
```

This will start the Vite dev server for the frontend, the local Supabase instance for the API, and a Postgres database (thanks to Docker).

You can then access the app via [http://localhost:5173/](http://localhost:5173/). You will be prompted to create the first user.

If you need debug the backend, you can access the following services:

- Supabase dashboard: [http://localhost:54323/](http://localhost:54323/)
- REST API: [http://127.0.0.1:54321](http://127.0.0.1:54321)
- Attachments storage: [http://localhost:54323/project/default/storage/buckets/attachments](http://localhost:54323/project/default/storage/buckets/attachments)
- Inbucket email testing service: [http://localhost:54324/](http://localhost:54324/)

## Documentation

The user and developer documentation for this project is available [in the `doc/` directory](./doc/). You can also read it online at [https://marmelab.com/atomic-crm/doc/](https://marmelab.com/atomic-crm/doc/).

## Testing Changes

This project contains unit tests and e2e. 
Run unit test with the following command:

```sh
make test
```

Run e2e test with:

```sh
make test-e2e
```

Note: the `make test-e2e` will run the the e2e test in ui mode against a vite server with hot reload for ease of development. On the CI the e2e test will be run against the built app. If you need to run the test against the built file instead. You can run:

```sh
make start-e2e-ci # To launch the CI e2e environment (serving the built app)
# followed by
npx playwright test --ui
```

You can add your own unit tests powered by Jest anywhere in the `src` directory. The test files should be named `*.test.tsx` or `*.test.ts`.
And you can also add your own e2e test. The e2e test files should be placed inside the `./e2e` folder

## Getting Updates

Atomic CRM components are published as a Shadcn Registry file. This means you can update your installation by calling the following command:

```sh
npx shadcn add https://marmelab.com/atomic-crm/r/atomic-crm.json -o
```

## Registry

The Registry file is kept au to date when files are added or removed:

- The `registry.json` file is automatically generated by the `scripts/generate-registry.mjs` script as a pre-commit hook.
- The `http://marmelab.com/atomic-crm/r/atomic-crm.json` file is automatically published by the CI/CD pipeline

> [!WARNING]  
> If the `registry.json` misses some changes you made, you MUST update the `scripts/generate-registry.mjs` to include those changes.

## License

This project is licensed under the MIT License, courtesy of [Marmelab](https://marmelab.com). See the [LICENSE.md](./LICENSE.md) file for details.
