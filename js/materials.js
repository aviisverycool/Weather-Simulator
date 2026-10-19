export const AIR = 0;
export const DIRT = 1;
export const STONE = 2;
export const GRASS = 3;
export const WOOD = 4;
export const LEAF = 5;

const rgb = (r, g, b) => (0xff << 24) | (b << 16) | (g << 8) | r;

export const COLORS = new Uint32Array(6);
COLORS[AIR] = rgb(0, 0, 0);
COLORS[DIRT] = rgb(70, 37, 17);
COLORS[STONE] = rgb(110, 110, 120);
COLORS[GRASS] = rgb(59, 149, 62);
COLORS[WOOD] = rgb(89, 60, 41);
COLORS[LEAF] = rgb(60, 132, 64);

export const FALLS = new Set([DIRT, GRASS]);
