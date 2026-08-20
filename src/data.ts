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
import { GithubIcon, LinkedinIcon } from "./icons";

export type AnyIcon = LucideIcon | typeof GithubIcon;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Harshit Singh",
  handle: "@harshitdev-wq",
  shortUrl: "nexoradevweb.netlify.app",
  role: "BCA student · Developer in progress",
  bio: "BCA student building responsive web experiences while going deeper into Python, C++, Git, and real-world software projects. I like clean interfaces, practical tools, and learning by shipping.",
  location: "Maharashtra, India",
  status: "Open to internships · Building in public",
  email: "harshit23228822@gmail.com",
  resumePath: "/resume.html",
  avatar: "/assets/images/avatar.jpg",
  avatarAlt: "Nexora identity mark",
} as const;

/* ------------------------------------------------------------------ */
/* Social hub                                                          */
/* ------------------------------------------------------------------ */

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: AnyIcon;
  copy?: string;
}

export const SOCIALS: Social[] = [
  {
    label: "GitHub",
    handle: "@harshitdev-wq",
    href: "https://github.com/harshitdev-wq",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    handle: "in/harshit-singh",
    href: "https://www.linkedin.com/in/harshit-singh-870642422",
    icon: LinkedinIcon,
  },
  {
    label: "Portfolio",
    handle: "nexoradevweb.netlify.app",
    href: "https://nexoradevweb.netlify.app/",
    icon: Globe,
  },
  {
    label: "Email",
    handle: "harshit23228822@gmail.com",
    href: "mailto:harshit23228822@gmail.com",
    icon: Mail,
    copy: "harshit23228822@gmail.com",
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
    id: "nexora",
    name: "nexora",
    tagline: "Developer identity platform",
    description:
      "A responsive developer profile experience that brings projects, skills, social links, contact details, and a live portfolio together in one interface.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    category: "web",
    repo: "https://github.com/harshitdev-wq/nexora-developer-profile",
    demo: "https://nexoradevweb.netlify.app/",
    image: "/assets/images/cover-devdot.jpg",
    imageAlt: "Abstract dark artwork representing a connected developer profile",
  },
  {
    id: "boomerang",
    name: "Boomerang Real Estate",
    tagline: "Real-estate web experience",
    description:
      "A polished property-focused website project built to practice responsive layouts, visual hierarchy, navigation, and modern frontend presentation.",
    stack: ["HTML", "CSS", "JavaScript"],
    category: "web",
    repo: "https://github.com/harshitdev-wq/Boomerang-Real-Estate-Website",
    demo: "https://github.com/harshitdev-wq/Boomerang-Real-Estate-Website",
    image: "/assets/images/cover-campusly.jpg",
    imageAlt: "Abstract dark artwork representing a property website",
  },
  {
    id: "dentist-clinic",
    name: "Dentist Clinic Website",
    tagline: "Responsive clinic website",
    description:
      "A frontend project focused on clear information architecture, responsive sections, service presentation, and a professional visual system.",
    stack: ["HTML", "CSS", "JavaScript"],
    category: "web",
    repo: "https://github.com/harshitdev-wq/dentist-clinic-website",
    demo: "https://github.com/harshitdev-wq/dentist-clinic-website",
    image: "/assets/images/cover-sightline.jpg",
    imageAlt: "Abstract dark artwork representing a healthcare website",
  },
  {
    id: "restaurant",
    name: "Modern Restaurant Website",
    tagline: "Modern hospitality interface",
    description:
      "A responsive restaurant experience designed around strong visual hierarchy, menu presentation, navigation, and mobile-friendly layouts.",
    stack: ["HTML", "CSS", "JavaScript"],
    category: "web",
    repo: "https://github.com/harshitdev-wq/modern-restaurant-website",
    demo: "https://github.com/harshitdev-wq/modern-restaurant-website",
    image: "/assets/images/cover-pathray.jpg",
    imageAlt: "Abstract dark artwork representing a modern restaurant interface",
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
    note: "building the fundamentals",
    items: ["Python", "C", "C++", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    icon: Boxes,
    note: "interfaces that stay out of the way",
    items: ["React", "Vite", "Tailwind CSS", "Responsive UI", "Accessibility"],
  },
  {
    title: "Data & APIs",
    icon: Cpu,
    note: "learning practical software foundations",
    items: ["SQL", "REST APIs", "GitHub", "JSON"],
  },
  {
    title: "Toolbox",
    icon: Wrench,
    note: "daily development tools",
    items: ["Git", "Linux", "VS Code", "Figma", "Netlify"],
  },
];

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export const STATS = [
  { value: "4", label: "Public projects", hint: "built and published" },
  { value: "1", label: "Flagship build", hint: "Nexora developer profile" },
  { value: "2026", label: "BCA journey", hint: "learning by shipping" },
  { value: "∞", label: "Things left to learn", hint: "and that's the point" },
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
