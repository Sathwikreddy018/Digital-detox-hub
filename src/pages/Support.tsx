import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Heart, Wind, BookOpen, Sparkles } from "lucide-react";

import {
  getSupportMessage,
  getBreathingExercise,
  getGroundingExercise,
  getJournalingPrompt,
} from "@/utils/support";
import { getLogForToday } from "@/utils/today";

const Support = () => {
  // Use today's mood if available to tailor the message
  const todayLog = getLogForToday();
  const mood = todayLog?.mood;
  const reminder = getSupportMessage(mood);
  const breathing = getBreathingExercise();
  const grounding = getGroundingExercise();
  const journaling = getJournalingPrompt();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Support & Care
          </h1>
          <p className="text-muted-foreground">
            Gentle tools to help you through your journey
          </p>
        </div>

        {/* Today’s reminder, mood-aware */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {reminder.title}
              </h2>
              <p className="text-lg text-foreground/90">
                {reminder.body}
              </p>
              {mood && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on how you&apos;re feeling today: <span className="font-medium">{mood}</span>.
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          {/* Breathing exercise */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{breathing.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{breathing.body}</p>
          </Card>

          {/* Journaling prompt */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Journaling Prompt</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Take a few minutes to write about this:
            </p>
            <p className="text-foreground">{journaling.body}</p>
          </Card>

          {/* Grounding exercise */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold">Grounding Exercise</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              When you feel overwhelmed, try this:
            </p>
            <p className="text-foreground">{grounding.body}</p>
          </Card>

          {/* Closing reminders */}
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
            <h2 className="text-xl font-semibold mb-3">Remember</h2>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>💙 Your feelings are valid. It&apos;s okay to have difficult days.</p>
              <p>🌱 Change takes time. Be patient with yourself.</p>
              <p>✨ You&apos;re building healthier habits, one day at a time.</p>
              <p>🤗 If you&apos;re struggling, it&apos;s okay to reach out to someone you trust.</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
