import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { TimeBlock, DetoxPlan } from "@/types/detox";
import { savePlan, saveLogs } from "@/lib/storage";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const DEFAULT_FOCUS_AREAS = [
  "Instagram",
  "YouTube",
  "Gaming",
  "Twitter",
  "General Browsing",
];

const CreatePlan = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("My Detox Plan");
  const [duration, setDuration] = useState<"today" | "7days">("7days");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [customFocusArea, setCustomFocusArea] = useState("");
  const [activities, setActivities] = useState("");
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: crypto.randomUUID(), label: "Morning", start: "06:00", end: "08:00" },
    { id: crypto.randomUUID(), label: "Night", start: "21:00", end: "23:00" },
  ]);

  const handleFocusAreaToggle = (area: string) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  const handleAddCustomFocusArea = () => {
    if (customFocusArea.trim() && !selectedFocusAreas.includes(customFocusArea.trim())) {
      setSelectedFocusAreas((prev) => [...prev, customFocusArea.trim()]);
      setCustomFocusArea("");
    }
  };

  const handleAddTimeBlock = () => {
    setTimeBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", start: "09:00", end: "10:00" },
    ]);
  };

  const handleDeleteTimeBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const handleTimeBlockChange = (id: string, field: keyof TimeBlock, value: string) => {
    setTimeBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const startDate = today;
    const endDate =
      duration === "today"
        ? today
        : new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const activityList = activities
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const plan: DetoxPlan = {
      id: crypto.randomUUID(),
      title: title.trim() || "My Detox Plan",
      startDate,
      endDate,
      focusAreas: selectedFocusAreas,
      activities: activityList,
      timeBlocks: timeBlocks.filter((block) => block.label.trim()),
    };

    savePlan(plan);
    saveLogs([]);
    toast.success("Detox plan created successfully!");
    navigate("/today");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Detox Plan</h1>
          <p className="text-muted-foreground">Design a personalized plan to reduce screen time</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Plan Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Detox Plan"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Duration</Label>
                <RadioGroup value={duration} onValueChange={(v) => setDuration(v as "today" | "7days")} className="mt-1.5">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today" className="font-normal cursor-pointer">Today only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7days" id="7days" />
                    <Label htmlFor="7days" className="font-normal cursor-pointer">7 days</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Focus Areas</Label>
                <p className="text-sm text-muted-foreground mb-3">What would you like to reduce?</p>
                <div className="space-y-2">
                  {DEFAULT_FOCUS_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={selectedFocusAreas.includes(area)}
                        onCheckedChange={() => handleFocusAreaToggle(area)}
                      />
                      <Label htmlFor={area} className="font-normal cursor-pointer">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Add custom focus area"
                    value={customFocusArea}
                    onChange={(e) => setCustomFocusArea(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomFocusArea())}
                  />
                  <Button type="button" onClick={handleAddCustomFocusArea} size="sm">
                    Add
                  </Button>
                </div>
                {selectedFocusAreas.filter((a) => !DEFAULT_FOCUS_AREAS.includes(a)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFocusAreas
                      .filter((a) => !DEFAULT_FOCUS_AREAS.includes(a))
                      .map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => setSelectedFocusAreas((prev) => prev.filter((a) => a !== area))}
                            className="hover:text-primary/70"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="activities">Replacement Activities</Label>
                <p className="text-sm text-muted-foreground mb-1.5">What will you do instead? (one per line)</p>
                <Textarea
                  id="activities"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Read a book&#10;Go for a walk&#10;Call a friend&#10;Practice meditation"
                  rows={5}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen-Free Time Blocks</Label>
                  <p className="text-sm text-muted-foreground">Set times when you won't use screens</p>
                </div>
                <Button type="button" onClick={handleAddTimeBlock} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Block
                </Button>
              </div>

              <div className="space-y-3">
                {timeBlocks.map((block) => (
                  <div key={block.id} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`label-${block.id}`} className="text-xs">Label</Label>
                      <Input
                        id={`label-${block.id}`}
                        value={block.label}
                        onChange={(e) => handleTimeBlockChange(block.id, "label", e.target.value)}
                        placeholder="e.g. Morning"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`start-${block.id}`} className="text-xs">Start</Label>
                      <Input
                        id={`start-${block.id}`}
                        type="time"
                        value={block.start}
                        onChange={(e) => handleTimeBlockChange(block.id, "start", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`end-${block.id}`} className="text-xs">End</Label>
                      <Input
                        id={`end-${block.id}`}
                        type="time"
                        value={block.end}
                        onChange={(e) => handleTimeBlockChange(block.id, "end", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleDeleteTimeBlock(block.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1">
              Create Plan
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePlan;
