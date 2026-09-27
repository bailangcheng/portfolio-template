import "server-only";
import { Resend } from "resend";

/**
 * お問い合わせメール送信（Resend）の単一ソース。Server Action（lib/contact/actions.ts）だけが呼ぶ。
 *
 * env（.env.example / Vercel の Environment Variables。すべて **実行時**に読む）:
 *   RESEND_API_KEY      … Resend の API キー
 *   CONTACT_FROM_EMAIL  … 認証済みドメインの差出人（例 "Portfolio <contact@your-domain.com>"）
 *   CONTACT_TO_EMAIL    … 受信先（自分のアドレス）
 */

export type ContactPayload = { name: string; email: string; message: string; locale: string };

export type SendResult = { ok: true } | { ok: false; reason: "unconfigured" | "send_failed" };

/** HTML メール本文へ差し込む前に必ず通す。 */
function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContact(payload: ContactPayload): Promise<SendResult> {
  // ⚠️ env はリクエスト毎に読む（モジュールスコープでキャッシュしない）。
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  // ⚠️ 設定が無ければ fail closed。「とりあえず成功」は絶対にしない（送れていないのに「送信しました」は最悪の嘘）。
  //    ログに出す ―― Vercel の Runtime Logs で「未設定」と「送信失敗」を区別できるように。
  if (!apiKey || !from || !to) {
    console.error("[send-contact] unconfigured: RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL");
    return { ok: false, reason: "unconfigured" };
  }

  const text = [`Name: ${payload.name}`, `Email: ${payload.email}`, `Locale: ${payload.locale}`, "", payload.message].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: `[Portfolio] ${payload.name}`,
      text,
      // ⚠️ 順序: エスケープしてから改行を <br> にする（逆だと <br> ごと潰れる）
      html: `<p>${escapeHtml(text).replaceAll("\n", "<br />")}</p>`,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (error) {
    console.error("[send-contact] failed:", error instanceof Error ? error.message : String(error));
    return { ok: false, reason: "send_failed" };
  }
}
