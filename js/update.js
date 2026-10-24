import {W, H, idx} from './config.js';
import {AIR, DIRT, GRASS, WATER} from './materials.js';
import {material} from './world.js';

export const moved = new Uint8Array(W * H);

function swap(a, b) {
    if (a === b) return;

    const temp = material[a];
    material[a] = material[b];
    material[b] = temp;
    moved[a] = 1;
    moved[b] = 1;
}

function tryFall(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (y + 1 >= H) return;

    const below = idx(x, y + 1);
    if (material[below] === AIR) {
        swap(i, below);
        return;
    }

    const directions = Math.random() < 0.5 ? [-1, 1] : [1, -1];
    for (const dx of directions) {
        const nx = x + dx;
        if (nx < 0 || nx >= W) continue;

        const diag = idx(nx, y + 1);
        if (material[diag] === AIR) {
            swap(i, diag);
            return;
        }
    }
}

function stepWater(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (y + 1 < H && material [idx(x, y +1)] === AIR) {
        swap (i, idx(x, y +1));
        return;
    }

    const order = Math.random() < 0.5 ? [1, -1] : [-1, 1];

    for (const dx of order) {
        const nx = x + dx;
        if (nx < 0 || nx >= W || y + 1 >= H) continue;
        const diag = idx(nx, y +1);
        if (material[diag] === AIR) {
            swap(i, diag)
            return;
        }
    }

    const MAX_SCAN = 4;
    let bestDir= 0;
    let bestDist = 0;

    for (const dx of order) {
        let tx = x;
        let dist = 0;
        while (dist < MAX_SCAN) {
            const nx = tx + dx;
            if (nx < 0 || nx >= W) break;
            const target = idx(nx, y);

            if(material[target] !== AIR || moved[target]) break;

            tx = nx;
            dist++;
        }
        if (dist > bestDist) {
            bestDist = dist;
            bestDir = dx;
        }
    }

    if (bestDir !== 0) {
        const target = idx(x + bestDir, y);
        if (material[target] === AIR && !moved[target]) {
            swap(i, target);
        }
    }
}

let flip = false;

export function step() {
    moved.fill(0);
    flip = !flip;

    for (let y = H - 1; y >= 0; y--) {
        const startX = flip ? 0 : W - 1;
        const endX = flip ? W : -1;
        const stepX = flip ? 1 : -1;

        for (let x = startX; x !== endX; x += stepX) {
            const i = idx(x, y);
            if (moved[i]) continue;

            const m = material[i];
            if (m === DIRT || m === GRASS) tryFall(x, y);
            else if (m === WATER) stepWater(x, y);
        }
    }
}