// Andrew's selected compositions, revised as stationary, binary overprints.
// No tweened opacity, translation, rotation, scale, or collapsing letter exits.
export const OVERPRINT_MODES = ['signal', 'chorus', 'columns', 'lattice', 'stack', 'relay', 'monument'];

// Deliberately favor fewer, larger letters; Signal alone explores a dense field.
// A new take chooses another grid, never a resize while letters are visible.
const GRID_CHOICES = {
  chorus: [[2, 2], [2, 3], [3, 2]],
  columns: [[2, 3], [3, 2], [2, 2]],
  lattice: [[3, 3], [3, 4], [4, 3]],
  stack: [[1, 2], [1, 3]],
  relay: [[2, 2], [3, 2], [2, 3]],
  signal: [[5, 6], [6, 5], [5, 5]],
};

export function overprintGrid(id, seed = 1) {
  const choices = GRID_CHOICES[id] || [[1, 1]];
  const offset = Math.floor(randomFor(0, id)() * choices.length);
  const [columns, rows] = choices[((seed >>> 0) + offset) % choices.length];
  return { columns, rows };
}

export function overprintLayout(id, seed = 1) {
  const grid = overprintGrid(id, seed);
  const { columns, rows } = grid;
  const tiles = [];
  const occupied = new Set();
  const reserve = (column, row, width = 1, height = 1) => {
    tiles.push({ column, row, width, height });
    for (let y = row; y < row + height; y++) for (let x = column; x < column + width; x++) occupied.add(y * columns + x);
  };
  if (id === 'lattice') {
    // Nested grids share one occupancy map: large 2x2 letters replace cells,
    // rather than painting over an independent small-letter layer.
    const random = randomFor(seed, 'mixed-lattice');
    const left = random() < .5 ? 0 : columns - 2;
    const top = random() < .5 ? 0 : rows - 2;
    reserve(left, top, 2, 2);
    if (columns === 4) reserve(left === 0 ? 2 : 0, top, 2, 2);
    else if (rows === 4) reserve(left, top === 0 ? 2 : 0, 2, 2);
  }
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    if (!occupied.has(row * columns + column)) reserve(column, row);
  }
  return { ...grid, tiles };
}

function perimeter(columns, rows) {
  const path = [];
  for (let col = 0; col < columns; col++) path.push(col);
  for (let row = 1; row < rows; row++) path.push(row * columns + columns - 1);
  if (rows > 1) for (let col = columns - 2; col >= 0; col--) path.push((rows - 1) * columns + col);
  if (columns > 1) for (let row = rows - 2; row > 0; row--) path.push(row * columns);
  return path;
}

function randomFor(seed, id) {
  let state = seed >>> 0;
  for (const character of id) state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffle(items, random) {
  const order = [...items];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function overprintFrames(id, count, seed = 1, columns = 4, tiles) {
  const random = randomFor(seed, id);
  const cells = Array.from({ length: count }, (_, i) => i);
  const order = shuffle(cells, random);
  let patterns;
  if (id === 'monument') {
    // Large-field changes are intentionally much farther apart than grid cuts.
    return [{ at: .3, on: [0] }, { at: 3.45 + random() * .2, on: [] },
      { at: 4.6 + random() * .15, on: [0] }, { at: 5.85, on: [] }];
  }
  if (id === 'stack') {
    const [a, b, c] = order;
    patterns = count === 2 ? [[a], cells, [b], [], [a], cells, [b]]
      : [[a], [a, c], [a, b, c], [b, c], [b], [a, b], [c]];
  } else if (id === 'columns') {
    const banks = shuffle(Array.from({ length: columns }, (_, i) => i), random);
    const bank = positions => cells.filter(cell => positions.includes(cell % columns));
    patterns = [bank(banks.slice(0, 1)), bank(banks.slice(0, 2)), bank(banks.slice(1)),
      cells, bank(banks.slice(-1)), bank(banks.slice(0, 1)), bank(banks.slice(1))];
  } else if (id === 'chorus') {
    patterns = [.2, .45, .75, 1, .6, .3, .12].map(fraction => order.slice(0, Math.max(1, Math.round(count * fraction))));
  } else if (id === 'lattice') {
    const checker = cells.filter(i => tiles ? (tiles[i].column + tiles[i].row) % 2 === 0
      : (i % columns + Math.floor(i / columns)) % 2 === 0);
    const inverse = cells.filter(i => !checker.includes(i));
    const subset = Math.max(1, Math.round(count / 4));
    patterns = [shuffle(checker, random).slice(0, subset), checker, [...checker, ...inverse.slice(0, subset)],
      cells, cells.filter(i => !order.slice(0, subset).includes(i)), inverse, inverse.slice(0, subset)];
  } else if (id === 'relay') {
    const path = perimeter(columns, count / columns);
    const offset = Math.floor(random() * path.length);
    const direction = random() < .5 ? -1 : 1;
    patterns = Array.from({ length: 7 }, (_, i) => [path[((offset + i * direction) % path.length + path.length) % path.length]]);
  } else {
    // Signal: irregular sparse masks rather than a global strobe.
    patterns = [.27, .4, .55, .2, .45, .3, .6].map(fraction => shuffle(cells, random).slice(0, Math.max(1, Math.round(count * fraction))));
  }
  // Spaced edits: at least .56s between field states; no rapid flashing.
  // Seeded randomness makes a take imperfect but keeps scrub/replay reproducible.
  const frames = patterns.map((on, index) => ({ at: .3 + index * .74 + (index ? random() * .18 : 0), on }));
  return [...frames, { at: 5.85, on: [] }];
}

export function addPortraitOverprint(tl, { group, glyphs, columns = 4, tiles }, id, start, seed) {
  tl.set(glyphs, { autoAlpha: 0, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1 }, start);
  tl.set(group, { autoAlpha: 1 }, start);
  for (const { at, on } of overprintFrames(id, glyphs.length, seed, columns, tiles)) {
    tl.set(glyphs, { autoAlpha: 0 }, start + at);
    if (on.length) tl.set(on.map(index => glyphs[index]), { autoAlpha: 1 }, start + at);
  }
  tl.set(group, { autoAlpha: 0 }, start + 5.85);
}
