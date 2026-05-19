import { useEffect, useState } from "react";
import {
  getCoreMetricSummary,
  getCoreMetricUpdateEventName,
  recordSessionOpened,
  type CoreMetricSummary,
} from "./coreMetric";

const emptySummary: CoreMetricSummary = {
  activeDaysThisWeek: 0,
  daysBeforeWhatsapp: 0,
  whatsappTouchesThisWeek: 0,
};

export const useCoreMetric = () => {
  const [summary, setSummary] = useState<CoreMetricSummary>(emptySummary);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.localStorage ||
      !window.sessionStorage
    ) {
      return;
    }

    const refresh = () => {
      setSummary(getCoreMetricSummary(window.localStorage));
    };

    recordSessionOpened(window.localStorage, window.sessionStorage);
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener(getCoreMetricUpdateEventName(), refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(getCoreMetricUpdateEventName(), refresh);
    };
  }, []);

  return summary;
};
