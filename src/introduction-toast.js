// A quiet, nonmodal alternative; the retained welcome modal stays disabled.
const isProjects = () => ["", "/projects"].includes(location.pathname.replace(/\/$/, ""));
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function mountToast() {
  if (!isProjects() || document.querySelector('.introduction-toast')) return;
  const toast = document.createElement('aside');
  toast.className = 'introduction-toast';
  toast.setAttribute('aria-label', 'Portfolio introduction');
  toast.dataset.state = 'entering';
  toast.innerHTML = `
    <p class="introduction-toast__copy">This site documents my commercial product design work. Explore my AI projects here:</p>
    <p class="introduction-toast__visit"><span>visit</span><a href="https://andrewzellinger.framer.website/" target="_blank" rel="noopener noreferrer">temporary.com</a></p>
    <button class="introduction-toast__close" type="button" aria-label="Dismiss portfolio introduction">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8" /></svg>
    </button>
  `;
  let lastPageFocus = document.activeElement;
  let timer = 0;
  let frame = 0;
  let closing = false;
  const closeButton = toast.querySelector('button');

  function trackFocus(event) {
    if (!toast.contains(event.target)) lastPageFocus = event.target;
  }
  function removeToast() {
    const restoreFocus = toast.contains(document.activeElement);
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    window.removeEventListener('pagehide', removeToast);
    window.removeEventListener('portfolio:routechange', onRouteChange);
    document.removeEventListener('focusin', trackFocus);
    toast.removeEventListener('keydown', onKeyDown);
    closeButton.removeEventListener('click', dismiss);
    toast.remove();
    if (restoreFocus) {
      const target = lastPageFocus instanceof HTMLElement && lastPageFocus.isConnected
        && lastPageFocus !== document.body ? lastPageFocus
        : document.querySelector(matchMedia('(max-width: 599px)').matches
          ? '.site-navigation__menu-toggle' : '.masthead-link[aria-current="page"]');
      target?.focus({ preventScroll: true });
    }
  }
  function dismiss() {
    if (closing) return;
    closing = true;
    cancelAnimationFrame(frame);
    toast.dataset.state = 'leaving';
    if (reducedMotion()) removeToast();
    else timer = setTimeout(removeToast, 200);
  }
  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    dismiss();
  }
  function onRouteChange() {
    if (!isProjects()) removeToast();
  }
  document.body.append(toast);
  closeButton.addEventListener('click', dismiss);
  toast.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', trackFocus);
  window.addEventListener('pagehide', removeToast, { once: true });
  window.addEventListener('portfolio:routechange', onRouteChange);
  frame = requestAnimationFrame(() => { toast.dataset.state = 'open'; });
}

// Let incoming browser snapshots clear before showing the notice.
const incomingReady = isProjects() && 'onpagereveal' in window
  ? new Promise(resolve => window.addEventListener('pagereveal', event => {
    if (event.viewTransition) event.viewTransition.finished.catch(() => {}).then(resolve);
    else resolve();
  }, { once: true }))
  : Promise.resolve();
const mountWhenReady = () => incomingReady.then(mountToast);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountWhenReady, { once: true });
else mountWhenReady();
