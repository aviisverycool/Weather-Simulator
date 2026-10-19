import {W, H} from './config.js'
import {AIR} from './materials.js'
import {brush} from './paint.js'
import {placeTree} from './trees.js'
import {ui} from './ui.js'

const canvas = document.getElementById('c');
let drawing = false;

function eventToGrid(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((e.clientX - rect.left) / rect.width * W),
        y: Math.floor((e.clientY - rect.top) / rect.height * H),
    };
}

function applyAt(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    if (ui.tool === 'tree') placeTree(ui.treePattern, x, y);
    else if (ui.tool === 'eraser') brush(x, y, AIR, ui.brushSize);
    else brush(x, y, ui.selectedMat, ui.brushSize);
}

export function initInput() {
    canvas.addEventListener('pointerdown', (e) => {
        const {x, y} = eventToGrid(e);
        ui.hover = {x, y};
        if (!drawing) return;
        if (ui.tool === 'tree') return;
        applyAt(x, y);
    });;

    canvas.addEventListener('pointerleave', () => {ui.hover = null;});

    canvas.addEventListener('pointerup', (e) => {
        drawing = false;
        try {canvas.releasePointerCapture(e.pointerId); } catch {}
    });

    canvas.addEventListener('pointercancel', () => {drawing = false;})
}