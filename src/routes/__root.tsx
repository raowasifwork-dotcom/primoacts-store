import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LiveChatWidget } from "@/components/site/LiveChatWidget";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-display">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        {error?.message && (
          <div className="mt-3 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-left text-xs font-mono text-red-300 max-h-40 overflow-auto">
            {error.message}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold px-4 py-2 text-sm font-medium rounded-xl"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const fallbackQueryClient = new QueryClient();

export const Route = createRootRouteWithContext<{ queryClient?: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Primo Acts — Stories That Step Out of the Dark" },
      {
        name: "description",
        content: "Original fantasy thriller universe and digital book store written by Rao Wasif.",
      },
      { name: "author", content: "Rao Wasif" },
      { name: "application-name", content: "Primo Acts" },
      { name: "apple-mobile-web-app-title", content: "Primo Acts" },
      { name: "theme-color", content: "#07090e" },
      { property: "og:site_name", content: "Primo Acts" },
      { property: "og:title", content: "Primo Acts — Stories That Step Out of the Dark" },
      {
        property: "og:description",
        content: "Original fantasy thriller universe and digital book store written by Rao Wasif.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://primoacts-store.vercel.app" },
      { property: "og:image", content: "https://primoacts-store.vercel.app/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@PrimoActs" },
      { name: "twitter:creator", content: "@PrimoActs" },
      { name: "twitter:title", content: "Primo Acts — Stories That Step Out of the Dark" },
      {
        name: "twitter:description",
        content: "Original fantasy thriller universe and digital book store written by Rao Wasif.",
      },
      { name: "twitter:image", content: "https://primoacts-store.vercel.app/logo.png" },
      {
        name: "google-site-verification",
        content: "zRqQOmPT2e552_tnY-GGh_rurcIwKarh5cJqePj1ExA",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://primoacts-store.vercel.app/" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Sora:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.png?v=4", type: "image/png" },
      { rel: "icon", href: "/logo.png?v=4", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png?v=4" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://primoacts-store.vercel.app/#website",
        "url": "https://primoacts-store.vercel.app/",
        "name": "Primo Acts",
        "alternateName": ["PrimoActs", "Primo Acts Official", "Primo Acts Store", "primoacts"],
        "description": "Original fantasy thriller universe and digital book store written by Rao Wasif.",
        "publisher": {
          "@id": "https://primoacts-store.vercel.app/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://primoacts-store.vercel.app/#organization",
        "name": "Primo Acts",
        "url": "https://primoacts-store.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://primoacts-store.vercel.app/logo.png",
        },
        "founder": {
          "@type": "Person",
          "name": "Rao Wasif",
          "jobTitle": "Author & Founder",
          "email": "raowasifwork@gmail.com",
          "url": "https://primoacts-store.vercel.app/about",
        },
        "sameAs": ["https://www.youtube.com/@primoacts_official"],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const context = Route.useRouteContext();
  const queryClient = context?.queryClient ?? fallbackQueryClient;

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        {/* Floating Customer Support Live Chat Widget */}
        <LiveChatWidget />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}
