"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { WorkCategory } from "@/content/types";
import { WorkCard } from "./WorkCard";
import type { WorkView } from "./view";

type Filter = WorkCategory | "all";

const CHANGE = "works:category";
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("popstate", onChange);
  };
}
const readCategory = () => new URLSearchParams(window.location.search).get("category");

/**
 * /works の一覧 + カテゴリ絞り込み（Fashion / Graphic・Ad / Web）。
 *
 * ・絞り込みの状態は URL（?category=web）だけが持つ（共有・リロードで再現できる。状態の二重持ちをしない）。
 *   ページ自体は静的のまま ―― useSearchParams を使うと全体が動的描画になるので、location を
 *   useSyncExternalStore で購読する（サーバ描画・hydration 時は「すべて」）。
 * ・ボタンは aria-pressed のトグル。件数は aria-live で読み上げる。
 * ・切替時のフェードは GSAP（reduced-motion では動かさない）。カードに data-reveal は付けない ――
 *   隠れていたカードが「未表示の初期状態」のまま残るため。代わりに一覧の枠だけが data-reveal。
 */
export function WorksIndex({ works, categories }: { works: WorkView[]; categories: { key: WorkCategory; label: string }[] }) {
  const t = useTranslations("works");
  const q = useSyncExternalStore(subscribe, readCategory, () => null);
  const filter: Filter = q && categories.some((c) => c.key === q) ? (q as WorkCategory) : "all";
  const listRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);

  const setFilter = (next: Filter) => {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(CHANGE));
  };

  // 切替アニメ（初回表示では動かさない）
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = listRef.current?.querySelectorAll("li");
      if (items?.length) gsap.fromTo(items, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 });
    });
    // 高さが変わるので後続の ScrollTrigger（footer の reveal 等）の位置を取り直す
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [filter]);

  const shown = filter === "all" ? works : works.filter((w) => w.category === filter);
  const options: { key: Filter; label: string }[] = [{ key: "all", label: t("all") }, ...categories];

  return (
    <div data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-4">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-x-6 gap-y-2 text-ui">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={filter === o.key}
              onClick={() => setFilter(o.key)}
              className={`-my-2 py-2 ${filter === o.key ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              <span className="link-line">{o.label}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mono text-muted">
          {t("count", { count: shown.length })}
        </p>
      </div>

      {shown.length > 0 ? (
        <ul ref={listRef} className="mt-10 grid gap-x-[5vw] gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-20">
          {shown.map((w, i) => (
            <li key={w.slug}>
              <WorkCard work={w} priority={i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted">{t("empty")}</p>
      )}
    </div>
  );
}
