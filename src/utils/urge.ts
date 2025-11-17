// src/utils/urge.ts
import type { UrgeEvent, UrgeTrigger } from "@/types/detox";

const URGE_STORAGE_KEY = "detox-urge-events-v1";

function loadUrgeEvents(): UrgeEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(URGE_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as UrgeEvent[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

function saveUrgeEvents(events: UrgeEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(URGE_STORAGE_KEY, JSON.stringify(events));
}

export function logUrgeEvent(params: {
  planId?: string;
  trigger: UrgeTrigger;
  strength: number;
  usedAlternative: boolean;
}) {
  const events = loadUrgeEvents();
  const now = new Date();

  const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = now.toTimeString().slice(0, 5); // HH:mm

  const newEvent: UrgeEvent = {
    id: (globalThis.crypto ?? window.crypto).randomUUID(),
    planId: params.planId,
    date,
    time,
    trigger: params.trigger,
    strength: Math.min(5, Math.max(1, Math.round(params.strength))),
    usedAlternative: params.usedAlternative,
  };

  events.push(newEvent);
  saveUrgeEvents(events);

  return newEvent;
}

export function getAllUrgeEvents(): UrgeEvent[] {
  return loadUrgeEvents();
}

export function getUrgeEventsForPlan(planId?: string): UrgeEvent[] {
  const events = loadUrgeEvents();
  if (!planId) return events;
  return events.filter((e) => e.planId === planId);
}
