import type { DailyLog, Mood } from "../types/detox";
import { getTodayISO } from "./dates";
import { loadLogs, saveLogs } from "./storage";

function findOrCreateLogForDate(date: string, logs: DailyLog[]): DailyLog {
  let log = logs.find((l) => l.date === date);
  if (!log) {
    log = { date, completedBlocks: [], didActivity: false };
    logs.push(log);
  }
  return log;
}

// Toggle completion of a single time block for a given date
export function toggleBlockForDate(date: string, blockId: string): DailyLog {
  const logs = loadLogs();
  const log = findOrCreateLogForDate(date, logs);

  if (log.completedBlocks.includes(blockId)) {
    log.completedBlocks = log.completedBlocks.filter((id) => id !== blockId);
  } else {
    log.completedBlocks.push(blockId);
  }

  saveLogs(logs);
  return log;
}

export function toggleBlockForToday(blockId: string): DailyLog {
  const today = getTodayISO();
  return toggleBlockForDate(today, blockId);
}

// Set "didActivity" flag for a date
export function setDidActivityForDate(date: string, value: boolean): DailyLog {
  const logs = loadLogs();
  const log = findOrCreateLogForDate(date, logs);
  log.didActivity = value;
  saveLogs(logs);
  return log;
}

export function setDidActivityForToday(value: boolean): DailyLog {
  const today = getTodayISO();
  return setDidActivityForDate(today, value);
}

// Set mood for a date
export function setMoodForDate(date: string, mood: Mood): DailyLog {
  const logs = loadLogs();
  const log = findOrCreateLogForDate(date, logs);
  log.mood = mood;
  saveLogs(logs);
  return log;
}

export function setMoodForToday(mood: Mood): DailyLog {
  const today = getTodayISO();
  return setMoodForDate(today, mood);
}

// Getters
export function getLogForDate(date: string): DailyLog | undefined {
  const logs = loadLogs();
  return logs.find((l) => l.date === date);
}

export function getLogForToday(): DailyLog | undefined {
  const today = getTodayISO();
  return getLogForDate(today);
}

// A day is "completed" if at least one block is done and activity is true
export function isDateCompleted(date: string): boolean {
  const log = getLogForDate(date);
  if (!log) return false;
  return log.completedBlocks.length > 0 && log.didActivity === true;
}
