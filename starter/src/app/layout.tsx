/**
 * ルートは素通し。<html> は各サブツリーが持つ:
 *   - src/app/[locale]/layout.tsx … サイト本体（lang を locale から決めるため）
 *   - src/app/not-found.tsx       … locale 外の 404
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
