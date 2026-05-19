import { ErrorBoundary } from "react-error-boundary";
import {
  CalendarDays,
  ChevronRight,
  HandHeart,
  Sparkles,
  Cake,
} from "lucide-react";
import { useGetIdentity, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from "../layout/MobileHeader";
import { MobileContent } from "../layout/MobileContent";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { useCoreMetric } from "../metrics/useCoreMetric";
import { TodayOverdueTasksSection } from "./TodayOverdueTasksSection";

type SectionConfig = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  skeletonRows?: number;
};

const getGreetingKey = (hour: number) => {
  if (hour < 12) return "crm.today.greetings.morning";
  if (hour < 19) return "crm.today.greetings.afternoon";
  return "crm.today.greetings.evening";
};

const getFirstName = (fullName?: string) => {
  if (!fullName) return undefined;
  return fullName.split(" ").find(Boolean);
};

const SectionErrorFallback = ({ title }: { title: string }) => {
  const translate = useTranslate();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {translate("crm.today.section_error")}
        </p>
        <Link
          to="/today"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          {translate("crm.common.retry")}
          <ChevronRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

const TodaySectionCard = ({
  title,
  description,
  icon: Icon,
  skeletonRows = 4,
}: SectionConfig) => {
  const translate = useTranslate();

  return (
    <Card className="h-full gap-4">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
          <span>{translate("crm.today.shell_state")}</span>
          <span>{translate("crm.today.shell_state_value")}</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <div
              key={`${title}-row-${index}`}
              className="rounded-lg border bg-background px-3 py-3"
            >
              <Skeleton
                className={`h-4 ${
                  index % 3 === 0
                    ? "w-2/3"
                    : index % 3 === 1
                      ? "w-5/6"
                      : "w-3/4"
                }`}
              />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TodayHeader = () => {
  const translate = useTranslate();
  const { data } = useGetIdentity();
  const identity = data as { fullName?: string } | undefined;
  const metric = useCoreMetric();
  const greeting = translate(getGreetingKey(new Date().getHours()));
  const firstName = getFirstName(identity?.fullName);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
        <Sparkles className="size-3.5" />
        {translate("crm.today.kicker")}
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {firstName
            ? translate("crm.today.greeting_with_name", {
                greeting,
                name: firstName,
              })
            : greeting}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {formattedDate}
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {translate("crm.today.description")}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-background/80 px-4 py-3 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {translate("crm.today.core_metric.title")}
          </div>
          <div className="mt-1 text-2xl font-semibold text-foreground">
            {translate("crm.today.core_metric.days_before_whatsapp_value", {
              smart_count: metric.daysBeforeWhatsapp,
            })}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {translate("crm.today.core_metric.days_before_whatsapp_hint")}
          </div>
        </div>
        <div className="rounded-xl border bg-background/80 px-4 py-3 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {translate("crm.today.core_metric.active_days_title")}
          </div>
          <div className="mt-1 text-2xl font-semibold text-foreground">
            {translate("crm.today.core_metric.active_days_value", {
              smart_count: metric.activeDaysThisWeek,
            })}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {translate("crm.today.core_metric.active_days_hint")}
          </div>
        </div>
        <div className="rounded-xl border bg-background/80 px-4 py-3 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {translate("crm.today.core_metric.whatsapp_touches_title")}
          </div>
          <div className="mt-1 text-2xl font-semibold text-foreground">
            {translate("crm.today.core_metric.whatsapp_touches_value", {
              smart_count: metric.whatsappTouchesThisWeek,
            })}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {translate("crm.today.core_metric.whatsapp_touches_hint")}
          </div>
        </div>
      </div>
    </div>
  );
};

const TodayPageContent = () => {
  const translate = useTranslate();

  const sections: SectionConfig[] = [
    {
      id: "birthdays",
      title: translate("crm.today.sections.birthdays.title"),
      description: translate("crm.today.sections.birthdays.description"),
      icon: Cake,
      skeletonRows: 3,
    },
    {
      id: "appointments",
      title: translate("resources.appointments.name", { smart_count: 2 }),
      description: translate("crm.today.sections.appointments.description"),
      icon: CalendarDays,
      skeletonRows: 3,
    },
    {
      id: "touch_this_week",
      title: translate("crm.today.sections.touch_this_week.title"),
      description: translate("crm.today.sections.touch_this_week.description"),
      icon: HandHeart,
      skeletonRows: 4,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <TodayHeader />
      <section
        aria-label={translate("crm.today.sections_overview")}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <ErrorBoundary
          fallbackRender={() => (
            <SectionErrorFallback
              title={translate("crm.today.sections.tasks.title", {
                smart_count: 0,
              })}
            />
          )}
        >
          <TodayOverdueTasksSection />
        </ErrorBoundary>
        {sections.map((section) => (
          <ErrorBoundary
            key={section.id}
            fallbackRender={() => (
              <SectionErrorFallback title={section.title} />
            )}
          >
            <TodaySectionCard {...section} />
          </ErrorBoundary>
        ))}
      </section>
    </div>
  );
};

export const TodayPage = () => {
  const isMobile = useIsMobile();
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const translate = useTranslate();

  if (isMobile) {
    return (
      <>
        <MobileHeader>
          <Link
            to="/today"
            className="flex items-center gap-2 text-secondary-foreground no-underline"
            aria-label={translate("crm.today.title")}
          >
            <img
              className="[.light_&]:hidden h-6"
              src={darkModeLogo}
              alt={title}
            />
            <img
              className="[.dark_&]:hidden h-6"
              src={lightModeLogo}
              alt={title}
            />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-secondary-foreground/70">
                {translate("crm.today.title")}
              </div>
              <div className="truncate text-sm font-semibold">{title}</div>
            </div>
          </Link>
        </MobileHeader>
        <MobileContent>
          <TodayPageContent />
        </MobileContent>
      </>
    );
  }

  return <TodayPageContent />;
};

TodayPage.path = "/today";
