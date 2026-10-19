import {DIRT} from './materials.js';
import {generateTree} from './trees.js';

export const ui = {
    selectedMat: DIRT,
    tool: 'brush',
    brushSize: 3,
    speed: 1,
    paused: false,
    hover: null,
    treePattern: generateTree(3),
};

export function initUI({onClear, onPauseToggle, onSizeChange}) {
    const matButtons = document.querySelectorAll('[data-mat]');
    const toolButtons = document.querySelectorAll('[data-tool]');
    const clearBtn = document.getElementById('clear');
    const pauseBtn = document.getElementById('Pause') || document.getElementById('pause');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('sizeval');

    matButtons.forEach((b) => {
        b.addEventListener('click', () => {
            ui.selectedMat = parseInt(b.dataset.mat, 10);
            ui.tool = 'brush';
            matButtons.forEach((x) => x.classList.toggle('active', x === b));
            toolButtons.forEach((x) => x.classList.remove('active'));
        });
    });

    toolButtons.forEach((b) => {
        b.addEventListener('click', () => {
            ui.tool = b.dataset.tool;
            toolButtons.forEach((x) => x.classList.toggle('active', x === b));
            matButtons.forEach((x) => x.classList.remove('active'));
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (onClear) onClear();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            const paused = onPauseToggle ? onPauseToggle() : ui.paused;
            ui.paused = paused;
            pauseBtn.textContent = paused ? '▶ Play' : '⏸ Pause';
        });
    }

    const updateSize = (nextSize) => {
        const size = Math.max(1, Number(nextSize) || 1);
        ui.brushSize = size;
        ui.treePattern = generateTree(size);
        if (sizeInput) sizeInput.value = String(size);
        if (sizeValue) sizeValue.textContent = String(size);
        if (onSizeChange) onSizeChange(size);
    };

    if (sizeInput) {
        sizeInput.addEventListener('input', (e) => updateSize(e.target.value));
        updateSize(sizeInput.value);
    }
}