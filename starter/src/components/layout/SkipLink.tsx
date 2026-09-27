import { getTranslations } from "next-intl/server";

/**
 * <body> 直下の先頭要素。「本文へスキップ」（WCAG 2.4.1）。
 * .skip-link で通常は視覚的に隠れ、:focus で表示（globals.css）。
 */
export async function SkipLink({ targetId = "main" }: { targetId?: string }) {
  const t = await getTranslations("a11y");
  return (
    <a href={`#${targetId}`} className="skip-link font-medium">
      {t("skipToContent")}
    </a>
  );
}
