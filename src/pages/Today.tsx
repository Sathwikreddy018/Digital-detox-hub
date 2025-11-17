import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { loadPlan, loadLogs, saveLogs } from "@/lib/storage";
import { DailyLog } from "@/types/detox";
import { getMoodMessage } from "@/lib/rewards";
import Navbar from "@/components/Navbar";
import { Clock, Heart } from "lucide-react";

const Today = () => {
  const [plan] = useState(() => loadPlan());
  const [logs, setLogs] = useState(() => loadLogs());
  const today = new Date().toISOString().split("T")[0];

  const todayLog = logs.find((log) => log.date === today);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const handleBlockToggle = (blockId: string) => {
    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex((log) => log.date === today);
      
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prevLogs];
        const completedBlocks = updatedLogs[existingLogIndex].completedBlocks;
        
        if (completedBlocks.includes(blockId)) {
          updatedLogs[existingLogIndex].completedBlocks = completedBlocks.filter((id) => id !== blockId);
        } else {
          updatedLogs[existingLogIndex].completedBlocks = [...completedBlocks, blockId];
        }
        
        return updatedLogs;
      } else {
        return [...prevLogs, { date: today, completedBlocks: [blockId], didActivity: false }];
      }
    });
  };

  const handleActivityToggle = () => {
    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex((log) => log.date === today);
      
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex].didActivity = !updatedLogs[existingLogIndex].didActivity;
        return updatedLogs;
      } else {
        return [...prevLogs, { date: today, completedBlocks: [], didActivity: true }];
      }
    });
  };

  const handleMoodChange = (mood: "good" | "okay" | "stressful" | "overwhelmed") => {
    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex((log) => log.date === today);
      
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex].mood = mood;
        return updatedLogs;
      } else {
        return [...prevLogs, { date: today, completedBlocks: [], didActivity: false, mood }];
      }
    });
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Detox Plan Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a detox plan to start tracking your progress
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const completedBlocksCount = todayLog?.completedBlocks.length || 0;
  const totalBlocks = plan.timeBlocks.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{plan.title}</h1>
          <p className="text-muted-foreground">
            {new Date(today).toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time blocks completed:</span>
                <span className="font-semibold">
                  {completedBlocksCount}/{totalBlocks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Activity completed:</span>
                <span className="font-semibold">
                  {todayLog?.didActivity ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </Card>

          {plan.focusAreas.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">Focus Areas</h2>
              <div className="flex flex-wrap gap-2">
                {plan.focusAreas.map((area) => (
                  <Badge key={area} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {plan.activities.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">Replacement Activities</h2>
              <ul className="space-y-2">
                {plan.activities.map((activity, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {activity}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Screen-Free Time Blocks</h2>
            <div className="space-y-3">
              {plan.timeBlocks.map((block) => {
                const isCompleted = todayLog?.completedBlocks.includes(block.id) || false;
                
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{block.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {block.start} – {block.end}
                        </p>
                      </div>
                    </div>
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => handleBlockToggle(block.id)}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Replacement Activity</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Did you do at least one replacement activity today?
                </p>
              </div>
              <Checkbox
                checked={todayLog?.didActivity || false}
                onCheckedChange={handleActivityToggle}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">How are you feeling?</h2>
              <p className="text-sm text-muted-foreground">
                Check in with yourself today
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "good", label: "Good", emoji: "😊" },
                { value: "okay", label: "Okay", emoji: "😌" },
                { value: "stressful", label: "Stressful", emoji: "😰" },
                { value: "overwhelmed", label: "Overwhelmed", emoji: "😔" },
              ].map((mood) => (
                <button
                  key={mood.value}
                  onClick={() =>
                    handleMoodChange(
                      mood.value as "good" | "okay" | "stressful" | "overwhelmed"
                    )
                  }
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    todayLog?.mood === mood.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {todayLog?.mood && (
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">A gentle reminder</h3>
                  <p className="text-muted-foreground">
                    {getMoodMessage(todayLog.mood)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Today;
