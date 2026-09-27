"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { SceneFactory } from "./types";

/**
 * シーン一覧。★ ここに足したものだけが使える（site.ts の hero.visual.scene と型でつながる）。
 * 動的 import なので、three（~150KB gz）は 3D を使うページでだけ読まれる。
 */
const scenes = {
  sample: () => import("./scenes/sample"),
} satisfies Record<string, () => Promise<{ default: SceneFactory }>>;

export type SceneId = keyof typeof scenes;

/**
 * Three.js の描画面（DESIGN.md「3D」）。ライフサイクルの面倒はすべてここで見て、シーンは絵だけを書く。
 *
 *   ・WebGL が使えない / 初期化に失敗 → 何も出さない（下の poster か十字グリッドが見えたまま）。console に理由。
 *   ・prefers-reduced-motion → 1 フレームだけ描いて止める（動かさない）。
 *   ・画面外 / タブ非表示 → 描画を止める（バッテリー・発熱）。
 *   ・DPR は最大 2（4K + DPR3 の端末で GPU を焼かない）。
 *   ・ループは gsap.ticker（内嵌プレビューで rAF が止まっても __gsap.ticker.tick() で進められる。V-06）。
 *   ・unmount でジオメトリ・マテリアル・レンダラーを破棄し、コンテキストも解放（ページ遷移で GPU メモリを漏らさない）。
 *   ・canvas は装飾（aria-hidden）。文字は必ず HTML 側に置く。
 */
export function ThreeStage({ scene, className = "" }: { scene: SceneId; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [THREE, mod] = await Promise.all([import("three"), scenes[scene]()]);
      if (cancelled) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
      } catch (error) {
        // fallback は「何も描かない」だけ。偽の絵は出さない（poster / グリッドがそのまま見える）
        console.warn("[ThreeStage] WebGL unavailable:", error);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const css = getComputedStyle(document.documentElement);
      const token = (name: string) => css.getPropertyValue(name).trim();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(pointer: fine)").matches;

      const size = () => ({ width: canvas.clientWidth || 1, height: canvas.clientHeight || 1 });
      let { width, height } = size();
      renderer.setSize(width, height, false);

      const instance = mod.default({
        THREE,
        renderer,
        width,
        height,
        reducedMotion: reduced,
        // 色は DESIGN.md / globals.css のトークンから取る（シーンに色を直書きしない）
        palette: { accent: token("--c-accent"), accentSoft: token("--c-accent-soft"), ink: token("--c-ink"), paper: token("--c-paper") },
      });

      const pointer = { x: 0, y: 0 };
      let visible = true;
      let pageVisible = document.visibilityState === "visible";
      let elapsed = 0;

      const frame = (dt: number) => {
        instance.render(elapsed, dt, pointer);
        if (!canvas.dataset.ready) canvas.dataset.ready = "";
      };

      // 開発時のみ: rAF が止まる内嵌プレビューで 1 フレームを手で描いて検証するため（V-06。__gsap と同じ扱い）
      //   window.__three.frame() → 直後に gl.readPixels で描画を確かめられる
      if (process.env.NODE_ENV === "development") {
        (window as unknown as { __three: { frame: () => void } }).__three = { frame: () => frame(1 / 60) };
      }

      const onResize = () => {
        ({ width, height } = size());
        renderer.setSize(width, height, false);
        instance.resize(width, height);
        if (reduced) frame(0);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(canvas);

      if (reduced) {
        frame(0);
        cleanup = () => ro.disconnect();
      } else {
        const tick = (_time: number, deltaMs: number) => {
          if (!visible || !pageVisible) return;
          const dt = Math.min(deltaMs / 1000, 0.1); // タブ復帰時の大きな跳びを抑える
          elapsed += dt;
          frame(dt);
        };
        gsap.ticker.add(tick);

        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
        io.observe(canvas);
        const onVisibility = () => (pageVisible = document.visibilityState === "visible");
        document.addEventListener("visibilitychange", onVisibility);

        // ポインター: 親（首屏）の上での位置を -1..1 に。fine pointer のときだけ（タッチでは追わない）
        const host = canvas.parentElement?.parentElement ?? canvas;
        const onMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
          pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        };
        const onLeave = () => Object.assign(pointer, { x: 0, y: 0 });
        if (fine) {
          host.addEventListener("pointermove", onMove);
          host.addEventListener("pointerleave", onLeave);
        }

        cleanup = () => {
          gsap.ticker.remove(tick);
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
        };
      }

      const baseCleanup = cleanup;
      cleanup = () => {
        baseCleanup?.();
        instance.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    })().catch((error) => console.error("[ThreeStage] failed to start:", error));

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [scene]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`three-canvas block size-full ${className}`} />;
}
