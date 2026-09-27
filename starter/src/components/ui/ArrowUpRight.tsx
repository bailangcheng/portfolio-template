/** 右上向きの矢印（装飾）。大きな文字の横ではフォントの ↗ が細く歪むので、線幅を揃えた SVG を使う。 */
export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 18 18 6M8.5 6H18v9.5" />
    </svg>
  );
}
