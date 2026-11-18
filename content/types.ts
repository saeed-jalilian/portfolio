export type Locale = "fa" | "en";

export type ContactId = "telegram" | "email" | "phone" | "whatsapp" | "github";

export interface Project {
  name: string;
  description: string;
  /** Full public address, used as the link target. */
  url: string;
  /** Address as shown to the reader. */
  domain: string;
  tags: string[];
  role: string;
  statusValue: string;
  image: { src: string; width: number; height: number; alt: string };
}

export interface Content {
  /** Search-result copy: title under ~60 characters, description ~140–160. */
  meta: { title: string; description: string };
  name: string;
  jobTitle: string;
  nav: { work: string; services: string; about: string; process: string; cta: string };
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
    facts: { label: string; value: string }[];
  };
  work: {
    title: string;
    roleLabel: string;
    statusLabel: string;
    stackLabel: string;
    visit: string;
    projects: Project[];
  };
  services: {
    title: string;
    items: { title: string; body: string }[];
  };
  about: { title: string; body: string[] };
  process: {
    title: string;
    steps: { title: string; body: string }[];
  };
  contact: {
    before: string;
    highlight: string;
    sub: string;
    entries: { id: ContactId; label: string }[];
  };
  footer: (year: string) => string;
}
