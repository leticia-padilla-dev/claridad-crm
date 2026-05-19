import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays, startOfToday } from "date-fns";
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheckBig,
  ListTodo,
} from "lucide-react";
import {
  useGetIdentity,
  useGetList,
  useGetMany,
  useNotify,
  useTranslate,
  useUpdate,
  type Identifier,
} from "ra-core";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Contact, ContactBusinessLineValue, Task } from "../types";
import {
  contactBusinessLines,
  translateContactBusinessLineLabel,
} from "../contacts/contactModel";
import { OpenWhatsAppButton } from "../whatsapp/OpenWhatsAppButton";

const MAX_VISIBLE_TASKS = 5;

const businessLineChoices = contactBusinessLines.reduce<
  Record<ContactBusinessLineValue, string>
>(
  (acc, choice) => {
    acc[choice.value] = choice.label;
    return acc;
  },
  {} as Record<ContactBusinessLineValue, string>,
);

const getTaskTypeLabel = (
  type: string,
  taskTypes: Array<{ value: string; label: string }>,
) => {
  return taskTypes.find((taskType) => taskType.value === type)?.label ?? type;
};

const getPrimaryBusinessLine = (contact?: Contact | null) => {
  return contact?.business_lines_interest?.[0] ?? null;
};

const OverdueTaskCard = ({
  task,
  contact,
  onMarkDone,
  disabled,
}: {
  task: Task;
  contact?: Contact | null;
  onMarkDone: (task: Task) => void;
  disabled: boolean;
}) => {
  const translate = useTranslate();
  const { taskTypes } = useConfigurationContext();
  const overdueDays = Math.max(
    1,
    differenceInCalendarDays(startOfToday(), new Date(task.due_date)),
  );
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
  const taskTypeLabel =
    task.type && task.type !== "none"
      ? getTaskTypeLabel(task.type, taskTypes)
      : null;
  const contactName = contact
    ? `${contact.first_name} ${contact.last_name}`
    : translate("resources.contacts.forcedCaseName", { _: "Client" });

  return (
    <div className="rounded-xl border border-border/80 bg-background px-4 py-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/contacts/${task.contact_id}/show`}
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
          <p className="text-sm font-medium text-destructive">
            {translate("crm.today.sections.tasks.overdue_days", {
              smart_count: overdueDays,
            })}
          </p>
        </div>
        {taskTypeLabel ? (
          <Badge variant="outline" className="shrink-0">
            {taskTypeLabel}
          </Badge>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-foreground">{task.text}</p>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <OpenWhatsAppButton
          contact={contact}
          task={task}
          businessLineLabel={businessLineLabel}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMarkDone(task)}
          disabled={disabled}
          className="min-w-24"
        >
          <Check className="size-4" />
          {translate("crm.today.sections.tasks.mark_done")}
        </Button>
      </div>
    </div>
  );
};

const OverdueTasksEmptyState = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
      <CircleCheckBig className="size-8 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-3 text-sm font-medium text-foreground">
        {translate("crm.today.sections.tasks.empty_title")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {translate("crm.today.sections.tasks.empty_description")}
      </p>
    </div>
  );
};

const OverdueTasksPendingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={`today-overdue-task-skeleton-${index}`}
        className="rounded-xl border bg-background px-4 py-4"
      >
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <Skeleton className="mt-4 h-4 w-5/6" />
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const OverdueTasksErrorState = () => {
  const translate = useTranslate();

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-4">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 size-4 text-destructive" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {translate("crm.today.section_error")}
          </p>
          <Button asChild variant="link" className="h-auto px-0">
            <Link to="/today">{translate("crm.common.retry")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TodayOverdueTasksSection = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [pendingTaskId, setPendingTaskId] = useState<Identifier | null>(null);
  const [update] = useUpdate();
  const today = startOfToday().toISOString();

  const {
    data: overdueTasks = [],
    error,
    isPending,
    total,
  } = useGetList<Task>(
    "tasks",
    {
      pagination: { page: 1, perPage: MAX_VISIBLE_TASKS + 1 },
      sort: { field: "due_date", order: "ASC" },
      filter: {
        sales_id: identity?.id,
        "done_date@is": null,
        "due_date@lt": today,
      },
    },
    { enabled: !!identity },
  );

  const visibleTasks = overdueTasks.slice(0, MAX_VISIBLE_TASKS);
  const contactIds = useMemo(
    () =>
      Array.from(
        new Set(
          visibleTasks
            .map((task) => task.contact_id)
            .filter((contactId) => contactId != null),
        ),
      ) as Identifier[],
    [visibleTasks],
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

  const handleMarkDone = (task: Task) => {
    setPendingTaskId(task.id);
    update(
      "tasks",
      {
        id: task.id,
        data: {
          done_date: new Date().toISOString(),
        },
        previousData: task,
      },
      {
        onSuccess: async () => {
          notify("resources.tasks.updated");
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["tasks", "getList"] }),
            queryClient.invalidateQueries({ queryKey: ["contacts", "getOne"] }),
            queryClient.invalidateQueries({
              queryKey: ["contacts", "getList"],
            }),
          ]);
          setPendingTaskId(null);
        },
        onError: () => {
          setPendingTaskId(null);
          notify("ra.notification.http_error", { type: "error" });
        },
      },
    );
  };

  return (
    <Card className="h-full gap-4 border-destructive/20">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {translate("crm.today.sections.tasks.title", {
                smart_count: total ?? 0,
              })}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {translate("crm.today.sections.tasks.description")}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ListTodo className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <OverdueTasksErrorState />
        ) : isPending ? (
          <OverdueTasksPendingState />
        ) : visibleTasks.length === 0 ? (
          <OverdueTasksEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <OverdueTaskCard
                  key={task.id}
                  task={task}
                  contact={contactsById.get(task.contact_id)}
                  onMarkDone={handleMarkDone}
                  disabled={pendingTaskId === task.id}
                />
              ))}
            </div>

            {typeof total === "number" && total > MAX_VISIBLE_TASKS ? (
              <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/tasks">
                    {translate("crm.today.sections.tasks.view_all", {
                      smart_count: total,
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
