import {
  CreateButton,
  DateField,
  List,
  ReferenceField,
} from "@/components/admin";
import { DataTable } from "@/components/admin/data-table";
import { TopToolbar } from "../layout/TopToolbar";
import { useTranslate } from "ra-core";
import { Badge } from "@/components/ui/badge";

import type { Appointment, Contact } from "../types";
import {
  appointmentRowClassName,
  appointmentStatuses,
  appointmentTypes,
  translateAppointmentStatusLabel,
  translateAppointmentTypeLabel,
} from "./appointmentModel";

const AppointmentListActions = () => (
  <TopToolbar>
    <CreateButton label="resources.appointments.action.new" />
  </TopToolbar>
);

export const AppointmentList = () => {
  const translate = useTranslate();

  return (
    <List
      actions={<AppointmentListActions />}
      sort={{ field: "scheduled_at", order: "ASC" }}
    >
      <DataTable rowClick="edit" rowClassName={appointmentRowClassName}>
        <DataTable.Col
          source="scheduled_at"
          label="resources.appointments.fields.scheduled_at"
        >
          <DateField source="scheduled_at" showDate showTime />
        </DataTable.Col>
        <DataTable.Col
          label="resources.appointments.fields.type"
          render={(record: Appointment) => {
            const match = appointmentTypes.find(
              (choice) => choice.value === record.type,
            );
            return match
              ? translateAppointmentTypeLabel(match, translate)
              : record.type;
          }}
        />
        <DataTable.Col
          label="resources.appointments.fields.status"
          render={(record: Appointment) => {
            const match = appointmentStatuses.find(
              (choice) => choice.value === record.status,
            );
            const label = match
              ? translateAppointmentStatusLabel(match, translate)
              : record.status;
            return <Badge variant="outline">{label}</Badge>;
          }}
        />
        <DataTable.Col label="resources.appointments.fields.contact_id">
          <ReferenceField<Appointment, Contact>
            source="contact_id"
            reference="contacts"
            link="show"
            render={({ referenceRecord }) =>
              referenceRecord
                ? `${referenceRecord.first_name} ${referenceRecord.last_name}`
                : null
            }
          />
        </DataTable.Col>
        <DataTable.Col source="notes" />
      </DataTable>
    </List>
  );
};
