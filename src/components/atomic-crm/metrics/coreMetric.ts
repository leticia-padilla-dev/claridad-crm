const CORE_METRIC_SESSION_KEY = "claridad.coreMetric.session";
const CORE_METRIC_HISTORY_KEY = "claridad.coreMetric.history";
const CORE_METRIC_UPDATED_EVENT = "claridad-core-metric-updated";

export type CoreMetricSession = {
  dayKey: string;
  id: string;
  startedAt: string;
};

export type CoreMetricDay = {
  dayKey: string;
  firstOpenedAt: string;
  firstWhatsappOpenedAt?: string;
  sessionIds: string[];
  whatsappTouches: number;
};

export type CoreMetricHistory = Record<string, CoreMetricDay>;

export type CoreMetricSummary = {
  activeDaysThisWeek: number;
  daysBeforeWhatsapp: number;
  whatsappTouchesThisWeek: number;
};

const getLocalDayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekStart = (date: Date) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diff);
  return current;
};

const getWeekDayKeys = (date: Date) => {
  const weekStart = getWeekStart(date);
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(weekStart);
    current.setDate(weekStart.getDate() + index);
    return getLocalDayKey(current);
  });
};

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const readHistory = (storage: Storage) =>
  safeParse<CoreMetricHistory>(storage.getItem(CORE_METRIC_HISTORY_KEY), {});

const writeHistory = (storage: Storage, history: CoreMetricHistory) => {
  storage.setItem(CORE_METRIC_HISTORY_KEY, JSON.stringify(history));
};

const writeSession = (storage: Storage, session: CoreMetricSession) => {
  storage.setItem(CORE_METRIC_SESSION_KEY, JSON.stringify(session));
};

const createSession = (date: Date): CoreMetricSession => ({
  dayKey: getLocalDayKey(date),
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  startedAt: date.toISOString(),
});

const announceMetricUpdate = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(CORE_METRIC_UPDATED_EVENT));
};

export const getCoreMetricUpdateEventName = () => CORE_METRIC_UPDATED_EVENT;

export const getOrCreateCoreMetricSession = (
  sessionStorage: Storage,
  now = new Date(),
) => {
  const existing = safeParse<CoreMetricSession | null>(
    sessionStorage.getItem(CORE_METRIC_SESSION_KEY),
    null,
  );
  const currentDayKey = getLocalDayKey(now);

  if (existing && existing.dayKey === currentDayKey) {
    return existing;
  }

  const nextSession = createSession(now);
  writeSession(sessionStorage, nextSession);
  return nextSession;
};

export const recordSessionOpened = (
  localStorage: Storage,
  sessionStorage: Storage,
  now = new Date(),
) => {
  const session = getOrCreateCoreMetricSession(sessionStorage, now);
  const history = readHistory(localStorage);
  const existingDay = history[session.dayKey];

  history[session.dayKey] = existingDay
    ? {
        ...existingDay,
        sessionIds: existingDay.sessionIds.includes(session.id)
          ? existingDay.sessionIds
          : [...existingDay.sessionIds, session.id],
      }
    : {
        dayKey: session.dayKey,
        firstOpenedAt: session.startedAt,
        sessionIds: [session.id],
        whatsappTouches: 0,
      };

  writeHistory(localStorage, history);
  announceMetricUpdate();

  return {
    day: history[session.dayKey],
    session,
  };
};

export const recordWhatsappOpened = (
  localStorage: Storage,
  sessionStorage: Storage,
  now = new Date(),
) => {
  const { day, session } = recordSessionOpened(
    localStorage,
    sessionStorage,
    now,
  );
  const history = readHistory(localStorage);
  const updatedDay: CoreMetricDay = {
    ...day,
    firstWhatsappOpenedAt: day.firstWhatsappOpenedAt ?? now.toISOString(),
    whatsappTouches: day.whatsappTouches + 1,
  };

  history[session.dayKey] = updatedDay;
  writeHistory(localStorage, history);
  announceMetricUpdate();

  return {
    day: updatedDay,
    session,
  };
};

export const calculateCoreMetricSummary = (
  history: CoreMetricHistory,
  now = new Date(),
): CoreMetricSummary => {
  return getWeekDayKeys(now).reduce<CoreMetricSummary>(
    (summary, dayKey) => {
      const day = history[dayKey];

      if (!day) {
        return summary;
      }

      const activeDaysThisWeek = summary.activeDaysThisWeek + 1;
      const whatsappTouchesThisWeek =
        summary.whatsappTouchesThisWeek + day.whatsappTouches;
      const daysBeforeWhatsapp =
        day.firstWhatsappOpenedAt &&
        day.firstOpenedAt <= day.firstWhatsappOpenedAt
          ? summary.daysBeforeWhatsapp + 1
          : summary.daysBeforeWhatsapp;

      return {
        activeDaysThisWeek,
        daysBeforeWhatsapp,
        whatsappTouchesThisWeek,
      };
    },
    {
      activeDaysThisWeek: 0,
      daysBeforeWhatsapp: 0,
      whatsappTouchesThisWeek: 0,
    },
  );
};

export const getCoreMetricSummary = (localStorage: Storage, now = new Date()) =>
  calculateCoreMetricSummary(readHistory(localStorage), now);
