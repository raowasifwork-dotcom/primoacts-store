import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, FileDown, MessageSquarePlus, Plus, Sparkles, Star, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BookCard } from "@/components/site/BookCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLiveReviews } from "@/lib/admin-store";
import { BOOKS, formatPrice, getBook } from "@/lib/books";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/store/$slug")({
  loader: ({ params }) => {
    const book = getBook(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book not found — Primo Acts" }, { name: "robots", content: "noindex" }],
      };
    }
    const { book } = loaderData;
    return {
      meta: [
        { title: `${book.title} — Primo Acts` },
        { name: "description", content: book.tagline },
        { property: "og:title", content: `${book.title} — Primo Acts` },
        { property: "og:description", content: book.tagline },
      ],
    };
  },
  component: BookDetail,
});

function BookDetail() {
  const { book } = Route.useLoaderData();
  const { add, has } = useCart();
  const [format, setFormat] = useState(book.formats[0] ?? "EPUB");
  const inCart = has(book.slug);

  // Reviews Hook
  const { reviews, totalReviews, averageRating, addReview } = useLiveReviews(book.slug);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast.error("Please enter your name and review comment.");
      return;
    }

    addReview({
      bookSlug: book.slug,
      reviewerName: reviewerName.trim(),
      rating: userRating,
      title: reviewTitle.trim() || `${userRating}-Star Reader Review`,
      comment: reviewComment.trim(),
    });

    toast.success("Thank you! Your verified review has been published!");
    setReviewDialogOpen(false);
    setReviewerName("");
    setReviewTitle("");
    setReviewComment("");
    setUserRating(5);
  };

  const related = BOOKS.filter((b) => b.slug !== book.slug && b.genre === book.genre).slice(0, 3);

  return (
    <div className="section-pad">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="w-full rounded-2xl object-cover shadow-2xl border border-slate-800"
          />

          <div>
            {book.series && (
              <p className="font-display text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">
                {book.series}
              </p>
            )}
            <h1 className="mt-4 text-3xl md:text-5xl font-display text-white">{book.title}</h1>
            {book.subtitle && (
              <p className="mt-2 font-display text-lg text-slate-400">{book.subtitle}</p>
            )}

            {/* Star Rating Badge */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white">
                {totalReviews > 0 ? averageRating.toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-slate-400">
                ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
              </span>
              <button
                onClick={() => setReviewDialogOpen(true)}
                className="text-xs text-blue-400 hover:underline font-semibold ml-2 flex items-center gap-1"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            <p className="mt-5 text-base italic text-slate-200">{book.tagline}</p>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              {book.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-slate-500 text-xs uppercase font-semibold">Genre</dt>
                <dd className="mt-1 font-medium text-slate-200">{book.genre}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs uppercase font-semibold">Pages</dt>
                <dd className="mt-1 font-medium text-slate-200">{book.pages}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs uppercase font-semibold">Formats</dt>
                <dd className="mt-1 font-medium text-slate-200">{book.formats.join(" · ")}</dd>
              </div>
              {book.releaseDate && (
                <div>
                  <dt className="text-blue-400 text-xs uppercase font-semibold">Release Date</dt>
                  <dd className="mt-1 text-blue-300 font-bold">{book.releaseDate}</dd>
                </div>
              )}
            </dl>

            {book.status === "preorder" && (
              <div className="mt-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-xs text-blue-300 flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="font-bold uppercase tracking-wider">Official Pre-Order Edition</p>
                  <p className="text-slate-400 text-[11px]">
                    Expected digital delivery on <strong className="text-white">{book.releaseDate || "Release Date"}</strong>. Pre-order now to secure launch access.
                  </p>
                </div>
              </div>
            )}

            <div className="glass-panel mt-8 rounded-2xl p-5 border border-slate-800">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Choose your digital format
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      format === f
                        ? "border-blue-500/60 bg-blue-500/20 text-blue-300"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="font-display text-3xl text-white font-bold">
                  {formatPrice(book.price)}
                </span>
                <Button
                  className="btn-gold rounded-xl px-6"
                  disabled={inCart}
                  onClick={() => {
                    add({
                      slug: book.slug,
                      title: book.title,
                      price: book.price,
                      cover: book.cover,
                      format,
                    });
                    toast.success(`${book.title} added to cart!`);
                  }}
                >
                  {inCart ? "In Cart" : "Add to Cart"}
                </Button>
              </div>
            </div>   
            <p className="mt-4 flex items-start gap-2 text-xs text-slate-400">
              <FileDown className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              Download links are emailed after your payment is verified — usually within 12 hours.
            </p>
          </div>
        </div>

        {/* READER REVIEWS & 5-STAR RATINGS SECTION */}
        <section className="mt-20 border-t border-border/40 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
                Reader Feedback
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold text-white">
                Reviews & Ratings
              </h2>
            </div>

            <Button
              onClick={() => setReviewDialogOpen(true)}
              className="btn-gold rounded-xl text-xs"
            >
              <MessageSquarePlus className="mr-1.5 h-4 w-4" /> Write a Review
            </Button>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr]">
            {/* Rating Summary Box */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1018]/90 shadow-xl space-y-4 h-fit">
              <div className="text-center space-y-1">
                <p className="font-display text-5xl font-bold text-white">
                  {totalReviews > 0 ? averageRating.toFixed(1) : "5.0"}
                </p>
                <div className="flex items-center justify-center text-amber-400 gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-5 w-5 ${
                        s <= Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Based on {totalReviews} {totalReviews === 1 ? "reader review" : "reader reviews"}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map((starVal) => {
                  const count = reviews.filter((r) => r.rating === starVal).length;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={starVal} className="flex items-center gap-2">
                      <span className="w-12 text-slate-400 text-[11px] font-mono">
                        {starVal} Stars
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-[11px] text-slate-400 font-mono">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setReviewDialogOpen(true)}
                  variant="outline"
                  className="w-full border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs rounded-xl"
                >
                  Rate This Novel
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-border/40 bg-[#0c1018]/80 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-white text-xs">{rev.title}</span>
                      </div>

                      <span className="text-[10px] text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      “{rev.comment}”
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/30 text-[11px]">
                      <span className="font-semibold text-white">{rev.reviewerName}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <UserCheck className="h-2.5 w-2.5" /> Verified Reader
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 rounded-2xl border border-dashed border-border/60 bg-[#0c1018]/40 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/30">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">
                      No Reviews Yet
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                      Have you read <strong>{book.title}</strong>? Share your thoughts and be the first verified reader to rate this title!
                    </p>
                  </div>
                  <Button
                    onClick={() => setReviewDialogOpen(true)}
                    className="bg-gold hover:bg-gold-light text-black font-semibold text-xs rounded-xl"
                  >
                    <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" /> Write the First Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WRITE A REVIEW DIALOG */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="border border-gold/30 bg-[#0d111a] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold uppercase tracking-wider text-gold flex items-center gap-2">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span>Review {book.title}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs pt-2">
              {/* Star Selector */}
              <div className="space-y-1.5 text-center p-4 rounded-xl bg-surface/50 border border-border/40">
                <Label className="text-muted-foreground text-xs">Your Rating</Label>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= (hoverRating || userRating)
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "text-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-gold mt-1">
                  {userRating === 5 && "★★★★★ Masterpiece / 5 Stars"}
                  {userRating === 4 && "★★★★☆ Great Read / 4 Stars"}
                  {userRating === 3 && "★★★☆☆ Good Book / 3 Stars"}
                  {userRating === 2 && "★★☆☆☆ Fair / 2 Stars"}
                  {userRating === 1 && "★☆☆☆☆ Needs Work / 1 Star"}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Your Name</Label>
                <Input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Tariq Khan"
                  className="bg-surface/80 border-border/60 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Review Headline (Optional)</Label>
                <Input
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unputdownable suspense and dark lore!"
                  className="bg-surface/80 border-border/60 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Your Detailed Review</Label>
                <Textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share what you loved about the characters, pacing, and story..."
                  className="bg-surface/80 border-border/60 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewDialogOpen(false)}
                  className="border-border/60 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gold hover:bg-gold-light text-black font-semibold text-xs"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl">More {book.genre}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <BookCard key={b.slug} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
