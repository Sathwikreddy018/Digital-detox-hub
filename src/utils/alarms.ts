// src/utils/alarms.ts
export type DetoxAlarmRepeat = "daily";

export type DetoxAlarm = {
  id: string;
  label: string;
  time: string; // "HH:MM" in 24h format
  enabled: boolean;
  repeat: DetoxAlarmRepeat;
  createdAt: string;
};

const STORAGE_KEY = "detox_alarms_v1";

export function loadAlarms(): DetoxAlarm[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DetoxAlarm[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveAlarms(alarms: DetoxAlarm[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
}

export function addAlarm(partial: { label: string; time: string }): DetoxAlarm {
  const alarms = loadAlarms();
  const alarm: DetoxAlarm = {
    id: crypto.randomUUID(),
    label: partial.label.trim() || "Detox reminder",
    time: partial.time,
    enabled: true,
    repeat: "daily",
    createdAt: new Date().toISOString(),
  };
  const next = [...alarms, alarm];
  saveAlarms(next);
  return alarm;
}

export function updateAlarm(
  id: string,
  updater: (a: DetoxAlarm) => DetoxAlarm
): DetoxAlarm[] {
  const alarms = loadAlarms();
  const next = alarms.map((a) => (a.id === id ? updater(a) : a));
  saveAlarms(next);
  return next;
}

export function deleteAlarm(id: string): DetoxAlarm[] {
  const alarms = loadAlarms();
  const next = alarms.filter((a) => a.id !== id);
  saveAlarms(next);
  return next;
}
