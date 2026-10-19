import {W, H, idx} from './config.js';
import {AIR, FALLS} from './materials.js';
import {material} from './world.js';

function tryFall(x, y) {
    const i = idx(x, y);
    const m = material[i];

    const below = i + W;
    if (y + 1 <H && material[below] === AIR) {
        material[below] = m;
        material[i] = AIR;
        return;
    }

    const dir = Math.random <0.5 ? -1 : 1;
    const nx = x +dir;
    if (nx < 0 || nx >=W || y + 1 >= H) return;
    const diag = idx(nx, y +1);
    if (material[diag] === AIR) {
        material [diag] = m;
        material[i] = AIR;
    } 
}

export function step() {
    for (let y = H - 2; y >=0; y--) {
        for (let x = 0; x < W; x++) {
            const m = material[idx(x, y)];
            if (FALLS.has(m)) tryFall(x, y);
        }
    }
}