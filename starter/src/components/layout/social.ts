import type { SiteContent } from "@/content/types";

export type Channel = { label: string; href: string; display: string };

/**
 * SNS の一覧（メールは別枠で大きく出すので含めない）。Footer と About が同じ順序・同じ表記を使う。
 * href が空のものは落とす（占位を出さない）。
 */
export function contactChannels(contact: SiteContent["contact"]): Channel[] {
  return contact.socials
    .filter((s) => s.href.trim() !== "")
    .map((s) => ({ label: s.label, href: s.href, display: shortUrl(s.href) }));
}

function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
