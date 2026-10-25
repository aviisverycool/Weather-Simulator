import {W, H} from './config.js';
import {AIR, STONE, GRASS, DIRT, WATER} from './materials.js';
import {idx} from './config.js';

export const material = new Uint8Array(W*H);

// prep for procedural generation


export function seed() {
    material.fill(AIR);
    const offset1 = Math.random() * 100;
    const offset2 = Math.random() * 100;
    const offset3 = Math.random() * 100;

    const baseY = Math.floor(H*0.75);
    const seaLevel = Math.floor(H*0.82);

    const heights = new Uint8Array(W);
    for (let x = 0; x < W; x++) {
        const wave1 = Math.sin((x*0.01)+offset1)*20;
        const wave2 = Math.sin((x*0.03)+offset2)*10;
        const wave3 = Math.sin((x*0.07)+offset3)*4;

        let groundY = Math.floor(baseY+wave1+wave2+wave3)
        heights[x]=Math.max(10, Math.min(H-10, groundY));
    }

    const isLake = new Uint8Array(W);
    let x = 0;
    while(x<W) {
        if (heights[x] > seaLevel) {
            let start=x;
            let maxDepth = 0;

            while (x < W && heights[x] > seaLevel) {
                if (heights[x]-seaLevel>maxDepth) {
                    maxDepth = heights[x] - seaLevel;
                }
                x++;
            }

            let end = x-1;
            let width=end-start+1;

            if (width >= 12 && maxDepth >= 6) {
                for (let i = start; i <= end; i++) {
                    isLake[i] = 1;
                }
            }
        } 
        
        else {
            x++;
        }
    }

    for (let cx = 0; cx<W; cx++) {
        const groundY = heights[cx];

        for (let y = groundY; y < H; y++) {
            let m = STONE;
            if (y === groundY) m = GRASS;
            else if (y < groundY + (Math.floor(Math.random()*6))+6) m = DIRT;
            material[idx(cx, y)] = m;
        }

        if (isLake[cx]) {
            for (let y = seaLevel; y < groundY; y++) {
                material[idx(cx, y)] = WATER;
            }
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