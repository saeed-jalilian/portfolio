import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saeed Jalilian — Full-Stack Developer",
    short_name: "Saeed J.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0C0E",
    theme_color: "#0B0C0E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
