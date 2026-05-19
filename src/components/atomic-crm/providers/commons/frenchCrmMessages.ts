import type { CrmMessages } from "./englishCrmMessages";

export const frenchCrmMessages = {
  resources: {
    companies: {
      name: "Entreprise |||| Entreprises",
      forcedCaseName: "Entreprise",
      fields: {
        name: "Nom de l'entreprise",
        website: "Site web",
        linkedin_url: "LinkedIn",
        phone_number: "Numéro de téléphone",
        created_at: "Date de création",
        nb_contacts: "Nombre de contacts",
        revenue: "Chiffre d'affaires",
        sector: "Secteur",
        size: "Taille",
        tax_identifier: "Identifiant fiscal",
        address: "Adresse",
        city: "Ville",
        zipcode: "Code postal",
        state_abbr: "État",
        country: "Pays",
        description: "Description",
        context_links: "URLs de contexte",
        sales_id: "Responsable de compte",
      },
      empty: {
        description: "Il semble que la liste de vos entreprises soit vide.",
        title: "Aucune entreprise trouvée",
      },
      field_categories: {
        contact: "Contact",
        additional_info: "Informations supplémentaires",
        address: "Adresse",
        context: "Contexte",
      },
      action: {
        create: "Créer une entreprise",
        edit: "Modifier l'entreprise",
        new: "Nouvelle entreprise",
        show: "Afficher l'entreprise",
      },
      added_on: "Ajoutée le %{date}",
      followed_by: "Suivie par %{name}",
      followed_by_you: "Suivie par vous",
      no_contacts: "Aucun contact",
      nb_contacts: "%{smart_count} contact |||| %{smart_count} contacts",
      nb_deals: "%{smart_count} affaire |||| %{smart_count} affaires",
      sizes: {
        one_employee: "1 employé",
        two_to_nine_employees: "2-9 employés",
        ten_to_forty_nine_employees: "10-49 employés",
        fifty_to_two_hundred_forty_nine_employees: "50-249 employés",
        two_hundred_fifty_or_more_employees: "250 employés ou plus",
      },
      autocomplete: {
        create_error:
          "Une erreur s'est produite lors de la création de l'entreprise",
        create_item: "Créer %{item}",
        create_label: "Commencez à taper pour créer une nouvelle entreprise",
      },
      filters: {
        only_mine: "Seulement les entreprises que je gère",
      },
    },
    contacts: {
      name: "Client |||| Clients",
      forcedCaseName: "Client",
      field_categories: {
        background_info: "Informations complémentaires",
        identity: "Identité",
        misc: "Divers",
        personal_info: "Informations personnelles",
        profile: "Profil client",
        position: "Poste",
      },
      fields: {
        allergies_or_needs: "Allergies ou besoins",
        birthday: "Date d'anniversaire",
        business_lines_interest: "Lignes d'activité",
        city: "Ville",
        first_name: "Prénom",
        last_name: "Nom",
        last_seen: "Dernière activité",
        title: "Titre",
        company_id: "Entreprise",
        preferences: "Préférences",
        status: "Statut client",
        email_jsonb: "Adresses e-mail",
        email: "E-mail",
        phone_jsonb: "Numéros de téléphone",
        phone_number: "Numéro de téléphone",
        whatsapp: "WhatsApp",
        linkedin_url: "URL LinkedIn",
        background: "Informations de contexte",
        has_newsletter: "Abonné à la newsletter",
        sales_id: "Responsable de compte",
      },
      action: {
        add: "Ajouter un client",
        add_first: "Ajoutez votre premier client",
        create: "Créer un client",
        edit: "Modifier le client",
        export_vcard: "Exporter en vCard",
        new: "Nouveau client",
        show: "Afficher le client",
      },
      background: {
        last_activity_on: "Dernière activité le %{date}",
        added_on: "Ajouté le %{date}",
        followed_by: "Suivi par %{name}",
        followed_by_you: "Suivi par vous",
        status_none: "Aucun",
      },
      position_at: "%{title} chez",
      position_at_company: "%{title} chez %{company}",
      empty: {
        description: "Il semble que votre liste de clients soit vide.",
        title: "Aucun client trouvé",
      },
      import: {
        title: "Importer des clients",
        button: "Importer un fichier CSV",
        complete:
          "Import des clients terminé. %{importCount} clients importés, %{errorCount} erreurs",
        progress:
          "%{importCount} / %{rowCount} clients importés, avec %{errorCount} erreurs.",
        error:
          "Échec de l'importation de ce fichier. Veuillez vous assurer que vous avez fourni un fichier CSV valide.",
        imported: "Importé",
        remaining_time: "Temps restant estimé :",
        running: "L'import est en cours, merci de ne pas fermer cet onglet.",
        sample_download: "Télécharger un exemple CSV",
        sample_hint:
          "Voici un exemple de fichier CSV que vous pouvez utiliser comme modèle",
        stop: "Arrêter l'importation",
        csv_file: "Fichier CSV",
        contacts_label: "client |||| clients",
      },
      inputs: {
        genders: {
          male: "Monsieur",
          female: "Madame",
          nonbinary: "Indéterminé",
        },
        personal_info_types: {
          work: "Pro",
          home: "Perso",
          other: "Autre",
        },
        business_lines: {
          mary_kay: "Mary Kay",
          beyond_beauty: "Beyond Beauty",
          incruises: "In Cruises",
        },
      },
      list: {
        error_loading: "Erreur lors du chargement des clients",
      },
      bulk_tag: {
        action: "Étiqueter",
        back: "Retour aux étiquettes",
        create_description:
          "Créez une nouvelle étiquette et appliquez-la aux clients sélectionnés.",
        description:
          "Choisissez une étiquette existante ou créez-en une pour les clients sélectionnés.",
        empty:
          "Aucune étiquette pour le moment. Créez-en une pour étiqueter les clients sélectionnés.",
        error: "Impossible d'ajouter l'étiquette aux clients",
        noop: "Les clients sélectionnés ont déjà cette étiquette",
        success:
          "Étiquette ajoutée à %{smart_count} client |||| Étiquette ajoutée à %{smart_count} clients",
        title: "Ajouter une étiquette aux clients",
      },
      timeline: {
        empty: "Aucune activite enregistree avec cette cliente pour le moment",
        events: {
          note_created: "Note creee",
          note_without_preview: "Aucun apercu disponible",
          task_created: "Suivi cree",
          task_completed: "Suivi termine",
          opportunity_created: "Opportunite creee",
          opportunity_stage_changed: "Changement d'etape de l'opportunite",
          no_context: "Aucun contexte supplementaire",
          stage_label: "Etape : %{stage}",
          stage_changed_detail: "%{name} est passe de %{from} a %{to}",
        },
      },
      merge: {
        action: "Fusionner avec un autre client",
        confirm: "Fusionner les clients",
        current_contact: "Client actuel (sera supprimé)",
        description: "Fusionnez ce client avec un autre.",
        error: "Échec de la fusion des clients",
        merging: "Fusion...",
        no_additional_data: "Aucune donnée supplémentaire à fusionner",
        select_target: "Veuillez sélectionner un client avec lequel fusionner",
        success: "Clients fusionnés avec succès",
        target_contact: "Client cible (sera conservé)",
        title: "Fusionner les clients",
        warning_description:
          "Toutes les données seront transférées au deuxième client. Cette action ne peut pas être annulée.",
        warning_title: "Avertissement : opération destructrice",
        what_will_be_merged: "Ce qui sera fusionné :",
      },
      filters: {
        before_last_month: "Avant le mois dernier",
        before_this_month: "Avant ce mois-ci",
        before_this_week: "Avant cette semaine",
        managed_by_me: "Géré par moi",
        search: "Rechercher un client...",
        this_week: "Cette semaine",
        today: "Aujourd'hui",
        tags: "Étiquettes",
        tasks: "Suivis",
      },
      hot: {
        empty_change_status:
          'Changez le statut d\'un client en ajoutant une note à ce client et en cliquant sur "afficher les options".',
        empty_hint: 'Les clients avec un statut "chaud" apparaîtront ici.',
        title: "Clients prioritaires",
      },
    },
    appointments: {
      name: "Rendez-vous |||| Rendez-vous",
      forcedCaseName: "Rendez-vous",
      fields: {
        contact_id: "Client",
        notes: "Notes",
        scheduled_at: "Prévu le",
        status: "Statut",
        type: "Type",
      },
      action: {
        add: "Ajouter un rendez-vous",
        create: "Créer un rendez-vous",
        edit: "Modifier le rendez-vous",
        new: "Nouveau rendez-vous",
        show: "Afficher le rendez-vous",
      },
      dialog: {
        create: "Créer un rendez-vous",
        create_for: "Créer un rendez-vous pour %{name}",
      },
      added: "Rendez-vous ajouté",
      updated: "Rendez-vous mis à jour",
      deleted: "Rendez-vous supprimé",
      empty: "Aucun rendez-vous pour le moment",
      regarding_contact: "(Client : %{name})",
      inputs: {
        statuses: {
          pending: "En attente",
          confirmed: "Confirmé",
          completed: "Terminé",
          cancelled: "Annulé",
        },
        types: {
          consultation: "Consultation",
          delivery: "Livraison",
          demonstration: "Démonstration",
          follow_up: "Suivi",
          video_call: "Appel vidéo",
        },
      },
    },
    catalog_links: {
      name: "Lien de catalogue |||| Liens de catalogue",
      forcedCaseName: "Lien de catalogue",
      fields: {
        title: "Titre",
        url: "URL",
        type: "Type",
        business_line: "Ligne d'activité",
        campaign: "Campagne",
        active: "Actif",
        active_yes: "Actif",
        active_no: "Inactif",
        notes: "Notes",
        created_at: "Créé le",
      },
      action: {
        create: "Créer un lien",
        edit: "Modifier le lien",
        new: "Nouveau lien",
        show: "Afficher le lien",
      },
      filters: {
        all_business_lines: "Toutes les lignes d'activité",
        all_types: "Tous les types",
      },
      validation: {
        url_format: "Doit être une URL commençant par http:// ou https://",
      },
      empty: "Aucun lien pour le moment",
      added: "Lien ajouté",
      updated: "Lien mis à jour",
      deleted: "Lien supprimé",
      inputs: {
        types: {
          catalog: "Catalogue",
          link: "Lien",
          campaign: "Campagne",
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
      name: "Affaire |||| Affaires",
      fields: {
        name: "Nom",
        description: "Description",
        company_id: "Entreprise",
        contact_ids: "Contacts",
        category: "Catégorie",
        amount: "Budget",
        expected_closing_date: "Date de clôture prévue",
        stage: "Étape",
      },
      action: {
        back_to_deal: "Retour à l'affaire",
        create: "Créer une affaire",
        new: "Nouvelle affaire",
      },
      field_categories: {
        misc: "Divers",
      },
      archived: {
        action: "Archiver",
        error: "Erreur : affaire non archivée",
        list_title: "Affaires archivées",
        success: "Affaire archivée",
        title: "Affaire archivée",
        view: "Afficher les affaires archivées",
      },
      inputs: {
        linked_to: "Lié à",
      },
      unarchived: {
        action: "Renvoyer au tableau",
        error: "Erreur : affaire non désarchivée",
        success: "Affaire désarchivée",
      },
      updated: "Affaire mise à jour",
      empty: {
        before_create: "avant de créer une affaire.",
        description: "Il semble que votre liste d'affaires soit vide.",
        title: "Aucune affaire trouvée",
      },
      invalid_date: "Date invalide",
    },
    notes: {
      name: "Note |||| Notes",
      forcedCaseName: "Note",
      fields: {
        status: "Statut",
        date: "Date",
        attachments: "Pièces jointes",
        contact_id: "Contact",
        deal_id: "Affaire",
      },
      action: {
        add: "Ajouter une note",
        add_first: "Ajoutez votre première note",
        delete: "Supprimer la note",
        edit: "Modifier la note",
        update: "Mettre à jour la note",
        add_this: "Ajouter cette note",
      },
      sheet: {
        create: "Créer une note",
        create_for: "Créer une note pour %{name}",
        edit: "Modifier la note",
        edit_for: "Modifier la note pour %{name}",
      },
      deleted: "Note supprimée",
      empty: "Aucune note pour l'instant",
      author_added: "%{name} a ajouté une note",
      you_added: "Vous avez ajouté une note",
      me: "Moi",
      list: {
        error_loading: "Erreur lors du chargement des notes",
      },
      note_for_contact: "Note pour %{name}",
      stepper: {
        hint: "Accédez à une page client et ajoutez une note",
      },
      added: "Note ajoutée",
      inputs: {
        add_note: "Ajouter une note",
        options_hint: "(joindre des fichiers ou modifier les détails)",
        show_options: "Afficher les options",
      },
      actions: {
        attach_document: "Joindre un document",
      },
      validation: {
        note_or_attachment_required: "Une note ou une pièce jointe est requise",
      },
    },
    sales: {
      name: "Utilisateur |||| Utilisateurs",
      fields: {
        first_name: "Prénom",
        last_name: "Nom",
        email: "E-mail",
        administrator: "Admin",
        disabled: "Désactivé",
      },
      create: {
        error:
          "Une erreur s'est produite lors de la création de l'utilisateur.",
        success:
          "Utilisateur créé. Ils recevront prochainement un email pour définir leur mot de passe.",
        title: "Créer un nouvel utilisateur",
      },
      edit: {
        error: "Une erreur s'est produite. Veuillez réessayer.",
        record_not_found: "Enregistrement introuvable",
        success: "Utilisateur mis à jour avec succès",
        title: "Modifier %{name}",
      },
      action: {
        new: "Nouvel utilisateur",
      },
    },
    tasks: {
      name: "Suivi |||| Suivis",
      forcedCaseName: "Suivi",
      fields: {
        text: "Description",
        due_date: "Date d'échéance",
        type: "Type",
        contact_id: "Client",
        due_short: "échéance",
      },
      action: {
        add: "Ajouter un suivi",
        create: "Créer un suivi",
        edit: "Modifier le suivi",
      },
      actions: {
        postpone_next_week: "Reporté à la semaine prochaine",
        postpone_tomorrow: "Reporter à demain",
        title: "Actions du suivi",
      },
      added: "Suivi ajouté",
      deleted: "Suivi supprimé avec succès",
      dialog: {
        create: "Créer un suivi",
        create_for: "Créer un suivi pour %{name}",
      },
      sheet: {
        edit: "Modifier le suivi",
        edit_for: "Modifier le suivi pour %{name}",
      },
      empty: "Aucun suivi pour l'instant",
      empty_list_hint: "Les suivis ajoutés à vos clients apparaîtront ici.",
      filters: {
        later: "Plus tard",
        overdue: "En retard",
        this_week: "Cette semaine",
        today: "Aujourd'hui",
        tomorrow: "Demain",
        with_pending: "Avec des suivis en attente",
      },
      regarding_contact: "(Client : %{name})",
      updated: "Suivi mis à jour",
    },
    tags: {
      name: "Étiquette |||| Étiquettes",
      action: {
        add: "Ajouter une étiquette",
        create: "Créer une nouvelle étiquette",
      },
      dialog: {
        color: "Couleur",
        create_title: "Créer une nouvelle étiquette",
        edit_title: "Modifier l'étiquette",
        name_label: "Nom de l'étiquette",
        name_placeholder: "Saisir le nom de l'étiquette",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Réinitialiser le mot de passe",
    },
    auth: {
      first_name: "Prénom",
      last_name: "Nom",
      confirm_password: "Confirmer le mot de passe",
      confirmation_required:
        "Veuillez suivre le lien que nous venons de vous envoyer par email pour confirmer votre compte.",
      recovery_email_sent:
        "Si vous êtes un utilisateur enregistré, vous devriez recevoir prochainement un e-mail de récupération de mot de passe.",
      sign_in_failed: "Échec de la connexion.",
      sign_in_google_workspace: "Connectez-vous avec Google Workplace",
      signup: {
        create_account: "Créer un compte",
        create_first_user:
          "Créez le premier compte utilisateur pour terminer la configuration.",
        creating: "Création...",
        initial_user_created: "Utilisateur initial créé avec succès",
      },
      welcome_title: "Bienvenue sur Claridad CRM",
    },
    common: {
      activity: "Activité",
      added: "ajoutée",
      details: "Détails",
      history: "Historique",
      last_activity_with_date: "dernière activité %{date}",
      load_more: "Charger plus",
      misc: "Divers",
      past: "Passé",
      read_more: "En savoir plus",
      retry: "Réessayer",
      show_less: "Afficher moins",
      task_count: "%{smart_count} suivi |||| %{smart_count} suivis",
      copied: "Copié !",
      copy: "Copier",
      loading: "Chargement...",
      me: "Moi",
    },
    changelog: {
      title: "Notes de version",
    },
    activity: {
      added_company: "%{name} a ajouté l'entreprise",
      you_added_company: "Vous avez ajouté l'entreprise",
      added_contact: "%{name} a ajouté le contact",
      you_added_contact: "Vous avez ajouté le contact",
      added_note: "%{name} a ajouté une note sur",
      you_added_note: "Vous avez ajouté une note sur",
      added_note_about_deal: "%{name} a ajouté une note sur l'affaire",
      you_added_note_about_deal: "Vous avez ajouté une note sur l'affaire",
      added_deal: "%{name} a ajouté l'affaire",
      you_added_deal: "Vous avez ajouté l'affaire",
      at_company: "chez",
      to: "à",
      load_more: "Charger plus d'activité",
    },
    dashboard: {
      latest_activity: "Dernière activité",
      latest_activity_error:
        "Erreur lors du chargement de la dernière activité",
      latest_notes: "Mes dernières notes",
      latest_notes_added_ago: "ajouté %{timeAgo}",
      stepper: {
        install: "Espace de travail prêt",
        progress: "%{step}/3 terminé",
        whats_next: "Et ensuite ?",
      },
      upcoming_tasks: "Suivis à venir",
    },
    header: {
      import_data: "Importer des données",
    },
    image_editor: {
      change: "Changer",
      drop_hint:
        "Déposez un fichier à télécharger ou cliquez pour le sélectionner.",
      editable_content: "Contenu modifiable",
      title: "Télécharger et redimensionner l'image",
      update_image: "Mettre à jour l'image",
    },
    import: {
      action: {
        download_error_report: "Téléchargez le rapport d'erreur",
        import: "Importer",
        import_another: "Importer un autre fichier",
      },
      error: {
        unable: "Impossible d'importer ce fichier.",
      },
      idle: {
        description_1:
          "Vous pouvez importer des ventes, des entreprises, des contacts, des entreprises, des notes et des tâches.",
        description_2:
          "Les données doivent se trouver dans un fichier JSON correspondant à l'exemple suivant :",
      },
      status: {
        all_success: "Tous les enregistrements ont été importés avec succès.",
        complete: "Importation terminée.",
        failed: "Échoué",
        imported: "Importé",
        in_progress: "Import en cours, veuillez ne pas quitter cette page.",
        some_failed: "Certains enregistrements n'ont pas été importés.",
        table_caption: "Statut d'importation",
      },
      title: "Importer des données",
    },
    settings: {
      about: "À propos",
      companies: {
        sectors: "Secteurs",
      },
      dark_mode_logo: "Logo du mode sombre",
      deals: {
        categories: "Catégories",
        currency: "Devise",
        pipeline_help:
          "Sélectionnez les étapes d'affaire à considérer comme des affaires dans le pipeline.",
        pipeline_statuses: "Statuts des pipelines",
        stages: "Étapes",
      },
      light_mode_logo: "Logo du mode clair",
      notes: {
        statuses: "Statuts",
      },
      reset_defaults: "Réinitialiser aux valeurs par défaut",
      save_error: "Échec de l'enregistrement de la configuration",
      saved: "Configuration enregistrée avec succès",
      saving: "Enregistrement...",
      tasks: {
        types: "Types",
      },
      preferences: "Préférences",
      title: "Paramètres",
      app_title: "Titre de l'application",
      sections: {
        branding: "Image de marque",
      },
      validation: {
        duplicate: "%{display_name} en double : %{items}",
        in_use:
          "Impossible de supprimer %{display_name} encore utilisés par des affaires : %{items}",
        validating: "Validation\u2026",
        entities: {
          categories: "catégories",
          stages: "étapes",
        },
      },
    },
    theme: {
      dark: "Sombre",
      label: "Thème",
      light: "Clair",
      system: "Système",
    },
    language: "Langue",
    navigation: {
      label: "Navigation CRM",
    },
    today: {
      title: "Aujourd'hui",
      kicker: "Accueil opérationnel",
      description:
        "Ceci devient l'espace de travail quotidien de Claridad. Les widgets réels arriveront dans les prochains slices.",
      core_metric: {
        title: "Claridad avant WhatsApp",
        days_before_whatsapp_value:
          "%{smart_count} jour cette semaine |||| %{smart_count} jours cette semaine",
        days_before_whatsapp_hint:
          "Jours ou Claridad a ete ouverte avant le premier usage WhatsApp depuis l'application.",
        active_days_title: "Jours actifs",
        active_days_value:
          "%{smart_count} jour avec ouverture |||| %{smart_count} jours avec ouverture",
        active_days_hint:
          "Ouvertures enregistrees cette semaine depuis cet appareil.",
        whatsapp_touches_title: "Usages WhatsApp",
        whatsapp_touches_value:
          "%{smart_count} usage depuis Claridad |||| %{smart_count} usages depuis Claridad",
        whatsapp_touches_hint:
          "Usage hebdomadaire du CTA WhatsApp dans le flux operationnel.",
      },
      greeting_with_name: "%{greeting}, %{name}",
      greetings: {
        morning: "Bonjour",
        afternoon: "Bon après-midi",
        evening: "Bonsoir",
      },
      shell_state: "État du shell",
      shell_state_value: "Données en préparation",
      sections_overview: "Sections de l'écran Aujourd'hui",
      section_error:
        "Cette section n'a pas pu s'afficher. Le shell reste disponible pendant que les widgets de données sont en cours de construction.",
      sections: {
        tasks: {
          title: "Suivis en retard (%{smart_count})",
          description:
            "Les suivis les plus anciens apparaissent ici en premier pour démarrer la journée par l'action.",
          open_whatsapp: "Ouvrir WhatsApp",
          mark_done: "Fait",
          missing_whatsapp: "Aucun numero enregistre",
          empty_title: "Aucun suivi en attente.",
          empty_description: "Bon travail.",
          view_all: "Voir tout (%{smart_count})",
          overdue_days:
            "En attente depuis hier |||| En attente depuis %{smart_count} jours",
        },
        birthdays: {
          title: "Anniversaires du jour (%{smart_count})",
          description:
            "Les clientes qui fetent leur anniversaire aujourd'hui apparaissent ici pour faciliter un geste humain avec un bon timing relationnel.",
          today_label: "Anniversaire aujourd'hui",
          send_greeting: "Felicitations via WhatsApp",
          empty_title: "Aucun anniversaire aujourd'hui.",
          empty_description:
            "Tu peux te concentrer sur les suivis et les rendez-vous.",
          view_all: "Voir toutes (%{smart_count})",
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
          title: "À toucher cette semaine",
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
          "Vous pouvez commencer à envoyer des e-mails vers l'adresse de réception de votre serveur, par exemple en l'ajoutant au champ %{field}. Atomic CRM traitera les e-mails et ajoutera des notes aux contacts correspondants.",
        title: "E-mail entrant",
      },
      mcp: {
        title: "Serveur MCP",
        description:
          "Utilisez cette URL pour connecter votre assistant IA aux données de votre CRM via le Model Context Protocol (MCP).",
      },
      password: {
        change: "Changer le mot de passe",
      },
      password_reset_sent:
        "Un e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail",
      record_not_found: "Enregistrement introuvable",
      title: "Profil",
      updated: "Votre profil a été mis à jour",
      update_error: "Une erreur s'est produite. Veuillez réessayer",
    },
    validation: {
      invalid_url: "Doit être une URL valide",
      invalid_linkedin_url: "L'URL doit provenir de linkedin.com",
    },
  },
} satisfies CrmMessages;
