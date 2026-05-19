import {
  calculateCoreMetricSummary,
  getCoreMetricSummary,
  getOrCreateCoreMetricSession,
  recordSessionOpened,
  recordWhatsappOpened,
} from "./coreMetric";

const createStorage = () => {
  const map = new Map<string, string>();

  return {
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    get length() {
      return map.size;
    },
  } satisfies Storage;
};

describe("coreMetric", () => {
  it("records only one session marker per day in the same session", () => {
    const localStorage = createStorage();
    const sessionStorage = createStorage();
    const now = new Date("2026-05-19T09:00:00.000Z");

    const first = recordSessionOpened(localStorage, sessionStorage, now);
    const second = recordSessionOpened(localStorage, sessionStorage, now);

    expect(first.session.id).toBe(second.session.id);
    expect(second.day.sessionIds).toHaveLength(1);

    const summary = getCoreMetricSummary(localStorage, now);
    expect(summary.activeDaysThisWeek).toBe(1);
    expect(summary.daysBeforeWhatsapp).toBe(0);
  });

  it("records WhatsApp touches and counts days before WhatsApp", () => {
    const localStorage = createStorage();
    const sessionStorage = createStorage();
    const openedAt = new Date("2026-05-19T09:00:00.000Z");
    const whatsappAt = new Date("2026-05-19T09:30:00.000Z");

    recordSessionOpened(localStorage, sessionStorage, openedAt);
    const result = recordWhatsappOpened(
      localStorage,
      sessionStorage,
      whatsappAt,
    );

    expect(result.day.whatsappTouches).toBe(1);
    expect(result.day.firstWhatsappOpenedAt).toBe(whatsappAt.toISOString());

    const summary = getCoreMetricSummary(localStorage, openedAt);
    expect(summary.activeDaysThisWeek).toBe(1);
    expect(summary.daysBeforeWhatsapp).toBe(1);
    expect(summary.whatsappTouchesThisWeek).toBe(1);
  });

  it("calculates the current week summary from stored history", () => {
    const summary = calculateCoreMetricSummary(
      {
        "2026-05-18": {
          dayKey: "2026-05-18",
          firstOpenedAt: "2026-05-18T08:00:00.000Z",
          firstWhatsappOpenedAt: "2026-05-18T09:00:00.000Z",
          sessionIds: ["a"],
          whatsappTouches: 2,
        },
        "2026-05-19": {
          dayKey: "2026-05-19",
          firstOpenedAt: "2026-05-19T08:00:00.000Z",
          sessionIds: ["b"],
          whatsappTouches: 0,
        },
        "2026-05-25": {
          dayKey: "2026-05-25",
          firstOpenedAt: "2026-05-25T08:00:00.000Z",
          firstWhatsappOpenedAt: "2026-05-25T09:00:00.000Z",
          sessionIds: ["future"],
          whatsappTouches: 1,
        },
      },
      new Date("2026-05-19T12:00:00.000Z"),
    );

    expect(summary).toEqual({
      activeDaysThisWeek: 2,
      daysBeforeWhatsapp: 1,
      whatsappTouchesThisWeek: 2,
    });
  });

  it("recreates the session marker on a different day", () => {
    const sessionStorage = createStorage();
    const first = getOrCreateCoreMetricSession(
      sessionStorage,
      new Date("2026-05-19T09:00:00.000Z"),
    );
    const second = getOrCreateCoreMetricSession(
      sessionStorage,
      new Date("2026-05-20T09:00:00.000Z"),
    );

    expect(first.id).not.toBe(second.id);
    expect(first.dayKey).toBe("2026-05-19");
    expect(second.dayKey).toBe("2026-05-20");
  });
});
