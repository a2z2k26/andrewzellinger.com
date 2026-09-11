export const NAVIGATION_ROUTES = [
  { path: '/', label: 'Projects' },
  { path: '/articles', label: 'Articles' },
  { path: '/history', label: 'History' },
];
export function navigationSection(path) {
  if (/^\/articles(?:\/|$)/.test(path)) return '/articles';
  if (/^\/history\/?$/.test(path)) return '/history';
  return '/';
}
export function detailReturn(path) {
  if (/^\/case-studies\/[^/]+/.test(path)) return { path: '/', label: 'Projects' };
  if (/^\/articles\/[^/]+/.test(path)) return { path: '/articles', label: 'Articles' };
  return null;
}

export function centeredMastheadLeft(brandRight, rightColumnLeft, menuWidth, offset = 0) {
  return brandRight + (rightColumnLeft - brandRight - menuWidth) / 2 + offset;
}
