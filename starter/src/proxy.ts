import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: middleware.ts → proxy.ts（AGENTS.md）。
export default createMiddleware(routing);

export const config = {
  // /api・Next/Vercel 内部・拡張子付きファイル（画像・favicon 等）は除外。
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
