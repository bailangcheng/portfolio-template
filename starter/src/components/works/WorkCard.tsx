import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import type { WorkView } from "./view";

/**
 * /works のカード。カード全体が 1 つのリンク（中にリンクを入れ子にしない）。
 * hover で画像がゆっくり寄る（内側の img。出現アニメは親の WorksIndex が持つ）。
 */
export function WorkCard({ work, priority }: { work: WorkView; priority?: boolean }) {
  return (
    <SmartLink href={work.href} className="group block">
      <div className="overflow-hidden rounded-media bg-media">
        <Image
          src={work.cover.src}
          alt={work.cover.alt}
          sizes="(min-width: 801px) 45vw, 100vw"
          placeholder="blur"
          priority={priority}
          className="aspect-[1.5] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.035]"
          style={work.cover.focus ? { objectPosition: work.cover.focus } : undefined}
        />
      </div>
      <div className="mono mt-4 flex justify-between text-muted">
        <span>{work.categoryLabel}</span>
        {work.year ? <span>{work.year}</span> : null}
      </div>
      <h2 className="mt-2 text-[24px] leading-[1.25] tracking-[var(--ls-title)] md:text-[28px]">
        <span className="link-line">{work.title}</span>
      </h2>
      <p className="mt-2 max-w-[520px] text-ui text-muted">{work.summary}</p>
    </SmartLink>
  );
}
