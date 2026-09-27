import { Fragment } from "react";

/**
 * 設計稿どおりの位置で改行する見出し/文。
 * <br> の前に半角スペースを置く ―― 視覚上は行末で消えるが、読み上げ・コピー時に語がくっつかない。
 */
export function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? (
        <>
          {" "}
          <br />
        </>
      ) : null}
      {line}
    </Fragment>
  ));
}
