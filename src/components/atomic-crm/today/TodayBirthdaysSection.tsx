import { ArrowRight, Cake, CircleCheckBig, Gift } from "lucide-react";
import { useMemo } from "react";
import { useGetIdentity, useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";
import type { Contact, ContactBusinessLineValue } from "../types";
import { OpenWhatsAppButton } from "../whatsapp/OpenWhatsAppButton";

const MAX_VISIBLE_BIRTHDAYS = 5;

const businessLineChoices = contactBusinessLines.reduce<
  Record<ContactBusinessLineValue, string>
>(
  (acc, choice) => {
    acc[choice.value] = choice.label;
    return acc;
  },
  {} as Record<ContactBusinessLineValue, string>,
);

const isBirthdayToday = (birthday?: string | null) => {
  if (!birthday) {
    return false;
  }

  const today = new Date();
  const parsed = new Date(birthday);

  return (
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate()
  );
};

const getPrimaryBusinessLine = (contact: Contact) =>
  contact.business_lines_interest?.[0] ?? null;

const BirthdaysEmptyState = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
      <CircleCheckBig className="size-8 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-3 text-sm font-medium text-foreground">
        {translate("crm.today.sections.birthdays.empty_title")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {translate("crm.today.sections.birthdays.empty_description")}
      </p>
    </div>
  );
};

const BirthdaysPendingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={`today-birthday-skeleton-${index}`}
        className="rounded-xl border bg-background px-4 py-4"
      >
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    ))}
  </div>
);

const BirthdayCard = ({ contact }: { contact: Contact }) => {
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
  const contactName = `${contact.first_name} ${contact.last_name}`.trim();

  return (
    <div className="rounded-xl border border-border/80 bg-background px-4 py-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/contacts/${contact.id}/show`}
              className="truncate text-sm font-semibold text-foreground hover:underline"
            >
              {contactName}
            </Link>
            {businessLineLabel ? (
              <Badge variant="secondary" className="font-normal">
                {businessLineLabel}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {translate("crm.today.sections.birthdays.today_label")}
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <Gift className="size-4" />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <OpenWhatsAppButton
          contact={contact}
          businessLineLabel={businessLineLabel}
          label={translate("crm.today.sections.birthdays.send_greeting")}
          mode="birthday"
        />
      </div>
    </div>
  );
};

export const TodayBirthdaysSection = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();

  const { data: contacts = [], isPending } = useGetList<Contact>(
    "contacts",
    {
      pagination: { page: 1, perPage: 250 },
      sort: { field: "first_name", order: "ASC" },
      filter: {
        sales_id: identity?.id,
        "birthday@not.is": null,
      },
    },
    { enabled: !!identity },
  );

  const birthdayContacts = useMemo(
    () => contacts.filter((contact) => isBirthdayToday(contact.birthday)),
    [contacts],
  );

  const visibleContacts = birthdayContacts.slice(0, MAX_VISIBLE_BIRTHDAYS);

  return (
    <Card className="h-full gap-4 border-amber-200/70">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {translate("crm.today.sections.birthdays.title", {
                smart_count: birthdayContacts.length,
              })}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {translate("crm.today.sections.birthdays.description")}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Cake className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending ? (
          <BirthdaysPendingState />
        ) : visibleContacts.length === 0 ? (
          <BirthdaysEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {visibleContacts.map((contact) => (
                <BirthdayCard key={contact.id} contact={contact} />
              ))}
            </div>
            {birthdayContacts.length > MAX_VISIBLE_BIRTHDAYS ? (
              <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/contacts">
                    {translate("crm.today.sections.birthdays.view_all", {
                      smart_count: birthdayContacts.length,
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
