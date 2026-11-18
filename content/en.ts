import type { Content } from "./types";

export const en: Content = {
  meta: { title: "Saeed Jalilian — Full-Stack Developer" },
  name: "Saeed Jalilian",
  jobTitle: "Full-Stack Developer",
  nav: {
    work: "Work",
    services: "Services",
    about: "About",
    process: "Process",
    cta: "Start a project",
  },
  langSwitch: { label: "فا", aria: "فا، تغییر زبان به فارسی", href: "/", lang: "fa" },
  theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  status: "Available for new projects",
  hero: {
    before: "I design and build websites and the systems behind them: ",
    highlight: "one person, start to finish.",
    after: "",
    sub: "I’m Saeed Jalilian, a full-stack developer working with Next.js and Nest.js. My latest project is an online candle shop with its own admin panel, now live.",
    ctaWork: "See my work",
    ctaContact: "Get in touch",
    facts: [
      { label: "Works with", value: "Next.js, Nest.js, Django, FastAPI" },
      { label: "Covers", value: "Design, front-end, back-end, launch" },
      { label: "Latest project", value: "Mia Candle, live" },
    ],
  },
  work: {
    title: "Selected work",
    roleLabel: "My role",
    statusLabel: "Status",
    stackLabel: "Stack",
    visit: "Visit the site",
    projects: [
      {
        name: "Mia Candle",
        description:
          "An online shop for a handmade-candle brand. Buyers choose a size, wax, wick, container, color and fragrance in a Persian storefront, and the owner runs the catalog, stock and discounts from a separate admin panel.",
        url: "https://miacandlehub.ir",
        domain: "miacandlehub.ir",
        tags: ["Next.js", "Nest.js", "Admin panel"],
        role: "Design, front-end, back-end",
        statusValue: "Live",
        image: {
          src: "/work/mia-candle.jpg",
          width: 1440,
          height: 780,
          alt: "The Mia Candle storefront: a hero with a handmade candle and a link to the products.",
        },
      },
    ],
  },
  services: {
    title: "What I can do for you",
    items: [
      {
        title: "Design & front-end",
        body: "Custom UI design, built fast, responsive and SEO-friendly with Next.js.",
      },
      {
        title: "Back-end & APIs",
        body: "API design and server logic with Nest.js, or Django and FastAPI when the project calls for it.",
      },
      {
        title: "Full projects, from zero",
        body: "One person for the whole journey: design, front-end, back-end and launch, with no juggling of multiple teams.",
      },
    ],
  },
  about: {
    title: "About",
    body: [
      "I’m Saeed, a full-stack developer. I work on my own, so you talk to the person who designs and writes your site, with no handoffs between a designer, a front-end team and a back-end team.",
      "I build with Next.js and Nest.js, and reach for Django or FastAPI when a project calls for it.",
    ],
  },
  process: {
    title: "How we’ll work",
    steps: [
      { title: "Discovery", body: "I get to know your needs, audience and business goals." },
      { title: "Design", body: "I design the look and structure, and we finalize it together." },
      { title: "Build", body: "Front-end and back-end development, with updates at every step." },
      { title: "Launch & support", body: "Your site goes live, and I stay around after handoff." },
    ],
  },
  contact: {
    before: "Have an idea in mind?",
    highlight: "Let’s build it.",
    sub: "Reach out however you prefer. I usually reply within a day.",
    entries: [
      { id: "telegram", label: "Telegram" },
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "github", label: "GitHub" },
    ],
  },
  footer: (year) => `© ${year} Saeed Jalilian. Designed and built by me.`,
};
