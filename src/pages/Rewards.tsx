import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadPlan, loadLogs } from "@/lib/storage";
import { calculateRewards } from "@/lib/rewards";
import Navbar from "@/components/Navbar";
import { Trophy, Award, Flame } from "lucide-react";

const Rewards = () => {
  const [plan] = useState(() => loadPlan());
  const [logs] = useState(() => loadLogs());

  const rewards = calculateRewards(plan, logs);

  const earnedBadges = rewards.badges.filter((b) => b.earned);
  const lockedBadges = rewards.badges.filter((b) => !b.earned);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Rewards</h1>
          <p className="text-muted-foreground">
            Celebrate your digital detox achievements
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rewards.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rewards.totalDaysCompleted}</p>
                <p className="text-sm text-muted-foreground">Days Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Earned Badges</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-accent/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {badge.earnedDate && (
                        <Badge variant="secondary" className="text-xs">
                          Earned{" "}
                          {new Date(badge.earnedDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Badges</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lockedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-6 opacity-60 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {earnedBadges.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-xl text-muted-foreground mb-2">
              Start your journey to earn badges!
            </p>
            <p className="text-sm text-muted-foreground">
              Complete your daily tasks to unlock achievements
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rewards;
