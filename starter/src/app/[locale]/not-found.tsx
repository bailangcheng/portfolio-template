import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/ui/PageIntro";
import { TextLink } from "@/components/ui/SmartLink";

/** 404。見つからなくても作品一覧へ戻れるようにする（sitemap 方針）。 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <>
      <PageIntro eyebrow="404" title={[t("title")]} lead={[t("body")]} />
      <div className="flex gap-6 px-pad pb-[90px]">
        <TextLink href="/works" arrow="→">
          {t("works")}
        </TextLink>
        <TextLink href="/" arrow="↗">
          {t("home")}
        </TextLink>
      </div>
    </>
  );
}
