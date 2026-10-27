import {LEAF, WOOD, AIR} from './materials.js';
import {get, set} from './world.js';
import {W} from './config.js';

export function generateTree(size) {
    const t = (size - 1) / 11;
    const trunkH = 3 + Math.round(t * 7);
    const canopyR = 2 + Math.round(t * 5);
    const trunkW = size >= 8 ? 2 : 1;

    const w = canopyR * 2 + 1;
    const h = trunkH + canopyR;

    const pattern = Array.from({length: h}, () => new Uint8Array(w));
    const cx = Math.floor(w / 2);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = x - cx;
            const dy = y - canopyR;
            if (dx * dx + dy * dy <= canopyR * canopyR) {
                pattern[y][x] = LEAF;
            }
        }
    }

    const tx0 = cx - Math.floor((trunkW - 1) / 2);
    const tx1 = tx0 + trunkW;
    for (let y = canopyR; y < canopyR + trunkH; y++) {
        for (let x = tx0; x < tx1; x++) {
            if (x < 0 || x >= w) continue;
            pattern[y][x] = WOOD;
        }
    }

    return pattern;
}

export function treeBounds(pattern, cx, cy) {
    const w = pattern[0].length;
    const h = pattern.length;
    return {px: cx - (w >> 1), py: cy - h + 1, w, h};
}

export function placeTree(pattern, cx, cy) {
    const {px, py} = treeBounds(pattern, cx, cy);
    for (let ty = 0; ty < pattern.length; ty++) {
        for (let tx = 0; tx < pattern[ty].length; tx++) {
            const v = pattern[ty][tx];
            if (!v) continue;
            const x = px + tx;
            const y = py + ty;
            
            if (get(x, y) === AIR) {
                set(x, y, v);
            }
        }
    }
}