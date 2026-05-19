import { useMemo } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { ArrowRight, CalendarDays, CircleCheckBig, Clock3 } from "lucide-react";
import {
  useGetIdentity,
  useGetList,
  useGetMany,
  useTranslate,
  type Identifier,
} from "ra-core";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";
import type { Appointment, Contact, ContactBusinessLineValue } from "../types";

const MAX_VISIBLE_APPOINTMENTS = 5;
const ACTIVE_STATUSES = new Set(["pending", "confirmed"]);

const businessLineChoices = contactBusinessLines.reduce<
  Record<ContactBusinessLineValue, string>
>(
  (acc, choice) => {
    acc[choice.value] = choice.label;
    return acc;
  },
  {} as Record<ContactBusinessLineValue, string>,
);

const appointmentTypes = {
  consultation: "crm.today.sections.appointments.types.consultation",
  delivery: "crm.today.sections.appointments.types.delivery",
  demonstration: "crm.today.sections.appointments.types.demonstration",
  follow_up: "crm.today.sections.appointments.types.follow_up",
  video_call: "crm.today.sections.appointments.types.video_call",
} as const;

const appointmentStatuses = {
  pending: "crm.today.sections.appointments.statuses.pending",
  confirmed: "crm.today.sections.appointments.statuses.confirmed",
  completed: "crm.today.sections.appointments.statuses.completed",
  cancelled: "crm.today.sections.appointments.statuses.cancelled",
} as const;

const getPrimaryBusinessLine = (contact?: Contact | null) =>
  contact?.business_lines_interest?.[0] ?? null;

const formatAppointmentTime = (scheduledAt: string) =>
  format(new Date(scheduledAt), "HH:mm");

const isForToday = (scheduledAt: string) =>
  isSameDay(new Date(scheduledAt), startOfDay(new Date()));

const AppointmentsEmptyState = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-8 text-center dark:border-sky-900 dark:bg-sky-950/30">
      <CircleCheckBig className="size-8 text-sky-600 dark:text-sky-400" />
      <p className="mt-3 text-sm font-medium text-foreground">
        {translate("crm.today.sections.appointments.empty_title")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {translate("crm.today.sections.appointments.empty_description")}
      </p>
    </div>
  );
};

const AppointmentsPendingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={`today-appointment-skeleton-${index}`}
        className="rounded-xl border bg-background px-4 py-4"
      >
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const AppointmentCard = ({
  appointment,
  contact,
}: {
  appointment: Appointment;
  contact?: Contact | null;
}) => {
  const translate = useTranslate();
  const primaryBusinessLine = getPrimaryBusinessLine(contact);
  const businessLineLabel = primaryBusinessLine
    ? translateContactBusinessLineLabel(
        {
          value: primaryBusinessLine,
          label: businessLineChoices[primaryBusinessLine],
        },
        translate,
      )
    : null;
  const contactName = contact
    ? `${contact.first_name} ${contact.last_name}`.trim()
    : translate("resources.contacts.forcedCaseName", { _: "Clienta" });
  const typeLabel = translate(
    appointmentTypes[appointment.type as keyof typeof appointmentTypes] ??
      appointment.type,
    {
      _: appointment.type,
    },
  );
  const statusLabel = translate(
    appointmentStatuses[
      appointment.status as keyof typeof appointmentStatuses
    ] ?? appointment.status,
    {
      _: appointment.status,
    },
  );

  return (
    <div className="rounded-xl border border-border/80 bg-background px-4 py-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
            <Clock3 className="size-4 shrink-0" />
            <span className="text-sm font-semibold">
              {formatAppointmentTime(appointment.scheduled_at)}
            </span>
          </div>
          <p className="truncate text-sm font-semibold text-foreground">
            {contactName}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{typeLabel}</span>
            {businessLineLabel ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{businessLineLabel}</span>
              </>
            ) : null}
          </div>
        </div>
        <Badge variant="outline" className="shrink-0">
          {statusLabel}
        </Badge>
      </div>

      {appointment.notes ? (
        <p className="mt-3 line-clamp-2 text-sm text-foreground">
          {appointment.notes}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Button asChild size="sm" variant="outline" className="min-w-24">
          <Link to={`/contacts/${appointment.contact_id}/show`}>
            {translate("crm.today.sections.appointments.open_contact")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const TodayAppointmentsSection = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  const dayStart = startOfDay(new Date());
  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);

  const { data: appointments = [], isPending } = useGetList<Appointment>(
    "appointments",
    {
      pagination: { page: 1, perPage: MAX_VISIBLE_APPOINTMENTS + 1 },
      sort: { field: "scheduled_at", order: "ASC" },
      filter: {
        sales_id: identity?.id,
        "scheduled_at@gte": dayStart.toISOString(),
        "scheduled_at@lt": nextDay.toISOString(),
      },
    },
    { enabled: !!identity },
  );

  const todaysAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          isForToday(appointment.scheduled_at) &&
          ACTIVE_STATUSES.has(appointment.status),
      ),
    [appointments],
  );

  const visibleAppointments = todaysAppointments.slice(
    0,
    MAX_VISIBLE_APPOINTMENTS,
  );
  const contactIds = useMemo(
    () =>
      Array.from(
        new Set(
          visibleAppointments
            .map((appointment) => appointment.contact_id)
            .filter((contactId) => contactId != null),
        ),
      ) as Identifier[],
    [visibleAppointments],
  );

  const { data: contacts = [] } = useGetMany<Contact>(
    "contacts",
    { ids: contactIds },
    { enabled: contactIds.length > 0 },
  );

  const contactsById = useMemo(
    () =>
      new Map<Identifier, Contact>(
        contacts.map((contact) => [contact.id, contact]),
      ),
    [contacts],
  );

  return (
    <Card className="h-full gap-4 border-sky-200/70">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {translate("crm.today.sections.appointments.title", {
                smart_count: todaysAppointments.length,
              })}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {translate("crm.today.sections.appointments.description")}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
            <CalendarDays className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending ? (
          <AppointmentsPendingState />
        ) : visibleAppointments.length === 0 ? (
          <AppointmentsEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {visibleAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  contact={contactsById.get(appointment.contact_id)}
                />
              ))}
            </div>
            {todaysAppointments.length > MAX_VISIBLE_APPOINTMENTS ? (
              <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/appointments">
                    {translate("crm.today.sections.appointments.view_all", {
                      smart_count: todaysAppointments.length,
                    })}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};
