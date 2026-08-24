import { ExternalLink, Play, Sparkles, Youtube } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLiveVideos } from "@/lib/admin-store";
import { getYoutubeEmbedUrl, getYoutubeThumbnail, YOUTUBE_CHANNEL_URL, type VideoItem } from "@/lib/videos";

export function CinematicTrailersSection() {
  const { videos = [] } = useLiveVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const safeVideos = Array.isArray(videos) ? videos : [];
  const featured = safeVideos.find((v) => v?.featured) || safeVideos[0];

  return (
    <section className="section-pad border-t border-border/60 bg-gradient-to-b from-[#0a0d14] via-[#080a10] to-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-96 w-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-400 uppercase tracking-widest">
                <Youtube className="h-3.5 w-3.5" /> Official YouTube Media
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wide text-white">
              Cinematic Teasers & Trailers
            </h2>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-xl">
              Watch official teasers, character reels, and trailers from the Primo Acts universe created by Rao Wasif.
            </p>
          </div>

          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-950/40 shrink-0"
          >
            <Youtube className="h-4 w-4" />
            <span>Visit @primoacts_official</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {safeVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="float-card glass-panel group overflow-hidden rounded-3xl cursor-pointer border-border/60 hover:border-red-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-black/80">
                  <img
                    src={getYoutubeThumbnail(video.videoId || video.youtubeUrl)}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      // fallback if maxresdefault is missing
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-900/60 group-hover:scale-110 group-hover:bg-red-500 transition-all">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-black/80 border border-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {video.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-gold transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <span className="text-[10px] font-semibold text-red-400 group-hover:underline flex items-center gap-1">
                  ▶ Watch Trailer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <Dialog open={Boolean(selectedVideo)} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl border-border/60 bg-[#0c1018]/98 p-4 md:p-6 rounded-3xl shadow-2xl backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-lg font-bold text-white truncate flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <span>{selectedVideo.title}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black mt-2 shadow-2xl border border-border/40">
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo.videoId || selectedVideo.youtubeUrl)}
                title={selectedVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/40">
              <p className="text-xs text-muted-foreground">{selectedVideo.description}</p>
              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:underline shrink-0 font-medium"
              >
                Watch on YouTube →
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
