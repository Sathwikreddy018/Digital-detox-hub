import type { DetoxPlan, DailyLog } from "../types/detox";
import { loadPlan, loadLogs } from "./storage";
import { eachDayBetween, getTodayISO, minISO } from "./dates";
import { isDateCompleted } from "./today";

export type ProgressStats = {
  hasPlan: boolean;
  totalDays: number;
  completedDays: number;
  streak: number;
  completionRate: number; // 0–1
  plan?: DetoxPlan | null;
  logs?: DailyLog[];
};

export function calculateProgress(): ProgressStats {
  const plan = loadPlan();
  const logs = loadLogs();

  if (!plan) {
    return {
      hasPlan: false,
      totalDays: 0,
      completedDays: 0,
      streak: 0,
      completionRate: 0,
    };
  }

  const today = getTodayISO();
  const effectiveEnd = minISO(plan.endDate, today);
  const dates = eachDayBetween(plan.startDate, effectiveEnd);

  const totalDays = dates.length;
  let completedDays = 0;
  let longestStreak = 0;
  let currentStreak = 0;

  for (const date of dates) {
    const completed = isDateCompleted(date);
    if (completed) {
      completedDays += 1;
      currentStreak += 1;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  const completionRate = totalDays === 0 ? 0 : completedDays / totalDays;

  return {
    hasPlan: true,
    totalDays,
    completedDays,
    streak: longestStreak,
    completionRate,
    plan,
    logs,
  };
}
