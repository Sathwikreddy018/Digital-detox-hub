import type { Badge, RewardData } from "../types/detox";
import { loadPlan, loadLogs, saveRewardData, loadRewardData } from "./storage";
import { eachDayBetween, getTodayISO, minISO } from "./dates";
import { isDateCompleted } from "./today";

const STREAK_THRESHOLDS = [3, 5, 7];

function calculateStreak(dates: string[]): { current: number; longest: number } {
  let current = 0;
  let longest = 0;

  for (const date of dates) {
    if (isDateCompleted(date)) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }

  return { current, longest };
}

export function calculateRewardData(): RewardData {
  const plan = loadPlan();
  const logs = loadLogs();

  if (!plan) {
    const empty: RewardData = {
      badges: [],
      totalDaysCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    saveRewardData(empty);
    return empty;
  }

  const today = getTodayISO();
  const effectiveEnd = minISO(plan.endDate, today);
  const dates = eachDayBetween(plan.startDate, effectiveEnd);

  const badges: Badge[] = [];
  let totalDaysCompleted = 0;

  // Daily completion badges
  dates.forEach((date, index) => {
    if (isDateCompleted(date)) {
      totalDaysCompleted += 1;
      badges.push({
        id: `daily-${date}`,
        name: `Day ${index + 1} Complete`,
        description: `You completed your detox tasks on ${date}.`,
        icon: "✅",
        earned: true,
        earnedDate: date,
        type: "daily",
      });
    }
  });

  const { current, longest } = calculateStreak(dates);

  // Streak badges
  STREAK_THRESHOLDS.forEach((threshold) => {
    if (longest >= threshold) {
      badges.push({
        id: `streak-${threshold}`,
        name: `${threshold}-Day Streak`,
        description: `You maintained your detox streak for ${threshold} days.`,
        icon: "🔥",
        earned: true,
        earnedDate: today,
        type: "streak",
      });
    }
  });

  // Milestone badge: completed full plan
  const allCompleted = dates.length > 0 && dates.every((d) => isDateCompleted(d));
  if (allCompleted) {
    badges.push({
      id: "milestone-full-plan",
      name: "Full Plan Completed",
      description: "You completed every day of your detox plan.",
      icon: "🏆",
      earned: true,
      earnedDate: dates[dates.length - 1],
      type: "milestone",
    });
  }

  // Deduplicate badges by id (in case of recompute)
  const map = new Map<string, Badge>();
  for (const b of badges) {
    map.set(b.id, b);
  }
  const uniqueBadges = Array.from(map.values());

  const rewardData: RewardData = {
    badges: uniqueBadges,
    totalDaysCompleted,
    currentStreak: current,
    longestStreak: longest,
  };

  saveRewardData(rewardData);
  return rewardData;
}

export function getStoredRewardData(): RewardData {
  return loadRewardData();
}
