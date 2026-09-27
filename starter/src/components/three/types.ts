import type * as THREE_NS from "three";

/**
 * シーンの契約。シーンは「絵」だけを書く ―― ループ・リサイズ・可視判定・破棄のきっかけは ThreeStage が持つ。
 * 新しいシーン = scenes/<name>.ts で SceneFactory を default export → ThreeStage の scenes に 1 行。
 */
export type SceneContext = {
  THREE: typeof THREE_NS;
  renderer: THREE_NS.WebGLRenderer;
  width: number;
  height: number;
  /** true のとき render は 1 回しか呼ばれない。静止画として成立する構図にする */
  reducedMotion: boolean;
  /** globals.css のトークン値（例 "#2855be"）。色はここから取る */
  palette: { accent: string; accentSoft: string; ink: string; paper: string };
};

export type SceneInstance = {
  /** elapsed = 秒（停止中は進まない）、dt = 秒、pointer = 首屏上の位置 -1..1（fine pointer 以外は常に 0） */
  render(elapsed: number, dt: number, pointer: { x: number; y: number }): void;
  resize(width: number, height: number): void;
  /** 自分で作った geometry / material / texture を全部 dispose する */
  dispose(): void;
};

export type SceneFactory = (ctx: SceneContext) => SceneInstance;
