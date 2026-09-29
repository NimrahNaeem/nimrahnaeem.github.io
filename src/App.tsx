import { useEffect, useMemo, useState } from "react";
import {
  achievements,
  education,
  experience,
  metrics,
  profile,
  projects,
  research,
  skillGroups,
  type Domain,
  type Project,
} from "./data";
import { CountUp } from "./components/CountUp";
import { ProjectDialog } from "./components/ProjectDialog";
import { SaliencyScan } from "./components/SaliencyScan";

const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

type Theme = "light" | "dark";
type Filter = { kind: "domain"; value: Domain } | { kind: "skill"; value: string } | null;

const norm = (s: string) => s.toLowerCase();

function projectUses(p: Project, skill: string) {
  const s = norm(skill);
  return [...p.stack, ...p.domains, ...(p.also ?? [])].some((x) => norm(x) === s);
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const set = document.documentElement.dataset.theme;
    if (set === "light" || set === "dark") return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
    setTheme(next);
  };
  return { theme, toggle };
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export default function App() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection(useMemo(() => sections.map((s) => s.id), []));
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleId, setRoleId] = useState(experience[0].id);
  const [filter, setFilter] = useState<Filter>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);

  const role = experience.find((r) => r.id === roleId) ?? experience[0];
  const domains = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.domains))), []);

  const shownProjects = projects.filter((p) => {
    if (!filter) return true;
    if (filter.kind === "domain") return p.domains.includes(filter.value);
    return projectUses(p, filter.value);
  });

  const pickSkill = (skill: string) => {
    setFilter({ kind: "skill", value: skill });
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.getElementById("email-text");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top" aria-label="Nimrah Naeem, back to top">
            <span className="brand-mark" aria-hidden="true">
              NN
            </span>
            <span className="brand-name">Nimrah Naeem</span>
          </a>

          <nav className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="Sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={active === s.id ? "is-active" : undefined}
                aria-current={active === s.id ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="hero wrap" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {profile.current}
            </p>
            <h1 className="hero-title">
              I build AI that can <em>explain</em> what it sees.
            </h1>
            <p className="hero-lede">{profile.summary}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View projects
              </a>
              <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
            <p className="hero-meta">
              {profile.role} · {profile.location}
            </p>
          </div>
          <SaliencyScan />
        </section>

        {/* Metrics */}
        <section className="wrap" aria-label="Highlights">
          <dl className="metrics">
            {metrics.map((m) => (
              <div key={m.label} className="metric">
                <dt className="metric-label">{m.label}</dt>
                <dd className="metric-value">
                  <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Experience */}
        <section className="section wrap" id="experience" aria-labelledby="experience-title">
          <div className="section-head">
            <p className="eyebrow">Experience</p>
            <h2 id="experience-title">Research to production</h2>
          </div>

          <div className="exp">
            <div className="exp-tabs" role="tablist" aria-label="Roles">
              {experience.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  id={`tab-${r.id}`}
                  aria-selected={r.id === roleId}
                  aria-controls="exp-panel"
                  className="exp-tab"
                  onClick={() => setRoleId(r.id)}
                >
                  <span className="exp-tab-org">{r.org}</span>
                  <span className="exp-tab-period mono">{r.period}</span>
                </button>
              ))}
            </div>
            <div className="exp-panel" role="tabpanel" id="exp-panel" aria-labelledby={`tab-${role.id}`}>
              <h3 className="exp-title">
                {role.title} <span className="exp-at">at {role.org}</span>
              </h3>
              <p className="exp-meta mono">
                {role.period} · {role.place}
              </p>
              <ul className="points">
                {role.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {role.stack && (
                <ul className="chips" aria-label="Technologies">
                  {role.stack.map((s) => (
                    <li key={s} className="chip chip-static">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="edu">
            <p className="label">Education</p>
            <p className="edu-line">
              <strong>{education.degree}</strong>, {education.school}
            </p>
            <p className="edu-meta mono">
              {education.period} · {education.result}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="section wrap" id="projects" aria-labelledby="projects-title">
          <div className="section-head">
            <p className="eyebrow">Projects</p>
            <h2 id="projects-title">Selected work</h2>
          </div>

          <div className="filters" role="group" aria-label="Filter projects">
            <button
              type="button"
              className="chip"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
            >
              All
            </button>
            {domains.map((d) => (
              <button
                key={d}
                type="button"
                className="chip"
                aria-pressed={filter?.kind === "domain" && filter.value === d}
                onClick={() => setFilter({ kind: "domain", value: d })}
              >
                {d}
              </button>
            ))}
            {filter?.kind === "skill" && (
              <button type="button" className="chip chip-skill" aria-pressed="true" onClick={() => setFilter(null)}>
                Uses {filter.value}
                <span aria-hidden="true"> ×</span>
                <span className="sr-only">, clear filter</span>
              </button>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {shownProjects.length} of {projects.length} projects
          </p>

          <div className="projects">
            {shownProjects.map((p) => (
              <article key={p.id} className={`project ${p.models ? "project-featured" : ""}`}>
                <div className="project-top">
                  <p className="eyebrow">{p.award ?? p.context ?? p.domains.join(" · ")}</p>
                  <h3 className="project-name">{p.name}</h3>
                  <p className="project-tagline">{p.tagline}</p>
                </div>
                <p className="project-summary">{p.summary}</p>

                {p.models && (
                  <ul className="bars" aria-label="Model results">
                    {p.models.map((m) => (
                      <li key={m.task} className="bar">
                        <div className="bar-row">
                          <span>
                            {m.task} <span className="mono muted">· {m.model}</span>
                          </span>
                          <span className="mono tnum">
                            {m.value}% <span className="muted">{m.metric.toLowerCase()}</span>
                          </span>
                        </div>
                        <div className="meter" aria-hidden="true">
                          <span style={{ width: `${m.value}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <ul className="chips chips-sm" aria-label="Technologies">
                  {p.stack.slice(0, 5).map((s) => (
                    <li key={s} className="chip chip-static">
                      {s}
                    </li>
                  ))}
                  {p.stack.length > 5 && <li className="chip chip-static muted">+{p.stack.length - 5}</li>}
                </ul>

                <button type="button" className="project-open" onClick={() => setOpenProject(p)}>
                  View details
                  <span aria-hidden="true"> →</span>
                  <span className="sr-only"> about {p.name}</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Research */}
        <section className="section wrap" id="research" aria-labelledby="research-title">
          <div className="section-head">
            <p className="eyebrow">Research</p>
            <h2 id="research-title">AI in medical diagnosis</h2>
            <p className="section-lede">
              As a Research Assistant at IST, I analysed 150+ studies and co-authored two review papers with faculty
              researchers.
            </p>
          </div>
          <ul className="papers">
            {research.map((r) => (
              <li key={r.title} className="paper">
                <p className="label">{r.kind}</p>
                <h3 className="paper-title">{r.title}</h3>
                <p className="pill">{r.status}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section className="section wrap" id="skills" aria-labelledby="skills-title">
          <div className="section-head">
            <p className="eyebrow">Skills</p>
            <h2 id="skills-title">Toolkit</h2>
            <p className="section-lede">Select a skill to see the projects that use it.</p>
          </div>
          <div className="skills">
            {skillGroups.map((g) => (
              <div key={g.name} className="skill-group">
                <h3 className="label">{g.name}</h3>
                <ul className="chips">
                  {g.items.map((s) => {
                    const count = projects.filter((p) => projectUses(p, s)).length;
                    return (
                      <li key={s}>
                        {count > 0 ? (
                          <button type="button" className="chip" onClick={() => pickSkill(s)}>
                            {s}
                            <span className="chip-count mono" aria-label={`${count} projects`}>
                              {count}
                            </span>
                          </button>
                        ) : (
                          <span className="chip chip-static">{s}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="section wrap" aria-labelledby="awards-title">
          <div className="section-head">
            <p className="eyebrow">Recognition</p>
            <h2 id="awards-title">Achievements</h2>
          </div>
          <ul className="awards">
            {achievements.map((a) => (
              <li key={a.title} className="award">
                <h3 className="award-title">{a.title}</h3>
                <p className="award-detail">{a.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="section wrap" id="contact" aria-labelledby="contact-title">
          <div className="contact">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Let's work together</h2>
              <p className="section-lede">
                Open to collaborations in AI research, medical imaging and production ML systems.
              </p>
            </div>
            <div className="contact-list">
              <div className="contact-row">
                <span className="label">Email</span>
                <a id="email-text" className="contact-value" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copyEmail}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="contact-row">
                <span className="label">LinkedIn</span>
                <a className="contact-value" href={profile.linkedin} target="_blank" rel="noreferrer">
                  linkedin.com/in/nimrah-naeem
                </a>
              </div>
              <div className="contact-row">
                <span className="label">GitHub</span>
                <a className="contact-value" href={profile.github} target="_blank" rel="noreferrer">
                  github.com/NimrahNaeem
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>© {new Date().getFullYear()} Nimrah Naeem</span>
          <span className="muted">{profile.location}</span>
        </div>
      </footer>

      <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />
    </>
  );
}
