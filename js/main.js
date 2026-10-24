import {H} from './config.js';
import {seed, clear, get} from './world.js';
import {step} from './update.js';
import {render} from './render.js';
import { generateTree, treeBounds, placeTree } from './trees.js';
import {ui, initUI} from './ui.js';
import { initInput } from './input.js';
import {pushHistory} from './save.js';
import {GRASS} from './materials.js';

function seedScene() {
    seed();
    
    const sizes = [2, 4, 6, 8, 10];
    const xs = [40, 100, 160, 220, 280];

    for (let i = 0; i < sizes.length; i++) {
        const x = xs[i];

        let groundY = -1;
        for (let y = 0; y < H; y++) {
            if (get(x, y) === GRASS) {
                groundY = y;
                break;
            }
        }

        if (groundY >= 0) {
            placeTree(generateTree(sizes[i]), x, groundY - 1);
        }
    }
}

initUI({
    onClear: () => {
        pushHistory();
        clear();
    },
    onPauseToggle: () => {
        ui.paused = !ui.paused;
        return ui.paused;
    },
    onSizeChange: (size) => {
        ui.treePattern= generateTree(size);
    },
});

initInput();


let accumulator = 0;
let last = performance.now();
const BASE_TICK = 1000 / 60; // 60 tps at 100% speed

function loop(now) {
    const dt = Math.min(now - last, 100);
    last = now;

    if (!ui.paused) {
        accumulator += dt * ui.speed;
        const maxSteps = 5;
        let steps = 0;
        while (accumulator >= BASE_TICK && steps++ < maxSteps) {
            step();
            accumulator -= BASE_TICK;
        }
    }
    render(ui.hover, ui.tool, ui.brushSize, ui.treePattern, treeBounds);
    requestAnimationFrame(loop);
}

seedScene();
requestAnimationFrame(loop);