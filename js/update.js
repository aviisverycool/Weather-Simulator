import {W, H, idx} from './config.js';
import {AIR, DIRT, GRASS, WATER, FIRE, SMOKE, WOOD, LEAF, STEAM, ICE} from './materials.js';
import {material, variationMap} from './world.js';
import {ui} from './ui.js';

export const moved = new Uint8Array(W * H);

function isDisplacedBySolid(m) {
    return m === AIR || m === WATER || m === SMOKE || m === FIRE;
}

function isDisplacedByLiquid(m) {
    return m === AIR || m === SMOKE || m === FIRE;
}

function swap(a, b) {
    if (a === b) return;

    const temp = material[a];
    material[a] = material[b];
    material[b] = temp;

    const tempVar = variationMap[a];
    variationMap[a] = variationMap[b];
    variationMap[b] = tempVar; 

    moved[a] = 1;
    moved[b] = 1;
}

function tryFall(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (y + 1 >= H) return;

    const below = idx(x, y + 1);
    
    if (material[below] === AIR || material[below] === WATER || material[below] === SMOKE || material[below] === FIRE || material[below] === STEAM) {
        moveInto(i, below);
        return;
    }

    const directions = Math.random() < 0.5 ? [-1, 1] : [1, -1];
    for (const dx of directions) {
        const nx = x + dx;
        if (nx < 0 || nx >= W) continue;

        const diag = idx(nx, y + 1);
        if (material[diag] === AIR || material[diag] === WATER || material[diag] === SMOKE || material[diag] === FIRE || material[diag] === STEAM) {
            moveInto(i, diag);
            return;
        }
    }
}

function stepWater(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (ui.weather.temperature <=0) {
        if (Math.random() <0.01) {
            material[i] = ICE;
            variationMap[i] = Math.floor(Math.random()*3);
            return;
        }
    }

    const below = idx(x, y + 1);
    if (y + 1 < H && (material[below] === AIR || material[below] === SMOKE || material[below] === FIRE || material[below] === STEAM)) {
        moveInto(i, below);
        return;
    }

    const order = Math.random() < 0.5 ? [1, -1] : [-1, 1];

    for (const dx of order) {
        const nx = x + dx;
        if (nx < 0 || nx >= W || y + 1 >= H) continue;
        const diag = idx(nx, y + 1);
        
        if (material[diag] === AIR || material[diag] === SMOKE || material[diag] === FIRE || material[diag] === STEAM) {
            moveInto(i, diag);
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

            if ((material[target] !== AIR && material[target] !== SMOKE && material[target] !== FIRE && material[target] !== STEAM) || moved[target]) break;

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
        if ((material[target] === AIR || material[target] === SMOKE || material[target] === FIRE || material[target] === STEAM) && !moved[target]) {
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
            else if (m === FIRE) stepFire(x, y);
            else if (m === SMOKE) stepSmoke(x, y);
            else if (m === STEAM) stepSteam(x, y);
            else if (m === ICE) stepIce(x, y);
        }
    }
}

function stepFire(x, y) {
    const i = idx(x, y)
    if (moved[i]) return;

    // dissipate if it touches water
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const j = idx(nx, ny);
        if (material[j] === WATER) {
            material[j] = STEAM;
            variationMap[j] = Math.floor(Math.random()*3);

            material[i] = SMOKE;
            variationMap[i] = Math.floor(Math.random()*3);

            moved[i] = 1;
            moved[j] = 1;
            return;
        }

        else if (material[j] === ICE) {
            material[j] = WATER;
            variationMap[j] = Math.floor(Math.random()*3);
            
            material[i] = SMOKE;
            variationMap[i] = Math.floor(Math.random()*3);

            moved[i] = 1;
            moved[j] = 1;
            return;
        }
    }

    // Burn naturally.
    if (Math.random() < 0.05) {
        material[i] = SMOKE;
        variationMap[i] = Math.floor(Math.random() * 3);
        return;
    }

    // Spread to nearby wood and leaves.
    for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const j = idx(nx, ny);
        if ((material[j] === WOOD || material[j] === LEAF) && Math.random() < 0.1) {
            material[j] = FIRE;
            variationMap[j] = Math.floor(Math.random() * 3);
        }
    }

    // Rise into empty space.
    const dir = Math.random() < 0.5 ? -1 : 1;
    const moves=[[0, -1], [dir, -1], [-dir, -1], [dir, 0], [-dir, 0]];

    for (const [dx, dy] of moves) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const j = idx(nx, ny);
        if (material[j] === AIR) {
            swap(i, j);
            return;
        }
    }
}

function stepSmoke(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (Math.random()<0.02) {
        material[i] = AIR;
        return;
    }

    const dir = Math.random() <0.5 ? -1 : 1;
    const moves = [[0, -1], [dir, -1]];

    for (const [dx, dy] of moves) {
        const nx = dx + x, ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const j = idx(nx, ny);
        if (material[j] === AIR) {
            swap(i, j);
            return;
        }
    }
}

function moveInto(a, b) {
    const mB = material[b];
    if (mB === WATER || mB === SMOKE || mB === FIRE || mB === STEAM) {
        const bx = b%W
        const by = Math.floor(b/W)
        const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];

        for (const dx of dirs) {
            const nx = bx + dx;
            if (nx >= 0 && nx < W) {
                const n = idx(nx, by);

                if (material[n] === AIR && !moved[n]) {
                    swap(b, n);
                    swap(a, b);
                    return
                }
            }
        }
    }
    swap(a,b);
}

function stepSteam(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;
    
    if(Math.random() < 0.005) {
        material[i] = WATER;
        variationMap[i] = Math.floor(Math.random()*3);
        return;
    }

    const dir = Math.random() < 0.5 ? -1 : 1;
    const moves = [[0, -1], [dir, -1], [-dir, -1]];

    for (const [dx, dy] of moves) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx >= W || ny < 0 ||ny >= H) continue;
        const j = idx(nx, ny);

        if (material[j] === AIR || material[j] === SMOKE) {
            swap(i, j);
            return;
        }
    }
}

function stepIce(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    if (ui.weather.temperature > 0) {
        if (Math.random() < 0.01) {
            material[i] = WATER;
            variationMap[i] = Math.floor(Math.random()*3);
            return;
        }
    }
}