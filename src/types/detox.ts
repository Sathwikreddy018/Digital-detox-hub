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

export type Mood = "good" | "okay" | "stressful" | "overwhelmed";

export type DailyLog = {
  date: string;
  completedBlocks: string[];
  didActivity: boolean;
  mood?: Mood;
};

export type RewardType = "daily" | "streak" | "milestone";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  type?: RewardType; // identifies daily / streak / milestone
};

export type RewardData = {
  badges: Badge[];
  totalDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;
};

export type SupportMessage = {
  title: string;
  body: string;
};
