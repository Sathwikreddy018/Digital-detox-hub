import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Moon, Sparkles } from "lucide-react";
import { loadPlan } from "@/lib/storage";
import Navbar from "@/components/Navbar";

const Home = () => {
  const plan = loadPlan();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Digital Detox Planner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your screen time and reconnect with what matters most
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">More Focus</h3>
            <p className="text-sm text-muted-foreground">
              Reduce distractions and improve concentration on important tasks
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Better Sleep</h3>
            <p className="text-sm text-muted-foreground">
              Break free from late-night scrolling and improve sleep quality
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Less Addiction</h3>
            <p className="text-sm text-muted-foreground">
              Build healthier digital habits and reclaim your time
            </p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/create-plan">
            <Button size="lg" className="w-full sm:w-auto">
              Create My Plan
            </Button>
          </Link>
          {plan && (
            <Link to="/today">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Today
              </Button>
            </Link>
          )}
          <Link to="/rewards">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              View Rewards
            </Button>
          </Link>
          <Link to="/support">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Get Support
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
