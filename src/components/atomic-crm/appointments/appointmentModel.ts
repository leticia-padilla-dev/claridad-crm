import type { Appointment } from "../types";

export const appointmentTypes = [
  { value: "consultation", label: "consultation" },
  { value: "delivery", label: "delivery" },
  { value: "demonstration", label: "demonstration" },
  { value: "follow_up", label: "follow_up" },
  { value: "video_call", label: "video_call" },
] as const;

export const appointmentStatuses = [
  { value: "pending", label: "pending" },
  { value: "confirmed", label: "confirmed" },
  { value: "completed", label: "completed" },
  { value: "cancelled", label: "cancelled" },
] as const;

export const defaultAppointmentType = appointmentTypes[0].value;
export const defaultAppointmentStatus = appointmentStatuses[0].value;

export const translateAppointmentTypeLabel = (
  choice: { label: string },
  translate: (key: string, options?: Record<string, unknown>) => string,
) =>
  translate(`resources.appointments.inputs.types.${choice.label}`, {
    _: choice.label,
  });

export const translateAppointmentStatusLabel = (
  choice: { label: string },
  translate: (key: string, options?: Record<string, unknown>) => string,
) =>
  translate(`resources.appointments.inputs.statuses.${choice.label}`, {
    _: choice.label,
  });

export const appointmentRowClassName = (appointment: Appointment) => {
  if (appointment.status === "cancelled") return "opacity-60";
  if (appointment.status === "completed") return "text-muted-foreground";
  return undefined;
};
