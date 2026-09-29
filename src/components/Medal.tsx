import { useRef, useState } from "react";
import type { Medal as MedalData } from "../data";

// A struck-gold medal on a ribbon. It tilts toward the pointer (the shine follows)
// and turns over on click to show what it was awarded for.

function Laurel({ side }: { side: "l" | "r" }) {
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  return (
    <g transform={side === "r" ? "translate(200 0) scale(-1 1)" : undefined}>
      <path d="M58 150 C 38 124, 36 84, 56 52" fill="none" stroke="var(--gold-deep)" strokeWidth="2.2" strokeLinecap="round" />
      {leaves.map((i) => {
        const t = i / 6;
        const x = 58 - Math.sin(t * Math.PI) * 18 + (1 - t) * 2 - t * 4;
        const y = 148 - t * 94;
        const rot = -30 - t * 40;
        return (
          <ellipse
            key={i}
            cx={x - 6}
            cy={y}
            rx="7.5"
            ry="3.4"
            transform={`rotate(${rot} ${x - 6} ${y})`}
            fill="var(--gold-deep)"
            opacity="0.85"
          />
        );
      })}
    </g>
  );
}

export function Medal({ medal, delay = 0 }: { medal: MedalData; delay?: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [flipped, setFlipped] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 18).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 22).toFixed(2)}deg`);
    el.style.setProperty("--sx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--sy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--sx", "30%");
    el.style.setProperty("--sy", "25%");
  };

  return (
    <div className="medal-hang" style={{ animationDelay: `${delay}ms` }}>
      <div className="medal-ribbon" aria-hidden="true">
        <span />
        <span />
      </div>
      <button
        ref={ref}
        type="button"
        className={`medal ${flipped ? "is-flipped" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`Gold medal: ${medal.title}. ${medal.detail}. Select to turn over.`}
      >
        <span className="medal-inner">
          <span className="medal-face medal-front">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="84" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" opacity="0.7" />
              <circle cx="100" cy="100" r="76" fill="none" stroke="var(--gold-deep)" strokeWidth="0.8" strokeDasharray="1.5 3.5" opacity="0.8" />
              <Laurel side="l" />
              <Laurel side="r" />
              <text x="100" y="62" textAnchor="middle" className="medal-small">
                GOLD MEDAL
              </text>
              <text x="100" y="116" textAnchor="middle" className={medal.face.length > 3 ? "medal-big" : "medal-big medal-big-word"}>
                {medal.face}
              </text>
              <text x="100" y="148" textAnchor="middle" className="medal-small">
                IST
              </text>
            </svg>
          </span>
          <span className="medal-face medal-back">
            <span className="medal-back-title">{medal.title}</span>
            <span className="medal-back-detail">{medal.detail}</span>
          </span>
          <span className="medal-shine" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
