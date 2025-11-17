import type { Mood, SupportMessage } from "../types/detox";
import { getTodayISO } from "./dates";

const genericMessages: SupportMessage[] = [
  {
    title: "One step at a time",
    body: "You don’t need a perfect detox. Showing up today is already progress.",
  },
  {
    title: "Progress, not perfection",
    body: "Even if you slipped, you are still moving in the right direction.",
  },
  {
    title: "You’re not alone",
    body: "Many people struggle with screen time. You’re doing something brave by facing it.",
  },
];

const moodMessages: Record<Mood, SupportMessage[]> = {
  good: [
    {
      title: "Nice work",
      body: "You’re feeling good today. Use that energy to strengthen your new habits.",
    },
    {
      title: "Keep the momentum",
      body: "Celebrate your small wins and keep taking small, consistent steps.",
    },
  ],
  okay: [
    {
      title: "You’re doing fine",
      body: "It’s okay to feel just ‘okay’. You still showed up, and that matters.",
    },
    {
      title: "Gentle progress",
      body: "Try to do one small thing for yourself today — even 5 minutes counts.",
    },
  ],
  stressful: [
    {
      title: "Breathe, you’ve got this",
      body: "Stress happens. Take a pause, breathe slowly, and come back when you’re ready.",
    },
    {
      title: "Lighten the load",
      body: "You don’t have to fix everything today. Choose one simple step and start there.",
    },
  ],
  overwhelmed: [
    {
      title: "It’s okay to slow down",
      body: "Feeling overwhelmed is not a failure. It’s a signal to go gently with yourself.",
    },
    {
      title: "Small is enough",
      body: "Pick the smallest possible action. A 1-minute pause away from screens is still progress.",
    },
  ],
};

export function getSupportMessage(mood?: Mood): SupportMessage {
  const pool =
    mood && moodMessages[mood] && moodMessages[mood].length > 0
      ? moodMessages[mood]
      : genericMessages;

  const today = getTodayISO();
  const index = new Date(today + "T00:00:00").getDate() % pool.length;
  return pool[index];
}

export function getBreathingExercise(): SupportMessage {
  return {
    title: "1-minute breathing reset",
    body: "Inhale slowly for 4 seconds, hold for 4 seconds, and exhale for 6 seconds. Repeat this 5–8 times.",
  };
}

export function getGroundingExercise(): SupportMessage {
  return {
    title: "5–4–3–2–1 grounding",
    body: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
  };
}

export function getJournalingPrompt(): SupportMessage {
  return {
    title: "Quick reflection prompt",
    body: "Write for 2–3 minutes about this: “What is one thing my future self will thank me for if I do it today?”",
  };
}
