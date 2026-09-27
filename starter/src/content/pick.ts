import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { L } from "./types";

/**
 * L<T> から locale の値を取り出す。コンポーネントは必ずこれを通す（書き方をそろえる）。
 *
 * ・locale が未知 → 404。proxy の matcher は拡張子付きのパスを通さないので、/favicon.ico などは
 *   [locale] = "favicon.ico" のまま generateMetadata まで届く。ここで投げると 500 になる（実測）。
 * ・locale は正しいのに値が無い → バグなので投げる。既定言語に黙って落とさない
 *   （型で全 locale を必須にしているので、ここに来るのは型を回避したときだけ）。
 */
export function pick<T>(value: L<T>, locale: string): T {
  if (!hasLocale(routing.locales, locale)) notFound();
  const v = value[locale];
  if (v === undefined) throw new Error(`[content] missing "${locale}" value`);
  return v;
}
