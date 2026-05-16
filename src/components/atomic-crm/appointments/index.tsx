import type { Appointment } from "../types";
import { AppointmentCreate } from "./AppointmentCreate";
import { AppointmentEdit } from "./AppointmentEdit";
import { AppointmentList } from "./AppointmentList";

export default {
  list: AppointmentList,
  create: AppointmentCreate,
  edit: AppointmentEdit,
  recordRepresentation: (record: Appointment) =>
    `${record.type} ${record.scheduled_at}`,
};
