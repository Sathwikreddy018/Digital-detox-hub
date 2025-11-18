// src/pages/Alarms.tsx
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Trash2 } from "lucide-react";
import {
  addAlarm,
  deleteAlarm,
  loadAlarms,
  saveAlarms,
  updateAlarm,
  type DetoxAlarm,
} from "@/utils/alarms";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const Alarms = () => {
  const [alarms, setAlarms] = useState<DetoxAlarm[]>([]);
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setAlarms(loadAlarms());
  }, []);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const handleAdd = () => {
    if (!time) {
      alert("Pick a time for your alarm.");
      return;
    }
    const alarm = addAlarm({ label, time });
    setAlarms((prev) => [...prev, alarm]);
    setTime("");
    setLabel("");
  };

  const handleToggle = (id: string) => {
    const next = updateAlarm(id, (a) => ({
      ...a,
      enabled: !a.enabled,
    }));
    setAlarms(next);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this alarm?")) return;
    const next = deleteAlarm(id);
    setAlarms(next);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            Detox Alarms
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Set gentle reminders for your screen-free blocks, focus sprints, or
            daily check-ins. Alarms ring while this tab is open.
          </p>
        </section>

        {/* Create alarm */}
        <section>
          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold text-slate-50 mb-3">
              Create a new alarm
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              For example: &quot;Morning detox block at 07:30&quot; or
              &quot;Evening scroll check at 21:00&quot;.
            </p>
            <div className="grid gap-3 sm:grid-cols-[auto,1fr]">
              <div className="space-y-1 text-sm">
                <Label htmlFor="alarm-time" className="text-slate-200">
                  Time
                </Label>
                <Input
                  id="alarm-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-slate-950/70 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-1 text-sm">
                <Label htmlFor="alarm-label" className="text-slate-200">
                  Label (optional)
                </Label>
                <Input
                  id="alarm-label"
                  placeholder="Evening detox block"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                Alarms repeat daily at the chosen time.
              </p>
              <Button size="sm" onClick={handleAdd}>
                Add alarm
              </Button>
            </div>
          </Card>
        </section>

        {/* List alarms */}
        <section>
          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold text-slate-50 mb-3">
              Your alarms
            </h2>
            {alarms.length === 0 ? (
              <p className="text-sm text-slate-300">
                You haven&apos;t created any alarms yet. Add one above to get
                started.
              </p>
            ) : (
              <div className="space-y-3">
                {alarms
                  .slice()
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((alarm) => (
                    <div
                      key={alarm.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
                          {alarm.enabled ? (
                            <Bell className="w-4 h-4 text-primary" />
                          ) : (
                            <BellOff className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-50">
                              {alarm.time}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                alarm.enabled
                                  ? "border-emerald-400/60 text-emerald-200 bg-emerald-500/10"
                                  : "border-slate-600 text-slate-300"
                              }
                            >
                              {alarm.enabled ? "On" : "Off"}
                            </Badge>
                          </div>
                          {alarm.label && (
                            <span className="text-xs text-slate-300">
                              {alarm.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px]"
                          onClick={() => handleToggle(alarm.id)}
                        >
                          {alarm.enabled ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-red-400"
                          onClick={() => handleDelete(alarm.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Alarms;
