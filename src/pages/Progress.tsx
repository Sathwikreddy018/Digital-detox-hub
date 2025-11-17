import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loadPlan, loadLogs } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";

function getStats(planStartDate: string, planEndDate: string, logs: any[]) {
  const start = new Date(planStartDate);
  const end = new Date(planEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const actualEnd = end < today ? end : today;
  
  const totalDays = Math.floor((actualEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const completedDays = logs.filter((log) => {
    const logDate = new Date(log.date);
    return (
      logDate >= start &&
      logDate <= actualEnd &&
      log.completedBlocks.length > 0 &&
      log.didActivity
    );
  }).length;

  let streak = 0;
  const todayStr = today.toISOString().split("T")[0];
  let currentDate = new Date(todayStr);

  while (currentDate >= start) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const log = logs.find((l) => l.date === dateStr);
    
    if (log && log.completedBlocks.length > 0 && log.didActivity) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { totalDays: Math.max(totalDays, 0), completedDays, streak };
}

const ProgressPage = () => {
  const [plan] = useState(() => loadPlan());
  const [logs] = useState(() => loadLogs());

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Detox Plan Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a detox plan to start tracking progress
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const stats = getStats(plan.startDate, plan.endDate, logs);
  const progressPercentage = stats.totalDays > 0 ? (stats.completedDays / stats.totalDays) * 100 : 0;

  const getDayStatus = (dateStr: string) => {
    const log = logs.find((l) => l.date === dateStr);
    if (!log) return "none";
    if (log.completedBlocks.length > 0 && log.didActivity) return "completed";
    return "partial";
  };

  const generateDaysList = () => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    let current = new Date(start);

    while (current <= end && current <= today) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const daysList = generateDaysList();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your digital detox journey</p>
        </div>

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedDays}</p>
                  <p className="text-sm text-muted-foreground">Completed Days</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-bold text-lg">
                    {stats.totalDays}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                  <p className="text-sm text-muted-foreground">Total Progress</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.completedDays} of {stats.totalDays} days completed
                </span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Daily Breakdown</h2>
            <div className="grid grid-cols-7 gap-2">
              {daysList.map((day) => {
                const dateStr = day.toISOString().split("T")[0];
                const status = getDayStatus(dateStr);
                
                return (
                  <div
                    key={dateStr}
                    className="aspect-square flex flex-col items-center justify-center p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground mb-1">
                      {day.getDate()}
                    </span>
                    {status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                    {status === "partial" && (
                      <div className="w-5 h-5 rounded-full border-2 border-accent" />
                    )}
                    {status === "none" && (
                      <XCircle className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-accent" />
                <span className="text-muted-foreground">Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-muted-foreground/30" />
                <span className="text-muted-foreground">Missed</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
