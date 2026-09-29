import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1100 }: Props) {
  // Rests at the real value; counts up once, the first time it scrolls into view.
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(value * (1 - Math.pow(1 - t, 3)));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tnum" aria-label={`${prefix}${format(value, decimals)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {format(shown, decimals)}
        {suffix}
      </span>
    </span>
  );
}
