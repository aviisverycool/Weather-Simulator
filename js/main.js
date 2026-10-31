import {H, W} from './config.js';
import {seed, clear, get} from './world.js';
import {step} from './update.js';
import {render} from './render.js';
import { generateTree, treeBounds, placeTree } from './trees.js';
import {ui, initUI} from './ui.js';
import { initInput } from './input.js';
import {pushHistory} from './save.js';
import {GRASS, AIR} from './materials.js';
import {initDebug, tickDebug} from './debug.js';

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
    onNewMap: () => {
        pushHistory();
        seedScene();
    },
    onClear: () => {           
        pushHistory();
        clear();
    },
    onPauseToggle: () => {
        ui.paused = !ui.paused;
        return ui.paused;
    },
});

initInput();

initDebug();

let accumulator = 0;
let last = performance.now();
const BASE_TICK = 1000 / 60;

function loop(now) {
    const dt = Math.min(now - last, 100);
    last = now;

    let stepsThisFrame = 0;
    let stepMs = 0;

    if (!ui.paused) {
        accumulator += dt * ui.speed;
        const stepStart = performance.now();
        while (accumulator >= BASE_TICK && stepsThisFrame < 5) {
            step();
            accumulator -= BASE_TICK;
            stepsThisFrame++;
        }
        stepMs = performance.now() - stepStart;
    }

    render(ui.hover, ui.tool, ui.brushSize, ui.treePattern, treeBounds);

    tickDebug(now, { frameMs: dt, stepsThisFrame, stepMs, accumulator });

    requestAnimationFrame(loop);
}

seedScene();
requestAnimationFrame(loop);
