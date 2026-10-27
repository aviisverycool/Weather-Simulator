import {get, set} from './world.js';
import {W, H} from './config.js';
import {AIR} from './materials.js';

export function brush(cx, cy, mat, size) {
    const r = size;
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
            if (dx * dx + dy * dy > r2) continue;
            const x = cx + dx;
            const y = cy + dy;
            if (x < 0 || x >= W || y < 0 || y >= H) continue;
            if (mat !== AIR && get(x, y) !== AIR) continue;
            set(x, y, mat);
        }
    }
}