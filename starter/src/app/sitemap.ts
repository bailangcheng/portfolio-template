import type { MetadataRoute } from "next";
import { siteConfig, staticRoutes } from "@/content/site";
import { works } from "@/content/works";
import { localizedPath, routing } from "@/i18n/routing";

/**
 * 静的ルート＋作品詳細 × 全 locale（hreflang alternates 付き）。
 * ⚠️ siteConfig.url が空文字だと <loc> が空になる。site.ts の `||` を参照（R-03）。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const abs = (path: string) => `${base}${path === "/" ? "" : path}`;
  const paths = [...staticRoutes, ...works.map((w) => `/works/${w.slug}`)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(localizedPath(locale, path)) || base,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, abs(localizedPath(l, path)) || base])),
      },
    })),
  );
}
