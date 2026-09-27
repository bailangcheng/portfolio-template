import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Arrow = "↗" | "→" | "↓" | "↑" | "←";

/** hover で矢印を向きに沿って動かす（globals.css .link-arrow[data-dir]） */
const arrowDir: Record<Arrow, string> = { "↗": "up-right", "→": "right", "↓": "down", "↑": "up", "←": "left" };

type SmartLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** 矢印は装飾（aria-hidden）。"←" は前置、それ以外は後置。 */
  arrow?: Arrow;
  /** 新規タブ（外部サイト・原寸画像） */
  newTab?: boolean;
  "aria-label"?: string;
};

/**
 * サイト内外のリンクを 1 つに:
 *   - "/..."（ページ）… locale 付きの @/i18n/navigation Link
 *   - "#..." / "http..." / "mailto:" / 静的ファイル（"/_next/..." の画像 URL）… 素の <a>
 *     ⚠️ 静的ファイルに i18n Link を使うと、2 言語目を足したとき /ja/_next/... に化けて壊れる。
 */
export function SmartLink({ href, children, className = "", arrow, newTab, ...rest }: SmartLinkProps) {
  const content = (
    <>
      {arrow === "←" ? (
        <>
          <span className="link-arrow" data-dir="left" aria-hidden="true">
            ←
          </span>{" "}
        </>
      ) : null}
      {children}
      {arrow && arrow !== "←" ? (
        <>
          {" "}
          <span className="link-arrow" data-dir={arrowDir[arrow]} aria-hidden="true">
            {arrow}
          </span>
        </>
      ) : null}
    </>
  );
  const isPage = href.startsWith("/") && !href.startsWith("/_next/");
  const tab = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (isPage && !newTab) {
    return (
      <Link href={href} className={className} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...tab} {...rest}>
      {content}
    </a>
  );
}

/** 下線付きの小さなテキストリンク（globals.css .text-link）。 */
export function TextLink(props: SmartLinkProps) {
  return <SmartLink {...props} className={`text-link ${props.className ?? ""}`} />;
}
