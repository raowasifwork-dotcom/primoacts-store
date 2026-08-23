import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-lg uppercase tracking-[0.2em]">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <Link to="/store" className="hover:text-gold">
              Digital Store
            </Link>
            <Link to="/characters" className="hover:text-gold">
              Characters
            </Link>
            <Link to="/about" className="hover:text-gold">
              About the Author
            </Link>
            <Link to="/contact" className="hover:text-gold">
              Contact
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium">Get in touch</p>
          <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-gold">
              <Mail className="h-4 w-4 shrink-0" /> {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-gold"
            >
              <Phone className="h-4 w-4 shrink-0" /> {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border/60 px-4 pt-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 md:px-6">
        <div>
          © {new Date().getFullYear()} {SITE.name} · Written by {SITE.founder}. All rights reserved.
        </div>
        <div>
          <Link to="/admin" className="text-muted-foreground/60 hover:text-gold text-[11px] transition-colors">
            Staff / Control Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
