import { Link } from "@tanstack/react-router";
import { Code2, ExternalLink, Mail, Phone } from "lucide-react";

import { useLiveSettings } from "@/lib/admin-store";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const { settings } = useLiveSettings();

  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-700">
              <img src="/logo.png" alt="Primo Acts" className="h-full w-full object-cover" />
            </div>
            <p className="font-display text-lg uppercase tracking-[0.2em] font-bold text-white">{SITE.name}</p>
          </div>
          <p className="max-w-xs text-xs text-slate-400 leading-relaxed">{SITE.tagline}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-white">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
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

        {/* Sister Business Venture: Nexora */}
        <div className="text-sm">
          <p className="font-medium text-white flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-blue-400" />
            <span>Sister Business</span>
          </p>
          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
            <a
              href={settings.webAgencyUrl || "https://nexoraweb-store.vercel.app/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-bold"
            >
              <span>Nexora Web Studio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Custom modern business websites & e-commerce stores designed & built by Rao Wasif.
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium text-white">Get in touch</p>
          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" /> {SITE.phone}
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
