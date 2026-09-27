"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { TextLink } from "@/components/ui/SmartLink";

/** [locale] 配下のエラーバウンダリ。reset で該当セグメントの再レンダリングを試みる。 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="px-pad pt-[45px] pb-[90px] md:pt-[65px]">
      <h1 className="text-page md:text-page-lg">{t("title")}</h1>
      <p className="mt-7 max-w-[650px] text-lead md:text-lead-lg">{t("body")}</p>
      <div className="mt-8 flex gap-6">
        <button type="button" onClick={reset} className="text-link">
          {t("retry")}
        </button>
        <TextLink href="/">{t("back")}</TextLink>
      </div>
    </section>
  );
}
