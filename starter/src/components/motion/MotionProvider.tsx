"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

// 開発時のみ: 描画しないテスト環境（rAF が止まる）で ticker を手動で進めて最終状態を検証するため。
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { __gsap: typeof gsap; __ST: typeof ScrollTrigger }).__gsap = gsap;
  (window as unknown as { __ST: typeof ScrollTrigger }).__ST = ScrollTrigger;
}

/**
 * 全ページのスクロール演出（DESIGN.md「Motion」）。ページ遷移ごとに作り直し、前ページ分は revert する。
 *
 *   [data-reveal]            … フェード + 24px 上昇（まとめて出るものは batch で stagger）
 *   [data-reveal="media"]    … 画像枠。枠だけをフェード + 36px 上昇（中の img は触らない:
 *                              hover 拡大用の CSS transition と GSAP が同じ transform を奪い合うとカクつくため）
 *   [data-parallax]          … 作品ヒーロー画像のゆるいパララックス（scrub）
 *
 * 初期の非表示は CSS（html.js [data-reveal]）。JS が動かない/失敗した場合は layout の head スクリプトが
 * 3 秒後に html.reveal-fallback を付けて強制表示する ―― 「アニメのせいで内容が見えない」を起こさない。
 * ⚠️ prefers-reduced-motion では一切動かさない（CSS 側でも即表示）。
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        if (ctx.conditions?.reduce) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
          return;
        }

        const text = items.filter((el) => el.dataset.reveal !== "media");
        const media = items.filter((el) => el.dataset.reveal === "media");

        ScrollTrigger.batch(text, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
        });

        media.forEach((el) => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -4, scale: 1.08 },
            {
              yPercent: 4,
              scale: 1.08,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      },
    );

    // 画像読込でページ高が変わるので、読み込み後に位置を再計算
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
