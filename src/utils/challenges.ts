// src/utils/challenges.ts
import type {
  Challenge,
  ChallengeId,
  ChallengeProgress,
  ChallengeStatus,
} from "@/types/detox";

const STORAGE_KEY = "detox-challenge-progress-v1";

export const ALL_CHALLENGES: Challenge[] = [
  {
    id: "no_morning_social",
    title: "No Morning Social Apps",
    description: "Avoid social apps before 10 AM for 3 days.",
    targetDays: 3,
  },
  {
    id: "evening_screen_free",
    title: "Screen-Free Evenings",
    description: "Stay off screens for 1 hour before bed for 3 days.",
    targetDays: 3,
  },
  {
    id: "no_bed_scrolling",
    title: "No Scrolling in Bed",
    description: "Do not use your phone once you are in bed for 2 days.",
    targetDays: 2,
  },
  {
    id: "consistent_week",
    title: "Consistent Week",
    description: "Complete at least 6 out of 7 days of your plan.",
    targetDays: 1,
  },
];

function loadProgress(): ChallengeProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChallengeProgress[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProgress(progress: ChallengeProgress[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getChallengesWithProgress(): (Challenge & {
  progress: ChallengeProgress | null;
})[] {
  const progress = loadProgress();
  return ALL_CHALLENGES.map((c) => ({
    ...c,
    progress: progress.find((p) => p.id === c.id) ?? null,
  }));
}

export function activateChallenge(id: ChallengeId) {
  const all = loadProgress();
  const existing = all.find((p) => p.id === id);
  const now = new Date().toISOString();

  if (existing) {
    existing.status = "active";
    existing.startedAt = now;
    existing.completedAt = undefined;
    existing.currentDays = 0;
  } else {
    all.push({
      id,
      status: "active",
      startedAt: now,
      currentDays: 0,
    });
  }

  saveProgress(all);
}

export function completeChallengeDay(id: ChallengeId, success: boolean) {
  const all = loadProgress();
  const entry = all.find((p) => p.id === id);
  if (!entry || entry.status !== "active") return;

  if (success) {
    entry.currentDays += 1;
  }

  const challenge = ALL_CHALLENGES.find((c) => c.id === id);
  if (challenge && entry.currentDays >= challenge.targetDays) {
    entry.status = "completed";
    entry.completedAt = new Date().toISOString();
  }

  saveProgress(all);
}

export function getChallengeStatus(id: ChallengeId): ChallengeStatus {
  const all = loadProgress();
  const entry = all.find((p) => p.id === id);
  return entry?.status ?? "locked";
}
