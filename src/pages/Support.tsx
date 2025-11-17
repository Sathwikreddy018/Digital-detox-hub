import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Heart, Wind, BookOpen, Sparkles } from "lucide-react";

const SUPPORTIVE_PHRASES = [
  "It's okay if yesterday wasn't perfect.",
  "Be kind to yourself. You're doing your best.",
  "You're not alone. Keep going.",
  "Small steps lead to big changes.",
  "Progress, not perfection.",
  "Every day is a fresh start.",
  "You deserve this self-care.",
  "Healing isn't linear.",
];

const BREATHING_EXERCISE = {
  title: "1-Minute Breathing Exercise",
  steps: [
    "Find a comfortable position and close your eyes if that feels right.",
    "Breathe in slowly through your nose for 4 counts.",
    "Hold your breath gently for 4 counts.",
    "Exhale slowly through your mouth for 6 counts.",
    "Repeat this cycle 3-4 times.",
    "Notice how your body feels more relaxed.",
  ],
};

const JOURNALING_PROMPTS = [
  "What am I grateful for today?",
  "What is one thing I can do right now to care for myself?",
  "What triggered my urge to use screens today?",
  "How do I feel after spending less time on screens?",
  "What did I do instead of scrolling today?",
];

const GROUNDING_EXERCISES = [
  {
    name: "5-4-3-2-1 Technique",
    description:
      "Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.",
  },
  {
    name: "Body Scan",
    description:
      "Starting from your toes, slowly bring awareness to each part of your body, noticing any sensations without judgment.",
  },
  {
    name: "Gentle Movement",
    description:
      "Stand up and stretch. Move your shoulders, neck, and arms. Notice how your body feels.",
  },
];

const Support = () => {
  const randomPhrase =
    SUPPORTIVE_PHRASES[Math.floor(Math.random() * SUPPORTIVE_PHRASES.length)];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Support & Care</h1>
          <p className="text-muted-foreground">
            Gentle tools to help you through your journey
          </p>
        </div>

        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Today's Reminder</h2>
              <p className="text-lg text-foreground/90 italic">&ldquo;{randomPhrase}&rdquo;</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{BREATHING_EXERCISE.title}</h2>
            </div>
            <ol className="space-y-3">
              {BREATHING_EXERCISE.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-semibold text-primary flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Journaling Prompts</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Take a moment to reflect on these questions:
            </p>
            <ul className="space-y-3">
              {JOURNALING_PROMPTS.map((prompt, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-foreground">{prompt}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold">Grounding Exercises</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              When you feel overwhelmed, try these grounding techniques:
            </p>
            <div className="space-y-4">
              {GROUNDING_EXERCISES.map((exercise, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <h3 className="font-semibold mb-2">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
            <h2 className="text-xl font-semibold mb-3">Remember</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                💙 Your feelings are valid. It's okay to have difficult days.
              </p>
              <p>
                🌱 Change takes time. Be patient with yourself.
              </p>
              <p>
                ✨ You're building healthier habits, one day at a time.
              </p>
              <p>
                🤗 If you're struggling, it's okay to reach out to someone you trust.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
