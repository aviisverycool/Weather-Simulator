export const AIR = 0;
export const DIRT = 1;
export const STONE = 2;
export const GRASS = 3;
export const WOOD = 4;
export const LEAF = 5;
export const WATER = 6;
export const FIRE = 7;
export const SMOKE = 8;
export const STEAM = 9;

const rgb = (r, g, b) => (0xff << 24) | (b << 16) | (g << 8) | r;

function createVariants(r, g, b) {
    const variation = 10;
    const clamp = (value) => Math.max(0, Math.min(255, value));
    return new Uint32Array([
        rgb(r, g, b),
        rgb(clamp(r - variation), clamp(g - variation), clamp(b - variation)),
        rgb(clamp(r + variation), clamp(g + variation), clamp(b + variation))
    ]);
}

export const VARIANTS = [];

VARIANTS[AIR] = new Uint32Array(3).fill(rgb(0, 0, 0));
VARIANTS[DIRT] = createVariants(70, 37, 17);
VARIANTS[STONE] = createVariants(110, 110, 120);
VARIANTS[GRASS] = createVariants(59, 149, 62);
VARIANTS[WOOD] = createVariants(89, 60, 41);
VARIANTS[LEAF] = createVariants(60, 132, 64);
VARIANTS[WATER] = createVariants(50, 120, 200);
VARIANTS[FIRE] = createVariants(255, 100, 0);
VARIANTS[SMOKE] = createVariants(80, 80, 80);
VARIANTS[STEAM] = createVariants(220, 220, 230);

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