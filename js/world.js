import {W, H} from './config.js';
import {AIR, STONE, GRASS, DIRT} from './materials.js';
import {idx} from './config.js';

export const material = new Uint8Array(W*H);

// prep for procedural generation


export function seed() {

    const offset1 = Math.random() * 100; 
    const offset2 = Math.random() * 100;
    const offset3 = Math.random() * 100;

    const baseY = Math.floor(H*0.75);

    for (let x =0; x < W; x++) {

        // Sine waves for procederal generation
        const wave1 = Math.sin((x*0.01)+offset1)*20;
        const wave2 = Math.sin((x*0.03)+offset2)*10;
        const wave3 = Math.sin((x*0.07)+offset3)*4;

        let groundY = Math.floor(baseY+wave1+wave2+wave3);

        groundY = Math.max(10, Math.min(H-10, groundY));

        for (let y =groundY; y<H; y++) {
            let m = STONE;
            if (y === groundY+(Math.floor(Math.random()))) m = GRASS;
            else if (y < groundY + (Math.floor(Math.random()*8))+4) m = DIRT;
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