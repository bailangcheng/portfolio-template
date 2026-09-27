"use client";

/**
 * ルートレイアウト自体が壊れたときのフォールバック。
 * layout も i18n も使えない前提なので、自前の <html><body> と固定文言で描く。
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "1rem", color: "#6b6b6b" }}>Please reload the page.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "2rem",
            minHeight: 44,
            padding: "0 1.5rem",
            background: "#111111",
            color: "#fff",
            border: 0,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
