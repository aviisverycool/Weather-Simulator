import {W, H} from './config.js';
import {AIR, STONE, GRASS, DIRT} from './materials.js';
import {idx} from './config.js';

export const material = new Uint8Array(W*H);

export function seed() {
    const groundY = Math.floor(H*0.75)
    for (let y = groundY; y < H; y++) {
        for (let x = 0; x < W; x++) {
            let m = STONE;
            if (y === groundY) m = GRASS;
            else if (y <groundY + 4) m = DIRT;
            material[idx(x, y)] = m;
        }
    }
}

export function clear() {
    material.fill(AIR);
}

export function get(x, y) {
    if (x < 0 || x >=W || y < 0 || y >= H) return AIR;
    return material[idx(x, y)];
}

export function set(x, y, m) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    material[idx(x, y)] = m;
}