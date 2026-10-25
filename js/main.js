import {H, W} from './config.js';
import {seed, clear, get} from './world.js';
import {step} from './update.js';
import {render} from './render.js';
import { generateTree, treeBounds, placeTree } from './trees.js';
import {ui, initUI} from './ui.js';
import { initInput } from './input.js';
import {pushHistory} from './save.js';
import {GRASS, AIR} from './materials.js';

const placedTrees = [];

function seedScene() {
    seed();
    placedTrees.length = 0;

    const numTrees = Math.floor(Math.random() * 35);
    let attempts = 0;

    while (placedTrees.length < numTrees && attempts < 100) {
        attempts++;

        const x = Math.floor(Math.random() * (W - 20)) + 10;

        let tooClose = false;
        for (const otherX of placedTrees) {

            if (Math.abs(x - otherX) < 8) {
                tooClose = true;
                break;
            }
        }

        if (tooClose) continue;

        let groundY = -1;
        for (let y = 0; y<H; y++) {
            if (get(x, y) === GRASS) {
                groundY=y;
                break;
            }
        }

        if (groundY >= 0 && get(x, groundY -1) === AIR) {
            const randomSize = Math.floor(Math.random() * 9)+2;
            placeTree(generateTree(randomSize), x, groundY - 1);
            placedTrees.push(x);
        }
    }
}

initUI({
    onClear: () => {           
        pushHistory();
        clear();
        seedScene();
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