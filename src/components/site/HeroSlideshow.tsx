import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import heroShadowrealm from "@/assets/hero-shadowrealm.jpg";
import heroSupreme from "@/assets/hero-supreme.jpg";
import { Button } from "@/components/ui/button";
import { useLiveHero } from "@/lib/admin-store";

export function HeroSlideshow() {
  const { slides, autoplayDuration } = useLiveHero();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fallback if slides empty
  const activeSlides =
    slides.length > 0
      ? slides
      : [
          {
            id: "slide-shadowrealm",
            universe: "Shadowrealm Saga",
            badge: "PRIMO ACTS PRESENTS · DARK FANTASY THRILLER",
            title: "Stories that step",
            titleHighlight: "out of the dark.",
            description:
              "Seven unlikely heroes, one town that keeps its secrets, and a door that should have stayed shut.",
            image: heroShadowrealm,
            primaryBtnText: "Enter the store",
            primaryBtnLink: "/store",
            secondaryBtnText: "Meet the seven",
            secondaryBtnLink: "/characters",
            active: true,
          },
          {
            id: "slide-supreme",
            universe: "Rise of the Supreme",
            badge: "EPIC SCI-FI FANTASY UNIVERSE",
            title: "Rise of the",
            titleHighlight: "Supreme Warrior.",
            description:
              "Alexander Vega awakens supreme cosmic powers to confront ancient dark conquerors threatening the galaxies.",
            image: heroSupreme,
            primaryBtnText: "Read Supreme",
            primaryBtnLink: "/store/rise-of-the-supreme",
            secondaryBtnText: "Meet The Heroes",
            secondaryBtnLink: "/characters",
            active: true,
          },
        ];

  // Helper to get image src (resolves relative/asset path or base64)
  const getImageSrc = (img: string) => {
    if (!img) return heroShadowrealm;
    if (img.includes("shadowrealm")) return heroShadowrealm;
    if (img.includes("supreme")) return heroSupreme;
    return img;
  };

  // Safe active index
  const activeIndex = currentIndex % activeSlides.length;
  const currentSlide = activeSlides[activeIndex] || activeSlides[0];

  // Autoplay timer with progress bar
  useEffect(() => {
    if (activeSlides.length <= 1 || isHovered) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / autoplayDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % activeSlides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeSlides.length, autoplayDuration, isHovered, activeIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleSelect = (idx: number) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  return (
    <section
      className="relative h-[88vh] min-h-[580px] max-h-[850px] w-full overflow-hidden bg-[#07090e] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides Images */}
      {activeSlides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        const src = getImageSrc(slide.image);

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
          >
            <img
              src={src}
              alt={slide.universe}
              className={`h-full w-full object-cover object-center transform transition-transform duration-10000 ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        );
      })}

      {/* Cinematic Netflix-style Gradients */}
      {/* Dark fade on bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent pointer-events-none z-10" />
      {/* Dark fade on left side for text readability */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#07090e]/90 via-[#07090e]/50 to-transparent pointer-events-none z-10" />
      {/* Subtle dark fade on top */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07090e]/70 to-transparent pointer-events-none z-10" />

      {/* Left/Right Navigation Chevron Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white backdrop-blur-md transition-all hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white backdrop-blur-md transition-all hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Bottom-Left Netflix Billboard Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 md:pb-20 md:px-12">
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-[11px] font-semibold text-gold tracking-widest uppercase backdrop-blur-md shadow-lg shadow-gold/10 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.08] text-white tracking-tight drop-shadow-2xl">
            <span className="text-gradient-violet">{currentSlide.title}</span>{" "}
            <span className="text-gradient-gold">{currentSlide.titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed max-w-xl font-normal drop-shadow-lg">
            {currentSlide.description}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold-light text-black font-semibold rounded-xl px-6 h-12 shadow-lg shadow-gold/20 hover:scale-105 transition-all text-sm"
            >
              <Link to={currentSlide.primaryBtnLink as any}>
                <span>{currentSlide.primaryBtnText}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>

            {currentSlide.secondaryBtnText && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 hover:border-white/50 bg-black/40 hover:bg-black/60 text-white rounded-xl px-6 h-12 backdrop-blur-md text-sm transition-all"
              >
                <Link to={(currentSlide.secondaryBtnLink as any) || "/characters"}>
                  {currentSlide.secondaryBtnText}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Slide Indicators & Progress Bars */}
        {activeSlides.length > 1 && (
          <div className="mt-8 pt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              {activeSlides.map((s, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(idx)}
                    className={`group flex items-center gap-2 py-1 transition-all text-left ${
                      isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <div className="relative h-1.5 w-14 sm:w-20 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-75"
                        style={{
                          width: isActive ? `${progress}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-white/90 hidden sm:inline-block">
                      {s.universe}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-gold font-bold ml-auto bg-black/50 border border-gold/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
              0{activeIndex + 1} / 0{activeSlides.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
