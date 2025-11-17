import { DailyLog, DetoxPlan, Badge, RewardData } from "@/types/detox";

const BADGE_DEFINITIONS = [
  {
    id: "first_day",
    name: "First Step",
    description: "Completed your first day",
    icon: "🌱",
  },
  {
    id: "streak_3",
    name: "Momentum Builder",
    description: "3-day streak achieved",
    icon: "🔥",
  },
  {
    id: "streak_5",
    name: "Dedication",
    description: "5-day streak achieved",
    icon: "⭐",
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "7-day streak achieved",
    icon: "🏆",
  },
  {
    id: "plan_complete",
    name: "Plan Master",
    description: "Completed your full detox plan",
    icon: "💎",
  },
  {
    id: "perfect_day",
    name: "Perfect Day",
    description: "Completed all tasks in one day",
    icon: "✨",
  },
];

export function calculateRewards(
  plan: DetoxPlan | null,
  logs: DailyLog[]
): RewardData {
  const badges: Badge[] = [];
  
  if (!plan) {
    return {
      badges: BADGE_DEFINITIONS.map((def) => ({ ...def, earned: false })),
      totalDaysCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  const completedDays = logs.filter(
    (log) => log.completedBlocks.length > 0 && log.didActivity
  );

  const totalDaysCompleted = completedDays.length;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort logs by date
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate current streak (working backwards from today)
  let currentDate = new Date(today);
  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const log = sortedLogs.find((l) => l.date === dateStr);

    if (log && log.completedBlocks.length > 0 && log.didActivity) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    if (log.completedBlocks.length > 0 && log.didActivity) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Award badges
  BADGE_DEFINITIONS.forEach((def) => {
    let earned = false;
    let earnedDate: string | undefined;

    switch (def.id) {
      case "first_day":
        if (totalDaysCompleted >= 1) {
          earned = true;
          earnedDate = completedDays[0]?.date;
        }
        break;
      case "streak_3":
        if (longestStreak >= 3) {
          earned = true;
        }
        break;
      case "streak_5":
        if (longestStreak >= 5) {
          earned = true;
        }
        break;
      case "streak_7":
        if (longestStreak >= 7) {
          earned = true;
        }
        break;
      case "plan_complete":
        if (plan) {
          const start = new Date(plan.startDate);
          const end = new Date(plan.endDate);
          const planDays =
            Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          if (totalDaysCompleted >= planDays) {
            earned = true;
            earnedDate = plan.endDate;
          }
        }
        break;
      case "perfect_day":
        if (
          logs.some(
            (log) =>
              log.completedBlocks.length === plan.timeBlocks.length &&
              log.didActivity
          )
        ) {
          earned = true;
        }
        break;
    }

    badges.push({
      ...def,
      earned,
      earnedDate,
    });
  });

  return {
    badges,
    totalDaysCompleted,
    currentStreak,
    longestStreak,
  };
}

export function getMoodMessage(mood?: string): string {
  switch (mood) {
    case "good":
      return "That's wonderful! Keep up the great work! 🌟";
    case "okay":
      return "You're doing just fine. Every step counts! 💪";
    case "stressful":
      return "It's okay to feel stressed. Take a deep breath. You're trying your best. 🌸";
    case "overwhelmed":
      return "Be gentle with yourself. Small steps still count. You've got this! 💙";
    default:
      return "How are you feeling today? Check in with yourself. 🌿";
  }
}
