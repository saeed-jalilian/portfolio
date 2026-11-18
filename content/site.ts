/**
 * Shared facts. Values wrapped in [brackets] are placeholders: they render as
 * visible text and their links fall back to #contact until replaced.
 */
export const site = {
  name: "Saeed Jalilian",
  domain: "saeed-jalilian.ir",
  siteUrl: "https://saeed-jalilian.ir",
  github: "https://github.com/saeed-jalilian",
  email: "[you@email.com]",
  phone: "[+98 9xx xxx xxxx]",
  telegram: "[@username]",
  whatsapp: "[+98 9xx xxx xxxx]",
  stack: [
    { name: "Next.js", primary: true },
    { name: "Nest.js", primary: true },
    { name: "Django", primary: false },
    { name: "FastAPI", primary: false },
  ],
} as const;
