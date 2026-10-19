import{W, H} from './config.js';
import {material, seed, clear} from './world.js';
import {step} from './update.js';
import {render} from './render.js';
import { generateTree, treeBounds, placeTree } from './trees.js';
import {ui, initUI} from './ui.js';
import { initInput } from './input.js';

function seedScene() {
    seed();

    const sizes = [2, 4, 6, 8, 10];
    const xs = [40, 100, 160, 220, 280];
    const groundY = Math.floor(H*0.75);
    for (let i = 0; i <sizes.length; i++) {
        placeTree(generateTree(sizes[i]), xs[i], groundY - 1);
    }
}


initUI({
    onClear: () => clear(),
    onPauseToggle: () => {
        ui.paused = !ui.paused;
        return ui.paused;
    },
    onSizeChange: (size) => {
        ui.treePattern= generateTree(size);
    },
});

initInput();


function loop() {
    if (!ui.paused) step();
    render(ui.hover, ui.tool, ui.brushSize, ui.treePattern, treeBounds);
    requestAnimationFrame(loop);
}

seedScene();
loop();