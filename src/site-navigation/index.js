import { NAVIGATION_ROUTES, navigationSection, detailReturn, centeredMastheadLeft } from './model.js';
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
  nav.id = 'site-primary-navigation';
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
  const menuToggle = make('button', 'site-navigation__menu-toggle');
  menuToggle.type = 'button';
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.setAttribute('aria-controls', nav.id);
  menuToggle.setAttribute('aria-expanded', 'false');
  const menuIcon = make('span', 'site-navigation__menu-icon');
  menuIcon.setAttribute('aria-hidden', 'true');
  menuToggle.append(menuIcon);
  host.append(menuToggle, nav, back);
  document.body.append(host);
  const compact = matchMedia('(max-width: 991px)');
  const phone = matchMedia('(max-width: 599px)');
  let mobileMenuOpen = false;
  let gestureStartY = null;
  let gesturePointerId = null;
  let suppressToggleClick = false;
  let frame = 0;
  const brand = document.querySelector('.nav_brand');
  const place = () => {
    host.style.setProperty('--mobile-menu-content-height', nav.offsetHeight + 'px');
    root.style.setProperty('--site-nav-title-top', heading.getBoundingClientRect().top + 'px');
    if (brand) {
      const rect = brand.getBoundingClientRect();
      const gridGap = Number.parseFloat(getComputedStyle(root).getPropertyValue('--structure--grid-row-gap')) || 0;
      const rightColumnLeft = window.innerWidth / 2 + gridGap / 2;
      const menuWidth = nav.getBoundingClientRect().width;
      root.style.setProperty('--masthead-left', centeredMastheadLeft(rect.right, rightColumnLeft, menuWidth, -136) + 'px');
      root.style.setProperty('--masthead-top', (rect.top + rect.height / 2 - 22) + 'px');
    }
  };
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };
  const setMobileMenuOpen = (open, { returnFocus = false } = {}) => {
    mobileMenuOpen = Boolean(open) && phone.matches && !detailReturn(location.pathname);
    host.classList.toggle('site-navigation--mobile-open', mobileMenuOpen);
    menuToggle.setAttribute('aria-expanded', String(mobileMenuOpen));
    menuToggle.setAttribute('aria-label', mobileMenuOpen ? 'Close navigation' : 'Open navigation');
    nav.setAttribute('aria-hidden', String(phone.matches && !mobileMenuOpen));
    links.forEach(link => { link.tabIndex = phone.matches && !mobileMenuOpen ? -1 : 0; });
    if (returnFocus) menuToggle.focus({ preventScroll: true });
  };
  const synchronize = () => {
    const section = navigationSection(location.pathname);
    const detail = detailReturn(location.pathname);
    links.forEach(link => {
      if (link.dataset.destination === section) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    nav.hidden = Boolean(detail) && compact.matches;
    menuToggle.hidden = Boolean(detail);
    back.hidden = !detail;
    setMobileMenuOpen(mobileMenuOpen);
    if (detail) {
      back.href = detail.path;
      back.setAttribute('aria-label', (compact.matches ? 'Close' : 'Back') + ' — return to ' + detail.label);
    }
    schedule();
  };
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link) setMobileMenuOpen(false);
    if (link && !detailReturn(location.pathname) && !event.button && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && link.dataset.destination === navigationSection(location.pathname)) event.preventDefault();
  });
  menuToggle.addEventListener('click', () => {
    if (suppressToggleClick) return;
    setMobileMenuOpen(!mobileMenuOpen);
  });
  menuToggle.addEventListener('pointerdown', event => {
    if (!phone.matches || event.button !== 0) return;
    gestureStartY = event.clientY;
    gesturePointerId = event.pointerId;
    menuToggle.setPointerCapture?.(event.pointerId);
  });
  menuToggle.addEventListener('pointermove', event => {
    if (event.pointerId !== gesturePointerId || gestureStartY === null) return;
    const travel = event.clientY - gestureStartY;
    if ((!mobileMenuOpen && travel <= -24) || (mobileMenuOpen && travel >= 24)) {
      suppressToggleClick = true;
      setMobileMenuOpen(!mobileMenuOpen);
      gestureStartY = null;
    }
  });
  const endGesture = event => {
    if (event.pointerId !== gesturePointerId) return;
    gestureStartY = null;
    gesturePointerId = null;
    setTimeout(() => { suppressToggleClick = false; }, 0);
  };
  menuToggle.addEventListener('pointerup', endGesture);
  menuToggle.addEventListener('pointercancel', endGesture);
  document.addEventListener('pointerdown', event => {
    if (mobileMenuOpen && !host.contains(event.target)) setMobileMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenuOpen) {
      event.preventDefault();
      setMobileMenuOpen(false, { returnFocus: true });
    }
  });
  const observer = new MutationObserver(synchronize);
  observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-detail-active-slug'] });
  const sizes = new ResizeObserver(schedule);
  sizes.observe(heading);
  if (brand) sizes.observe(brand);
  sizes.observe(nav);
  window.addEventListener('resize', schedule);
  for (const event of ['portfolio:routechange', 'portfolio:rail-sweep-arrival', 'popstate', 'pageshow']) window.addEventListener(event, synchronize);
  compact.addEventListener('change', synchronize);
  phone.addEventListener('change', synchronize);
  document.fonts?.ready.then(schedule);
  synchronize();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
