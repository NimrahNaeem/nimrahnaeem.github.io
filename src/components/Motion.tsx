import { useState } from "react";
import { motion } from "../data";

// EvaScan's case, framed as a debate motion. Each point is a "speech" step with a
// timer bar, the way a chair keeps time; the last step reads the verdict.

export function Motion() {
  const [step, setStep] = useState(0);
  const total = motion.points.length;
  const done = step >= total;
  const point = motion.points[Math.min(step, total - 1)];

  return (
    <div className="motion">
      <div className="motion-head">
        <p className="label">The motion</p>
        <blockquote className="motion-text">{motion.text}</blockquote>
        <p className="motion-side">
          <span className="motion-chip">Proposition</span> Nimrah Naeem, Best English Debater, NUST EME Olympiad 2023
        </p>
      </div>

      <div className="motion-case">
        <ol className="motion-steps" aria-label="Points of the case">
          {motion.points.map((p, i) => (
            <li key={p.heading}>
              <button
                type="button"
                className="motion-step"
                aria-current={!done && i === step ? "step" : undefined}
                data-state={i < step || done ? "done" : i === step ? "on" : "off"}
                onClick={() => setStep(i)}
              >
                <span className="motion-step-n mono">{i + 1}</span>
                {p.heading}
              </button>
            </li>
          ))}
        </ol>

        <div className="motion-card" aria-live="polite">
          {done ? (
            <div className="motion-verdict">
              <p className="label">The house divides</p>
              <p className="motion-verdict-line">{motion.verdict}</p>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>
                Hear it again
              </button>
            </div>
          ) : (
            <>
              <div className="motion-timer" aria-hidden="true">
                <span key={step} />
              </div>
              <p className="motion-line">“{point.line}”</p>
              <p className="motion-detail">{point.detail}</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>
                {step === total - 1 ? "Call the vote" : "Next point"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
