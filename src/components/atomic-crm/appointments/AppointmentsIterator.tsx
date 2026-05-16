import { useListContext, useTranslate } from "ra-core";
import { DateField, ReferenceField } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

import type { Appointment, Contact } from "../types";
import {
  appointmentStatuses,
  appointmentTypes,
  translateAppointmentStatusLabel,
  translateAppointmentTypeLabel,
} from "./appointmentModel";

export const AppointmentsIterator = ({
  showContact,
  className,
}: {
  showContact?: boolean;
  className?: string;
}) => {
  const { data, error, isPending } = useListContext<Appointment>();
  const translate = useTranslate();

  if (isPending || error || data.length === 0) return null;

  return (
    <div className={`space-y-4 md:space-y-2 ${className || ""}`}>
      {data.map((appointment) => {
        const type = appointmentTypes.find(
          (choice) => choice.value === appointment.type,
        );
        const status = appointmentStatuses.find(
          (choice) => choice.value === appointment.status,
        );

        return (
          <Link
            key={appointment.id}
            to={`/appointments/${appointment.id}`}
            className="block rounded-md border p-3 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium text-sm">
                {type
                  ? translateAppointmentTypeLabel(type, translate)
                  : appointment.type}
              </div>
              <Badge variant="outline">
                {status
                  ? translateAppointmentStatusLabel(status, translate)
                  : appointment.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              <DateField
                source="scheduled_at"
                record={appointment}
                showDate
                showTime
              />
              {showContact && (
                <ReferenceField<Appointment, Contact>
                  source="contact_id"
                  reference="contacts"
                  record={appointment}
                  link="show"
                  className="inline text-sm text-muted-foreground"
                  render={({ referenceRecord }) => {
                    if (!referenceRecord) return null;
                    return (
                      <>
                        {" "}
                        {translate("resources.appointments.regarding_contact", {
                          name: `${referenceRecord.first_name} ${referenceRecord.last_name}`,
                        })}
                      </>
                    );
                  }}
                />
              )}
            </div>
            {appointment.notes ? (
              <p className="text-sm mt-2 line-clamp-2">{appointment.notes}</p>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
};
