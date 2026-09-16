import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-700">
              <img src="/logo.png" alt="Primo Acts" className="h-full w-full object-cover" />
            </div>
            <p className="font-display text-lg uppercase tracking-[0.2em] font-bold text-white">{SITE.name}</p>
          </div>
          <p className="max-w-xs text-sm text-slate-400">{SITE.tagline}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-white">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-slate-400">
            <Link to="/store" className="hover:text-blue-400 transition-colors">
              Digital Store
            </Link>
            <Link to="/characters" className="hover:text-blue-400 transition-colors">
              Characters
            </Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">
              About the Author
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium text-white">Get in touch</p>
          <div className="mt-3 flex flex-col gap-2 text-slate-400">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Mail className="h-4 w-4 shrink-0" /> {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0" /> {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border/60 px-4 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 md:px-6">
        <div>
          © {new Date().getFullYear()} {SITE.name} · Written by {SITE.founder}. All rights reserved.
        </div>
        <div>
          <Link to="/admin" className="text-slate-500 hover:text-blue-400 text-[11px] transition-colors">
            Staff / Control Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
