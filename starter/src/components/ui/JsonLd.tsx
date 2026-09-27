type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * 構造化データ(JSON-LD)を安全に描画する共通コンポーネント。
 * Organization / WebSite / Article / BreadcrumbList で再利用。
 * < を < にエスケープして XSS 経路を塞ぐ（第一者データのみ渡す前提でも防御）。
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
