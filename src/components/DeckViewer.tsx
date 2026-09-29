import { useCallback, useEffect, useRef, useState } from "react";
import type { Deck } from "../data";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { deck: Deck | null; onClose: () => void };

// Full-screen slide viewer: arrow keys or buttons to move, a thumbnail strip to jump.
export function DeckViewer({ deck, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(1);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (deck) {
      setSlide(1);
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
  }, [deck]);

  const go = useCallback(
    (n: number) => {
      if (!deck) return;
      setSlide(Math.min(deck.slides, Math.max(1, n)));
    },
    [deck],
  );

  useEffect(() => {
    if (!deck) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") go(slide + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(slide - 1);
      if (e.key === "Home") go(1);
      if (e.key === "End") go(deck.slides);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck, slide, go]);

  useEffect(() => {
    const thumb = stripRef.current?.querySelector<HTMLElement>(`[data-slide="${slide}"]`);
    thumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [slide]);

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-labelledby="viewer-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {deck && (
        <div className="viewer-body">
          <header className="viewer-head">
            <div>
              <h3 id="viewer-title" className="viewer-title">
                {deck.title}
              </h3>
              <p className="viewer-sub">{deck.subtitle}</p>
            </div>
            <p className="viewer-count mono" aria-live="polite">
              {pad(slide)} / {pad(deck.slides)}
            </p>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close presentation">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div
            className="viewer-stage"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(slide + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            <button
              type="button"
              className="viewer-nav viewer-prev"
              onClick={() => go(slide - 1)}
              disabled={slide === 1}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <img
              key={`${deck.id}-${slide}`}
              className="viewer-img"
              src={`/decks/${deck.id}/${pad(slide)}.jpg`}
              alt={`${deck.title}, slide ${slide} of ${deck.slides}`}
            />
            <button
              type="button"
              className="viewer-nav viewer-next"
              onClick={() => go(slide + 1)}
              disabled={slide === deck.slides}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>

          <div className="viewer-strip" ref={stripRef}>
            {Array.from({ length: deck.slides }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                data-slide={n}
                className="viewer-thumb"
                aria-current={n === slide ? "true" : undefined}
                aria-label={`Go to slide ${n}`}
                onClick={() => go(n)}
              >
                <img src={`/decks/${deck.id}/t/${pad(n)}.jpg`} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
