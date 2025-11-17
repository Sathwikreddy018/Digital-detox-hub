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
// --- Urge Rescue ---

export type UrgeTrigger =
  | "boredom"
  | "stress"
  | "notification"
  | "habit"
  | "social_media_cue"
  | "other";

export interface UrgeEvent {
  id: string;
  planId?: string;   // link to current plan if you have an id
  date: string;      // "YYYY-MM-DD"
  time: string;      // "HH:mm"
  trigger: UrgeTrigger;
  strength: number;  // 1–5
  usedAlternative: boolean; // true = resisted, false = gave in
}

// --- Weekly Reflection ---

export interface WeeklyReflection {
  id: string;
  weekStartDate: string; // "YYYY-MM-DD" (e.g., Monday or plan start)
  createdAt: string;
  highlight: string;
  challenge: string;
  nextWeekFocus: string;
}

// --- Challenges ---

export type ChallengeId =
  | "no_morning_social"
  | "evening_screen_free"
  | "no_bed_scrolling"
  | "consistent_week";

export type ChallengeStatus = "locked" | "active" | "completed";

export interface Challenge {
  id: ChallengeId;
  title: string;
  description: string;
  targetDays: number; // how many days to complete
}

export interface ChallengeProgress {
  id: ChallengeId;
  status: ChallengeStatus;
  startedAt: string;     // ISO date-time
  completedAt?: string;  // ISO date-time
  currentDays: number;   // how many days successfully done so far
}
