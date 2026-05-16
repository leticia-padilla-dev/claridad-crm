import { useState } from "react";
import { useRecordContext, useTranslate } from "ra-core";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ReferenceManyField } from "@/components/admin/reference-many-field";

import { AppointmentCreateSheet } from "../appointments/AppointmentCreateSheet";
import { AppointmentsIterator } from "../appointments/AppointmentsIterator";
import type { Contact } from "../types";

export const ContactAppointmentsList = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();
  const [appointmentCreateOpen, setAppointmentCreateOpen] = useState(false);

  if (!record) return null;

  return (
    <>
      <AppointmentCreateSheet
        open={appointmentCreateOpen}
        onOpenChange={setAppointmentCreateOpen}
        contact_id={record.id}
      />
      <ReferenceManyField
        target="contact_id"
        reference="appointments"
        sort={{ field: "scheduled_at", order: "ASC" }}
        perPage={1000}
        empty={
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {translate("resources.appointments.empty")}
            </p>
            <Button
              variant="outline"
              onClick={() => setAppointmentCreateOpen(true)}
            >
              {translate("resources.appointments.action.add")}
            </Button>
          </div>
        }
        loading={
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="w-full h-18" key={index} />
            ))}
          </div>
        }
      >
        <AppointmentsIterator />
      </ReferenceManyField>
    </>
  );
};
