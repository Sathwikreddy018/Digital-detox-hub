import type { DetoxPlan, DailyLog, RewardData } from "../types/detox";

const PLAN_KEY = "dd_plan";
const LOGS_KEY = "dd_logs";
const REWARD_DATA_KEY = "dd_reward_data";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Plan
export function loadPlan(): DetoxPlan | null {
  return loadFromStorage<DetoxPlan | null>(PLAN_KEY, null);
}

export function savePlan(plan: DetoxPlan): void {
  saveToStorage<DetoxPlan>(PLAN_KEY, plan);
}

// Logs
export function loadLogs(): DailyLog[] {
  return loadFromStorage<DailyLog[]>(LOGS_KEY, []);
}

export function saveLogs(logs: DailyLog[]): void {
  saveToStorage<DailyLog[]>(LOGS_KEY, logs);
}

// Rewards
export function loadRewardData(): RewardData {
  return loadFromStorage<RewardData>(REWARD_DATA_KEY, {
    badges: [],
    totalDaysCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    graceDayUsed: false,
    graceDayDate: undefined,
  });
}


export function saveRewardData(data: RewardData): void {
  saveToStorage<RewardData>(REWARD_DATA_KEY, data);
}

// Reset everything when creating a new plan
export function clearAllData(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PLAN_KEY);
  window.localStorage.removeItem(LOGS_KEY);
  window.localStorage.removeItem(REWARD_DATA_KEY);
}
