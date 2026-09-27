import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * サイト内リンクは next/link ではなくこちらを使う（locale 接頭辞を自動で付ける）。
 * usePathname は locale を除いたパスを返す。
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
