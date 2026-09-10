// Timing is shared by real DOM characters and native snapshot characters.
// The outgoing cascade finishes before the first incoming glyph is revealed.
export function pageTitleForPath(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/') return 'Projects';
  if (path === '/projects' || path.startsWith('/case-studies/')) return 'Projects';
  if (path === '/articles' || path.startsWith('/articles/')) return 'Articles';
  return path === '/history' ? 'History' : null;
}

export function titleCascadeTiming(width, outgoingCount = 8, incomingCount = 8) {
  const compact = width < 992;
  const spread = (count, each, cap) => Math.min(Math.max(0, count - 1) * each, cap);
  const exit = { duration: compact ? .20 : .26, amount: spread(outgoingCount, .02, compact ? .10 : .14), ease: 'power2.inOut' };
  const enter = { duration: compact ? .28 : .34, amount: spread(incomingCount, .023, compact ? .12 : .16), ease: 'power3.out' };
  const incomingStart = exit.duration + exit.amount + .025;
  return { exit, enter, incomingStart, total: incomingStart + enter.duration + enter.amount };
}

export function titleSnapshotIndex(pseudoElement) {
  const match = /::view-transition-(old|new)\(cf-letter-(?:out|in)-(\d+)\)/.exec(pseudoElement || '');
  return match ? { phase: match[1] === 'old' ? 'exit' : 'enter', index: Number(match[2]) } : null;
}
