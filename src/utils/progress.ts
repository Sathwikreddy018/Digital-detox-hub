import { loadPlan, loadLogs } from "./storage";
import { getTodayISO, minISO, eachDayBetween } from "./dates";
import { isDateCompleted } from "./today";

export type ProgressStats = {
  totalDays: number;
  completedDays: number;
  streak: number;
  completionRate: number; // 0–1
};

/**
 * Shared helper to compute overall progress stats.
 * (Your Progress page can use this if you want, but it's optional.)
 */
export function calculateProgress(): ProgressStats {
  const plan = loadPlan();
  const logs = loadLogs(); // currently not used directly, but kept for future extensions

  if (!plan) {
    return {
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
  let runningStreak = 0;

  for (const date of dates) {
    const done = isDateCompleted(date);

    if (done) {
      completedDays += 1;
      runningStreak += 1;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // Current streak = streak counting backwards from the last day
  let currentStreak = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    if (isDateCompleted(dates[i])) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const completionRate =
    totalDays > 0 ? completedDays / totalDays : 0;

  return {
    totalDays,
    completedDays,
    streak: currentStreak,
    completionRate,
  };
}
