import type { ReactNode } from "react";

/** 節の上の番号ラベル（DM Mono 11px）。例: "02 / SELECTED WORK" */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mono mb-5 md:mb-[27px] ${className}`}>{children}</div>;
}
