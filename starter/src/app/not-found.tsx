import Link from "next/link";

/**
 * locale サブツリーの外で起きた 404（proxy の matcher 外のパス等）。
 * ルートレイアウトが素通しなので自前で <html> を描く。サイト内の 404 は [locale]/not-found.tsx。
 */
export default function RootNotFound() {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "Manrope, system-ui, sans-serif", background: "#f3f3f1", color: "#1c1d1c", margin: 0, padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400 }}>404 — Not found</h1>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/works" style={{ textDecoration: "underline" }}>
            Works
          </Link>
        </p>
      </body>
    </html>
  );
}
