import { useState } from "react";
import { logUrgeEvent } from "@/utils/urge";
import type { UrgeTrigger } from "@/types/detox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AlertTriangle, PauseCircle, CheckCircle2, XCircle } from "lucide-react";

interface UrgeRescueProps {
  planId?: string;
}

export function UrgeRescue({ planId }: UrgeRescueProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [trigger, setTrigger] = useState<UrgeTrigger>("boredom");
  const [strength, setStrength] = useState<number>(3);
  const [usedAlternative, setUsedAlternative] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  function reset() {
    setStep(1);
    setTrigger("boredom");
    setStrength(3);
    setUsedAlternative(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      logUrgeEvent({ planId, trigger, strength, usedAlternative });
    } finally {
      setIsSaving(false);
      setOpen(false);
      reset();
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full text-xs sm:text-sm border-primary/40 bg-primary/5 hover:bg-primary/10"
        onClick={() => setOpen(true)}
      >
        <AlertTriangle className="w-4 h-4 mr-1.5 text-primary" />
        I’m tempted
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md border-primary/20 bg-gradient-to-b from-background to-primary/5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PauseCircle className="w-5 h-5 text-primary" />
              Urge Rescue Mode
            </DialogTitle>
            <DialogDescription>
              When you feel the pull to open a distracting app, walk through
              these quick steps instead.
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For the next 30–60 seconds, breathe slowly:
                <br />
                <span className="font-medium">
                  Inhale 4s → Hold 4s → Exhale 4s
                </span>
              </p>
              <div className="flex items-center justify-center">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                  <div className="h-20 w-20 rounded-full border-2 border-primary/60 flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">
                      Breathe
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  What triggered this urge?
                </p>
                <Select
                  value={trigger}
                  onValueChange={(value) =>
                    setTrigger(value as UrgeTrigger)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boredom">Boredom</SelectItem>
                    <SelectItem value="stress">Stress</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="habit">Just a habit</SelectItem>
                    <SelectItem value="social_media_cue">
                      Saw a social media cue
                    </SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  How strong is the urge?{" "}
                  <span className="font-semibold">
                    {strength} / 5
                  </span>
                </p>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[strength]}
                  onValueChange={(v) => setStrength(v[0] ?? 3)}
                  className="mt-1"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Mild</span>
                  <span>Strong</span>
                </div>
              </div>

              <Button className="w-full" onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For the next few minutes, try one of your{" "}
                <span className="font-medium">replacement activities</span>{" "}
                instead of opening the app. When you’re done, choose what
                actually happened:
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={usedAlternative ? "default" : "outline"}
                  className="w-full text-sm justify-start gap-2"
                  onClick={() => setUsedAlternative(true)}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I stayed off and did an alternative
                </Button>
                <Button
                  type="button"
                  variant={!usedAlternative ? "default" : "outline"}
                  className="w-full text-sm justify-start gap-2"
                  onClick={() => setUsedAlternative(false)}
                >
                  <XCircle className="w-4 h-4" />
                  I still opened the distracting app
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Finish and save"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
