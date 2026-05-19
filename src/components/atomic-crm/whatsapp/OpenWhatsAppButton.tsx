import { MessageCircle } from "lucide-react";
import {
  useDataProvider,
  useGetIdentity,
  useNotify,
  useTranslate,
  type Identifier,
} from "ra-core";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getOrCreateCoreMetricSession,
  recordWhatsappOpened,
} from "../metrics/coreMetric";
import type { Contact, CustomerEvent, Task } from "../types";
import {
  buildBirthdayWhatsAppUrl,
  buildWhatsAppUrl,
  getWhatsAppNumber,
} from "./whatsapp";

export const OpenWhatsAppButton = ({
  contact,
  task,
  businessLineLabel,
  label,
  mode = "follow_up",
}: {
  contact?: Contact | null;
  task?: Task;
  businessLineLabel?: string | null;
  label?: string;
  mode?: "follow_up" | "birthday";
}) => {
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const whatsappNumber = getWhatsAppNumber(contact);
  const whatsappUrl =
    mode === "birthday"
      ? buildBirthdayWhatsAppUrl({ contact, businessLineLabel })
      : task
        ? buildWhatsAppUrl({ contact, task, businessLineLabel })
        : null;
  const disabled = !whatsappUrl;

  const handleClick = async () => {
    if (!contact || !whatsappUrl || !whatsappNumber) {
      return;
    }

    try {
      const session =
        typeof window !== "undefined" &&
        window.localStorage &&
        window.sessionStorage
          ? getOrCreateCoreMetricSession(window.sessionStorage)
          : null;

      await dataProvider.create<CustomerEvent>("customer_events", {
        data: {
          business_line_id: contact.company_id ?? null,
          contact_id: contact.id,
          occurred_at: new Date().toISOString(),
          payload: {
            day_key: session?.dayKey ?? null,
            message: decodeURIComponent(whatsappUrl.split("text=")[1] ?? ""),
            mode,
            phone_number: whatsappNumber,
            session_id: session?.id ?? null,
            task_text: task?.text ?? null,
          },
          related_id: task?.id ?? null,
          related_table: task ? "tasks" : null,
          sales_id: (identity?.id as Identifier | undefined) ?? null,
          source: "whatsapp_link",
          type: "whatsapp.opened",
        },
      });

      if (
        typeof window !== "undefined" &&
        window.localStorage &&
        window.sessionStorage
      ) {
        recordWhatsappOpened(window.localStorage, window.sessionStorage);
      }

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open WhatsApp from Today", error);
      notify("ra.notification.http_error", { type: "error" });
    }
  };

  const button = (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleClick}
      disabled={disabled}
      className="min-w-32"
    >
      <MessageCircle className="size-4" />
      {label ?? translate("crm.today.sections.tasks.open_whatsapp")}
    </Button>
  );

  if (!disabled) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{button}</span>
      </TooltipTrigger>
      <TooltipContent>
        {translate("crm.today.sections.tasks.missing_whatsapp")}
      </TooltipContent>
    </Tooltip>
  );
};
