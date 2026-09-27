import type { MetadataRoute } from "next";
import { pick } from "@/content/pick";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

export default function manifest(): MetadataRoute.Manifest {
  const name = pick(site.name, routing.defaultLocale);
  return {
    name,
    short_name: name,
    description: pick(site.description, routing.defaultLocale),
    start_url: "/",
    display: "standalone",
    background_color: "#f3f3f1",
    theme_color: "#f3f3f1",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
