import type { Content } from "./types";

export const en: Content = {
  meta: { title: "Saeed Jalilian — Full-Stack Developer" },
  name: "Saeed Jalilian",
  jobTitle: "Full-Stack Developer",
  nav: {
    work: "Work",
    services: "Services",
    process: "Process",
    cta: "Start a project",
  },
  langSwitch: { label: "فا", aria: "فا، تغییر زبان به فارسی", href: "/", lang: "fa" },
  theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  status: "Available for new projects",
  hero: {
    before: "I build websites that ",
    highlight: "look beautiful",
    after: " and work flawlessly.",
    sub: "I’m Saeed Jalilian, a full-stack developer. I craft interfaces with Next.js and back-ends with Nest.js — and stay with you from the first sketch to the day your site goes live.",
    ctaWork: "See my work",
    ctaContact: "Get in touch",
  },
  stackLabel: "Tools I build with",
  work: {
    title: "Selected work",
    sub: "Projects I’ve designed and engineered end to end.",
    shot: "[Project screenshot]",
    inProgress: "In progress",
    roleLabel: "My role",
    statusLabel: "Status",
    projects: [
      {
        name: "[Project name]",
        description:
          "[Short project description: who it’s for, what problem it solves, and what it includes.]",
        domain: "[project-domain.ir]",
        tags: ["Next.js", "Nest.js"],
        role: "Design, front-end, back-end",
        statusValue: "Launching soon",
        year: "2026",
      },
    ],
    nextTitle: "The next slot is open.",
    nextSub: "Your website could be the next project on this page.",
    nextCta: "Let’s talk",
  },
  services: {
    title: "What I can do for you",
    items: [
      {
        icon: "frontend",
        title: "Design & front-end",
        body: "Custom UI design, built fast, responsive and SEO-friendly with Next.js.",
      },
      {
        icon: "backend",
        title: "Back-end & APIs",
        body: "API design and server logic with Nest.js — or Django and FastAPI when the project calls for it.",
      },
      {
        icon: "fullstack",
        title: "Full projects, from zero",
        body: "One person for the whole journey: design, front-end, back-end and launch — no juggling multiple teams.",
      },
    ],
  },
  process: {
    title: "How we’ll work",
    steps: [
      { n: "01", title: "Discovery", body: "I get to know your needs, audience and business goals." },
      {
        n: "02",
        title: "Design",
        body: "I design the look and structure, and we finalize it together.",
      },
      {
        n: "03",
        title: "Build",
        body: "Front-end and back-end development, with updates at every step.",
      },
      {
        n: "04",
        title: "Launch & support",
        body: "Your site goes live — and I stay around after handoff.",
      },
    ],
  },
  contact: {
    before: "Have an idea in mind?",
    highlight: "Let’s build it.",
    sub: "Reach out however you prefer — I usually reply within [24 hours].",
    entries: [
      { id: "telegram", label: "Telegram" },
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "github", label: "GitHub" },
    ],
  },
  footer: (year) => `© ${year} Saeed Jalilian — designed & built by me.`,
};
