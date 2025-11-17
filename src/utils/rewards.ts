import type { RewardData, Badge, DetoxPlan, DailyLog } from "@/types/detox";
import { loadPlan, loadLogs, loadRewardData, saveRewardData } from "./storage";
import { eachDayBetween, getTodayISO, minISO } from "./dates";

/* ---------- Check if a day is completed ---------- */
function isDateCompleted(log: DailyLog | undefined): boolean {
  if (!log) return false;
  return (log.completedBlocks?.length ?? 0) > 0 && log.didActivity === true;
}

/* ---------- Calculate current streak ---------- */
function calculateStreak(dates: string[], logMap: Record<string, DailyLog>): number {
  let streak = 0;

  for (let i = dates.length - 1; i >= 0; i--) {
    const log = logMap[dates[i]];
    if (isDateCompleted(log)) streak++;
    else break;
  }

  return streak;
}

/* ---------- Calculate longest streak ---------- */
function calculateLongestStreak(dates: string[], logMap: Record<string, DailyLog>): number {
  let longest = 0;
  let current = 0;

  for (const date of dates) {
    if (isDateCompleted(logMap[date])) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }

  return longest;
}

/* ---------- MAIN: calculateRewardData ---------- */
export function calculateRewardData(): RewardData {
  const plan: DetoxPlan | null = loadPlan();
  const logs: DailyLog[] = loadLogs();

  const prev = loadRewardData();

  // No plan → return empty structure but keep grace day info
  if (!plan) {
    const empty: RewardData = {
      badges: [],
      totalDaysCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      graceDayUsed: prev.graceDayUsed ?? false,
      graceDayDate: prev.graceDayDate,
    };
    saveRewardData(empty);
    return empty;
  }

  const today = getTodayISO();
  const end = minISO(plan.endDate, today);
  const dates = eachDayBetween(plan.startDate, end);

  // Map logs by date for quick access
  const logMap: Record<string, DailyLog> = {};
  logs.forEach((l) => {
    logMap[l.date] = l;
  });

  let totalDaysCompleted = 0;
  const badges: Badge[] = [];

  // --- Daily completion badges ---
  dates.forEach((date, index) => {
    const log = logMap[date];
    if (isDateCompleted(log)) {
      totalDaysCompleted++;

      badges.push({
        id: `day-${date}`,
        name: `Day ${index + 1} Completed`,
        description: `You completed the detox tasks on ${date}.`,
        icon: "✅",
        earned: true,
        earnedDate: date,
        type: "daily",
      });
    }
  });

  // --- Streaks ---
  const currentStreak = calculateStreak(dates, logMap);
  const longestStreak = calculateLongestStreak(dates, logMap);

  const streakThresholds = [3, 5, 7];
  streakThresholds.forEach((t) => {
    if (longestStreak >= t) {
      badges.push({
        id: `streak-${t}`,
        name: `${t}-Day Streak`,
        description: `You stayed consistent for ${t} days!`,
        icon: "🔥",
        earned: true,
        earnedDate: today,
        type: "streak",
      });
    }
  });

  // --- Milestone: full plan completion ---
  const fullyCompleted =
    dates.length > 0 && dates.every((d) => isDateCompleted(logMap[d]));

  if (fullyCompleted) {
    badges.push({
      id: "milestone-full-plan",
      name: "Full Plan Completed",
      description: "You completed every day of your detox plan!",
      icon: "🏆",
      earned: true,
      earnedDate: today,
      type: "milestone",
    });
  }

  // Deduplicate badges by id
  const uniqueBadges = Array.from(
    new Map<string, Badge>(badges.map((b) => [b.id, b])).values()
  );

  const result: RewardData = {
    badges: uniqueBadges,
    totalDaysCompleted,
    currentStreak,
    longestStreak,
    graceDayUsed: prev.graceDayUsed ?? false,
    graceDayDate: prev.graceDayDate ?? undefined,
  };

  saveRewardData(result);
  return result;
}

/* ---------- Grace Day Logic ---------- */
export function useGraceDayForToday(): RewardData {
  const current = loadRewardData();
  if (current.graceDayUsed) return current;

  const today = getTodayISO();

  const updated: RewardData = {
    ...current,
    graceDayUsed: true,
    graceDayDate: today,
  };

  saveRewardData(updated);
  return updated;
}
