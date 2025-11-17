export type TimeBlock = {
  id: string;
  label: string;
  start: string;
  end: string;
};

export type DetoxPlan = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  focusAreas: string[];
  activities: string[];
  timeBlocks: TimeBlock[];
};

export type DailyLog = {
  date: string;
  completedBlocks: string[];
  didActivity: boolean;
  mood?: "good" | "okay" | "stressful" | "overwhelmed";
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
};

export type RewardData = {
  badges: Badge[];
  totalDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;
};
