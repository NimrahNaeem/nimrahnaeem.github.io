import { useEffect, useMemo, useState } from "react";
import {
  awards,
  decks,
  evascanModels,
  experience,
  medals,
  metrics,
  papers,
  prisma,
  profile,
  projects,
  skills,
  type Deck,
} from "./data";
import { CountUp } from "./components/CountUp";
import { DeckViewer } from "./components/DeckViewer";
import { Medal } from "./components/Medal";
import { Motion } from "./components/Motion";
import { PhoneDemo } from "./components/PhoneDemo";

const sections = [
  { id: "evascan", label: "EvaScan" },
  { id: "motion", label: "The motion" },
  { id: "work", label: "Work" },
  { id: "decks", label: "Presentations" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

type Theme = "light" | "dark";

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
      /* storage unavailable: the theme still applies for this visit */
    }
    setTheme(next);
  };
  return { theme, toggle };
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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

function Ribbon({ className = "" }: { className?: string }) {
  return <img className={`ribbon-logo ${className}`} src="/evascan/logo.png" alt="" width="44" height="44" />;
}

export default function App() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection(useMemo(() => sections.map((s) => s.id), []));
  const [menuOpen, setMenuOpen] = useState(false);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [roleId, setRoleId] = useState(experience[0].id);
  const [prismaStep, setPrismaStep] = useState(prisma.length - 1);
  const [copied, setCopied] = useState(false);

  const role = experience.find((r) => r.id === roleId) ?? experience[0];
  const openDeck = (id: string) => setDeck(decks.find((d) => d.id === id) ?? null);

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
              N
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
        {/* ---------- Hero ---------- */}
        <section className="hero wrap" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {profile.current}
            </p>
            <h1 className="hero-name">
              Nimrah <span>Naeem</span>
            </h1>
            <p className="hero-motto">{profile.motto}</p>
            <p className="hero-bio">{profile.bio}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#evascan">
                Try EvaScan
              </a>
              <a className="btn btn-ghost" href="#decks">
                See my decks
              </a>
              <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <p className="hero-meta">
              AI & ML Engineer · Debater · {profile.location}
            </p>
          </div>

          <div className="hero-medals">
            <div className="medals">
              {medals.map((m, i) => (
                <Medal key={m.id} medal={m} delay={i * 180} />
              ))}
            </div>
            <p className="medals-caption">Two gold medals, Institute of Space Technology. Tap one to turn it over.</p>
          </div>
        </section>

        <section className="wrap" aria-label="Highlights">
          <dl className="metrics">
            {metrics.map((m) => (
              <div key={m.label} className="metric">
                <dt className="metric-label">{m.label}</dt>
                <dd className="metric-value">
                  <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- EvaScan ---------- */}
        <section className="evascan" id="evascan" aria-labelledby="evascan-title">
          <div className="wrap">
            <div className="eva-head">
              <div className="eva-brand">
                <Ribbon />
                <div>
                  <h2 id="evascan-title" className="eva-word">
                    EvaScan
                  </h2>
                  <p className="eva-sub">AI-powered breast cancer screening & care</p>
                </div>
              </div>
              <p className="eva-badge">
                <span aria-hidden="true">★</span> Best FYP · Gold Medal, IST
              </p>
            </div>

            <p className="eva-thesis">
              What if hope could fit right in the palm of her hand?
            </p>
            <p className="eva-lede">
              In Pakistan, 1 in 9 women is at risk of breast cancer, and too many are diagnosed too late. EvaScan brings
              early detection to the phone she already carries: mammogram and ultrasound analysis, risk prediction and a
              guided self-exam, with AI that shows why it flagged something.
            </p>

            <PhoneDemo />

            <div className="eva-grid">
              <div className="eva-card">
                <p className="label">Model card</p>
                <ul className="eva-models">
                  {evascanModels.map((m) => (
                    <li key={m.task}>
                      <div className="eva-model-row">
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
                <p className="eva-foot">Trained across 5,000+ medical images from public datasets.</p>
              </div>
              <div className="eva-card">
                <p className="label">Team</p>
                <p className="eva-team">
                  Built by <strong>Nimrah Naeem</strong> and <strong>Ikram Ullah Qazi</strong>, supervised by{" "}
                  <strong>Dr. Altaf Hussain</strong>, KICSIT, Institute of Space Technology.
                </p>
                <p className="eva-team muted">
                  My focus: the AI. YOLOv8 detection, the ensemble ultrasound classifier, the DNN risk model and the
                  Grad-CAM / saliency explainability.
                </p>
                <div className="eva-links">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openDeck("evascan-pitch")}>
                    Open the pitch deck
                  </button>
                  <a className="btn btn-ghost btn-sm" href="/evascan/poster.jpg" target="_blank" rel="noreferrer">
                    View the poster
                  </a>
                </div>
              </div>
            </div>

            <div className="poster-scroll" tabIndex={0} aria-label="EvaScan poster, scroll sideways">
              <img src="/evascan/poster.jpg" alt="EvaScan poster: breast cancer facts, target users, statistics, core benefits and SDG alignment" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ---------- The motion ---------- */}
        <section className="section wrap" id="motion" aria-label="The motion">
          <Motion />
        </section>

        {/* ---------- Work ---------- */}
        <section className="section wrap" id="work" aria-labelledby="work-title">
          <div className="section-head">
            <p className="eyebrow">Work</p>
            <h2 id="work-title">From research to production</h2>
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
                {role.title} <span className="exp-at">· {role.org}</span>
              </h3>
              <p className="exp-meta mono">
                {role.period} · {role.place}
              </p>
              <ul className="points">
                {role.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="projects">
            {projects.map((p) => (
              <article key={p.id} className={`project project-${p.id}`}>
                {p.cover && (
                  <button type="button" className="project-cover" onClick={() => p.deck && openDeck(p.deck)}>
                    <img src={p.cover} alt={`${p.name} deck cover`} loading="lazy" />
                    <span className="project-cover-cta">Open the deck</span>
                  </button>
                )}
                <div className="project-body">
                  <p className="eyebrow">{p.tagline}</p>
                  <h3 className="project-name">{p.name}</h3>
                  <p>{p.summary}</p>
                  <ul className="points">
                    {p.points.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <ul className="chips" aria-label="Technologies">
                    {p.stack.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Presentations ---------- */}
        <section className="section wrap" id="decks" aria-labelledby="decks-title">
          <div className="section-head">
            <p className="eyebrow">Presentations</p>
            <h2 id="decks-title">The decks behind the work</h2>
            <p className="section-lede">
              Pitches and defences I've presented. Open one and page through it with the arrow keys or by swiping.
            </p>
          </div>
          <ul className="deck-shelf">
            {decks.map((d) => (
              <li key={d.id}>
                <button type="button" className="deck" onClick={() => setDeck(d)}>
                  <span className="deck-cover">
                    <img src={d.cover} alt="" loading="lazy" />
                    <span className="deck-count mono">{d.slides} slides</span>
                  </span>
                  <span className="deck-title">{d.title}</span>
                  <span className="deck-sub">{d.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Research ---------- */}
        <section className="section wrap" id="research" aria-labelledby="research-title">
          <div className="section-head">
            <p className="eyebrow">Research</p>
            <h2 id="research-title">AI in medical diagnosis</h2>
            <p className="section-lede">
              EvaScan started as a systematic literature review. Select a stage to see how 570 papers became 160.
            </p>
          </div>

          <div className="research">
            <ol className="prisma" aria-label="PRISMA flow of the systematic review">
              {prisma.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    className="prisma-row"
                    aria-pressed={i === prismaStep}
                    onClick={() => setPrismaStep(i)}
                  >
                    <span className="prisma-bar" style={{ width: `${(s.n / prisma[0].n) * 100}%` }} />
                    <span className="prisma-n mono tnum">{s.n}</span>
                    <span className="prisma-label">{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="prisma-note" aria-live="polite">
              <p className="label">{prisma[prismaStep].label}</p>
              <p className="prisma-note-n tnum">{prisma[prismaStep].n}</p>
              <p>{prisma[prismaStep].note}</p>
            </div>
          </div>

          <ul className="papers">
            {papers.map((p) => (
              <li key={p.title} className="paper">
                <p className="label">{p.kind}</p>
                <h3 className="paper-title">{p.title}</h3>
                <p className="pill">{p.status}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Recognition & skills ---------- */}
        <section className="section wrap" aria-labelledby="more-title">
          <div className="section-head">
            <p className="eyebrow">Beyond the medals</p>
            <h2 id="more-title">Recognition & toolkit</h2>
          </div>
          <div className="more">
            <ul className="awards">
              {awards.map((a) => (
                <li key={a.title} className="award">
                  <span className="rosette" aria-hidden="true" />
                  <div>
                    <h3 className="award-title">{a.title}</h3>
                    <p className="award-detail">
                      {a.where}
                      {a.year && ` · ${a.year}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="skills">
              {skills.map((g) => (
                <div key={g.group} className="skill-group">
                  <p className="label">{g.group}</p>
                  <ul className="chips">
                    {g.items.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="section wrap" id="contact" aria-labelledby="contact-title">
          <div className="contact">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Let's build something that matters.</h2>
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
          <span className="muted">One tap. One woman. One future.</span>
        </div>
      </footer>

      <DeckViewer deck={deck} onClose={() => setDeck(null)} />
    </>
  );
}
