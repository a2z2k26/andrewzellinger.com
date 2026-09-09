// Keep the text and its progress rule together within the actual free space.
export function readingContextLayout(titleBottom, clockTop, textHeight, showProgress = true) {
  const ruleGap = 25;
  const ruleHeight = 1;
  const height = textHeight + (showProgress ? ruleGap + ruleHeight : 0);
  const top = (titleBottom + clockTop - height) / 2;
  return { top, ruleTop: top + textHeight + ruleGap };
}
