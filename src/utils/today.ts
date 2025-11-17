import type { DailyLog, Mood } from "@/types/detox";
import { loadLogs, saveLogs } from "./storage";
import { getTodayISO } from "./dates";

function getLogForDate(date: string): DailyLog | undefined {
  const logs = loadLogs();
  return logs.find((l) => l.date === date);
}

export function getLogForToday(): DailyLog | undefined {
  const today = getTodayISO();
  return getLogForDate(today);
}

function upsertLogForDate(
  date: string,
  updater: (log: DailyLog) => DailyLog
): DailyLog {
  const logs = loadLogs();
  const idx = logs.findIndex((l) => l.date === date);

  let updated: DailyLog;
  let newLogs: DailyLog[];

  if (idx >= 0) {
    updated = updater(logs[idx]);
    newLogs = [...logs];
    newLogs[idx] = updated;
  } else {
    const base: DailyLog = {
      date,
      completedBlocks: [],
      didActivity: false,
    };
    updated = updater(base);
    newLogs = [...logs, updated];
  }

  saveLogs(newLogs);
  return updated;
}

export function toggleBlockForToday(blockId: string): DailyLog {
  const today = getTodayISO();
  return upsertLogForDate(today, (log) => {
    const has = log.completedBlocks.includes(blockId);
    return {
      ...log,
      completedBlocks: has
        ? log.completedBlocks.filter((id) => id !== blockId)
        : [...log.completedBlocks, blockId],
    };
  });
}

export function setDidActivityForToday(did: boolean): DailyLog {
  const today = getTodayISO();
  return upsertLogForDate(today, (log) => ({
    ...log,
    didActivity: did,
  }));
}

export function setMoodForToday(mood: Mood): DailyLog {
  const today = getTodayISO();
  return upsertLogForDate(today, (log) => ({
    ...log,
    mood,
  }));
}

export function isDateCompleted(date: string): boolean {
  const log = getLogForDate(date);
  if (!log) return false;
  return (log.completedBlocks?.length ?? 0) > 0 && log.didActivity === true;
}

// NEW: helper – get today's log, always returning an object
export function getTodayLogOrCreate(): DailyLog {
  const today = getTodayISO();
  const existing = getLogForDate(today);
  if (existing) return existing;
  const base: DailyLog = {
    date: today,
    completedBlocks: [],
    didActivity: false,
  };
  const logs = loadLogs();
  const newLogs = [...logs, base];
  saveLogs(newLogs);
  return base;
}

// NEW: helper – is today completed
export function isTodayCompleted(): boolean {
  const today = getTodayISO();
  return isDateCompleted(today);
}
