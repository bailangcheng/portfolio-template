import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ThreeStage } from "@/components/three/ThreeStage";
import { pick } from "@/content/pick";
import { site } from "@/content/site";
import { HeroPointer } from "./HeroPointer";

/**
 * 首屏: 名前 + 一句定位 + 主視覚（DESIGN.md「First view」）。
 *
 * 主視覚は site.hero.visual で切り替える:
 *   grid  … 十字グリッド + ポインター（素材なしで成立する既定）
 *   image … 代表作の 1 枚（ゆるいパララックス）
 *   three … Three.js のシーン。文字は常に HTML（SEO・読み上げ・翻訳のため canvas に文字を描かない）
 *
 * 高さ: 桌面は全画面（min-height: 100svh - 128px）。移动は 480〜600px に収める
 *   （背の高い端末で上半分が空のカードになるのを防ぐ）。min-height（height ではない）+ svh: 短い画面で文字を切らない。
 * 見出しは行ごとにマスク（overflow hidden）→ 初回表示で下から上昇（HeroPointer）。
 */
export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("home");
  const { visual } = site.hero;
  const lines = pick(site.hero.title, locale);
  const onImage = visual.kind === "image";

  return (
    <section
      className={`relative isolate mx-[14px] mb-[25px] flex min-h-[clamp(480px,calc(100svh-130px),600px)] flex-col justify-end overflow-hidden rounded-[20px] border border-surface-line bg-surface px-6 pb-[25px] pt-[95px] md:mx-pad md:mb-7 md:mt-3 md:min-h-[calc(100svh-128px)] md:rounded-hero md:px-10 md:pb-[27px] md:pt-[50px] ${
        visual.kind === "image" ? "" : "cross-grid"
      } ${onImage ? "text-white" : ""}`}
    >
      {/* HeroPointer は見出しの登場アニメも持つ ―― 全 kind で置く（光の層は grid のときだけ描く） */}
      <HeroPointer glow={visual.kind === "grid"} />

      {visual.kind === "image" ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={visual.image.src}
            alt={pick(visual.image.alt, locale)}
            fill
            priority
            data-parallax
            sizes="100vw"
            className="object-cover"
            style={visual.image.focus ? { objectPosition: visual.image.focus } : undefined}
          />
          {/* 文字の可読性のための下側の陰り（画像そのものには色を乗せない） */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        </div>
      ) : null}

      {visual.kind === "three" ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {visual.poster ? (
            <Image src={visual.poster.src} alt="" fill priority sizes="100vw" className="object-cover" />
          ) : null}
          <ThreeStage scene={visual.scene} className="absolute inset-0" />
        </div>
      ) : null}

      <h1 className="max-w-[1180px] text-hero md:text-hero-lg 2xl:max-w-[1450px]">
        {lines.map((line) => (
          // 行マスク: 降り字（p, y）が切れないよう下に余白を足し、同量を負マージンで戻す
          <span key={line} data-hero-line className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <span className="block">{line}</span>
          </span>
        ))}
      </h1>
      <p data-hero-fade className="mt-6 max-w-[520px] text-[16px] md:text-[18px]">
        {pick(site.name, locale)} — {pick(site.tagline, locale)}
      </p>
      <div
        data-hero-fade
        className={`mt-[55px] flex justify-between gap-[25px] text-micro md:mt-[70px] md:text-meta ${onImage ? "text-white/80" : "text-muted"}`}
      >
        <span>{site.location ? pick(site.location, locale) : null}</span>
        <a href="#works" className="link-line">
          {t("scroll")} <span className="link-arrow" data-dir="down" aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
