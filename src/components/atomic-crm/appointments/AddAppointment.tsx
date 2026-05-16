import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { useRecordContext, useTranslate } from "ra-core";
import type { Contact } from "../types";

import { AppointmentCreateSheet } from "./AppointmentCreateSheet";

export const AddAppointment = ({
  selectContact,
  display = "chip",
}: {
  selectContact?: boolean;
  display?: "chip" | "icon";
}) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const contact = useRecordContext<Contact>();

  return (
    <>
      <AppointmentCreateSheet
        open={open}
        onOpenChange={setOpen}
        contact_id={selectContact ? undefined : contact?.id}
      />
      <Button
        variant={display === "icon" ? "ghost" : "outline"}
        size={display === "icon" ? "sm" : "sm"}
        className={
          display === "icon" ? "p-2 cursor-pointer" : "h-6 cursor-pointer"
        }
        onClick={() => setOpen(true)}
      >
        <CalendarPlus className="w-4 h-4" />
        {display === "icon"
          ? null
          : translate("resources.appointments.action.add")}
      </Button>
    </>
  );
};
