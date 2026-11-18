export type Locale = "fa" | "en";

export type ContactId = "telegram" | "email" | "phone" | "whatsapp" | "github";
export type ServiceIcon = "frontend" | "backend" | "fullstack";

export interface Project {
  name: string;
  description: string;
  /** Shown in the browser-mock URL bar. */
  domain: string;
  tags: string[];
  role: string;
  statusValue: string;
  year: string;
}

export interface Content {
  meta: { title: string };
  name: string;
  jobTitle: string;
  nav: { work: string; services: string; process: string; cta: string };
  langSwitch: { label: string; aria: string; href: string; lang: Locale };
  theme: { toLight: string; toDark: string };
  status: string;
  hero: {
    before: string;
    highlight: string;
    after: string;
    sub: string;
    ctaWork: string;
    ctaContact: string;
  };
  stackLabel: string;
  work: {
    title: string;
    sub: string;
    shot: string;
    inProgress: string;
    roleLabel: string;
    statusLabel: string;
    projects: Project[];
    nextTitle: string;
    nextSub: string;
    nextCta: string;
  };
  services: {
    title: string;
    items: { icon: ServiceIcon; title: string; body: string }[];
  };
  process: {
    title: string;
    steps: { n: string; title: string; body: string }[];
  };
  contact: {
    before: string;
    highlight: string;
    sub: string;
    entries: { id: ContactId; label: string }[];
  };
  footer: (year: string) => string;
}
