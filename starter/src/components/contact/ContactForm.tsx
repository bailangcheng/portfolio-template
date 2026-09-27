"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/lib/contact/actions";

const initial: ContactState = { status: "idle" };

function Submit() {
  const t = useTranslations("contact");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-3 rounded-full border border-ink px-6 py-3 text-ui transition-colors duration-[var(--dur-hover)] ease-[var(--ease-out)] hover:bg-ink hover:text-paper disabled:opacity-50"
    >
      {pending ? t("sending") : t("submit")}
      <span aria-hidden="true">→</span>
    </button>
  );
}

/**
 * お問い合わせフォーム（Resend）。site.contact.form = true のときだけ About に出る。
 * ・エラーは aria-invalid + aria-describedby で欄に結びつけ、全体エラーは role="alert"。
 * ・送信後はフォームを畳んで完了文だけを出す（別ページに飛ばさない）。
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action] = useActionState(submitContact, initial);
  // 表示時刻（bot 対策: 3 秒未満の送信を弾く）。hydration 後に入れる ―― render で Date.now() を使うと
  // サーバとクライアントで値がずれる。JS 無効なら空のまま（サーバ側は時間判定を飛ばし honeypot だけで判定）。
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  const err = state.errors ?? {};
  const val = state.values;

  if (state.status === "sent") {
    return (
      <p role="status" className="text-lead md:text-lead-lg">
        {t("sent")}
      </p>
    );
  }

  const field = (id: "name" | "email" | "message", input: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`contact-${id}`} className="flex gap-2 text-meta text-muted">
        {t(id)}
        <span aria-hidden="true">*</span>
        <span className="sr-only">{t("required")}</span>
      </label>
      {input}
      {err[id] ? (
        <p id={`contact-${id}-error`} className="text-meta text-danger">
          {err[id]}
        </p>
      ) : null}
    </div>
  );
  const aria = (id: "name" | "email" | "message") => ({
    "aria-invalid": err[id] ? true : undefined,
    "aria-describedby": err[id] ? `contact-${id}-error` : undefined,
  });

  return (
    <form action={action} noValidate className="flex max-w-[640px] flex-col gap-7">
      {state.formError ? (
        <p role="alert" className="border-l-2 border-danger pl-4 text-ui text-danger">
          {state.formError}
        </p>
      ) : null}

      <input type="hidden" name="locale" value={locale} />
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      {/* honeypot: 視覚・支援技術から隠す。bot が埋めたら握り潰す */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {field(
        "name",
        <input id="contact-name" name="name" type="text" required autoComplete="name" maxLength={100} defaultValue={val?.name} className="field" {...aria("name")} />,
      )}
      {field(
        "email",
        <input id="contact-email" name="email" type="email" required inputMode="email" autoComplete="email" maxLength={200} defaultValue={val?.email} className="field" {...aria("email")} />,
      )}
      {field(
        "message",
        <textarea id="contact-message" name="message" required rows={6} maxLength={2000} defaultValue={val?.message} className="field resize-y" {...aria("message")} />,
      )}

      <p className="text-meta text-muted">{t("note")}</p>
      <div>
        <Submit />
      </div>
    </form>
  );
}
