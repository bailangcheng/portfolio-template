import Image from "next/image";
import { SmartLink, TextLink } from "@/components/ui/SmartLink";
import type { WorkView } from "./view";

/**
 * TOP の精選作品の行。桌面は 0.77 : 1.45 の非対称 2 列、reverse で左右交替（DESIGN.md「Layout」）。
 * 画像もリンク。hover（行のどこでも）で画像がゆっくり寄る（CSS。出現は MotionProvider の data-reveal）。
 * ⚠️ hover 拡大は内側の img、出現は外側の枠 ―― 同じ要素に CSS transition と GSAP を載せない。
 */
export function WorkRow({ work, no, reverse, last, cta }: { work: WorkView; no: string; reverse?: boolean; last?: boolean; cta: string }) {
  return (
    <article
      className={`group grid items-center gap-[35px] border-t border-rule py-[38px] md:gap-[6vw] md:py-[52px] 2xl:py-[70px] ${
        reverse ? "md:grid-cols-[1.45fr_0.77fr]" : "md:grid-cols-[0.77fr_1.45fr]"
      } ${last ? "border-b" : ""}`}
    >
      <div data-reveal className={reverse ? "md:order-2" : ""}>
        <div className="mono flex max-w-[350px] justify-between text-muted">
          <span>{no}</span>
          <span>{[work.categoryLabel, work.year].filter(Boolean).join(" · ")}</span>
        </div>
        <h3 className="my-[22px] text-title md:text-title-lg">{work.title}</h3>
        <p className="mb-[25px] text-ui md:max-w-[340px]">{work.summary}</p>
        <TextLink href={work.href} arrow="↗">
          {cta}
        </TextLink>
      </div>
      <SmartLink
        href={work.href}
        aria-label={work.title}
        className={`relative block overflow-hidden rounded-media bg-media ${reverse ? "md:order-1" : ""}`}
      >
        <div data-reveal="media" className="overflow-hidden rounded-media">
          <Image
            src={work.cover.src}
            alt={work.cover.alt}
            sizes="(min-width: 801px) 60vw, 100vw"
            placeholder="blur"
            className="aspect-[1.55] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.035]"
            style={work.cover.focus ? { objectPosition: work.cover.focus } : undefined}
          />
        </div>
      </SmartLink>
    </article>
  );
}
