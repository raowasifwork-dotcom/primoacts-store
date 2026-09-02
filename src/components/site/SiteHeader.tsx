import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Download,
  Home,
  Info,
  LogIn,
  Mail,
  Menu,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { CustomerAuthDialog } from "@/components/site/CustomerAuthDialog";
import { Button } from "@/components/ui/button";
import { useLiveSettings } from "@/lib/admin-store";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/store", label: "Store", icon: Store },
  { to: "/downloads", label: "Downloads", icon: Download },
  { to: "/characters", label: "Characters", icon: BookOpen },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const { settings } = useLiveSettings();
  const { user, isLoggedIn } = useCustomerAuth();
  const [open, setOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        {settings.announcementEnabled && settings.announcementText && (
          <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-1.5 text-center text-xs text-blue-300 font-medium flex items-center justify-center gap-2">
            <span>{settings.announcementText}</span>
            {settings.announcementLink && (
              <Link to={settings.announcementLink} className="underline hover:text-white font-semibold">
                Explore →
              </Link>
            )}
          </div>
        )}
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-slate-700 shadow-sm shadow-blue-500/10">
              <img
                src="/logo.png"
                alt="Primo Acts Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="truncate font-display text-lg tracking-[0.18em] uppercase font-bold text-white">
              {SITE.name}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-400 transition-colors hover:text-white"
                    activeProps={{ className: "text-blue-400 font-semibold bg-blue-500/10" }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Button asChild variant="ghost" size="icon" className="relative shrink-0 text-slate-300 hover:text-white">
              <Link to="/cart" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </Button>

            {/* Customer Sign In / Account Button */}
            <button
              onClick={() => setAuthDialogOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isLoggedIn
                  ? "border-blue-500/40 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25"
                  : "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600"
              }`}
            >
              {isLoggedIn ? (
                <>
                  <User className="h-3.5 w-3.5 text-blue-400" />
                  <span className="max-w-[90px] truncate">
                    {user?.name ? user.name.split(" ")[0] : (user?.email ? user.email.split("@")[0] : "Account")}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border/60 px-4 pb-4 lg:hidden">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-3 text-sm text-muted-foreground"
                  activeProps={{ className: "text-gold font-semibold" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/40 mt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setAuthDialogOpen(true);
                }}
                className="flex items-center gap-3 py-3 text-sm text-gold font-semibold w-full text-left"
              >
                <User className="h-4 w-4" />
                {isLoggedIn ? `Account (${user?.name || user?.email || "Reader"})` : "Sign In / Register"}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Reader Account & Auth Modal */}
      <CustomerAuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
