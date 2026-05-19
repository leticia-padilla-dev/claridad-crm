export const englishCrmMessages = {
  resources: {
    companies: {
      name: "Company |||| Companies",
      forcedCaseName: "Company",
      fields: {
        name: "Company name",
        website: "Website",
        linkedin_url: "LinkedIn URL",
        phone_number: "Phone number",
        created_at: "Created at",
        nb_contacts: "Number of contacts",
        revenue: "Revenue",
        sector: "Sector",
        size: "Size",
        tax_identifier: "Tax Identifier",
        address: "Address",
        city: "City",
        zipcode: "Zip code",
        state_abbr: "State",
        country: "Country",
        description: "Description",
        context_links: "Context links",
        sales_id: "Account manager",
      },
      empty: {
        description: "It seems your company list is empty.",
        title: "No companies found",
      },
      field_categories: {
        contact: "Contact",
        additional_info: "Additional information",
        address: "Address",
        context: "Context",
      },
      action: {
        create: "Create Company",
        edit: "Edit company",
        new: "New Company",
        show: "Show company",
      },
      added_on: "Added on %{date}",
      followed_by: "Followed by %{name}",
      followed_by_you: "Followed by you",
      no_contacts: "No contact",
      nb_contacts: "%{smart_count} contact |||| %{smart_count} contacts",
      nb_deals: "%{smart_count} deal |||| %{smart_count} deals",
      sizes: {
        one_employee: "1 employee",
        two_to_nine_employees: "2-9 employees",
        ten_to_forty_nine_employees: "10-49 employees",
        fifty_to_two_hundred_forty_nine_employees: "50-249 employees",
        two_hundred_fifty_or_more_employees: "250 or more employees",
      },
      autocomplete: {
        create_error: "An error occurred while creating the company",
        create_item: "Create %{item}",
        create_label: "Start typing to create a new company",
      },
      filters: {
        only_mine: "Only companies I manage",
      },
    },
    contacts: {
      name: "Client |||| Clients",
      forcedCaseName: "Client",
      field_categories: {
        background_info: "Background info",
        identity: "Identity",
        misc: "Misc",
        personal_info: "Personal info",
        profile: "Client profile",
        position: "Position",
      },
      fields: {
        allergies_or_needs: "Allergies or needs",
        birthday: "Birthday",
        business_lines_interest: "Business lines",
        city: "City",
        first_name: "First name",
        last_name: "Last name",
        last_seen: "Last seen",
        title: "Title",
        company_id: "Company",
        preferences: "Preferences",
        status: "Client status",
        email_jsonb: "Email addresses",
        email: "Email",
        phone_jsonb: "Phone numbers",
        phone_number: "Phone number",
        whatsapp: "WhatsApp",
        linkedin_url: "LinkedIn URL",
        background: "Background info (bio, how you met, etc)",
        has_newsletter: "Has newsletter",
        sales_id: "Account manager",
      },
      action: {
        add: "Add client",
        add_first: "Add your first client",
        create: "Create client",
        edit: "Edit client",
        export_vcard: "Export to vCard",
        new: "New Client",
        show: "Show client",
      },
      background: {
        last_activity_on: "Last activity on %{date}",
        added_on: "Added on %{date}",
        followed_by: "Followed by %{name}",
        followed_by_you: "Followed by you",
        status_none: "None",
      },
      position_at: "%{title} at",
      position_at_company: "%{title} at %{company}",
      empty: {
        description: "It seems your client list is empty.",
        title: "No clients found",
      },
      import: {
        title: "Import clients",
        button: "Import CSV",
        complete:
          "Client import complete. Imported %{importCount} clients, with %{errorCount} errors",
        progress:
          "Imported %{importCount} / %{rowCount} clients, with %{errorCount} errors.",
        error:
          "Failed to import this file, please make sure your provided a valid CSV file.",
        imported: "Imported",
        remaining_time: "Estimated remaining time:",
        running: "The import is running, please do not close this tab.",
        sample_download: "Download CSV sample",
        sample_hint: "Here is a sample CSV file you can use as a template",
        stop: "Stop import",
        csv_file: "CSV File",
        contacts_label: "client |||| clients",
      },
      inputs: {
        genders: {
          male: "He/Him",
          female: "She/Her",
          nonbinary: "They/Them",
        },
        personal_info_types: {
          work: "Work",
          home: "Home",
          other: "Other",
        },
        business_lines: {
          mary_kay: "Mary Kay",
          beyond_beauty: "Beyond Beauty",
          incruises: "In Cruises",
        },
      },
      list: {
        error_loading: "Error loading clients",
      },
      bulk_tag: {
        action: "Tag",
        back: "Back to tags",
        create_description:
          "Create a new tag and apply it to the selected clients.",
        description:
          "Choose an existing tag or create a new one for the selected clients.",
        empty: "No tags yet. Create one to tag the selected clients.",
        error: "Failed to add tag to clients",
        noop: "Selected clients already have this tag",
        success:
          "Tag added to %{smart_count} client |||| Tag added to %{smart_count} clients",
        title: "Add tag to clients",
      },
      timeline: {
        empty: "No hay actividad registrada con esta clienta todavia",
        events: {
          note_created: "Nota creada",
          note_without_preview: "Sin vista previa disponible",
          task_created: "Seguimiento creado",
          task_completed: "Seguimiento completado",
          opportunity_created: "Oportunidad creada",
          opportunity_stage_changed: "Cambio de etapa de oportunidad",
          no_context: "Sin contexto adicional",
          stage_label: "Etapa: %{stage}",
          stage_changed_detail: "%{name} paso de %{from} a %{to}",
        },
      },
      merge: {
        action: "Merge with another client",
        confirm: "Merge Clients",
        current_contact: "Current Client (will be deleted)",
        description: "Merge this client with another one.",
        error: "Failed to merge clients",
        merging: "Merging...",
        no_additional_data: "No additional data to merge",
        select_target: "Please select a client to merge with",
        success: "Clients merged successfully",
        target_contact: "Target Client (will be kept)",
        title: "Merge Client",
        warning_description:
          "All data will be transferred to the second client. This action cannot be undone.",
        warning_title: "Warning: Destructive Operation",
        what_will_be_merged: "What will be merged:",
      },
      filters: {
        before_last_month: "Before last month",
        before_this_month: "Before this month",
        before_this_week: "Before this week",
        managed_by_me: "Managed by me",
        search: "Search client name...",
        this_week: "This week",
        today: "Today",
        tags: "Tags",
        tasks: "Seguimientos",
      },
      hot: {
        empty_change_status:
          'Change a client status by adding a note to that client and clicking on "show options".',
        empty_hint: 'Clients with a "hot" status will appear here.',
        title: "Priority Clients",
      },
    },
    appointments: {
      name: "Appointment |||| Appointments",
      forcedCaseName: "Appointment",
      fields: {
        contact_id: "Client",
        notes: "Notes",
        scheduled_at: "Scheduled at",
        status: "Status",
        type: "Type",
      },
      action: {
        add: "Add appointment",
        create: "Create appointment",
        edit: "Edit appointment",
        new: "New Appointment",
        show: "Show appointment",
      },
      dialog: {
        create: "Create appointment",
        create_for: "Create appointment for %{name}",
      },
      added: "Appointment added",
      updated: "Appointment updated",
      deleted: "Appointment deleted",
      empty: "No appointments yet",
      regarding_contact: "(Client: %{name})",
      inputs: {
        statuses: {
          pending: "Pending",
          confirmed: "Confirmed",
          completed: "Completed",
          cancelled: "Cancelled",
        },
        types: {
          consultation: "Consultation",
          delivery: "Delivery",
          demonstration: "Demonstration",
          follow_up: "Follow-up",
          video_call: "Video call",
        },
      },
    },
    catalog_links: {
      name: "Catalog link |||| Catalog links",
      forcedCaseName: "Catalog link",
      fields: {
        title: "Title",
        url: "URL",
        type: "Type",
        business_line: "Business line",
        campaign: "Campaign",
        active: "Active",
        active_yes: "Active",
        active_no: "Inactive",
        notes: "Notes",
        created_at: "Created at",
      },
      action: {
        create: "Create catalog link",
        edit: "Edit catalog link",
        new: "New catalog link",
        show: "Show catalog link",
      },
      filters: {
        all_business_lines: "All business lines",
        all_types: "All types",
      },
      validation: {
        url_format: "Must be a URL starting with http:// or https://",
      },
      empty: "No catalog links yet",
      added: "Catalog link added",
      updated: "Catalog link updated",
      deleted: "Catalog link deleted",
      inputs: {
        types: {
          catalog: "Catalog",
          link: "Link",
          campaign: "Campaign",
          promotion: "Promotion",
        },
        business_lines: {
          "mary-kay": "Mary Kay",
          "beyond-beauty": "Beyond Beauty",
          incruises: "In Cruises",
        },
      },
    },
    deals: {
      name: "Deal |||| Deals",
      fields: {
        name: "Name",
        description: "Description",
        company_id: "Company",
        contact_ids: "Contacts",
        category: "Category",
        amount: "Budget",
        expected_closing_date: "Expected closing date",
        stage: "Stage",
      },
      action: {
        back_to_deal: "Back to deal",
        create: "Create deal",
        new: "New Deal",
      },
      field_categories: {
        misc: "Misc",
      },
      archived: {
        action: "Archive",
        error: "Error: deal not archived",
        list_title: "Archived Deals",
        success: "Deal archived",
        title: "Archived Deal",
        view: "View archived deals",
      },
      inputs: {
        linked_to: "Linked to",
      },
      unarchived: {
        action: "Send back to the board",
        error: "Error: deal not unarchived",
        success: "Deal unarchived",
      },
      updated: "Deal updated",
      empty: {
        before_create: "before creating a deal.",
        description: "It seems your deal list is empty.",
        title: "No deals found",
      },
      invalid_date: "Invalid date",
    },
    notes: {
      name: "Note |||| Notes",
      forcedCaseName: "Note",
      fields: {
        status: "Status",
        date: "Date",
        attachments: "Attachments",
        contact_id: "Contact",
        deal_id: "Deal",
      },
      action: {
        add: "Add note",
        add_first: "Add your first note",
        delete: "Delete note",
        edit: "Edit note",
        update: "Update note",
        add_this: "Add this note",
      },
      sheet: {
        create: "Create note",
        create_for: "Create note for %{name}",
        edit: "Edit note",
        edit_for: "Edit note for %{name}",
      },
      deleted: "Note deleted",
      empty: "No notes yet",
      author_added: "%{name} added a note",
      you_added: "You added a note",
      me: "Me",
      list: {
        error_loading: "Error loading notes",
      },
      note_for_contact: "Note for %{name}",
      stepper: {
        hint: "Go to a client page and add a note",
      },
      added: "Note added",
      inputs: {
        add_note: "Add a note",
        options_hint: "(attach files, or change details)",
        show_options: "Show options",
      },
      actions: {
        attach_document: "Attach document",
      },
      validation: {
        note_or_attachment_required: "A note or an attachment is required",
      },
    },
    sales: {
      name: "User |||| Users",
      fields: {
        first_name: "First name",
        last_name: "Last name",
        email: "Email",
        administrator: "Admin",
        disabled: "Disabled",
      },
      create: {
        error: "An error occurred while creating the user.",
        success:
          "User created. They will soon receive an email to set their password.",
        title: "Create a new user",
      },
      edit: {
        error: "An error occurred. Please try again.",
        record_not_found: "Record not found",
        success: "User updated successfully",
        title: "Edit %{name}",
      },
      action: {
        new: "New user",
      },
    },
    tasks: {
      name: "Seguimiento |||| Seguimientos",
      forcedCaseName: "Seguimiento",
      fields: {
        text: "Description",
        due_date: "Due date",
        type: "Type",
        contact_id: "Client",
        due_short: "due",
      },
      action: {
        add: "Add seguimiento",
        create: "Create seguimiento",
        edit: "Edit seguimiento",
      },
      actions: {
        postpone_next_week: "Postpone to next week",
        postpone_tomorrow: "Postpone to tomorrow",
        title: "seguimiento actions",
      },
      added: "Seguimiento added",
      deleted: "Seguimiento deleted successfully",
      dialog: {
        create: "Create seguimiento",
        create_for: "Create seguimiento for %{name}",
      },
      sheet: {
        edit: "Edit seguimiento",
        edit_for: "Edit seguimiento for %{name}",
      },
      empty: "No seguimientos yet",
      empty_list_hint: "Seguimientos added to your clients will appear here.",
      filters: {
        later: "Later",
        overdue: "Overdue",
        this_week: "This week",
        today: "Today",
        tomorrow: "Tomorrow",
        with_pending: "With pending seguimientos",
      },
      regarding_contact: "(Client: %{name})",
      updated: "Seguimiento updated",
    },
    tags: {
      name: "Tag |||| Tags",
      action: {
        add: "Add tag",
        create: "Create new tag",
      },
      dialog: {
        color: "Color",
        create_title: "Create a new tag",
        edit_title: "Edit tag",
        name_label: "Tag name",
        name_placeholder: "Enter tag name",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Reset Password",
    },
    auth: {
      first_name: "First name",
      last_name: "Last name",
      confirm_password: "Confirm password",
      confirmation_required:
        "Please follow the link we just sent you by email to confirm your account.",
      recovery_email_sent:
        "If you're a registered user, you should receive a password recovery email shortly.",
      sign_in_failed: "Failed to log in.",
      sign_in_google_workspace: "Sign in with Google Workplace",
      signup: {
        create_account: "Create account",
        create_first_user:
          "Create the first user account to complete the setup.",
        creating: "Creating...",
        initial_user_created: "Initial user successfully created",
      },
      welcome_title: "Welcome to Claridad CRM",
    },
    common: {
      activity: "Activity",
      added: "added",
      details: "Details",
      history: "Historia",
      last_activity_with_date: "last activity %{date}",
      load_more: "Load more",
      misc: "Misc",
      past: "Past",
      read_more: "Read more",
      retry: "Retry",
      show_less: "Show less",
      copied: "Copied!",
      copy: "Copy",
      loading: "Loading...",
      me: "Me",
      task_count: "%{smart_count} seguimiento |||| %{smart_count} seguimientos",
    },
    changelog: {
      title: "Changelog",
    },
    activity: {
      added_company: "%{name} added company",
      you_added_company: "You added company",
      added_contact: "%{name} added",
      you_added_contact: "You added",
      added_note: "%{name} added a note about",
      you_added_note: "You added a note about",
      added_note_about_deal: "%{name} added a note about deal",
      you_added_note_about_deal: "You added a note about deal",
      added_deal: "%{name} added deal",
      you_added_deal: "You added deal",
      at_company: "at",
      to: "to",
      load_more: "Load more activity",
    },
    dashboard: {
      latest_activity: "Latest Activity",
      latest_activity_error: "Error loading latest activity",
      latest_notes: "My Latest Notes",
      latest_notes_added_ago: "added %{timeAgo}",
      stepper: {
        install: "Workspace ready",
        progress: "%{step}/3 done",
        whats_next: "What's next?",
      },
      upcoming_tasks: "Upcoming Seguimientos",
    },
    header: {
      import_data: "Import data",
    },
    image_editor: {
      change: "Change",
      drop_hint: "Drop a file to upload, or click to select it.",
      editable_content: "Editable content",
      title: "Upload and resize image",
      update_image: "Update Image",
    },
    import: {
      action: {
        download_error_report: "Download the error report",
        import: "Import",
        import_another: "Import another file",
      },
      error: {
        unable: "Unable to import this file.",
      },
      idle: {
        description_1:
          "You can import sales, companies, contacts, companies, notes, and tasks.",
        description_2:
          "Data must be in a JSON file matching the following sample:",
      },
      status: {
        all_success: "All records were imported successfully.",
        complete: "Import complete.",
        failed: "Failed",
        imported: "Imported",
        in_progress:
          "Import in progress, please don't navigate away from this page.",
        some_failed: "Some records were not imported.",
        table_caption: "Import status",
      },
      title: "Import Data",
    },
    settings: {
      about: "About",
      companies: {
        sectors: "Sectors",
      },
      dark_mode_logo: "Dark Mode Logo",
      deals: {
        categories: "Categories",
        currency: "Currency",
        pipeline_help:
          "Select which deal stages should count as pipeline deals.",
        pipeline_statuses: "Pipeline Statuses",
        stages: "Stages",
      },
      light_mode_logo: "Light Mode Logo",
      notes: {
        statuses: "Statuses",
      },
      reset_defaults: "Reset to Defaults",
      save_error: "Failed to save configuration",
      saved: "Configuration saved successfully",
      saving: "Saving...",
      tasks: {
        types: "Types",
      },
      preferences: "Preferences",
      title: "Settings",
      app_title: "App Title",
      sections: {
        branding: "Branding",
      },
      validation: {
        duplicate: "Duplicate %{display_name}: %{items}",
        in_use:
          "Cannot remove %{display_name} that are still used by deals: %{items}",
        validating: "Validating\u2026",
        entities: {
          categories: "categories",
          stages: "stages",
        },
      },
    },
    theme: {
      dark: "Dark",
      label: "Theme",
      light: "Light",
      system: "System",
    },
    language: "Language",
    navigation: {
      label: "CRM navigation",
    },
    today: {
      title: "Hoy",
      kicker: "Inicio operativo",
      description:
        "Este es el espacio diario de Claridad. Los widgets con datos reales irán aterrizando en los siguientes slices.",
      core_metric: {
        title: "Claridad antes de WhatsApp",
        days_before_whatsapp_value:
          "%{smart_count} dia esta semana |||| %{smart_count} dias esta semana",
        days_before_whatsapp_hint:
          "Dias en los que Claridad se abrio antes del primer toque de WhatsApp desde la app.",
        active_days_title: "Dias activos",
        active_days_value:
          "%{smart_count} dia con apertura |||| %{smart_count} dias con apertura",
        active_days_hint:
          "Aperturas registradas en esta semana desde este dispositivo.",
        whatsapp_touches_title: "Toques de WhatsApp",
        whatsapp_touches_value:
          "%{smart_count} toque desde Claridad |||| %{smart_count} toques desde Claridad",
        whatsapp_touches_hint:
          "Uso semanal del CTA de WhatsApp dentro del flujo operativo.",
      },
      greeting_with_name: "%{greeting}, %{name}",
      greetings: {
        morning: "Buenos dias",
        afternoon: "Buenas tardes",
        evening: "Buenas noches",
      },
      shell_state: "Estado del shell",
      shell_state_value: "Preparando datos reales",
      sections_overview: "Secciones de Hoy",
      section_error:
        "No se pudo renderizar esta seccion. El shell sigue disponible mientras terminamos de conectar los widgets reales.",
      sections: {
        tasks: {
          title: "Seguimientos vencidos (%{smart_count})",
          description:
            "Los seguimientos pendientes mas antiguos aparecen primero para que Hoy siempre arranque por la accion.",
          open_whatsapp: "Abrir WhatsApp",
          mark_done: "Hecho",
          missing_whatsapp: "Sin numero registrado",
          empty_title: "No hay seguimientos pendientes.",
          empty_description: "Buen trabajo.",
          view_all: "Ver todos (%{smart_count})",
          overdue_days:
            "Pendiente desde ayer |||| Pendiente desde hace %{smart_count} dias",
        },
        birthdays: {
          title: "Cumpleanos hoy (%{smart_count})",
          description:
            "Las clientas que cumplen hoy aparecen aqui para facilitar un gesto humano con timing comercial ligero.",
          today_label: "Cumple hoy",
          send_greeting: "Felicitar por WhatsApp",
          empty_title: "Nadie cumple hoy.",
          empty_description: "Puedes dedicar el dia a seguimientos y citas.",
          view_all: "Ver todas (%{smart_count})",
        },
        appointments: {
          title: "Citas de hoy (%{smart_count})",
          description:
            "Las citas pendientes y confirmadas de hoy aparecen aqui para que no se te escape ninguna.",
          open_contact: "Abrir ficha",
          empty_title: "No tienes citas hoy.",
          empty_description:
            "Tu agenda queda libre para seguimientos y mensajes.",
          view_all: "Ver todas (%{smart_count})",
          statuses: {
            pending: "Pendiente",
            confirmed: "Confirmada",
            completed: "Realizada",
            cancelled: "Cancelada",
          },
          types: {
            consultation: "Asesoria",
            delivery: "Entrega",
            demonstration: "Demostracion",
            follow_up: "Seguimiento",
            video_call: "Videollamada",
          },
        },
        touch_this_week: {
          title: "Toca esta semana",
          description:
            "Una vista ligera para anticipar reactivaciones, oportunidades sin movimiento y momentos relacionales cercanos.",
          rows: {
            no_contact: {
              title: "Clientas sin contacto",
              hint: "Sin actividad registrada desde hace mas de %{smart_count} dias.",
              cta: "Ver clientas",
            },
            opportunities: {
              title: "Oportunidades sin actividad",
              hint: "Sin movimiento visible desde hace mas de %{smart_count} dias.",
              cta: "Ver oportunidades",
            },
            birthdays: {
              title: "Cumpleanos proximos",
              hint: "Clientas que cumplen dentro de los proximos %{smart_count} dias.",
              cta: "Ver cumpleanos",
            },
          },
          footer:
            "La idea no es abarcarlo todo hoy, sino saber donde conviene volver a mirar esta semana.",
        },
      },
    },
    profile: {
      inbound: {
        description:
          "You can start sending emails to your server's inbound email address, e.g. by adding it to the %{field} field. Atomic CRM will process the emails and add notes to the corresponding contacts.",
        title: "Inbound email",
      },
      mcp: {
        title: "MCP Server",
        description:
          "Use this URL to connect your AI assistant to your CRM data via the Model Context Protocol (MCP).",
      },
      password: {
        change: "Change password",
      },
      password_reset_sent:
        "A reset password email has been sent to your email address",
      record_not_found: "Record not found",
      title: "Profile",
      updated: "Your profile has been updated",
      update_error: "An error occurred. Please try again",
    },
    validation: {
      invalid_url: "Must be a valid URL",
      invalid_linkedin_url: "URL must be from linkedin.com",
    },
  },
} as const;

type MessageSchema<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? MessageSchema<T[K]>
      : never;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

export type CrmMessages = MessageSchema<typeof englishCrmMessages>;
export type PartialCrmMessages = DeepPartial<CrmMessages>;
