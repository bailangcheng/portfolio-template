"use client";

import { Link, usePathname } from "@/i18n/navigation";

type Item = { href: string; match: string; label: string };

/**
 * 主ナビ（現在地に下線、hover で下線が左から伸びる）。唯一の client 境界 ―― usePathname のため。
 * タップ領域: py-3/-my-3 で見た目を変えずに縦 44px 前後を確保（DESIGN.md §6）。
 */
export function NavLinks({ items, label }: { items: Item[]; label: string }) {
  const pathname = usePathname();
  const isCurrent = (match: string) => pathname === match || pathname.startsWith(`${match}/`);

  return (
    <nav aria-label={label} className="pt-0.5">
      <ul className="flex gap-[14px] text-meta sm:gap-5 sm:text-nav md:gap-[30px]">
        {items.map((item) => {
          const current = isCurrent(item.match);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="-my-3 inline-block py-3"
              >
                {/* 線は内側の span に（py-3 のタップ域の下端ではなく文字の下に出すため） */}
                <span className="link-line">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
