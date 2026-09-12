import { gsap } from 'gsap';
import { PHONE_MOTION as motion, isPhoneWidth, phoneCSSVariables } from './profile.js';
import './phone.css';

if (typeof document !== 'undefined') {
  for (const [name, value] of Object.entries(phoneCSSVariables())) document.documentElement.style.setProperty(name, value);
}
export const isPhone = () => isPhoneWidth(innerWidth);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.dataset.editionMotion === 'reduced';
const visible = node => node && node.getBoundingClientRect().bottom > 0 && node.getBoundingClientRect().top < innerHeight;

function watchEnvironment(cancel) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  window.addEventListener('resize', cancel);
  window.addEventListener('pagehide', cancel);
  preference.addEventListener('change', cancel);
  return () => {
    window.removeEventListener('resize', cancel);
    window.removeEventListener('pagehide', cancel);
    preference.removeEventListener('change', cancel);
  };
}

// Every handle resolves on cancellation and releases only the styles it owns.
export function animatePhoneReading(view, entering, reduceMotion, onComplete = () => {}) {
  let resolve;
  const finished = new Promise(done => { resolve = done; });
  let timeline;
  let unwatch = () => {};
  let settled = false;
  const header = entering ? [...view.querySelectorAll('[data-detail-motion-title], [data-detail-motion-meta], [data-detail-motion-lede]')].filter(visible) : [];
  const clear = () => {
    gsap.set(view, { clearProps: 'opacity,transform' });
    if (header.length) gsap.set(header, { clearProps: 'opacity,transform,clipPath' });
  };
  const finish = (notify = true) => {
    if (settled) return;
    settled = true; unwatch(); clear(); resolve();
    if (notify) onComplete();
  };
  const cancel = () => { timeline?.kill(); finish(false); };
  unwatch = watchEnvironment(cancel);
  if (reduceMotion || reduced()) finish();
  else {
    timeline = gsap.timeline({ onComplete: () => finish() });
    if (entering) {
      timeline.fromTo(view, { opacity: 0 }, { opacity: 1, duration: motion.duration.response, ease: motion.ease.enter }, 0);
      header.forEach((node, index) => timeline.fromTo(node,
        { opacity: 0, y: motion.distance.reveal, clipPath: node.matches('[data-detail-motion-title]') ? 'inset(0 0 100% 0)' : 'none' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: motion.duration.reading, ease: motion.ease.enter }, index * motion.stagger));
    } else {
      timeline.to(view, { opacity: 0, y: motion.distance.page, duration: motion.duration.exit, ease: motion.ease.exit }, 0);
    }
  }
  return { finished, cancel };
}

export function animatePhoneArrival(targets, { returning = false } = {}) {
  const nodes = [...targets].filter(Boolean);
  let timeline;
  let unwatch = () => {};
  let resolve;
  const finished = new Promise(done => { resolve = done; });
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    unwatch();
    if (nodes.length) gsap.set(nodes, { clearProps: 'opacity,transform,clipPath' });
    resolve();
  };
  const cancel = () => { timeline?.kill(); finish(); };
  unwatch = watchEnvironment(cancel);
  if (!isPhone() || reduced() || !nodes.length) finish();
  else {
    timeline = gsap.timeline({ onComplete: finish });
    // Returns restore the collection before painting; never move its scroll position.
    timeline.fromTo(nodes, { opacity: returning ? .65 : 0, y: returning ? 0 : motion.distance.reveal },
      { opacity: 1, y: 0, duration: returning ? motion.duration.feedback : motion.duration.reading,
        stagger: returning ? 0 : motion.stagger, ease: motion.ease.enter }, 0);
  }
  return { finished, cancel };
}
