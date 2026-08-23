import { Link } from "@tanstack/react-router";
import { BookOpen, Check, KeyRound, LogIn, LogOut, Mail, ShieldCheck, User, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerAuth } from "@/lib/customer-auth";

export function CustomerAuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, isLoggedIn, login, register, logout } = useCustomerAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      register(name.trim(), email.trim(), password);
      toast.success(`Welcome to Primo Acts, ${name}! Account created.`);
    } else {
      login(email.trim(), password);
      toast.success(`Welcome back, ${user?.name || email}!`);
    }

    setName("");
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  const isFounder =
    user?.email.includes("raowasif") ||
    user?.email.includes("primoacts") ||
    user?.email === "raowasifwork@gmail.com";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-[#0c1018]/95 p-6 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold uppercase tracking-wider text-white flex items-center justify-between">
            <span>{isLoggedIn ? "My Reader Account" : mode === "login" ? "Sign In to Primo Acts" : "Create Reader Account"}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoggedIn && user ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/60 border border-border/50">
              <div className="h-12 w-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold font-display text-lg">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-base truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-medium">
                  <Check className="h-3 w-3" /> Verified Reader
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full justify-start rounded-xl h-11 bg-gold hover:bg-gold-light text-black font-semibold text-xs">
                <Link to="/downloads" onClick={() => onOpenChange(false)}>
                  <BookOpen className="mr-2 h-4 w-4" /> My Digital Books & Downloads
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start rounded-xl h-11 border-border/60 text-xs text-white hover:bg-surface">
                <Link to="/store" onClick={() => onOpenChange(false)}>
                  <BookOpen className="mr-2 h-4 w-4 text-gold" /> Browse Book Store
                </Link>
              </Button>

              {isFounder && (
                <Button asChild variant="outline" className="w-full justify-start rounded-xl h-11 border-gold/40 bg-gold/10 text-gold hover:bg-gold/20 text-xs font-semibold">
                  <Link to="/admin" onClick={() => onOpenChange(false)}>
                    <KeyRound className="mr-2 h-4 w-4" /> Open Founder Admin Portal
                  </Link>
                </Button>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 flex justify-between items-center">
              <button
                onClick={() => {
                  logout();
                  toast.info("Signed out successfully.");
                  onOpenChange(false);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
              <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === "login"
                ? "Sign in to access your purchased novels, digital downloads, and reading history."
                : "Create an account to keep all your purchased books and reading library in one place."}
            </p>

            {mode === "register" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input
                  placeholder="e.g. Ali Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface/80 border-border/60 rounded-xl h-10 text-xs"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email Address</Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface/80 border-border/60 rounded-xl h-10 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface/80 border-border/60 rounded-xl h-10 text-xs"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gold hover:bg-gold-light text-black font-semibold rounded-xl h-10 text-xs font-display uppercase tracking-wider">
              {mode === "login" ? (
                <>
                  <LogIn className="mr-1.5 h-3.5 w-3.5" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Create Free Account
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              {mode === "login" ? (
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-gold font-semibold hover:underline ml-1"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-gold font-semibold hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
