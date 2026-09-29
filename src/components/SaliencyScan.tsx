import { useEffect, useRef } from "react";

// Illustrative Grad-CAM style panel: a synthetic grayscale "scan" with a heat
// overlay that follows the pointer and settles back on a fixed region of interest.
// No patient data is used; the texture is generated procedurally.

const ROI = { x: 0.62, y: 0.44 };

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function makeScan(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const ny = y / h;
      // Tissue silhouette: an ellipse anchored on the left edge.
      const dx = nx / 0.95;
      const dy = (ny - 0.5) / 0.58;
      const r = Math.sqrt(dx * dx + dy * dy);
      const tissue = Math.max(0, Math.min(1, (1 - r) * 3.2));
      let n = 0;
      let amp = 0.5;
      let f = 4;
      for (let o = 0; o < 5; o++) {
        n += amp * valueNoise(nx * f + 3.1, ny * f * 1.4 + 7.7);
        amp *= 0.5;
        f *= 2;
      }
      // Fibrous streaks radiating toward the left edge.
      const streak = 0.5 + 0.5 * Math.sin(ny * 38 + n * 6 - nx * 4);
      const dist = Math.hypot(nx - ROI.x, (ny - ROI.y) * 1.2);
      const mass = Math.max(0, 1 - dist / 0.07) * 0.55;
      let g = tissue * (0.22 + 0.5 * n + 0.12 * streak) + mass * tissue;
      g = Math.max(0, Math.min(1, g));
      const i = (y * w + x) * 4;
      const c = Math.round(g * 235);
      img.data[i] = c;
      img.data[i + 1] = c;
      img.data[i + 2] = Math.min(255, c + 6);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function SaliencyScan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scan = makeScan(200, 150);
    const pos = { x: ROI.x, y: ROI.y };
    let target = { x: ROI.x, y: ROI.y };
    let raf = 0;
    let idleTimer = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(scan, 0, 0, w, h);

      const cx = pos.x * w;
      const cy = pos.y * h;
      const radius = Math.min(w, h) * 0.34;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "rgba(220, 38, 38, 0.72)");
      grad.addColorStop(0.22, "rgba(249, 115, 22, 0.6)");
      grad.addColorStop(0.42, "rgba(250, 204, 21, 0.45)");
      grad.addColorStop(0.64, "rgba(34, 211, 238, 0.3)");
      grad.addColorStop(0.84, "rgba(37, 99, 235, 0.16)");
      grad.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // Region-of-interest box, drawn like a detector's output.
      const bw = w * 0.2;
      const bh = h * 0.24;
      const bx = ROI.x * w - bw / 2;
      const by = ROI.y * h - bh / 2;
      const dpr = w / canvas.getBoundingClientRect().width || 1;
      ctx.strokeStyle = "rgba(127, 211, 208, 0.95)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.setLineDash([6 * dpr, 4 * dpr]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(127, 211, 208, 0.95)";
      ctx.font = `${11 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.fillText("ROI", bx, by - 6 * dpr);
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      draw();
      if (Math.abs(target.x - pos.x) > 0.001 || Math.abs(target.y - pos.y) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const setTarget = (x: number, y: number) => {
      target = { x, y };
      if (reduceMotion) {
        pos.x = x;
        pos.y = y;
        draw();
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      setTarget((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setTarget(ROI.x, ROI.y), 1400);
    };
    const onLeave = () => setTarget(ROI.x, ROI.y);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure className="scan">
      <div className="scan-frame">
        <canvas
          ref={canvasRef}
          className="scan-canvas"
          role="img"
          aria-label="Illustration of a Grad-CAM heatmap over a synthetic grayscale scan"
        />
        <span className="scan-tag scan-tag-tl">Grad-CAM</span>
        <span className="scan-tag scan-tag-tr">XAI</span>
      </div>
      <figcaption className="scan-caption">
        Move your cursor over the image to shift the model's attention; it settles back on the
        region of interest. Synthetic image, not patient data.
      </figcaption>
    </figure>
  );
}
