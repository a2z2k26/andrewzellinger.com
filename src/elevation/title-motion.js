import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { pageTitleForPath, titleCascadeTiming, titleSnapshotIndex } from './title-motion-model.js';
import './title-motion.css';

gsap.registerPlugin(SplitText);
let split = null;
let domMotion = null;

export function ensureTitleCharacters() {
  const heading = document.querySelector('.title .heading');
  if (!heading) return null;
  // Home and Projects share one HTML file. Resolve the canonical heading
  // before capture, rather than depending on DOMContentLoaded listener order.
  const canonicalText = pageTitleForPath(location.pathname);
  if (canonicalText && heading.textContent !== canonicalText) heading.textContent = canonicalText;
  if (split?.elements[0] === heading && split.chars.every(char => heading.contains(char))) return split;
  const desktopText = heading.querySelector('.home-title-desktop')?.textContent;
  const mobileText = heading.querySelector('.home-title-mobile')?.textContent;
  if (desktopText && desktopText === mobileText) heading.textContent = desktopText;
  // Detail chrome can replace h1.textContent. Do not revert an obsolete split
  // over the newer authored title when that happens.
  domMotion?.cancel();
  split?.kill();
  heading.removeAttribute('aria-label');
  split = SplitText.create(heading, {
    type: 'chars', mask: 'chars', smartWrap: true, aria: 'auto',
    charsClass: 'page-title-char', tag: 'span', overwrite: false,
  });
  return split;
}

export function resetTitleCharacters() {
  domMotion?.cancel();
  if (split) gsap.set(split.chars, { clearProps: 'transform' });
}

export function captureTitleCharacters(phase) {
  resetTitleCharacters();
  const current = ensureTitleCharacters();
  current?.masks.forEach((mask, index) => {
    // Separate old/new names retain each glyph's exact position and width:
    // no horizontal morph between, for example, Designer and Projects.
    mask.style.viewTransitionName = `cf-letter-${phase}-${index}`;
  });
}

export function animateTitleCharacters(phase, width = innerWidth) {
  resetTitleCharacters();
  const current = ensureTitleCharacters();
  let resolve;
  const finished = new Promise(done => { resolve = done; });
  if (!current) { resolve(); return { finished, cancel() {} }; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.dataset.editionMotion === 'reduced';
  if (reduced) { resolve(); return { finished, cancel() {} }; }
  const timing = titleCascadeTiming(width, current.chars.length, current.chars.length)[phase];
  const timeline = gsap.timeline({ onComplete: resolve });
  timeline.fromTo(current.chars,
    { yPercent: phase === 'enter' ? -150 : 0 },
    { yPercent: phase === 'enter' ? 0 : 150, duration: timing.duration,
      stagger: { amount: timing.amount, from: 'start' }, ease: timing.ease }, 0);
  const motion = { finished, cancel() {
    timeline.kill();
    gsap.set(current.chars, { clearProps: 'transform' });
    if (domMotion === motion) domMotion = null;
    resolve();
  } };
  domMotion = motion;
  return motion;
}

export function animateCapturedTitleCharacters(width = innerWidth) {
  // Cross-document View Transitions paint in a browser-owned top layer.
  // GSAP drives the paused snapshot animations' clocks, not invisible DOM
  // underneath them. Masks and character placement stay fixed throughout.
  const snapshots = document.getAnimations().flatMap(animation => {
    const info = titleSnapshotIndex(animation.effect?.pseudoElement);
    return info && /^cf-letter-(exit|enter)$/.test(animation.animationName)
      ? [{ ...info, animation, time: 0 }] : [];
  }).sort((a, b) => a.index - b.index);
  if (!snapshots.length) return () => {};
  const outgoing = snapshots.filter(item => item.phase === 'exit');
  const incoming = snapshots.filter(item => item.phase === 'enter');
  const timing = titleCascadeTiming(width, outgoing.length, incoming.length);
  snapshots.forEach(item => { item.animation.pause(); item.animation.currentTime = 0; });
  const timeline = gsap.timeline({
    onUpdate: () => snapshots.forEach(item => { item.animation.currentTime = item.time; }),
    onComplete: () => snapshots.forEach(item => item.animation.finish()),
  });
  for (const [items, settings, start] of [[outgoing, timing.exit, 0], [incoming, timing.enter, timing.incomingStart]]) {
    if (items.length) timeline.to(items, { time: 1000, duration: settings.duration,
      stagger: { amount: settings.amount, from: 'start' }, ease: settings.ease }, start);
  }
  return () => { timeline.kill(); snapshots.forEach(item => item.animation.cancel()); };
}

window.addEventListener('resize', resetTitleCharacters);
window.addEventListener('pageshow', event => { if (event.persisted) resetTitleCharacters(); });
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', resetTitleCharacters);
