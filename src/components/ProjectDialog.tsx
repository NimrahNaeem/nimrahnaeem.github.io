import { useEffect, useRef } from "react";
import type { Project } from "../data";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectDialog({ project, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {project && (
        <div className="dialog-body">
          <header className="dialog-head">
            <div>
              <p className="eyebrow">{project.award ?? project.context ?? project.domains.join(" · ")}</p>
              <h3 id="dialog-title" className="dialog-title">
                {project.name}
              </h3>
              <p className="dialog-tagline">{project.tagline}</p>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close project details">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <p className="dialog-summary">{project.summary}</p>

          {project.models && (
            <section className="model-card" aria-label="Model results">
              <h4 className="label">Model card</h4>
              <div className="table-wrap">
                <table className="model-table">
                  <thead>
                    <tr>
                      <th scope="col">Task</th>
                      <th scope="col">Model</th>
                      <th scope="col">Metric</th>
                      <th scope="col" className="num">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.models.map((m) => (
                      <tr key={m.task}>
                        <td>{m.task}</td>
                        <td className="mono">{m.model}</td>
                        <td>{m.metric}</td>
                        <td className="num">
                          <div className="meter" aria-hidden="true">
                            <span style={{ width: `${m.value}%` }} />
                          </div>
                          <span className="tnum mono">{m.value}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section>
            <h4 className="label">What it does</h4>
            <ul className="points">
              {project.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="label">Stack</h4>
            <ul className="chips" aria-label="Technologies">
              {project.stack.map((s) => (
                <li key={s} className="chip chip-static">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </dialog>
  );
}
