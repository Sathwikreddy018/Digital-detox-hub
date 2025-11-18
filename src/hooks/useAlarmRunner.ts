// src/hooks/useAlarmRunner.ts
import { useEffect } from "react";
import { loadAlarms, DetoxAlarm } from "@/utils/alarms";

export function useAlarmRunner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ask for notification permission once
    if (typeof Notification !== "undefined") {
      Notification.requestPermission().catch(() => {});
    }

    // Prepare audio element for alarm sound
    let alarmAudio: HTMLAudioElement | null = null;
    try {
      alarmAudio = new Audio("/sounds/detox-alarm.mp3");
      // small volume to avoid being too harsh; adjust if you want
      alarmAudio.volume = 0.7;
    } catch {
      alarmAudio = null;
    }

    // Track which alarms already fired in the current minute
    const lastFired: Record<string, string> = {};

    const checkAlarms = () => {
      const alarms = loadAlarms();
      if (!alarms.length) return;

      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const currentKey = `${hh}:${mm}`;

      alarms.forEach((alarm: DetoxAlarm) => {
        if (!alarm.enabled) return;
        if (alarm.time !== currentKey) return;

        // avoid double firing within same minute
        if (lastFired[alarm.id] === currentKey) return;
        lastFired[alarm.id] = currentKey;

        const title = "Digital Detox Alarm";
        const body =
          alarm.label || "Screen-free reminder. Take a short mindful break.";

        // Browser notification
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          try {
            new Notification(title, {
              body,
              tag: `detox-alarm-${alarm.id}-${currentKey}`,
            });
          } catch {
            // ignore
          }
        } else {
          // Fallback log
          console.log(`${title}: ${body}`);
        }

        // Play sound
        if (alarmAudio) {
          try {
            alarmAudio.currentTime = 0;
            alarmAudio.play().catch(() => {
              // play can fail if user hasn’t interacted with the page yet
            });
          } catch {
            // ignore
          }
        }

        // Optional: vibration
        if ("vibrate" in navigator) {
          try {
            navigator.vibrate(200);
          } catch {
            // ignore
          }
        }
      });
    };

    // Check every 20 seconds
    const id = window.setInterval(checkAlarms, 20_000);
    checkAlarms();

    return () => {
      window.clearInterval(id);
    };
  }, []);
}
