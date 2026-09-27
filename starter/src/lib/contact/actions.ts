"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { sendContact } from "@/lib/mail/send-contact";
import { routing } from "@/i18n/routing";

/**
 * お問い合わせフォームの Server Action（About の #contact）。
 * ・<form action> から呼ばれるので JS 無効でも動く（プログレッシブ・エンハンスメント）。
 * ・検証・bot 対策はすべてサーバ側。エラー文は送信元の locale で返す。
 * ・bot 対策は 2 つ（どちらも「成功を装って」握り潰す ―― bot に失敗理由を教えない）:
 *     honeypot … 人には見えない website 欄。埋まっていたら bot
 *     経過時間 … 表示から 3 秒未満の送信は bot（JS 無効で時刻が無いときは判定しない）
 *   ⚠️ サーバレスでは in-memory のレート制限は効かない。スパムが来たら Vercel Firewall か Turnstile を足す。
 */

export type ContactState = {
  status: "idle" | "sent" | "error";
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
  formError?: string;
};

const MIN_ELAPSED_MS = 3000;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const requested = String(formData.get("locale") ?? "");
  const locale = routing.locales.includes(requested as (typeof routing.locales)[number]) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "contact.errors" });

  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (String(formData.get("website") ?? "") !== "" || (startedAt > 0 && Date.now() - startedAt < MIN_ELAPSED_MS)) {
    return { status: "sent" };
  }

  const schema = z.object({
    name: z.string().min(1, t("name")).max(100, t("name")),
    email: z.email(t("email")).max(200, t("email")),
    message: z.string().min(1, t("message")).max(2000, t("message")),
  });
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", errors, values };
  }

  const result = await sendContact({ ...parsed.data, locale });
  if (!result.ok) {
    return { status: "error", formError: t(result.reason === "unconfigured" ? "unconfigured" : "failed"), values };
  }
  return { status: "sent" };
}
