// level.js — datos de nivel + parser resiliente.
// Legend de mapas (ver MAPS abajo):
//   # tech  % concrete  F flesh  P techpanel  R rust  M marble
//   + door  = locked door (necesita llave)  X exit switch  . floor
//   @ player start
//   enemigos: z zombie  i imp  d demon(pinky)
//   items: h health  a ammo  s shotgun  c chaingun  l plasma  m armor  k key

const WALL_CHARS = { '#': 1, '%': 2, 'F': 3, 'P': 4, 'R': 5, 'M': 6, '+': 7, '=': 7, 'X': 8 };
const ENTITY_CHARS = new Set(['z', 'i', 'd', 'h', 'a', 's', 'c', 'l', 'm', 'k']);
const ENTITY_KIND = {
  z: { kind: 'enemy', type: 'zombie' }, i: { kind: 'enemy', type: 'imp' }, d: { kind: 'enemy', type: 'pinky' },
  h: { kind: 'pickup', type: 'health' }, a: { kind: 'pickup', type: 'ammo' }, s: { kind: 'pickup', type: 'shotgun' },
  c: { kind: 'pickup', type: 'chaingun' }, l: { kind: 'pickup', type: 'plasma' }, m: { kind: 'pickup', type: 'armor' },
  k: { kind: 'pickup', type: 'key' },
};

function parseMap(name, src, opts = {}) {
  let rows = src.replace(/^\n+|\n+$/g, '').split('\n');
  const W = Math.max(...rows.map((r) => r.length));
  const diags = [];
  rows = rows.map((r, i) => {
    if (r.length !== W) { diags.push(`row ${i} len ${r.length}!=${W} (padded)`); return r.padEnd(W, '#'); }
    return r;
  });
  const H = rows.length;
  const cells = new Uint8Array(W * H);
  const spawns = [];
  const doors = [];
  let start = { x: 1.5, y: 1.5, angle: opts.angle ?? 0 };
  let exit = null;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ch = rows[y][x];
      if (WALL_CHARS[ch]) {
        cells[y * W + x] = WALL_CHARS[ch];
        if (ch === '+' || ch === '=') doors.push({ x, y, locked: ch === '=' });
        if (ch === 'X') exit = { x, y };
      } else if (ch === '@') {
        start = { x: x + 0.5, y: y + 0.5, angle: opts.angle ?? 0 };
      } else if (ENTITY_CHARS.has(ch)) {
        const e = ENTITY_KIND[ch];
        spawns.push({ ...e, x: x + 0.5, y: y + 0.5 });
      }
      // '.' y demas -> floor (0)
    }
  }
  if (diags.length) console.warn(`[level ${name}]`, diags.join(' | '));
  return { name, w: W, h: H, cells, start, spawns, doors, exit, par: opts.par ?? 90 };
}

// ---- Mapa 1: "Hangar" — intro: techbase, una puerta, un imp, escopeta, salida ----
const MAP_1 = `
########################
#@.....#.......#...hh..#
#......#...zz..#.......#
#......+.......#...a...#
#......#.......%%%%%#..#
#......#####+####...#..#
#....i.#......P.....#..#
#......#......P#%%%#%%.#
#......#......P#.....F.#
#......#......P#..d..F.#
###+####......P#.....F.#
#.............P#.....X.#
#..s...#......P#%%%%%%%#
#......#......P#.......#
#......#......+....k...#
#......########%#......#
#......#.............m.#
#..ii..#....d.........R#
#......#......#........R#
#......#......#...c..#.R#
#......#......#......#.R#
#......#......#...l..#.R#
#......#......#......#.R#
########################
`;

// ---- Mapa 2: "Refinery" — mas abierto, flesh/hell, mas enemigos ----
const MAP_2 = `
########################
#@...........FFFFFFFFFF#
#....zz...............F#
#..........d.....ii...F#
#FFFF+FFFF............F#
#F.......F....m.......F#
#F..hh...F...........F#
#F.......FFFFFF+FFFFF.F#
#F............F.....F.F#
#F....s.......F..d..F.F#
#F............F.....F.F#
#FFFFFFFF+FFFFF.....F.F#
#..................F..F#
#...d.....k.......F...F#
#............%%%%%%...F#
#....ii......%...X%...F#
#............%....%...F#
#....c.......%%%%%%...F#
#....................F#
#FF.FFFFFFFFFFFFFF.FFFF#
#FF.....l.........a..FF#
#FF...............d..FF#
#FFFFFFFFFFFFFFFFFFFFFFF#
########################
`;

export const LEVELS = [
  () => parseMap('E1M1 Hangar', MAP_1, { angle: 0, par: 75 }),
  () => parseMap('E1M2 Refinery', MAP_2, { angle: 0, par: 120 }),
];

export function loadLevel(index) {
  const factory = LEVELS[index % LEVELS.length];
  return factory();
}

export const levelCount = LEVELS.length;
