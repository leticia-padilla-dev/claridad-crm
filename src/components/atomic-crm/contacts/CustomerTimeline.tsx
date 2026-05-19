import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useTranslate, type Identifier } from "ra-core";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CustomerEvent, CustomerEventType } from "../types";
import { useCustomerEvents } from "./useCustomerEvents";

const formatOccurredAt = (value: string) => {
  try {
    return format(new Date(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
};

const getEventIcon = (type: CustomerEventType) => {
  switch (type) {
    case "note.created":
      return FileText;
    case "task.completed":
      return CheckCircle2;
    case "task.created":
      return CircleDot;
    case "opportunity.created":
      return TrendingUp;
    case "opportunity.stage_changed":
      return Sparkles;
    default:
      return Circle;
  }
};

const TimelineSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`customer-timeline-skeleton-${index}`}
        className="flex gap-3 rounded-xl border bg-background px-4 py-4"
      >
        <Skeleton className="mt-1 size-8 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

const TimelineEmptyState = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
      <CircleDashed className="size-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">
        {translate("resources.contacts.timeline.empty")}
      </p>
    </div>
  );
};

const renderEventBody = (
  event: CustomerEvent,
  translate: ReturnType<typeof useTranslate>,
) => {
  const payload = (event.payload ?? {}) as Record<string, unknown>;

  switch (event.type) {
    case "note.created":
      return {
        title: translate("resources.contacts.timeline.events.note_created"),
        description:
          typeof payload.preview === "string" && payload.preview.length > 0
            ? payload.preview
            : translate(
                "resources.contacts.timeline.events.note_without_preview",
              ),
      };
    case "task.created":
      return {
        title: translate("resources.contacts.timeline.events.task_created"),
        description:
          typeof payload.title === "string"
            ? payload.title
            : translate("resources.contacts.timeline.events.no_context"),
      };
    case "task.completed":
      return {
        title: translate("resources.contacts.timeline.events.task_completed"),
        description:
          typeof payload.title === "string"
            ? payload.title
            : translate("resources.contacts.timeline.events.no_context"),
      };
    case "opportunity.created":
      return {
        title: translate(
          "resources.contacts.timeline.events.opportunity_created",
        ),
        description:
          typeof payload.name === "string"
            ? `${payload.name}${
                typeof payload.stage === "string"
                  ? ` · ${translate(
                      "resources.contacts.timeline.events.stage_label",
                      {
                        stage: payload.stage,
                      },
                    )}`
                  : ""
              }`
            : translate("resources.contacts.timeline.events.no_context"),
      };
    case "opportunity.stage_changed":
      return {
        title: translate(
          "resources.contacts.timeline.events.opportunity_stage_changed",
        ),
        description:
          typeof payload.name === "string"
            ? translate(
                "resources.contacts.timeline.events.stage_changed_detail",
                {
                  from: payload.from_stage ?? "—",
                  name: payload.name,
                  to: payload.to_stage ?? "—",
                },
              )
            : translate("resources.contacts.timeline.events.no_context"),
      };
    default:
      return {
        title: event.type,
        description: translate("resources.contacts.timeline.events.no_context"),
      };
  }
};

const TimelineEventCard = ({ event }: { event: CustomerEvent }) => {
  const translate = useTranslate();
  const Icon = getEventIcon(event.type);
  const { title, description } = renderEventBody(event, translate);

  return (
    <div className="flex gap-3 rounded-xl border bg-background px-4 py-4 shadow-xs">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <Badge variant="outline" className="font-normal">
            {formatOccurredAt(event.occurred_at)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const CustomerTimeline = ({
  contactId,
  limit = 50,
}: {
  contactId: Identifier;
  limit?: number;
}) => {
  const { data = [], isPending } = useCustomerEvents(contactId, { limit });

  if (isPending) {
    return <TimelineSkeleton />;
  }

  if (data.length === 0) {
    return <TimelineEmptyState />;
  }

  return (
    <div className="space-y-3">
      {data.map((event) => (
        <TimelineEventCard
          key={`${event.id}-${event.occurred_at}`}
          event={event}
        />
      ))}
    </div>
  );
};
