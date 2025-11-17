// src/utils/craving.ts
import type { UrgeEvent, UrgeTrigger } from "@/types/detox";
import { getUrgeEventsForPlan } from "@/utils/urge";

type TimeBucket = "morning" | "afternoon" | "evening" | "night";

export interface CravingInsights {
  totalUrges: number;
  resisted: number;
  mostCommonTrigger: UrgeTrigger | null;
  bestTimeBucket: TimeBucket | null;   // where urges are lowest
  worstTimeBucket: TimeBucket | null;  // where urges are highest
  peakHour: number | null;             // 0–23
  averageStrength: number;
}

function getBucket(hour: number): TimeBucket {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

export function getCravingInsightsForPlan(planId?: string): CravingInsights {
  const events: UrgeEvent[] = getUrgeEventsForPlan(planId);

  if (events.length === 0) {
    return {
      totalUrges: 0,
      resisted: 0,
      mostCommonTrigger: null,
      bestTimeBucket: null,
      worstTimeBucket: null,
      peakHour: null,
      averageStrength: 0,
    };
  }

  const totalUrges = events.length;
  const resisted = events.filter((e) => e.usedAlternative).length;

  const triggerCounts = new Map<UrgeTrigger, number>();
  const bucketCounts = new Map<TimeBucket, number>();
  const hourCounts = new Map<number, number>();
  let strengthSum = 0;

  for (const e of events) {
    triggerCounts.set(e.trigger, (triggerCounts.get(e.trigger) ?? 0) + 1);

    const [hourStr] = e.time.split(":");
    const hour = Number(hourStr);
    if (!Number.isNaN(hour)) {
      const bucket = getBucket(hour);
      bucketCounts.set(bucket, (bucketCounts.get(bucket) ?? 0) + 1);
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    }

    strengthSum += e.strength;
  }

  let mostCommonTrigger: UrgeTrigger | null = null;
  let triggerMax = 0;
  triggerCounts.forEach((count, trigger) => {
    if (count > triggerMax) {
      triggerMax = count;
      mostCommonTrigger = trigger;
    }
  });

  let worstTimeBucket: TimeBucket | null = null;
  let bestTimeBucket: TimeBucket | null = null;
  let maxBucket = -1;
  let minBucket = Number.MAX_SAFE_INTEGER;
  (["morning", "afternoon", "evening", "night"] as TimeBucket[]).forEach(
    (bucket) => {
      const count = bucketCounts.get(bucket) ?? 0;
      if (count > maxBucket) {
        maxBucket = count;
        worstTimeBucket = bucket;
      }
      if (count < minBucket) {
        minBucket = count;
        bestTimeBucket = bucket;
      }
    }
  );

  let peakHour: number | null = null;
  let maxHourCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      peakHour = hour;
    }
  });

  return {
    totalUrges,
    resisted,
    mostCommonTrigger,
    bestTimeBucket,
    worstTimeBucket,
    peakHour,
    averageStrength: strengthSum / totalUrges,
  };
}
