import { Calendar, MapPin, MessageCircle } from "lucide-react";
import {
  useLocaleState,
  useRecordContext,
  useTranslate,
  WithRecord,
} from "ra-core";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { DateField } from "@/components/admin/date-field";

import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "./contactModel";
import type { Contact } from "../types";

export const ContactProfileInfo = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();
  const [locale = "en"] = useLocaleState();

  if (!record) return null;

  const businessLineChoices = contactBusinessLines.reduce<
    Record<string, string>
  >((acc, choice) => {
    acc[choice.value] = translateContactBusinessLineLabel(choice, translate);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-3">
      {record.whatsapp ? (
        <ProfileInfoRow
          icon={<MessageCircle className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.whatsapp")}
        >
          <span>{record.whatsapp}</span>
        </ProfileInfoRow>
      ) : null}

      {record.city ? (
        <ProfileInfoRow
          icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.city")}
        >
          <span>{record.city}</span>
        </ProfileInfoRow>
      ) : null}

      {record.birthday ? (
        <ProfileInfoRow
          icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.birthday")}
        >
          <DateField
            source="birthday"
            record={record}
            locales={locale}
            showDate
          />
        </ProfileInfoRow>
      ) : null}

      {record.business_lines_interest?.length ? (
        <ProfileInfoRow
          icon={<span className="w-4 h-4" />}
          label={translate("resources.contacts.fields.business_lines_interest")}
        >
          <div className="flex flex-wrap gap-1">
            {record.business_lines_interest.map((businessLine) => (
              <Badge key={businessLine} variant="outline">
                {businessLineChoices[businessLine] ?? businessLine}
              </Badge>
            ))}
          </div>
        </ProfileInfoRow>
      ) : null}

      <WithRecord<Contact>
        render={(row) =>
          row.preferences ? (
            <ProfileInfoRow
              icon={<span className="w-4 h-4" />}
              label={translate("resources.contacts.fields.preferences")}
            >
              <span>{row.preferences}</span>
            </ProfileInfoRow>
          ) : null
        }
      />

      <WithRecord<Contact>
        render={(row) =>
          row.allergies_or_needs ? (
            <ProfileInfoRow
              icon={<span className="w-4 h-4" />}
              label={translate("resources.contacts.fields.allergies_or_needs")}
            >
              <span>{row.allergies_or_needs}</span>
            </ProfileInfoRow>
          ) : null
        }
      />
    </div>
  );
};

const ProfileInfoRow = ({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) => (
  <div className="flex items-start gap-2">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm break-words">{children}</div>
    </div>
  </div>
);
