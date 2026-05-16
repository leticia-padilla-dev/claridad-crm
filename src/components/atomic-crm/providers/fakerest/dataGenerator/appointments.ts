import { datatype, lorem, random } from "faker/locale/en_US";

import type { Appointment } from "../../../types";
import type { Db } from "./types";
import { randomDate } from "./utils";
import {
  appointmentStatuses,
  appointmentTypes,
} from "../../../appointments/appointmentModel";

export const generateAppointments = (db: Db, size = 180) => {
  return Array.from(Array(size).keys()).map<Appointment>((id) => {
    const contact = random.arrayElement(db.contacts);
    const startDate = new Date(contact.first_seen);
    const endDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
    const scheduledAt = randomDate(startDate, endDate).toISOString();
    const status = datatype.boolean()
      ? random.arrayElement(appointmentStatuses.slice(0, 2)).value
      : random.arrayElement(appointmentStatuses).value;

    return {
      id,
      contact_id: contact.id,
      type: random.arrayElement(appointmentTypes).value,
      status,
      scheduled_at: scheduledAt,
      notes: datatype.boolean() ? lorem.sentence() : null,
      created_at: scheduledAt,
      updated_at: scheduledAt,
    };
  });
};
