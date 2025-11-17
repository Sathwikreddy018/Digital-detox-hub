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

  // NEW FIELDS
  triggers?: string[];        // what tempted the user that day
  gratitudeNote?: string;     // one good thing about today
  focusSessions?: number;     // how many focus-mode sessions
};

export type RewardType = "daily" | "streak" | "milestone";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  type?: RewardType;
};

export type RewardData = {
  badges: Badge[];
  totalDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;

  // NEW FIELDS FOR GRACE DAY
  graceDayUsed?: boolean;
  graceDayDate?: string;
};

export type SupportMessage = {
  title: string;
  body: string;
};

export type CustomReward = {
  id: string;
  title: string;
  cost: number; // cost in coins
  description?: string;
  redeemed?: boolean;
  redeemedDate?: string;
};
