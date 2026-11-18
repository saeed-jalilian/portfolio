import type { MetadataRoute } from "next";
import { BRAND } from "@/components/Logo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saeed Jalilian — Full-Stack Developer",
    short_name: "Saeed J.",
    description: "Full-stack developer building websites and online shops with Next.js and Nest.js.",
    start_url: "/",
    display: "standalone",
    background_color: BRAND.paper,
    theme_color: BRAND.paper,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
