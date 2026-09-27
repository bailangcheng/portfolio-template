import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Lines } from "./Lines";

type PageIntroProps = {
  eyebrow: ReactNode;
  title: readonly string[];
  lead?: readonly string[];
  /** 作品詳細の meta 行（border-top 付き、左右に振り分け） */
  meta?: readonly string[];
};

/** 下層ページ冒頭。ページ唯一の <h1>。各要素は data-reveal で順に出る。 */
export function PageIntro({ eyebrow, title, lead, meta }: PageIntroProps) {
  return (
    <section className="px-pad pt-[45px] pb-[60px] md:pt-[65px]">
      <div data-reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h1 data-reveal className="max-w-[1040px] text-page md:text-page-lg">
        <Lines lines={title} />
      </h1>
      {lead ? (
        <p data-reveal className="mt-7 max-w-[650px] text-lead md:text-lead-lg">
          <Lines lines={lead} />
        </p>
      ) : null}
      {meta && meta.length > 0 ? (
        <div data-reveal className="mt-[35px] flex flex-wrap justify-between gap-[10px] border-t border-rule pt-4 text-meta md:flex-nowrap md:gap-[30px] md:text-nav">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
