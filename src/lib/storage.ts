import { DetoxPlan, DailyLog } from "@/types/detox";

const PLAN_KEY = "dd_plan";
const LOGS_KEY = "dd_logs";

export function savePlan(plan: DetoxPlan): void {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function loadPlan(): DetoxPlan | null {
  const data = localStorage.getItem(PLAN_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as DetoxPlan;
  } catch {
    return null;
  }
}

export function saveLogs(logs: DailyLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function loadLogs(): DailyLog[] {
  const data = localStorage.getItem(LOGS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as DailyLog[];
  } catch {
    return [];
  }
}
