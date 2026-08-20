import {
  Globe,
  Mail,
  Code2,
  FileText,
  Terminal,
  Boxes,
  Cpu,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "./icons";

export type AnyIcon = LucideIcon | typeof GithubIcon;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Nexora",
  handle: "@nexora",
  shortUrl: "junction.cc/nexora",
  role: "Student developer · Web & systems",
  bio: "BCA ’26 student building fast, honest software — from CPU ray tracers to campus-scale web apps. I care about clean APIs, sharp interfaces, and code that reads like prose.",
  location: "Jaipur, India",
  status: "Open to internships · Summer 2026",
  email: "hello@nexora.dev",
  resumePath: "/resume.html",
  avatar: "/assets/images/avatar.jpg",
  avatarAlt: "Abstract glass “N” identity mark used as Nexora’s avatar",
} as const;

/* ------------------------------------------------------------------ */
/* Social hub                                                          */
/* ------------------------------------------------------------------ */

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: AnyIcon;
  copy?: string; // when present, a copy affordance is rendered
}

export const SOCIALS: Social[] = [
  {
    label: "GitHub",
    handle: "@nexora-dev",
    href: "https://github.com/nexora-dev",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    handle: "in/nexora-dev",
    href: "https://www.linkedin.com/in/nexora-dev",
    icon: LinkedinIcon,
  },
  {
    label: "Portfolio",
    handle: "nexora.dev",
    href: "https://nexora.dev",
    icon: Globe,
  },
  {
    label: "X / Twitter",
    handle: "@nexoradev",
    href: "https://x.com/nexoradev",
    icon: XIcon,
  },
  {
    label: "LeetCode",
    handle: "@nexora_dev",
    href: "https://leetcode.com/nexora_dev",
    icon: Code2,
  },
  {
    label: "Email",
    handle: "hello@nexora.dev",
    href: "mailto:hello@nexora.dev",
    icon: Mail,
    copy: "hello@nexora.dev",
  },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectCategoryId = "web" | "python" | "cpp" | "other";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  category: ProjectCategoryId;
  repo: string;
  demo: string;
  image: string;
  imageAlt: string;
}

export const PROJECTS: Project[] = [
  {
    id: "campusly",
    name: "campusly",
    tagline: "Campus community platform",
    description:
      "Event boards, notes exchange and moderated Q&A for BCA clubs. Handles 40+ events a semester on a tiny VPS without breaking a sweat.",
    stack: ["React", "TypeScript", "Node.js", "MongoDB"],
    category: "web",
    repo: "https://github.com/nexora-dev/campusly",
    demo: "https://campusly-nexora.vercel.app",
    image: "/assets/images/cover-campusly.jpg",
    imageAlt: "Minimal line-art network of connected campus nodes on black",
  },
  {
    id: "devdot",
    name: "devdot",
    tagline: "The profile engine behind this page",
    description:
      "A link-in-bio generator with theme tokens, markdown bios and zero-tracking analytics. Dogfooded daily — this profile runs on it.",
    stack: ["Vite", "React", "CSS"],
    category: "web",
    repo: "https://github.com/nexora-dev/devdot",
    demo: "https://devdot-nexora.vercel.app",
    image: "/assets/images/cover-devdot.jpg",
    imageAlt: "Thin line-art chain of linked profile cards on black",
  },
  {
    id: "pyvault",
    name: "pyvault",
    tagline: "Offline-first CLI password vault",
    description:
      "AES-256 encrypted store with TOTP codes and master-key stretching. Everything stays on disk, everything stays yours.",
    stack: ["Python", "SQLite", "cryptography"],
    category: "python",
    repo: "https://github.com/nexora-dev/pyvault",
    demo: "https://github.com/nexora-dev/pyvault#readme",
    image: "/assets/images/cover-pyvault.jpg",
    imageAlt: "Concentric line-art key etched in white on black",
  },
  {
    id: "sightline",
    name: "sightline",
    tagline: "Face-ID attendance for classrooms",
    description:
      "OpenCV pipeline with a liveness check and one-click CSV exports. Cut our lab’s roll-call from six minutes to forty seconds.",
    stack: ["Python", "OpenCV", "Flask"],
    category: "python",
    repo: "https://github.com/nexora-dev/sightline",
    demo: "https://github.com/nexora-dev/sightline#readme",
    image: "/assets/images/cover-sightline.jpg",
    imageAlt: "Facial landmark mesh of dots and lines fading into black",
  },
  {
    id: "pathray",
    name: "pathray",
    tagline: "A tiny physically-based ray tracer",
    description:
      "Sphere and quad scenes, BVH acceleration, PPM out. Written to finally understand the math I kept copy-pasting from tutorials.",
    stack: ["C++17", "CMake"],
    category: "cpp",
    repo: "https://github.com/nexora-dev/pathray",
    demo: "https://github.com/nexora-dev/pathray#readme",
    image: "/assets/images/cover-pathray.jpg",
    imageAlt: "Contour-ring sphere lit by thin light rays on black",
  },
  {
    id: "ferroctl",
    name: "ferroctl",
    tagline: "Fleet ops in the terminal",
    description:
      "A TUI that tails logs and restarts services across SSH hosts. Built after one too many nights of juggling tmux panes.",
    stack: ["Go", "Bubble Tea", "SSH"],
    category: "other",
    repo: "https://github.com/nexora-dev/ferroctl",
    demo: "https://github.com/nexora-dev/ferroctl#readme",
    image: "/assets/images/cover-ferroctl.jpg",
    imageAlt: "Outlined terminal window with a glowing cursor on black",
  },
];

export const PROJECT_FILTERS: { id: "all" | ProjectCategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "other", label: "Other" },
];

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  note: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    title: "Languages",
    icon: Terminal,
    note: "comfort-first: typed where it counts",
    items: ["TypeScript", "JavaScript", "Python", "C", "C++", "SQL"],
  },
  {
    title: "Frontend",
    icon: Boxes,
    note: "interfaces that stay out of the way",
    items: ["React", "Vite", "Tailwind CSS", "HTML", "CSS", "Accessibility"],
  },
  {
    title: "Backend & data",
    icon: Cpu,
    note: "small services, honest queries",
    items: ["Node.js", "Express", "Flask", "REST", "MongoDB", "PostgreSQL"],
  },
  {
    title: "Toolbox",
    icon: Wrench,
    note: "the daily drivers",
    items: ["Git", "Linux", "Docker", "Figma", "GitHub Actions", "VS Code"],
  },
];

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export const STATS = [
  { value: "6", label: "Projects shipped", hint: "all maintained, none abandoned" },
  { value: "22", label: "Public repositories", hint: "github.com/nexora-dev" },
  { value: "480+", label: "Contributions this year", hint: "code, reviews and docs" },
  { value: "3 yrs", label: "Writing code", hint: "self-taught, BCA since ’23" },
] as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "links", label: "Links" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const RESUME_ICON = FileText;

export const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4";

export const HERO_POSTER =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png";
