"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

/**
 * 首屏の登場アニメ + ポインター層（DESIGN.md「Motion」）。
 *
 * ★ 登場: 見出しの行がマスクから上昇 → 名前・定位・meta がフェード（全 kind 共通）。
 * ★ glow（kind: "grid" のときだけ）: 淡いアクセント色の正円グラデ（半径 180px）を「十字の形のマスク」で
 *   切り抜いた層（.hero-grid-glow）+ その下の小さな淡いグロー（.hero-glow）。網格そのものが色を帯びる。
 * ★ ほぼ即時に追従: --mx/--my を 0.08s で更新（1.4s のイージングは「遅れて見える」と却下された実績あり）。
 * ★ カスタムカーソル（dot）は置かない。ネイティブカーソルのまま。
 *
 * 分岐（gsap.matchMedia）:
 *   fine pointer + motion … 追従。離れると定位置へ戻り、また漂う
 *   coarse / touch        … 定位置のまわりをゆっくり漂うだけ
 *   reduced motion        … 定位置で静止
 */
export function HeroPointer({ glow = true }: { glow?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = layerRef.current?.parentElement;
    if (!hero) return;

    const pos = { x: 0, y: 0 };
    const write = () => {
      hero.style.setProperty("--mx", `${pos.x}px`);
      hero.style.setProperty("--my", `${pos.y}px`);
    };
    // 定位置: 右下寄り（CSS 既定の 72% 62% と同じ）
    const rest = () => ({ x: hero.clientWidth * 0.72, y: hero.clientHeight * 0.62 });
    Object.assign(pos, rest());
    write();

    const mm = gsap.matchMedia();
    mm.add(
      {
        fine: "(pointer: fine) and (prefers-reduced-motion: no-preference)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { fine, motion } = ctx.conditions ?? {};
        if (!motion) return;

        // ── 初回表示: 行マスク上昇 → identity / meta ──
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          // y: 0 を明示: CSS の初期 translateY(110%) を GSAP が px の y として読み込み、残ってしまうため（実測で 97px ずれた）
          .fromTo(
            hero.querySelectorAll("[data-hero-line] > span"),
            { yPercent: 110, y: 0 },
            { yPercent: 0, y: 0, duration: 1.2, stagger: 0.1 },
          )
          .fromTo(hero.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, "-=0.7");

        if (!glow) return;

        // ── 待機中の漂い（定位置のまわりを小さく往復）──
        const drift = () =>
          gsap.to(pos, {
            x: rest().x - hero.clientWidth * 0.12,
            y: rest().y - hero.clientHeight * 0.16,
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            onUpdate: write,
          });
        let idle: gsap.core.Tween | null = drift();
        if (!fine) return () => idle?.kill();

        // ── ポインター追従（fine pointer のみ）──
        const toX = gsap.quickTo(pos, "x", { duration: 0.08, ease: "power2.out", onUpdate: write });
        const toY = gsap.quickTo(pos, "y", { duration: 0.08, ease: "power2.out", onUpdate: write });
        let back: gsap.core.Tween | null = null;

        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          toX(e.clientX - r.left);
          toY(e.clientY - r.top);
        };
        const onEnter = () => {
          idle?.kill();
          idle = null;
          back?.kill();
          back = null;
        };
        const onLeave = () => {
          // 定位置へゆっくり戻ってから漂いを再開（その場で跳ばない）
          back = gsap.to(pos, {
            ...rest(),
            duration: 1.1,
            delay: 0.1,
            ease: "power3.inOut",
            onUpdate: write,
            onComplete: () => {
              idle = drift();
            },
          });
        };

        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerenter", onEnter);
        hero.addEventListener("pointerleave", onLeave);
        return () => {
          idle?.kill();
          back?.kill();
          hero.removeEventListener("pointermove", onMove);
          hero.removeEventListener("pointerenter", onEnter);
          hero.removeEventListener("pointerleave", onLeave);
        };
      },
    );

    return () => mm.revert();
  }, [glow]);

  return (
    <>
      {glow ? <div aria-hidden="true" className="hero-glow" /> : null}
      {/* glow なしでも ref の要素は置く（親 = 首屏 section を見つけるため） */}
      <div ref={layerRef} aria-hidden="true" className={glow ? "hero-grid-glow" : "hidden"} />
    </>
  );
}
