import type { Identifier } from "ra-core";
import {
  useGetOne,
  useGetRecordRepresentation,
  useNotify,
  useTranslate,
} from "ra-core";

import { CreateSheet } from "../misc/CreateSheet";
import { AppointmentFormContent } from "./AppointmentFormContent";
import {
  defaultAppointmentStatus,
  defaultAppointmentType,
} from "./appointmentModel";

export interface AppointmentCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact_id?: Identifier;
}

export const AppointmentCreateSheet = ({
  open,
  onOpenChange,
  contact_id,
}: AppointmentCreateSheetProps) => {
  const translate = useTranslate();
  const notify = useNotify();
  const getContactRepresentation = useGetRecordRepresentation("contacts");
  const selectContact = contact_id == null;
  const { data: contact } = useGetOne(
    "contacts",
    { id: contact_id! },
    { enabled: !selectContact },
  );

  return (
    <CreateSheet
      resource="appointments"
      title={
        <span className="text-xl font-semibold truncate pr-10">
          {!selectContact
            ? translate("resources.appointments.dialog.create_for", {
                name: getContactRepresentation(contact!),
              })
            : translate("resources.appointments.dialog.create")}
        </span>
      }
      redirect={false}
      record={{
        contact_id,
        type: defaultAppointmentType,
        status: defaultAppointmentStatus,
        scheduled_at: new Date().toISOString(),
      }}
      mutationOptions={{
        onSuccess: () => {
          notify("resources.appointments.added");
          onOpenChange(false);
        },
      }}
      open={open}
      onOpenChange={onOpenChange}
    >
      <AppointmentFormContent selectContact={selectContact} />
    </CreateSheet>
  );
};
