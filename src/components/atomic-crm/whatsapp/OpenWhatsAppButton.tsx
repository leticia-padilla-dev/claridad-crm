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
import type { Contact, CustomerEvent, Task } from "../types";
import { buildWhatsAppUrl, getWhatsAppNumber } from "./whatsapp";

export const OpenWhatsAppButton = ({
  contact,
  task,
  businessLineLabel,
}: {
  contact?: Contact | null;
  task: Task;
  businessLineLabel?: string | null;
}) => {
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const whatsappNumber = getWhatsAppNumber(contact);
  const whatsappUrl = buildWhatsAppUrl({ contact, task, businessLineLabel });
  const disabled = !whatsappUrl;

  const handleClick = async () => {
    if (!contact || !whatsappUrl || !whatsappNumber) {
      return;
    }

    try {
      await dataProvider.create<CustomerEvent>("customer_events", {
        data: {
          business_line_id: contact.company_id ?? null,
          contact_id: contact.id,
          occurred_at: new Date().toISOString(),
          payload: {
            message: decodeURIComponent(whatsappUrl.split("text=")[1] ?? ""),
            phone_number: whatsappNumber,
            task_text: task.text,
          },
          related_id: task.id,
          related_table: "tasks",
          sales_id: (identity?.id as Identifier | undefined) ?? null,
          source: "whatsapp_link",
          type: "whatsapp.opened",
        },
      });

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
      {translate("crm.today.sections.tasks.open_whatsapp")}
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
