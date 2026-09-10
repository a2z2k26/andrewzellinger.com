// Anchor the context to its page title; keep the progress rule with the text.
export function readingContextLayout(titleBottom, textHeight) {
  const titleGap = 32;
  const ruleGap = 25;
  const top = titleBottom + titleGap;
  return { top, ruleTop: top + textHeight + ruleGap };
}
