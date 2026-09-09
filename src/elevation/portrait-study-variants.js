// These are typography studies, not replacement image assets. Every slice
// contains the same full-size A in the same coordinate system at rest.
export const NEW_PORTRAIT_STUDIES = [
  { id: 'multiplicity', label: '03 Multiplicity', layout: 'slices', columns: 8, rows: 1, hint: 'Repeated vertical slices resolve into one A.' },
  { id: 'registers', label: '04 Registers', layout: 'slices', columns: 1, rows: 7, hint: 'Horizontal bands slide into registration.' },
  { id: 'mosaic', label: '05 Mosaic', layout: 'slices', columns: 4, rows: 4, hint: 'Sixteen masked fragments assemble one letter.' },
  { id: 'quadrants', label: '06 Quadrants', layout: 'slices', columns: 2, rows: 2, hint: 'Four magnified copies converge at the center.' },
  { id: 'columns', label: '07 Columns', layout: 'grid', columns: 4, rows: 4, hint: 'Fixed column banks switch on and drop out.' },
  { id: 'rows', label: '08 Rows', layout: 'grid', columns: 4, rows: 4, hint: 'Alternating rows cross from opposite sides.' },
  { id: 'signal', label: '09 Signal', layout: 'grid', columns: 4, rows: 4, hint: 'Sparse groups switch on and off in spaced cuts.' },
  { id: 'relay', label: '10 Relay', layout: 'grid', columns: 4, rows: 4, hint: 'One fixed cell cuts to the next with no travel.' },
  { id: 'lattice', label: '11 Lattice', layout: 'grid', columns: 4, rows: 4, hint: 'Large and small overprints share a nested grid without overlapping.' },
  { id: 'stack', label: '12 Stack', layout: 'stack', columns: 1, rows: 3, hint: 'Three fixed overprints appear in irregular combinations.' },
];

export const STUDY_SLOT = 6.4;
export const STUDY_STILL = 2.7;

export function sliceInsets(index, columns, rows) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  return [row * 100 / rows, (columns - column - 1) * 100 / columns,
    (rows - row - 1) * 100 / rows, column * 100 / columns];
}

// No random timing: a review replay always shows the same composition.
// Signal changes only once per .72s and holds each group for .55s.
export const SIGNAL_BEATS = [
  [0, 5, 10, 15], [3, 6, 9, 12], [1, 4, 11, 14],
  [2, 7, 8, 13], [0, 6, 9, 15], [3, 5, 10, 12],
].map((cells, index) => ({ cells, at: .3 + index * .72, hold: .55 }));
export const RELAY_PATH = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];

export function seedPortraitVariant(gsap, { glyphs }, id) {
  if (id === 'registers') gsap.set(glyphs, { xPercent: i => i % 2 ? 105 : -105 });
  else if (id === 'columns') gsap.set(glyphs, { yPercent: -125 });
  else if (id === 'rows') gsap.set(glyphs, { xPercent: i => Math.floor(i / 4) % 2 ? 140 : -140 });
  else if (id === 'stack') gsap.set(glyphs, { yPercent: 125 });
  else gsap.set(glyphs, { autoAlpha: 0 });
}

export function addPortraitVariant(tl, nodes, id, start) {
  const { group, glyphs } = nodes;
  const enter = (from, to, at = .25) => tl.fromTo(glyphs, from,
    { ...to, immediateRender: false }, start + at);
  tl.set(group, { autoAlpha: 1 }, start);
  if (id === 'multiplicity') {
    enter({ xPercent: i => (i % 2 ? -1 : 1) * (10 + i * 3), yPercent: i => (i % 3 - 1) * 13, autoAlpha: 0 },
      { xPercent: i => (i % 2 ? -1 : 1) * (10 + i * 3), yPercent: i => (i % 3 - 1) * 13,
        autoAlpha: 1, duration: .35, stagger: .055, ease: 'power1.out' });
    tl.to(glyphs, { xPercent: 0, yPercent: 0, duration: 1.25, stagger: .075, ease: 'power3.inOut' }, start + .9);
    tl.to(glyphs, { yPercent: i => i % 2 ? -105 : 105, duration: .9, stagger: .055, ease: 'power3.inOut' }, start + 4.25);
  } else if (id === 'registers') {
    enter({ xPercent: i => i % 2 ? 105 : -105 },
      { xPercent: 0, duration: 1.2, stagger: .115, ease: 'power3.inOut' });
    tl.to(glyphs, { xPercent: i => i % 2 ? -105 : 105, duration: 1, stagger: .09, ease: 'power3.inOut' }, start + 4.05);
  } else if (id === 'mosaic') {
    enter({ xPercent: i => (i % 4 - 1.5) * 28, yPercent: i => (Math.floor(i / 4) - 1.5) * 28, autoAlpha: 0 },
      { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.2, stagger: { amount: .85, from: 'center' }, ease: 'power3.inOut' });
    tl.to(glyphs, { scale: .65, autoAlpha: 0, duration: .9, stagger: { amount: .8, from: 'edges' }, ease: 'power2.inOut' }, start + 3.95);
  } else if (id === 'quadrants') {
    enter({ scale: 1.8, xPercent: i => i % 2 ? 22 : -22, yPercent: i => i < 2 ? -22 : 22, autoAlpha: 0 },
      { scale: 1.8, xPercent: i => i % 2 ? 22 : -22, yPercent: i => i < 2 ? -22 : 22,
        autoAlpha: 1, duration: .5, stagger: .08, ease: 'power1.out' });
    tl.to(glyphs, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.35, stagger: .12, ease: 'power3.inOut' }, start + .8);
    tl.to(glyphs, { scale: .15, autoAlpha: 0, duration: 1.1, stagger: .13, ease: 'power3.inOut' }, start + 4.05);
  } else if (id === 'columns') {
    glyphs.forEach((glyph, i) => {
      const phase = (i % 4) * .22 + Math.floor(i / 4) * .07;
      tl.fromTo(glyph, { yPercent: -125 }, { yPercent: 0, duration: 1, ease: 'power3.out', immediateRender: false }, start + .25 + phase);
      tl.to(glyph, { yPercent: 125, duration: .9, ease: 'power3.inOut' }, start + 4.05 + phase);
    });
  } else if (id === 'rows') {
    glyphs.forEach((glyph, i) => {
      const row = Math.floor(i / 4), col = i % 4, direction = row % 2 ? -1 : 1;
      const phase = row * .19 + (direction > 0 ? col : 3 - col) * .075;
      tl.fromTo(glyph, { xPercent: direction * -140 }, { xPercent: 0, duration: .95, ease: 'power3.out', immediateRender: false }, start + .25 + phase);
      tl.to(glyph, { xPercent: direction * 140, duration: .85, ease: 'power3.inOut' }, start + 4.1 + phase);
    });
  } else if (id === 'signal') {
    tl.set(glyphs, { autoAlpha: 0 }, start);
    SIGNAL_BEATS.forEach(({ cells, at, hold }) => {
      const subset = cells.map(index => glyphs[index]);
      tl.set(subset, { autoAlpha: 1 }, start + at);
      tl.set(subset, { autoAlpha: 0 }, start + at + hold);
    });
  } else if (id === 'relay') {
    tl.set(glyphs, { autoAlpha: 0 }, start);
    RELAY_PATH.forEach((index, step) => {
      const glyph = glyphs[index], at = start + .25 + step * .4;
      tl.fromTo(glyph, { autoAlpha: 0, yPercent: 35 }, { autoAlpha: 1, yPercent: 0, duration: .2, ease: 'power2.out', immediateRender: false }, at);
      tl.to(glyph, { autoAlpha: 0, yPercent: -35, duration: .22, ease: 'power2.in' }, at + .24);
    });
  } else if (id === 'lattice') {
    enter({ scaleX: 0, scaleY: .15, autoAlpha: 0 },
      { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: .95, stagger: { amount: .9, from: 'center' }, ease: 'power3.inOut' });
    tl.to(glyphs, { scaleY: .02, autoAlpha: 0, duration: .8, stagger: { amount: .9, from: 'edges' }, ease: 'power3.inOut' }, start + 4.05);
  } else if (id === 'stack') {
    enter({ yPercent: 125 }, { yPercent: 0, duration: 1.15, stagger: .32, ease: 'power3.out' });
    tl.to(glyphs, { yPercent: -125, duration: 1, stagger: .3, ease: 'power3.inOut' }, start + 4.1);
  }
  tl.set(group, { autoAlpha: 0 }, start + 5.85);
}
