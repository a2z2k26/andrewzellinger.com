import { NAVIGATION_ROUTES, navigationSection, detailReturn } from './model.js';
import './styles.css';
const root = document.documentElement;
root.dataset.siteNavigation = 'masthead';
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
function initialize() {
  if (document.querySelector('.site-navigation')) return;
  const heading = document.querySelector('.title .heading');
  if (!heading) return;
  const legacy = document.querySelector('.nav_wrapper');
  if (legacy) legacy.inert = true;
  const identity = document.querySelector('.nav');
  identity?.setAttribute('role', 'banner');
  identity?.removeAttribute('aria-label');
  const host = make('div', 'site-navigation');
  const nav = make('nav', 'masthead-links');
  nav.setAttribute('aria-label', 'Primary navigation');
  const links = NAVIGATION_ROUTES.map(route => {
    const link = make('a', 'masthead-link', route.label);
    link.href = route.path;
    link.dataset.destination = route.path;
    nav.append(link);
    return link;
  });
  const back = make('a', 'site-navigation__back');
  back.dataset.siteDetailBack = '';
  const icon = make('span', 'site-navigation__close-icon');
  const arrow = make('span', 'site-navigation__back-arrow');
  icon.setAttribute('aria-hidden', 'true');
  arrow.setAttribute('aria-hidden', 'true');
  back.append(icon, arrow, make('span', 'site-navigation__desktop-label', 'Back'), make('span', 'site-navigation__close-label', 'Close'));
  host.append(nav, back);
  document.body.append(host);
  const compact = matchMedia('(max-width: 991px)');
  let frame = 0;
  const place = () => root.style.setProperty('--site-nav-title-top', heading.getBoundingClientRect().top + 'px');
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };
  const synchronize = () => {
    const section = navigationSection(location.pathname);
    const detail = detailReturn(location.pathname);
    links.forEach(link => {
      if (link.dataset.destination === section) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    nav.hidden = Boolean(detail) && compact.matches;
    back.hidden = !detail;
    if (detail) {
      back.href = detail.path;
      back.setAttribute('aria-label', (compact.matches ? 'Close' : 'Back') + ' — return to ' + detail.label);
    }
    schedule();
  };
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && !detailReturn(location.pathname) && !event.button && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && link.dataset.destination === navigationSection(location.pathname)) event.preventDefault();
  });
  const observer = new MutationObserver(synchronize);
  observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-detail-active-slug'] });
  new ResizeObserver(schedule).observe(heading);
  window.addEventListener('resize', schedule);
  for (const event of ['portfolio:routechange', 'portfolio:rail-sweep-arrival', 'popstate', 'pageshow']) window.addEventListener(event, synchronize);
  compact.addEventListener('change', synchronize);
  document.fonts?.ready.then(schedule);
  synchronize();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
