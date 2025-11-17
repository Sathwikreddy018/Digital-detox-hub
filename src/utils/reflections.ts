// src/utils/reflections.ts
import type { WeeklyReflection } from "@/types/detox";

const REFLECTIONS_KEY = "detox-weekly-reflections-v1";

function loadReflections(): WeeklyReflection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REFLECTIONS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as WeeklyReflection[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

function saveReflections(reflections: WeeklyReflection[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
}

export function createOrUpdateWeeklyReflection(input: {
  weekStartDate: string;
  highlight: string;
  challenge: string;
  nextWeekFocus: string;
}) {
  const reflections = loadReflections();
  const existingIndex = reflections.findIndex(
    (r) => r.weekStartDate === input.weekStartDate
  );
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    reflections[existingIndex] = {
      ...reflections[existingIndex],
      highlight: input.highlight.trim(),
      challenge: input.challenge.trim(),
      nextWeekFocus: input.nextWeekFocus.trim(),
      createdAt: now,
    };
  } else {
    reflections.push({
      id: (globalThis.crypto ?? window.crypto).randomUUID(),
      weekStartDate: input.weekStartDate,
      highlight: input.highlight.trim(),
      challenge: input.challenge.trim(),
      nextWeekFocus: input.nextWeekFocus.trim(),
      createdAt: now,
    });
  }

  saveReflections(reflections);
}

export function getReflections(): WeeklyReflection[] {
  return loadReflections();
}

export function getReflectionForWeek(weekStartDate: string) {
  return loadReflections().find((r) => r.weekStartDate === weekStartDate);
}
