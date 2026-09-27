import { notFound } from "next/navigation";

/** 未知のパスを [locale]/not-found.tsx（ヘッダー/フッター付き・翻訳済み）へ流すための catch-all。 */
export default function CatchAllPage() {
  notFound();
}
