import type { DetoxPlan, TimeBlock } from "../types/detox";
import { getTodayISO, addDays } from "./dates";
import { savePlan, saveLogs } from "./storage";

type PlanDuration = "today" | "7days";

export type PlanFormValues = {
  title: string;
  duration: PlanDuration;
  focusAreas: string[];
  activities: string[];
  timeBlocks: Array<{
    label: string;
    start: string;
    end: string;
  }>;
};

export function createPlanFromForm(values: PlanFormValues): DetoxPlan {
  const startDate = getTodayISO();
  const endDate =
    values.duration === "today" ? startDate : addDays(startDate, 6);

  const timeBlocks: TimeBlock[] = values.timeBlocks.map((tb, index) => ({
    id: tb.label && tb.label.trim().length > 0
      ? `${tb.label}-${index}-${Date.now()}`
      : `block-${index}-${Date.now()}`,
    label: tb.label || `Block ${index + 1}`,
    start: tb.start,
    end: tb.end,
  }));

  const plan: DetoxPlan = {
    id: `plan-${Date.now()}`,
    title: values.title?.trim() || "My Detox Plan",
    startDate,
    endDate,
    focusAreas: values.focusAreas,
    activities: values.activities,
    timeBlocks,
  };

  // Save plan and reset logs
  savePlan(plan);
  saveLogs([]);

  return plan;
}

export function hasActivePlan(): boolean {
  const plan = typeof window !== "undefined" ? undefined : null; // just to avoid SSR confusion
  return !!plan;
}
