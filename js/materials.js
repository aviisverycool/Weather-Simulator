export const AIR = 0;
export const DIRT = 1;
export const STONE = 2;
export const GRASS = 3;
export const WOOD = 4;
export const LEAF = 5;
export const WATER = 6;

const rgb = (r, g, b) => (0xff << 24) | (b << 16) | (g << 8) | r;

export const COLORS = new Uint32Array(7);
COLORS[AIR] = rgb(0, 0, 0);
COLORS[DIRT] = rgb(70, 37, 17);
COLORS[STONE] = rgb(110, 110, 120);
COLORS[GRASS] = rgb(59, 149, 62);
COLORS[WOOD] = rgb(89, 60, 41);
COLORS[LEAF] = rgb(60, 132, 64);
COLORS[WATER] = rgb(50, 120, 200);

export const FALLS = new Set([DIRT, GRASS]);

export function line(x0, y0, x1, y1, cb) {
    const dx = Math.abs(x1 - x0), sx = x0 <x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 <y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
        cb(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {err += dy; x0 += sx}
        if (e2 <= dx) {err += dx; y0 += sy}
    }
}