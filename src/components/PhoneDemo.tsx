import { useEffect, useRef, useState } from "react";
import { evascanFlows } from "../data";

// Real screen recordings from the EvaScan demo, one clip per flow, inside a phone frame.
// Selecting a flow swaps the clip; when a clip ends, the tour moves to the next flow.

export function PhoneDemo() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flow = evascanFlows[index];
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduceMotion) return;
    v.currentTime = 0;
    v.play().catch(() => {
      /* autoplay blocked: the poster frame stays visible */
    });
  }, [index, reduceMotion]);

  const pick = (i: number) => {
    setAuto(false);
    setIndex(i);
  };

  const onEnded = () => {
    if (auto) setIndex((i) => (i + 1) % evascanFlows.length);
    else videoRef.current?.play().catch(() => {});
  };

  const sides = ["Patient", "Doctor"] as const;

  return (
    <div className="demo">
      <div className="phone" aria-label={`EvaScan app: ${flow.title}`}>
        <div className="phone-notch" aria-hidden="true" />
        <video
          key={flow.id}
          ref={videoRef}
          className="phone-screen"
          src={`/evascan/${flow.id}.mp4`}
          poster={`/evascan/${flow.id}.jpg`}
          muted
          playsInline
          preload="metadata"
          onEnded={onEnded}
          aria-label={`Screen recording: ${flow.title}`}
        />
      </div>

      <div className="demo-side">
        {sides.map((side) => (
          <div key={side} className="demo-group">
            <p className="label">{side === "Patient" ? "Her side" : "Doctor's side"}</p>
            <div className="demo-tabs" role="tablist" aria-label={`${side} flows`}>
              {evascanFlows.map((f, i) =>
                f.side === side ? (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-controls="demo-panel"
                    className="demo-tab"
                    onClick={() => pick(i)}
                  >
                    {f.label}
                  </button>
                ) : null,
              )}
            </div>
          </div>
        ))}

        <div id="demo-panel" className="demo-panel" role="tabpanel" aria-live="polite">
          <p className="demo-step mono">
            {String(index + 1).padStart(2, "0")} / {String(evascanFlows.length).padStart(2, "0")}
          </p>
          <h4 className="demo-title">{flow.title}</h4>
          <p className="demo-body">{flow.body}</p>
          {flow.stat && (
            <p className="demo-stat">
              <span className="demo-stat-value">{flow.stat.value}</span>
              <span className="demo-stat-label">{flow.stat.label}</span>
            </p>
          )}
          <div className="demo-progress" aria-hidden="true">
            {evascanFlows.map((f, i) => (
              <span key={f.id} className={i === index ? "is-on" : i < index ? "is-done" : undefined} />
            ))}
          </div>
          <p className="demo-note">
            {auto ? "Playing the tour. Pick a flow to stop on it." : "Stopped on this flow."}{" "}
            {!auto && (
              <button type="button" className="link-btn" onClick={() => setAuto(true)}>
                Resume tour
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
