import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import {
  PROFILE,
  SOCIALS,
  PROJECTS,
  PROJECT_FILTERS,
  SKILLS,
  STATS,
  NAV_LINKS,
  HERO_VIDEO,
  HERO_POSTER,
} from "./data";
import type { Project, ProjectCategoryId } from "./data";

/* ---------------------------------------------------------------------- */
/* Utilities                                                               */
/* ---------------------------------------------------------------------- */

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

const CATEGORY_LABEL: Record<ProjectCategoryId, string> = {
  web: "Web",
  python: "Python",
  cpp: "C++",
  other: "Other",
};

type Toast = { id: number; msg: string; kind: "success" | "error" };
type Notify = (msg: string, kind?: Toast["kind"]) => void;

/* ---------------------------------------------------------------------- */
/* App                                                                     */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [theme, setTheme] = useState<string>(
    () => document.documentElement.dataset.theme || "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  /* Toasts -------------------------------------------------------------- */
  const notify = useCallback<Notify>((msg, kind = "success") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  /* Theme --------------------------------------------------------------- */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem("junction-theme", next);
      } catch {
        /* storage unavailable — session-only theme */
      }
      return next;
    });
  }, []);

  /* Header scroll state --------------------------------------------------- */
  useEffect(() => {
    const header = document.querySelector(".header");
    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy ------------------------------------------------------------ */
  useEffect(() => {
    const ids = [...NAV_LINKS.map((l) => l.id), "stats", "resume"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Reveal-on-scroll ------------------------------------------------------- */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Mobile menu lifecycle -------------------------------------------------- */
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstMenuLinkRef.current?.focus(), 220);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const copyProfileUrl = useCallback(async () => {
    const url = window.location.origin + window.location.pathname;
    const ok = await copyText(url);
    notify(ok ? "Profile link copied" : "Couldn't copy — press Ctrl+C on the URL", ok ? "success" : "error");
  }, [notify]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        active={active}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        onCloseMenu={closeMenu}
        toggleRef={menuToggleRef}
        firstLinkRef={firstMenuLinkRef}
      />

      <main id="main">
        <Hero notify={notify} onCopyUrl={copyProfileUrl} />
        <About />
        <SocialHub notify={notify} />
        <Projects />
        <SkillsSection />
        <StatsSection />
        <ResumeCta />
        <Contact notify={notify} />
      </main>

      <Footer />

      <Toasts toasts={toasts} />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Header + mobile menu                                                    */
/* ---------------------------------------------------------------------- */

function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      className="brand__mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill="var(--text)" />
      <path
        d="M40 15 v26 a13 13 0 0 1 -26 0"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="47" r="3" fill="var(--accent)" />
    </svg>
  );
}

interface HeaderProps {
  theme: string;
  onToggleTheme: () => void;
  active: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
}

function Header({
  theme,
  onToggleTheme,
  active,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  toggleRef,
  firstLinkRef,
}: HeaderProps) {
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a className="brand" href="#main" aria-label="Junction — Nexora profile, back to top">
            <BrandMark />
            <span>Junction</span>
            <span className="brand__sub">/ nexora</span>
          </a>

          <nav className="nav-desktop" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={active === l.id ? "is-active" : undefined}
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={onToggleTheme}
              aria-pressed={theme === "light"}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              type="button"
              ref={toggleRef}
              className="menu-toggle"
              onClick={onToggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobileMenu"
        className={menuOpen ? "menu open" : "menu"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) onCloseMenu();
        }}
      >
        <nav className="menu__links" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              ref={i === 0 ? firstLinkRef : undefined}
              href={`#${l.id}`}
              onClick={onCloseMenu}
              style={{ "--i": i } as CSSProperties}
            >
              <span className="idx">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu__meta" style={{ "--i": NAV_LINKS.length } as CSSProperties}>
          <span className="wrap-anywhere">{PROFILE.shortUrl}</span>
          <a className="wrap-anywhere" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Hero                                                                    */
/* ---------------------------------------------------------------------- */

function Hero({ notify, onCopyUrl }: { notify: Notify; onCopyUrl: () => void }) {
  const [avatarOk, setAvatarOk] = useState(true);

  const copyEmail = useCallback(async () => {
    const ok = await copyText(PROFILE.email);
    notify(ok ? "Email copied to clipboard" : "Copy failed — select the address manually", ok ? "success" : "error");
  }, [notify]);

  return (
    <section className="hero" aria-label="Profile overview">
      <div className="hero__media">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          src={HERO_VIDEO}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <div className="container hero__inner">
        <div>
          <div className="hero__id">
            <div className="avatar">
              <span className="avatar__fallback" aria-hidden="true">
                N
              </span>
              {avatarOk && (
                <img
                  src={PROFILE.avatar}
                  alt={PROFILE.avatarAlt}
                  width={122}
                  height={122}
                  loading="eager"
                  onError={() => setAvatarOk(false)}
                />
              )}
            </div>
            <div className="hero__id-text">
              <p className="hero__kicker">Junction · Public profile</p>
              <h1>{PROFILE.name}</h1>
            </div>
          </div>

          <div className="hero__handle">
            <span>{PROFILE.handle}</span>
            <span aria-hidden="true">·</span>
            <span className="url">{PROFILE.shortUrl}</span>
          </div>

          <p className="hero__bio">{PROFILE.bio}</p>

          <div className="hero__meta">
            <span className="place">
              <MapPin size={14} aria-hidden="true" />
              {PROFILE.location}
            </span>
            <span className="status">
              <span className="status__dot" aria-hidden="true" />
              {PROFILE.status}
            </span>
          </div>

          <div className="hero__cta">
            <a
              className="btn btn--solid"
              href={PROFILE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={16} aria-hidden="true" />
              View resume
            </a>
            <a className="btn btn--ghost" href="#contact">
              Contact
            </a>
            <button
              type="button"
              className="btn btn--ghost btn--icon-only"
              onClick={onCopyUrl}
              aria-label="Copy profile link"
            >
              <Copy size={16} aria-hidden="true" />
              Copy link
            </button>
          </div>

          <div className="hero__socials" aria-label="Quick social links">
            {SOCIALS.filter((s) => s.label !== "Email").map((s) => (
              <a
                key={s.label}
                className="icon-btn"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} — ${s.handle}`}
              >
                <s.icon size={17} />
              </a>
            ))}
            <button
              type="button"
              className="icon-btn"
              onClick={copyEmail}
              aria-label={`Copy email address — ${PROFILE.email}`}
            >
              <Mail size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="hero__side" aria-label="Quick facts">
          <div className="row">
            <span className="k">Profile</span>
            <span className="v">{PROFILE.shortUrl}</span>
          </div>
          <div className="row">
            <span className="k">Mail</span>
            <span className="v">{PROFILE.email}</span>
          </div>
          <div className="row">
            <span className="k">Timezone</span>
            <span className="v">UTC +5:30 · IST</span>
          </div>
          <div className="row">
            <span className="k">Focus</span>
            <span className="v">Web platforms · Systems</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Section shell                                                           */
/* ---------------------------------------------------------------------- */

interface SectionProps {
  id: string;
  index: string;
  kicker: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}

function Section({ id, index, kicker, title, sub, children }: SectionProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head reveal">
          <p className="kicker">
            {index} — {kicker}
          </p>
          <h2 className="section-title" id={`${id}-title`}>
            {title}
          </h2>
          {sub ? <p className="section-sub">{sub}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* About                                                                   */
/* ---------------------------------------------------------------------- */

function About() {
  return (
    <Section
      id="about"
      index="01"
      kicker="About"
      title="A builder first, a student by timetable."
    >
      <div className="about__grid">
        <div className="about__prose reveal">
          <p>
            I'm a third-year BCA student who got hooked the first time a terminal printed back
            something I asked for. Since then I've been shipping small, honest software —{" "}
            <strong>campus tools classmates actually use</strong>, CLI utilities that scratch my
            own itch, and a ray tracer to prove to myself the math isn't magic.
          </p>
          <p>
            My happy place is the seam between <strong>product and systems</strong>: designing an
            interface in the morning, then profiling the query that's slowing it down after lunch.
            I keep my stack boring on purpose and my side-projects weird on purpose.
          </p>
          <p>
            Right now I'm going deeper on distributed systems and accessibility, and looking for a
            summer internship where I can ship real things next to people who code better than me.
          </p>
        </div>

        <dl className="about__facts reveal">
          <div className="fact">
            <dt>Education</dt>
            <dd>BCA · 2023–2026</dd>
          </div>
          <div className="fact">
            <dt>Based in</dt>
            <dd>Jaipur, Rajasthan</dd>
          </div>
          <div className="fact">
            <dt>Learning</dt>
            <dd>Distributed systems</dd>
          </div>
          <div className="fact">
            <dt>Community</dt>
            <dd>Campus dev-club lead</dd>
          </div>
          <div className="fact">
            <dt>Open to</dt>
            <dd>Internships · OSS · Collabs</dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Social hub                                                              */
/* ---------------------------------------------------------------------- */

function SocialHub({ notify }: { notify: Notify }) {
  const copyHandle = useCallback(
    async (text: string, label: string) => {
      const ok = await copyText(text);
      notify(ok ? `${label} copied` : "Copy failed — long-press to copy manually", ok ? "success" : "error");
    },
    [notify]
  );

  return (
    <Section
      id="links"
      index="02"
      kicker="Links"
      title="One hub, every profile."
      sub="Wherever you found me from — this is the canonical list. Anything not here probably isn't me."
    >
      <ul className="links__grid reveal">
        {SOCIALS.map((s) => {
          const external = !s.href.startsWith("mailto:");
          const body = (
            <>
              <span className="link-card__icon" aria-hidden="true">
                <s.icon size={19} />
              </span>
              <span className="link-card__body">
                <span className="link-card__label" style={{ display: "block" }}>
                  {s.label}
                </span>
                <span className="link-card__handle wrap-anywhere" style={{ display: "block" }}>
                  {s.handle}
                </span>
              </span>
            </>
          );

          /* Email card embeds a copy button, so the card itself can't be a link */
          if (s.copy) {
            return (
              <li key={s.label}>
                <div className="link-card">
                  <a
                    className="link-card__main"
                    href={s.href}
                    aria-label={`${s.label} — ${s.handle}`}
                  >
                    {body}
                  </a>
                  <button
                    type="button"
                    className="icon-btn link-card__copy"
                    onClick={() => void copyHandle(s.copy!, s.label)}
                    aria-label={`Copy ${s.label} address`}
                  >
                    <Copy size={15} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li key={s.label}>
              <a
                className="link-card"
                href={s.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`${s.label} — ${s.handle}`}
              >
                {body}
                <ArrowUpRight className="link-card__arrow" size={18} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Projects                                                                */
/* ---------------------------------------------------------------------- */

function ProjectCard({ project }: { project: Project }) {
  const [imgOk, setImgOk] = useState(true);
  const category = CATEGORY_LABEL[project.category] ?? "Other";

  return (
    <li>
      <article className="project">
        <div className="project__media">
          <span className="project__cat">{category}</span>
          {!imgOk && (
            <div className="project__media-fallback" aria-hidden="true">
              <Code2 size={30} />
            </div>
          )}
          {imgOk && (
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              decoding="async"
              width={640}
              height={400}
              onError={() => setImgOk(false)}
            />
          )}
        </div>

        <div className="project__body">
          <h3 className="project__name">
            <Code2 size={16} aria-hidden="true" />
            {project.name}
            <span className="sr-only"> — {project.tagline}</span>
          </h3>
          <p className="project__desc">
            <strong>{project.tagline}. </strong>
            {project.description}
          </p>
          <ul className="project__tags" aria-label="Technologies used">
            {project.stack.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <div className="project__actions">
            <a
              className="btn btn--ghost"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} — source code on GitHub`}
            >
              Source
            </a>
            <a
              className="btn btn--solid"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} — live demo`}
            >
              Live
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    </li>
  );
}

function Projects() {
  const [filter, setFilter] = useState<"all" | ProjectCategoryId>("all");

  const counts = PROJECT_FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f.id] = f.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f.id).length;
    return acc;
  }, {});

  const visible = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const activeLabel = PROJECT_FILTERS.find((f) => f.id === filter)?.label ?? "this category";

  return (
    <Section
      id="projects"
      index="03"
      kicker="Projects"
      title="Featured work"
      sub="Six things I built, shipped and still maintain — filtered by the stack they run on."
    >
      <div className="filters reveal" role="group" aria-label="Filter projects by category">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="filter-btn"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="count" aria-hidden="true">
              {String(counts[f.id]).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="projects__grid reveal in">
          {visible.map((p) => (
            <ProjectCard key={`${filter}-${p.id}`} project={p} />
          ))}
        </ul>
      ) : (
        <div className="projects__empty">
          <p>Nothing filed under “{activeLabel}” yet — it’s on the whiteboard.</p>
          <button type="button" className="btn btn--ghost" onClick={() => setFilter("all")}>
            Show all projects
          </button>
        </div>
      )}
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Skills                                                                  */
/* ---------------------------------------------------------------------- */

function SkillsSection() {
  return (
    <Section
      id="skills"
      index="04"
      kicker="Skills"
      title="Tools I reach for daily."
      sub="No progress bars — either I ship with it regularly, or it isn’t listed."
    >
      <ul className="skills__grid">
        {SKILLS.map((g, i) => (
          <li key={g.title} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="skill-card">
              <div className="skill-card__head">
                <g.icon size={19} aria-hidden="true" />
                <h3 className="skill-card__title">{g.title}</h3>
              </div>
              <p className="skill-card__note">{g.note}</p>
              <ul className="skill-card__items">
                {g.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Stats                                                                   */
/* ---------------------------------------------------------------------- */

function StatsSection() {
  return (
    <Section
      id="stats"
      index="05"
      kicker="Stats"
      title="The honest numbers."
      sub="Pulled from commit history and shipment logs — modest, but all mine."
    >
      <dl className="stats__grid">
        {STATS.map((s, i) => (
          <div key={s.label} className="stat reveal" style={{ transitionDelay: `${i * 60}ms` }}>
            <dt className="stat__label">{s.label}</dt>
            <dd className="stat__value">{s.value}</dd>
            <dd className="stat__hint">{s.hint}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Resume CTA                                                              */
/* ---------------------------------------------------------------------- */

function ResumeCta() {
  return (
    <Section id="resume" index="06" kicker="Resume" title="Prefer one page?">
      <div className="resume reveal">
        <div>
          <h3 className="resume__title">One page. Everything relevant, nothing inflated.</h3>
          <p className="resume__text">
            Education, projects, skills and the same honest numbers from above — formatted to be
            read by a human in ninety seconds, and by an ATS without crying.
          </p>
          <p className="resume__note">PDF-ready · print straight from the browser</p>
        </div>
        <div className="resume__actions">
          <a
            className="btn btn--solid"
            href={PROFILE.resumePath}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={16} aria-hidden="true" />
            Open resume
          </a>
          <a className="btn btn--ghost" href={`mailto:${PROFILE.email}?subject=Resume%20—%20Nexora`}>
            Request a PDF
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Contact                                                                 */
/* ---------------------------------------------------------------------- */

function Contact({ notify }: { notify: Notify }) {
  const copyEmail = useCallback(async () => {
    const ok = await copyText(PROFILE.email);
    notify(ok ? "Email copied to clipboard" : "Copy failed — select the address manually", ok ? "success" : "error");
  }, [notify]);

  return (
    <Section id="contact" index="07" kicker="Contact" title="Say hello.">
      <div className="contact__grid">
        <div className="reveal">
          <h3 className="contact__heading">Let’s build something worth shipping.</h3>
          <p className="contact__text">
            Internship offers, OSS issues, project collabs, or just a good ray-tracing debate —
            my inbox is the fastest route. If it’s urgent, say so in the subject and I’ll move
            faster than my GPA allows.
          </p>
        </div>

        <div className="contact__card reveal">
          <span className="kicker" style={{ marginBottom: 0 }}>
            Direct line
          </span>
          <a className="contact__email" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
          <div className="contact__actions">
            <button type="button" className="btn btn--solid" onClick={copyEmail}>
              <Copy size={15} aria-hidden="true" />
              Copy email
            </button>
            <a className="btn btn--ghost" href={`mailto:${PROFILE.email}`}>
              <Mail size={15} aria-hidden="true" />
              Open mail app
            </a>
          </div>
          <p className="contact__meta">
            Typical reply — within 24h
            <br />
            Timezone — UTC +5:30 (IST)
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* Footer                                                                  */
/* ---------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <a className="footer__brand" href="#main" aria-label="Back to top">
            <BrandMark size={24} />
            Junction
            <span>— one profile, every link</span>
          </a>
          <nav className="footer__nav" aria-label="Footer">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`}>
                {l.label}
              </a>
            ))}
            <a href="#stats">Stats</a>
            <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </nav>
        </div>
        <div className="footer__legal">
          <span>© 2026 {PROFILE.name} — built on Junction</span>
          <span>{PROFILE.location} · UTC +5:30</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- */
/* Toasts                                                                  */
/* ---------------------------------------------------------------------- */

function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          {t.kind === "success" ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <CircleAlert size={15} aria-hidden="true" />
          )}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
