import {get, set} from './world.js';
import {W, H} from './config.js';
import {AIR} from './materials.js';

export function brush(cx, cy, mat, size) {
    const r = size;

    for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
            const x = cx + dx;
            const y = cy + dy;

            if (x < 0 || x >= W || y < 0 || y >= H) continue;
            if (mat !== AIR && get(x, y) !== AIR) continue;
            set(x, y, mat);
        }
    }
}
