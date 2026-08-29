import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getTemplateBySlug, getWhatsAppOrderLink } from "@/lib/nexora/templates-data";
import { DemoRenderer } from "@/components/nexora/DemosRenderer";

export const Route = createFileRoute("/demo/$slug")({
  loader: ({ params }) => {
    const template = getTemplateBySlug(params.slug);
    if (!template) {
      throw notFound();
    }
    return { template };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.template
          ? `${loaderData.template.name} — Live Website Demo | NEXORA WEB`
          : "Live Website Demo | NEXORA WEB",
      },
      {
        name: "description",
        content: loaderData?.template?.description || "Live responsive business website demo.",
      },
    ],
  }),
  component: DemoDetailPage,
});

function DemoDetailPage() {
  const { template } = Route.useLoaderData();
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedPlan, setSelectedPlan] = useState<"code" | "ready" | "custom">("ready");

  const currentPriceUSD =
    selectedPlan === "code"
      ? template.pricing.codeOnlyUSD
      : selectedPlan === "ready"
      ? template.pricing.doneForYouUSD
      : template.pricing.customUSD;

  const currentPricePKR =
    selectedPlan === "code"
      ? template.pricing.codeOnlyPKR
      : selectedPlan === "ready"
      ? template.pricing.doneForYouPKR
      : template.pricing.customPKR;

  const whatsappUrl = getWhatsAppOrderLink(
    template.name,
    selectedPlan === "code" ? "Source Code Only" : selectedPlan === "ready" ? "Done-For-You Setup" : "Custom Agency Plan"
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Demo Action Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/95 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between gap-4 backdrop-blur-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">All Demos</span>
          </Link>

          <div className="min-w-0">
            <h1 className="font-extrabold text-sm text-white truncate">{template.name}</h1>
            <p className="text-[11px] text-zinc-400 truncate hidden md:block">
              {template.categoryName} • Rating: {template.rating}★
            </p>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              deviceMode === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              deviceMode === "tablet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
              deviceMode === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Quick Plan & WhatsApp Order */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedPlan("code")}
              className={`px-2.5 py-1 rounded ${
                selectedPlan === "code" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"
              }`}
            >
              Code Only (${template.pricing.codeOnlyUSD})
            </button>
            <button
              onClick={() => setSelectedPlan("ready")}
              className={`px-2.5 py-1 rounded ${
                selectedPlan === "ready" ? "bg-indigo-600 text-white font-bold" : "text-zinc-400"
              }`}
            >
              Done-For-You (${template.pricing.doneForYouUSD})
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/30"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Order This Website</span>
            <span className="sm:hidden">Order</span>
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-zinc-950 p-3 sm:p-6 flex items-start justify-center overflow-x-hidden">
        <div
          className={`transition-all duration-300 mx-auto shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 bg-black ${
            deviceMode === "desktop"
              ? "w-full max-w-6xl min-h-[750px]"
              : deviceMode === "tablet"
              ? "w-[768px] min-h-[800px] border-zinc-700 shadow-indigo-500/10"
              : "w-[380px] min-h-[750px] border-zinc-700 rounded-[36px] p-2 ring-8 ring-zinc-900 shadow-purple-500/10"
          }`}
        >
          {deviceMode === "mobile" && (
            <div className="w-full flex justify-center pb-2 pt-1">
              <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-zinc-800 rounded-full mr-2"></div>
                <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
              </div>
            </div>
          )}

          <div className="w-full h-full min-h-[650px] overflow-y-auto rounded-xl">
            <DemoRenderer template={template} />
          </div>
        </div>
      </div>

      {/* Template Detailed Feature Breakdown */}
      <div className="bg-zinc-900/60 border-t border-zinc-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Included Deliverables</span>
            <h3 className="text-xl font-bold text-white mt-1">What You Get With This Website</h3>
            <div className="mt-4 space-y-2.5">
              {template.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-2 font-medium">Included Page Templates:</span>
              <div className="flex flex-wrap gap-1.5">
                {template.includedPages.map((pg, idx) => (
                  <span key={idx} className="bg-zinc-800 px-2.5 py-1 rounded-lg text-xs text-zinc-300 font-medium">
                    {pg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fast Track Delivery</span>
              <h3 className="text-lg font-bold text-white mt-1">Ready to go live on your domain?</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Click below to order via WhatsApp. Our team will configure your business details, colors, and hosting within 24 hours.
              </p>

              <div className="mt-4 p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Selected Package Price:</span>
                  <span className="text-white font-extrabold text-base">
                    ${currentPriceUSD} <span className="text-xs font-normal text-zinc-400">/ Rs {currentPricePKR.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Launch {template.name} Website Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
