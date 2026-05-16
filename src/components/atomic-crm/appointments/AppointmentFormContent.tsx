import { required } from "ra-core";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

import { contactOptionText } from "../misc/ContactOption";
import {
  appointmentStatuses,
  appointmentTypes,
  translateAppointmentStatusLabel,
  translateAppointmentTypeLabel,
} from "./appointmentModel";
import { useTranslate } from "ra-core";

export const AppointmentFormContent = ({
  selectContact,
}: {
  selectContact?: boolean;
}) => {
  const translate = useTranslate();
  const typeChoices = appointmentTypes.map((choice) => ({
    id: choice.value,
    name: translateAppointmentTypeLabel(choice, translate),
  }));
  const statusChoices = appointmentStatuses.map((choice) => ({
    id: choice.value,
    name: translateAppointmentStatusLabel(choice, translate),
  }));

  return (
    <div className="flex flex-col gap-4">
      {selectContact && (
        <ReferenceInput source="contact_id" reference="contacts_summary">
          <AutocompleteInput
            label="resources.appointments.fields.contact_id"
            optionText={contactOptionText}
            helperText={false}
            validate={required()}
            modal
          />
        </ReferenceInput>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          source="type"
          validate={required()}
          choices={typeChoices}
          helperText={false}
        />
        <SelectInput
          source="status"
          validate={required()}
          choices={statusChoices}
          helperText={false}
        />
      </div>

      <DateTimeInput
        source="scheduled_at"
        helperText={false}
        validate={required()}
      />

      <TextInput source="notes" multiline helperText={false} />
    </div>
  );
};
