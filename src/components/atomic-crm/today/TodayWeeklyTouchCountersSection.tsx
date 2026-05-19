import { useMemo } from "react";
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { ArrowRight, HandHeart, Sparkles } from "lucide-react";
import {
  useGetIdentity,
  useGetList,
  useTranslate,
  type Identifier,
} from "ra-core";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact, CustomerEvent, Deal } from "../types";

const CONTACT_STALE_DAYS = 30;
const OPPORTUNITY_STALE_DAYS = 7;
const UPCOMING_BIRTHDAY_DAYS = 7;

const getNextBirthdayDate = (birthday?: string | null) => {
  if (!birthday) {
    return null;
  }

  const parsed = new Date(birthday);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const today = startOfDay(new Date());
  const nextBirthday = new Date(
    today.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
  );

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  return nextBirthday;
};

const WeeklyTouchPendingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`weekly-touch-skeleton-${index}`}
        className="rounded-xl border bg-background px-4 py-4"
      >
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-8 w-12" />
        <Skeleton className="mt-4 h-9 w-24" />
      </div>
    ))}
  </div>
);

type CounterRowProps = {
  title: string;
  count: number;
  hint: string;
  linkTo: string;
  ctaLabel: string;
  countTestId: string;
};

const CounterRow = ({
  title,
  count,
  hint,
  linkTo,
  ctaLabel,
  countTestId,
}: CounterRowProps) => (
  <div className="rounded-xl border border-border/80 bg-background px-4 py-4 shadow-xs">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div
        data-testid={countTestId}
        className="shrink-0 text-3xl font-semibold tracking-tight text-foreground"
      >
        {count}
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <Button asChild variant="ghost" size="sm">
        <Link to={linkTo}>
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  </div>
);

export const TodayWeeklyTouchCountersSection = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();

  const { data: contacts = [], isPending: contactsPending } =
    useGetList<Contact>(
      "contacts",
      {
        pagination: { page: 1, perPage: 500 },
        sort: { field: "last_seen", order: "DESC" },
        filter: { sales_id: identity?.id },
      },
      { enabled: !!identity },
    );

  const { data: customerEvents = [], isPending: eventsPending } =
    useGetList<CustomerEvent>(
      "customer_events",
      {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "occurred_at", order: "DESC" },
        filter: { sales_id: identity?.id },
      },
      { enabled: !!identity },
    );

  const { data: deals = [], isPending: dealsPending } = useGetList<Deal>(
    "deals",
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: "updated_at", order: "DESC" },
      filter: {
        sales_id: identity?.id,
        "archived_at@is": null,
      },
    },
    { enabled: !!identity },
  );

  const isPending = contactsPending || eventsPending || dealsPending;

  const latestEventByContact = useMemo(() => {
    const map = new Map<Identifier, string>();

    customerEvents.forEach((event) => {
      if (!map.has(event.contact_id)) {
        map.set(event.contact_id, event.occurred_at);
      }
    });

    return map;
  }, [customerEvents]);

  const noContactCount = useMemo(() => {
    const today = startOfDay(new Date());

    return contacts.filter((contact) => {
      const latestEvent = latestEventByContact.get(contact.id);
      const referenceDate = latestEvent ?? contact.last_seen;

      if (!referenceDate) {
        return false;
      }

      return (
        differenceInCalendarDays(today, startOfDay(new Date(referenceDate))) >
        CONTACT_STALE_DAYS
      );
    }).length;
  }, [contacts, latestEventByContact]);

  const staleOpportunitiesCount = useMemo(() => {
    const today = startOfDay(new Date());

    return deals.filter((deal) => {
      if (deal.archived_at) {
        return false;
      }

      return (
        differenceInCalendarDays(today, startOfDay(new Date(deal.updated_at))) >
        OPPORTUNITY_STALE_DAYS
      );
    }).length;
  }, [deals]);

  const upcomingBirthdaysCount = useMemo(() => {
    const today = startOfDay(new Date());
    const upcomingLimit = addDays(today, UPCOMING_BIRTHDAY_DAYS);

    return contacts.filter((contact) => {
      const nextBirthday = getNextBirthdayDate(contact.birthday);

      if (!nextBirthday) {
        return false;
      }

      const distance = differenceInCalendarDays(nextBirthday, today);

      return distance >= 1 && nextBirthday <= upcomingLimit;
    }).length;
  }, [contacts]);

  return (
    <Card className="h-full gap-4 border-violet-200/70">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {translate("crm.today.sections.touch_this_week.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {translate("crm.today.sections.touch_this_week.description")}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <HandHeart className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPending ? (
          <WeeklyTouchPendingState />
        ) : (
          <>
            <CounterRow
              title={translate(
                "crm.today.sections.touch_this_week.rows.no_contact.title",
              )}
              count={noContactCount}
              hint={translate(
                "crm.today.sections.touch_this_week.rows.no_contact.hint",
                {
                  smart_count: CONTACT_STALE_DAYS,
                },
              )}
              linkTo="/contacts"
              ctaLabel={translate(
                "crm.today.sections.touch_this_week.rows.no_contact.cta",
              )}
              countTestId="weekly-touch-no-contact-count"
            />
            <CounterRow
              title={translate(
                "crm.today.sections.touch_this_week.rows.opportunities.title",
              )}
              count={staleOpportunitiesCount}
              hint={translate(
                "crm.today.sections.touch_this_week.rows.opportunities.hint",
                {
                  smart_count: OPPORTUNITY_STALE_DAYS,
                },
              )}
              linkTo="/deals"
              ctaLabel={translate(
                "crm.today.sections.touch_this_week.rows.opportunities.cta",
              )}
              countTestId="weekly-touch-opportunities-count"
            />
            <CounterRow
              title={translate(
                "crm.today.sections.touch_this_week.rows.birthdays.title",
              )}
              count={upcomingBirthdaysCount}
              hint={translate(
                "crm.today.sections.touch_this_week.rows.birthdays.hint",
                {
                  smart_count: UPCOMING_BIRTHDAY_DAYS,
                },
              )}
              linkTo="/contacts"
              ctaLabel={translate(
                "crm.today.sections.touch_this_week.rows.birthdays.cta",
              )}
              countTestId="weekly-touch-birthdays-count"
            />
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-violet-200 bg-violet-50/60 px-3 py-3 text-sm text-muted-foreground dark:border-violet-900 dark:bg-violet-950/20">
              <Sparkles className="size-4 shrink-0 text-violet-600 dark:text-violet-300" />
              <span>
                {translate("crm.today.sections.touch_this_week.footer")}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
