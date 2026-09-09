import { NEW_PORTRAIT_STUDIES, STUDY_SLOT, addPortraitVariant, seedPortraitVariant } from './portrait-study-variants.js';
import { OVERPRINT_MODES, addPortraitOverprint } from './portrait-overprint.js';

export const PORTRAIT_AUTO_MODES = OVERPRINT_MODES;
export const PORTRAIT_STUDY_MODES = ['auto', 'monument', 'chorus', ...NEW_PORTRAIT_STUDIES.map(study => study.id), 'orbit', 'original'];
export const PORTRAIT_STUDY_BLENDS = ['overlay', 'difference', 'normal'];

export function portraitStudyTarget(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/' ? '.index-static-field' : path === '/history' ? '.biography-portrait-placeholder' : null;
}

export function orbitPlacement(index, count = 12) {
  const turn = index / count;
  const angle = turn * Math.PI * 2 - Math.PI / 2;
  const radius = 25 + turn * 16;
  return { left: 50 + Math.cos(angle) * radius, top: 50 + Math.sin(angle) * radius, rotation: turn * 360 };
}

export function portraitStudyCanPlay({ reduced, userPaused, globalPaused, visible, hidden, original }) {
  return !reduced && !userPaused && !globalPaused && visible && !hidden && !original;
}

// Selected compositions are stationary hard-cut overprints. Earlier, unselected
// motion tests stay available explicitly; none runs in the automatic sequence.
// The photograph and its crop never change.
export function createPortraitTimeline(gsap, nodes, mode = 'auto', seed = 1) {
  const { monument, chorus, orbit, chorusLetters, orbitLetters, bigLetter } = nodes;
  gsap.set([monument, chorus, orbit], { autoAlpha: 0 });
  gsap.set([bigLetter, ...chorusLetters], { autoAlpha: 0, xPercent: 0, yPercent: 0, rotation: 0, scale: 1 });
  gsap.set(orbitLetters, { autoAlpha: 0, scale: .1 });
  Object.entries(nodes.studies || {}).forEach(([id, { group, glyphs }]) => {
    gsap.set(group, { autoAlpha: 0 });
    gsap.set(glyphs, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0 });
    if (OVERPRINT_MODES.includes(id)) gsap.set(glyphs, { autoAlpha: 0 });
    else seedPortraitVariant(gsap, { glyphs }, id);
  });
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .7 });
  const motifs = mode === 'auto' ? PORTRAIT_AUTO_MODES : [mode];
  motifs.forEach((motif, index) => {
    const start = index * STUDY_SLOT;
    tl.addLabel(motif, start);
    if (OVERPRINT_MODES.includes(motif)) {
      const targets = motif === 'monument' ? { group: monument, glyphs: [bigLetter] }
        : motif === 'chorus' ? { group: chorus, glyphs: chorusLetters, columns: nodes.chorusColumns } : nodes.studies[motif];
      addPortraitOverprint(tl, targets, motif, start, seed);
    } else if (nodes.studies?.[motif]) {
      addPortraitVariant(tl, nodes.studies[motif], motif, start);
    } else if (motif === 'orbit') {
      tl.set(orbit, { autoAlpha: 1 }, start);
      tl.fromTo(orbitLetters, { scale: .1, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: .75, stagger: .055,
          ease: 'power2.out', immediateRender: false }, start + .2);
      tl.fromTo(orbit, { rotation: -55, scale: .76 },
        { rotation: 185, scale: 1.08, duration: 4.35, ease: 'sine.inOut', immediateRender: false }, start + .2);
      tl.to(orbitLetters, { scale: .15, autoAlpha: 0, duration: .65,
        stagger: .035, ease: 'power2.in' }, start + 3.65);
      tl.set(orbit, { autoAlpha: 0 }, start + 4.8);
    }
  });
  // Hold the unmarked photo briefly at each seam; no abrupt reset frame.
  tl.to({}, { duration: .55 }, motifs.length * STUDY_SLOT - .55);
  return tl;
}
