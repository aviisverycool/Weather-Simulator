import {W, H, idx} from './config.js';
import {AIR, DIRT, GRASS, WATER} from './materials.js';
import {material} from './world.js';

const moved = new Uint8Array(W* H)

function swap(a, b) {
    material[b] = material[a]
    material[a] = AIR;
    moved[b] = 1;
}

function tryFall(x, y) {
    const i = idx(x, y);
    const m = material[i];

    if (y + 1 >= H) return;

    const below = idx(x, y + 1);
    if (material[below] === AIR) {
        swap(i, below);
        return; 
    }

    const dir = Math.random() < 0.5 ? -1 : 1;
    const nx = x + dir;
    if (nx < 0 || nx >= W) return;

    const diag = idx(nx, y + 1);
    if (material[diag] === AIR) {
        swap(i, swap);
    }
}

function stepWater(x, y) {
    const i = idx(x, y);

    if (y + 1 < H && material[idx(x, y + 1)] === AIR) {
        material[idx(x, y + 1)] = WATER;
        material[i] = AIR;
        return;
    }

    const order = Math.random() < 0.5 ? [1, -1] : [-1, 1];
    for (const dx of order) {
        const nx = x + dx;
        if (nx < 0 || nx >= W) continue;

        const target = idx(nx, y);
        if (material[target] === AIR) {
            material[target] = WATER;
            material[i] = AIR;
            return;
        }

        if (y + 1 < H) {
            const diag = idx(nx, y + 1);
            if (material[diag] === AIR) {
                material[diag] = WATER;
                material[i] = AIR;
                return;
            }
        }
    }
}

export function step() {
    for (let y = H - 1; y >= 0; y--) {
        for (let x = 0; x < W; x++) {
            const m = material[idx(x, y)];
            if (m === DIRT || m === GRASS) tryFall(x, y);
            else if (m === WATER) stepWater(x, y);
        }
    }
}