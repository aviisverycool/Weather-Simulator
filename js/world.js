import {W, H} from './config.js';
import {AIR, STONE, GRASS, DIRT} from './materials.js';
import {idx} from './config.js';

export const material = new Uint8Array(W*H);

export function seed() {
    const baseY = Math.floor(H*0.75);

    for (let x =0; x < W; x++) {

        // Sine waves for procederal generation
        const wave1 = Math.sin(x*0.05)*15
        const wave2 = Math.sin((x*0.2)+1.5)*20;
        const wave3 = Math.sin(x*0.1)*5;

        let groundY = Math.floor(baseY+wave1+wave2+wave3);

        groundY = Math.max(10, Math.min(H-10, groundY));

        for (let y =groundY; y<H; y++) {
            let m = STONE;
            if (y === groundY) m = GRASS;
            else if (y < groundY + 4) m = DIRT;
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