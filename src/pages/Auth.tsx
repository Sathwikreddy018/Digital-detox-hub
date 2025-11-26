// src/pages/Auth.tsx
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";
import { LogIn, UserPlus, Waves } from "lucide-react";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/today";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className={`p-6 sm:p-8 ${glassCard}`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/60 to-cyan-500/60 flex items-center justify-center">
              <Waves className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-50">
                {mode === "login" ? "Welcome back" : "Create your detox space"}
              </h1>
              <p className="text-xs text-slate-300">
                {mode === "login"
                  ? "Log in to see your plan, streaks, and focus garden."
                  : "Sign up to save your detox progress to your account."}
              </p>
            </div>
          </div>

          <div className="flex mb-4 rounded-full bg-slate-900 border border-slate-700 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-xs py-1.5 rounded-full transition-colors ${
                mode === "login"
                  ? "bg-emerald-500/20 text-slate-50"
                  : "text-slate-300"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 text-xs py-1.5 rounded-full transition-colors ${
                mode === "signup"
                  ? "bg-emerald-500/20 text-slate-50"
                  : "text-slate-300"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1 text-sm">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1 text-sm">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                placeholder="At least 6 characters"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                "Please wait..."
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create account</span>
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-slate-400">
            This account is only used to keep your detox data in one place. You
            can always delete data later if you want.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
