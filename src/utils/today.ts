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
