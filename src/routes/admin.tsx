import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit2,
  ExternalLink,
  FileDown,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Plus,
  Quote,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import founderImg from "@/assets/rao-wasif.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminAuth,
  useLiveBooks,
  useLiveCharacters,
  useLiveOrders,
  useLiveSettings,
} from "@/lib/admin-store";
import { type Book, formatPrice } from "@/lib/books";
import type { Character } from "@/lib/characters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Primo Acts Control Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMasterPortal,
});

function AdminMasterPortal() {
  const { isAuthenticated, login, logout, updateCredentials } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "books" | "characters" | "orders" | "settings"
  >("dashboard");
  const [mobileNav, setMobileNav] = useState(false);

  // Login state
  const [inputPass, setInputPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPass.trim()) {
      toast.error("Please enter your PIN or Password");
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      const ok = login(inputPass);
      setLoginLoading(false);
      if (ok) {
        toast.success("Welcome back, Rao Wasif!", {
          description: "Access granted to Primo Acts Control Center.",
        });
      } else {
        setLoginError(true);
        toast.error("Access Denied", {
          description: "Incorrect secret PIN or Master Password.",
        });
      }
    }, 300);
  };

  // IF NOT AUTHENTICATED -> RENDER CINEMATIC SECURE LOGIN
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#06080d] overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-950/30 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl border border-gold/30 bg-[#0c1018]/95 p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gold/50 shadow-xl shadow-gold/20 mb-4 p-0.5 bg-black/60">
              <img src="/logo.png" alt="Primo Acts" className="h-full w-full object-cover rounded-xl" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> Founder Portal
            </span>

            <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wider text-white">
              {SITE.name} Admin
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your private master credentials to access store controls.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter Secret PIN or Password..."
                  value={inputPass}
                  onChange={(e) => {
                    setInputPass(e.target.value);
                    setLoginError(false);
                  }}
                  className={`pl-10 h-12 bg-surface/80 border text-sm rounded-xl transition-all ${
                    loginError
                      ? "border-rose-500 ring-2 ring-rose-500/20"
                      : "border-border/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  }`}
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 rounded-xl bg-gold hover:bg-gold-light text-black font-semibold text-sm transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              {loginLoading ? "Verifying..." : "Enter Control Center"}
              {!loginLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              ← Return to Public Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED -> RENDER FULL ADMIN DASHBOARD
  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", label: "Books Vault", icon: Package },
    { id: "characters", label: "Characters Lore", icon: Users },
    { id: "orders", label: "Customer Orders", icon: DollarSign },
    { id: "settings", label: "Settings & Security", icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-[#07090e] text-foreground antialiased flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border/40 bg-surface/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg overflow-hidden border border-gold/40">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-display text-sm tracking-wider uppercase text-gold font-bold">
            Primo Admin
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0a0d14]/95 border-r border-border/40 p-5 flex flex-col justify-between backdrop-blur-xl transition-transform duration-200 ${
          mobileNav ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gold/40 shadow-lg shadow-gold/10">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-[0.16em] font-semibold text-white">
                {SITE.name}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-gold tracking-widest uppercase font-medium">
                <ShieldCheck className="h-3 w-3" /> Control Center
              </span>
            </div>
          </div>

          {/* Admin User Card */}
          <div className="rounded-xl border border-border/50 bg-surface/50 p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-gold/50 bg-black/40">
              <img src={founderImg} alt="Rao Wasif" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{SITE.founder}</p>
              <p className="truncate text-[10px] text-muted-foreground">Founder & Admin</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/80 animate-pulse" />
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {TABS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-left ${
                    isActive
                      ? "bg-gold/15 text-gold border border-gold/30 shadow-sm shadow-gold/5"
                      : "text-muted-foreground hover:bg-surface hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-gold" : "text-muted-foreground"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <Link
            to="/"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs text-muted-foreground hover:bg-surface hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-gold" />
              View Live Store
            </span>
            <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded">Live</span>
          </Link>

          <button
            onClick={() => {
              logout();
              toast.info("Signed out of Admin Portal.");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {activeTab === "dashboard" && <AdminDashboardView onNavigate={setActiveTab} />}
        {activeTab === "books" && <AdminBooksView />}
        {activeTab === "characters" && <AdminCharactersView />}
        {activeTab === "orders" && <AdminOrdersView />}
        {activeTab === "settings" && <AdminSettingsView onUpdateCredentials={updateCredentials} />}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 1: DASHBOARD VIEW
// -------------------------------------------------------------
function AdminDashboardView({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { books } = useLiveBooks();
  const { characters } = useLiveCharacters();
  const { orders, updateOrderStatus } = useLiveOrders();

  const totalRevenue = orders
    .filter((o) => o.status === "verified")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
              Control Dashboard
            </h1>
            <span className="rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
              Live
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Welcome back, <span className="text-white font-medium">{SITE.founder}</span>. Here is your live bookstore overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => onNavigate("books")}
            className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl text-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Manage Books
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate("orders")}
            className="border-border/60 rounded-xl text-xs"
          >
            <Clock className="mr-1.5 h-3.5 w-3.5 text-gold" /> Pending Orders ({pendingOrders.length})
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-[#0c1018]/80 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </p>
            <div className="h-8 w-8 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {formatPrice(totalRevenue)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="h-3 w-3" /> Live verified orders
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-[#0c1018]/80 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Published Titles
            </p>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {books.length} Books
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Season 1, Season 2 & Bundle
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-[#0c1018]/80 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Customer Orders
            </p>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {orders.length} Orders
          </p>
          <p className="mt-1 text-[11px] text-amber-400 font-medium">
            {pendingOrders.length} pending review
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-[#0c1018]/80 p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Universe Characters
            </p>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {characters.length} Lore Heroes
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Mia, Lucas, Ethan, Holloway & Finch
          </p>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-[#0c1018]/80 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white uppercase tracking-wide">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-muted-foreground">Verify payment and unlock digital book downloads.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("orders")}
              className="text-xs text-gold hover:text-gold-light"
            >
              View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/40 bg-surface/40 p-3.5 transition-all hover:border-gold/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold text-gold">
                    {order.reference.slice(0, 5)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{order.customerName}</p>
                    <p className="text-[11px] text-muted-foreground">{order.customerEmail}</p>
                    <p className="text-[10px] text-gold/80 font-mono mt-0.5">
                      {order.items.map((i) => i.title).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <p className="font-display text-sm font-bold text-white">
                    {formatPrice(order.total)}
                  </p>
                  {order.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateOrderStatus(order.id, "verified");
                        toast.success(`Order ${order.reference} verified!`);
                      }}
                      className="h-7 text-[10px] bg-gold hover:bg-gold-light text-black font-semibold rounded-lg"
                    >
                      Verify & Unlock
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-[#0c1018]/80 p-5 shadow-xl backdrop-blur-md space-y-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => onNavigate("books")}
                className="w-full justify-start text-xs border-border/60 rounded-xl h-10 hover:border-gold/40"
              >
                <Package className="mr-2 h-4 w-4 text-gold" />
                Edit Book Prices & Upload PDFs
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("characters")}
                className="w-full justify-start text-xs border-border/60 rounded-xl h-10 hover:border-gold/40"
              >
                <Users className="mr-2 h-4 w-4 text-purple-400" />
                Update Character Lore
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("settings")}
                className="w-full justify-start text-xs border-border/60 rounded-xl h-10 hover:border-gold/40"
              >
                <Sparkles className="mr-2 h-4 w-4 text-amber-400" />
                Announcement Banner & Password
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-[#0c1018] to-[#0c1018] p-5 shadow-xl">
            <div className="flex items-center gap-2 text-gold">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-display text-xs font-bold uppercase tracking-wider">
                Store Security Active
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              DRM-free digital delivery system active. Customer purchases are verified directly by Rao Wasif.
            </p>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Admin: <strong className="text-white">Rao Wasif</strong></span>
              <span className="text-emerald-400 font-medium">● Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: BOOKS VAULT VIEW (WITH DIRECT PDF & IMAGE UPLOAD)
// -------------------------------------------------------------
function AdminBooksView() {
  const { books, updateBook, addBook, deleteBook, resetBooks } = useLiveBooks();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (book: Book) => {
    setEditingBook({ ...book });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingBook({
      slug: `book-${Date.now().toString().slice(-4)}`,
      title: "",
      subtitle: "",
      series: "Primo Acts Collection",
      genre: "Dark Fantasy",
      price: 14.99,
      formats: ["PDF"],
      pages: 350,
      cover: "/src/assets/shadowrealm-1.jpg",
      pdf: "/downloads/shadowrealm-bundle.pdf",
      tagline: "An original dark cinematic thriller.",
      description: "",
      featured: true,
    });
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title) {
      toast.error("Please provide a book title.");
      return;
    }

    if (isNew) {
      addBook(editingBook);
      toast.success(`Book "${editingBook.title}" added to store!`);
    } else {
      updateBook(editingBook);
      toast.success(`Book "${editingBook.title}" updated live!`);
    }

    setDialogOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
            Books & Products Vault
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Manage titles, pricing, descriptions, covers, and direct PDF downloads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Reset books catalog to original defaults?")) {
                resetBooks();
                toast.info("Books catalog reset to defaults.");
              }
            }}
            className="border-border/60 text-xs rounded-xl"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> Reset Defaults
          </Button>

          <Button
            size="sm"
            onClick={handleCreate}
            className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl text-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add New Book
          </Button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.slug}
            className="flex flex-col justify-between rounded-2xl border border-border/50 bg-[#0c1018]/90 overflow-hidden shadow-xl hover:border-gold/30 transition-all backdrop-blur-md"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-black/50 border-b border-border/40">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="rounded-full bg-gold/90 text-black font-display font-bold px-2.5 py-0.5 text-xs shadow-md">
                    {formatPrice(book.price)}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] uppercase font-semibold text-gold tracking-widest">
                    {book.series || book.genre}
                  </span>
                  <h3 className="font-display text-sm font-bold text-white truncate">
                    {book.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {book.description || book.tagline}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-surface px-2 py-0.5 border border-border/40">
                    📖 {book.pages} pages
                  </span>
                  <span className="rounded bg-surface px-2 py-0.5 border border-border/40">
                    📄 {book.formats.join(", ")}
                  </span>
                  {book.featured && (
                    <span className="rounded bg-gold/10 text-gold px-2 py-0.5 border border-gold/30 font-medium">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 p-3 bg-surface/30 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                {book.pdf.startsWith("data:") ? "Custom PDF Attached" : book.pdf}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(book)}
                  className="h-8 text-xs border-border/60 hover:border-gold rounded-lg"
                >
                  <Edit2 className="h-3 w-3 mr-1 text-gold" /> Edit
                </Button>
                {books.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Delete "${book.title}"?`)) {
                        deleteBook(book.slug);
                        toast.info("Book deleted from store.");
                      }
                    }}
                    className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {dialogOpen && editingBook && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-2xl bg-[#0d111a] border-border/60 text-foreground max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-white">
                {isNew ? "Add New Book to Store" : `Edit: ${editingBook.title}`}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Book Title *</Label>
                  <Input
                    required
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Subtitle / Season</Label>
                  <Input
                    value={editingBook.subtitle || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, subtitle: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Price (USD $) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={editingBook.price}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-surface/80 border-border/60 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Series / Universe</Label>
                  <Input
                    value={editingBook.series || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, series: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Page Count</Label>
                  <Input
                    type="number"
                    value={editingBook.pages}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, pages: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-surface/80 border-border/60"
                  />
                </div>
              </div>

              {/* Cover Image Uploader */}
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3 space-y-2">
                <Label className="font-semibold text-white flex items-center justify-between">
                  <span>📸 3D Book Cover Image</span>
                  <span className="text-[10px] text-muted-foreground">Select image from computer/phone</span>
                </Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-12 shrink-0 rounded-lg overflow-hidden border border-gold/40 bg-black/60">
                    <img
                      src={editingBook.cover}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-upload-portal"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setEditingBook({
                                ...editingBook,
                                cover: event.target.result as string,
                              });
                              toast.success("Cover image preview updated!");
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("cover-upload-portal")?.click()}
                      className="h-8 text-xs border-gold/40 text-gold hover:bg-gold/10 rounded-lg"
                    >
                      Choose New Cover Image
                    </Button>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Current: {editingBook.cover.slice(0, 35)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Uploader (Word / PDF / EPUB) */}
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3 space-y-2">
                <Label className="font-semibold text-white flex items-center justify-between">
                  <span>📄 Book File (Word .docx / .doc or PDF)</span>
                  <span className="text-[10px] text-muted-foreground">Upload Word file, PDF, or paste link</span>
                </Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.epub,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    id="pdf-upload-portal"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setEditingBook({
                              ...editingBook,
                              pdf: event.target.result as string,
                            });
                            toast.success(`Book file "${file.name}" attached successfully!`);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("pdf-upload-portal")?.click()}
                    className="h-9 text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/10 rounded-lg shrink-0"
                  >
                    <FileDown className="h-3.5 w-3.5 mr-1" /> Upload Word / PDF File
                  </Button>
                  <Input
                    placeholder="or paste direct download URL (/downloads/...)"
                    value={editingBook.pdf.startsWith("data:") ? "Document attached from device (Word / PDF ready)" : editingBook.pdf}
                    onChange={(e) => setEditingBook({ ...editingBook, pdf: e.target.value })}
                    className="h-9 text-[11px] bg-surface/80 border-border/60 font-mono flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Catchy Tagline</Label>
                <Input
                  value={editingBook.tagline}
                  onChange={(e) => setEditingBook({ ...editingBook, tagline: e.target.value })}
                  className="bg-surface/80 border-border/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Book Description</Label>
                <Textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="bg-surface/80 border-border/60"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={Boolean(editingBook.featured)}
                  onChange={(e) => setEditingBook({ ...editingBook, featured: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this book on Homepage & Store top banner
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gold hover:bg-gold-light text-black font-semibold text-xs rounded-xl"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: CHARACTERS LORE VIEW (WITH DIRECT PORTRAIT UPLOAD)
// -------------------------------------------------------------
function AdminCharactersView() {
  const { characters, updateCharacter, addCharacter, deleteCharacter, resetCharacters } =
    useLiveCharacters();

  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (char: Character) => {
    setEditingChar({ ...char });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingChar({
      slug: `character-${Date.now().toString().slice(-4)}`,
      name: "",
      age: 18,
      role: "The Wanderer",
      trait: "Mysterious",
      quote: "The shadows speak if you stay quiet enough.",
      bio: "A new presence emerging in Hollow Creek.",
      image: "/src/assets/hero-shadowrealm.jpg",
    });
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChar || !editingChar.name) {
      toast.error("Please enter a character name.");
      return;
    }

    if (isNew) {
      addCharacter(editingChar);
      toast.success(`Character "${editingChar.name}" added to universe!`);
    } else {
      updateCharacter(editingChar);
      toast.success(`Character "${editingChar.name}" updated!`);
    }

    setDialogOpen(false);
    setEditingChar(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
            Character Lore Studio
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Manage the seven heroes and characters of the Shadowrealm universe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Reset characters to original defaults?")) {
                resetCharacters();
                toast.info("Character roster reset to defaults.");
              }
            }}
            className="border-border/60 text-xs rounded-xl"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> Reset Defaults
          </Button>

          <Button
            size="sm"
            onClick={handleCreate}
            className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl text-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Character
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters.map((char) => (
          <div
            key={char.slug}
            className="flex flex-col justify-between rounded-2xl border border-border/50 bg-[#0c1018]/90 overflow-hidden shadow-xl hover:border-gold/30 transition-all backdrop-blur-md"
          >
            <div>
              <div className="relative aspect-[3/4] overflow-hidden bg-black/60 border-b border-border/40">
                <img
                  src={char.image}
                  alt={char.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-black/70 border border-gold/40 text-gold px-2.5 py-0.5 text-[10px] font-bold">
                    Age {char.age}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-display uppercase tracking-widest text-gold font-bold">
                    {char.role} · {char.trait}
                  </span>
                  <h3 className="font-display text-base font-bold text-white truncate">
                    {char.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="rounded-xl border border-border/40 bg-surface/40 p-2.5 text-[11px] italic text-gold/90 flex gap-2">
                  <Quote className="h-3.5 w-3.5 shrink-0 text-gold mt-0.5" />
                  <span>"{char.quote}"</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {char.bio}
                </p>
              </div>
            </div>

            <div className="border-t border-border/40 p-3 bg-surface/30 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                /{char.slug}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(char)}
                  className="h-8 text-xs border-border/60 hover:border-gold rounded-lg"
                >
                  <Edit2 className="h-3 w-3 mr-1 text-gold" /> Edit
                </Button>
                {characters.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Remove character "${char.name}"?`)) {
                        deleteCharacter(char.slug);
                        toast.info("Character removed.");
                      }
                    }}
                    className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dialogOpen && editingChar && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-[#0d111a] border-border/60 text-foreground max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-white">
                {isNew ? "Add New Character" : `Edit: ${editingChar.name}`}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Character Name *</Label>
                  <Input
                    required
                    value={editingChar.name}
                    onChange={(e) => setEditingChar({ ...editingChar, name: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={editingChar.age}
                    onChange={(e) =>
                      setEditingChar({ ...editingChar, age: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-surface/80 border-border/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Role (e.g. The Spark)</Label>
                  <Input
                    value={editingChar.role}
                    onChange={(e) => setEditingChar({ ...editingChar, role: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Primary Trait</Label>
                  <Input
                    value={editingChar.trait}
                    onChange={(e) => setEditingChar({ ...editingChar, trait: e.target.value })}
                    className="bg-surface/80 border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Signature Quote</Label>
                <Input
                  value={editingChar.quote}
                  onChange={(e) => setEditingChar({ ...editingChar, quote: e.target.value })}
                  className="bg-surface/80 border-border/60"
                />
              </div>

              {/* Portrait Uploader */}
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3 space-y-2">
                <Label className="font-semibold text-white flex items-center justify-between">
                  <span>🎭 Character Portrait Artwork</span>
                  <span className="text-[10px] text-muted-foreground">Select image from computer/phone</span>
                </Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-12 shrink-0 rounded-lg overflow-hidden border border-gold/40 bg-black/60">
                    <img
                      src={editingChar.image}
                      alt="Portrait Preview"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="char-upload-portal"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setEditingChar({
                                ...editingChar,
                                image: event.target.result as string,
                              });
                              toast.success("Character portrait updated!");
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("char-upload-portal")?.click()}
                      className="h-8 text-xs border-gold/40 text-gold hover:bg-gold/10 rounded-lg"
                    >
                      Choose New Portrait
                    </Button>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Current: {editingChar.image.slice(0, 35)}...
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Character Biography</Label>
                <Textarea
                  rows={3}
                  value={editingChar.bio}
                  onChange={(e) => setEditingChar({ ...editingChar, bio: e.target.value })}
                  className="bg-surface/80 border-border/60"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gold hover:bg-gold-light text-black font-semibold text-xs rounded-xl"
                >
                  Save Character
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: CUSTOMER ORDERS VIEW
// -------------------------------------------------------------
function AdminOrdersView() {
  const { orders, updateOrderStatus, deleteOrder } = useLiveOrders();
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "all" || o.status === filter;
    const matchesSearch =
      search === "" ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.reference.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success(`Reference ${ref} copied!`);
  };

  const exportOrders = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `primoacts-orders-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Orders exported to JSON backup!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
            Customer Orders Hub
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Track customer digital book purchases, verify orders, and unlock download access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={exportOrders}
            className="border-border/60 text-xs rounded-xl"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-gold" /> Export JSON
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "verified", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab
                  ? "border-gold/60 bg-gold/15 text-gold"
                  : "border-border/60 text-muted-foreground hover:text-white"
              }`}
            >
              {tab} ({tab === "all" ? orders.length : orders.filter((o) => o.status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or PA-ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-surface/80 border-border/60 rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-[#0c1018]/90 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/40 bg-surface/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Order Ref</th>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Items</th>
                <th className="px-5 py-3.5 font-semibold">Total</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-gold">
                    <button
                      onClick={() => copyRef(order.reference)}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      {order.reference}
                      <Copy className="h-3 w-3 opacity-60" />
                    </button>
                    <span className="text-[10px] block font-normal text-muted-foreground font-sans mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-[11px] text-muted-foreground hover:text-gold flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="h-3 w-3" /> {order.customerEmail}
                    </a>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="truncate text-[11px] text-white">
                          • {item.title}
                        </p>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-display font-bold text-sm text-white">
                    {formatPrice(order.total)}
                  </td>

                  <td className="px-5 py-4">
                    {order.status === "verified" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {order.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                        <Clock className="h-3 w-3" /> Pending Review
                      </span>
                    )}
                    {order.status === "cancelled" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-[10px] font-bold text-rose-400">
                        <XCircle className="h-3 w-3" /> Cancelled
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status !== "verified" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            updateOrderStatus(order.id, "verified");
                            toast.success(`Order ${order.reference} verified!`);
                          }}
                          className="h-7 text-[10px] bg-gold hover:bg-gold-light text-black font-semibold rounded-lg"
                        >
                          Verify
                        </Button>
                      )}

                      {order.status === "verified" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateOrderStatus(order.id, "pending");
                            toast.info(`Order ${order.reference} marked as pending.`);
                          }}
                          className="h-7 text-[10px] border-border/60 rounded-lg text-muted-foreground"
                        >
                          Mark Pending
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete order ${order.reference}?`)) {
                            deleteOrder(order.id);
                            toast.info("Order deleted.");
                          }
                        }}
                        className="h-7 w-7 p-0 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    No orders matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 5: SETTINGS & SECURITY VIEW
// -------------------------------------------------------------
function AdminSettingsView({
  onUpdateCredentials,
}: {
  onUpdateCredentials: (pin: string, pass: string) => void;
}) {
  const { settings, updateSettings } = useLiveSettings();

  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementEnabled);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementLink, setAnnouncementLink] = useState(settings.announcementLink);

  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);

  const [newPin, setNewPin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcementEnabled,
      announcementText,
      announcementLink,
      contactEmail,
      contactPhone,
    });
    toast.success("Store and announcement settings saved live!");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin && !newPassword) {
      toast.error("Please enter a new PIN or Password to update.");
      return;
    }
    onUpdateCredentials(newPin, newPassword);
    toast.success("Admin credentials updated successfully!");
    setNewPin("");
    setNewPassword("");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-border/40 pb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
          Settings & Security
        </h1>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          Manage header announcements, contact information, and admin security credentials.
        </p>
      </div>

      {/* Header Announcement Banner */}
      <form
        onSubmit={handleSaveStore}
        className="rounded-2xl border border-border/50 bg-[#0c1018]/90 p-6 shadow-xl backdrop-blur-md space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white uppercase tracking-wide">
                Header Announcement Banner
              </h2>
              <p className="text-xs text-muted-foreground">
                Display a top banner on the live website to announce new books or special updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {announcementEnabled ? "Active" : "Disabled"}
            </span>
            <Switch
              checked={announcementEnabled}
              onCheckedChange={setAnnouncementEnabled}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Announcement Message</Label>
            <Input
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. 🔥 Shadowrealm Season 2 is now available!"
              className="bg-surface/80 border-border/60"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Banner Button Link</Label>
            <Input
              value={announcementLink}
              onChange={(e) => setAnnouncementLink(e.target.value)}
              placeholder="/store"
              className="bg-surface/80 border-border/60 font-mono"
            />
          </div>
        </div>

        <div className="border-t border-border/40 pt-5 space-y-4">
          <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wide">
            Public Contact Info
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1.5">
              <Label>Business Email</Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-surface/80 border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Business WhatsApp / Phone</Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="bg-surface/80 border-border/60"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-gold hover:bg-gold-light text-black font-semibold text-xs rounded-xl"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Store Settings
          </Button>
        </div>
      </form>

      {/* Security Credentials */}
      <form
        onSubmit={handleSaveSecurity}
        className="rounded-2xl border border-border/50 bg-[#0c1018]/90 p-6 shadow-xl backdrop-blur-md space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
          <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-white uppercase tracking-wide">
              Admin Password & PIN Manager
            </h2>
            <p className="text-xs text-muted-foreground">
              Update the secret credentials used to access the Primo Acts Control Center.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="space-y-1.5">
            <Label>New Master PIN</Label>
            <Input
              type="text"
              placeholder="e.g. 7788"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="bg-surface/80 border-border/60 font-mono"
            />
            <p className="text-[10px] text-muted-foreground">Current default PIN is: 7788</p>
          </div>

          <div className="space-y-1.5">
            <Label>New Master Password</Label>
            <Input
              type="password"
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-surface/80 border-border/60"
            />
            <p className="text-[10px] text-muted-foreground">Current default password is: primoacts</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-900/30"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Update Admin Password
          </Button>
        </div>
      </form>
    </div>
  );
}
