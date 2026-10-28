import {W, H} from './config.js';
import {AIR, DIRT, STONE, GRASS, WOOD, LEAF, WATER, FIRE, SMOKE, line} from './materials.js';
import {brush} from './paint.js';
import {placeTree} from './trees.js';
import {ui} from './ui.js';
import {pushHistory} from './save.js';
import {get} from './world.js';

const canvas = document.getElementById('c');
let drawing = false;
let lastPos = null;

function eventToGrid(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((e.clientX - rect.left) / rect.width * W),
        y: Math.floor((e.clientY - rect.top) / rect.height * H),
    };
}

function applyAt(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;

    if (ui.tool === 'tree') {
        placeTree(ui.treePattern, x, y);
        return;
    }

    if (ui.tool === 'erase' || ui.tool === 'eraser') {
        brush(x, y, AIR, ui.brushSize);
        return;
    }

    if (ui.tool === 'eyedropper') {
        const mat = get(x, y);
        const nextTool = mat === AIR ? document.querySelector('[data-tool="erase"]') : document.querySelector(`[data-mat="${mat}"]`);
        nextTool?.click();
        return;
    }

    brush(x, y, ui.selectedMat, ui.brushSize);
}

export function initInput() {
    let paintTimer = null;
    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        drawing = true;
        const {x, y} = eventToGrid(e);
        lastPos = {x, y};
        ui.hover = {x, y};
        pushHistory();
        applyAt(x, y);
        canvas.setPointerCapture(e.pointerId);
        if (ui.tool !== 'tree') {
            if (paintTimer) clearInterval(paintTimer);
            paintTimer = setInterval(() => {
                if (drawing && lastPos) {
                    applyAt(lastPos.x, lastPos.y);
                }
            }, 50);
        }
    });

    canvas.addEventListener('pointermove', (e) => {
        const {x, y} = eventToGrid(e);
        ui.hover = {x, y};
        if (!drawing || ui.tool === 'tree') return;
        line(lastPos.x, lastPos.y, x, y, applyAt);
        lastPos = {x, y};
    });

    canvas.addEventListener('pointerleave', () => {
        ui.hover = null;
    });

    canvas.addEventListener('pointerup', (e) => {
        drawing = false;
        lastPos = null;
        if (paintTimer) clearInterval(paintTimer);
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointercancel', () => {
        drawing = false;
        lastPos = null;
        if (paintTimer) clearInterval(paintTimer);
    });
}

function handleKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const matMap = {'1': DIRT, '2': STONE, '3': GRASS, '4': WOOD, '5': LEAF, '6': WATER, '7': FIRE, '8': SMOKE};
    if (matMap[e.key] !== undefined) {
        document.querySelector(`[data-mat="${matMap[e.key]}"]`)?.click();
        return;
    }

    switch (e.key) {
        case 'e': case 'E':
            document.querySelector('[data-tool="erase"]')?.click();
            break;
        case ' ':
            e.preventDefault();
            document.getElementById('pause')?.click();
            break;
        case '[':
            adjustBrushSize(-1);
            break;
        case ']':
            adjustBrushSize(1);
            break;
    }
}

function adjustBrushSize(delta) {
    const slider = document.getElementById('size');
    if (!slider) return;

    const next = Math.max(
        parseInt(slider.min, 10),
        Math.min(parseInt(slider.max, 10), ui.brushSize + delta)
    );
    if (next === ui.brushSize) return;
    slider.value = next;
    slider.dispatchEvent(new Event('input'));
}