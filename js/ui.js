import {DIRT} from './materials.js'
import {generateTree} from './trees.js'

export const ui = {
    selectedMat: DIRT,
    tool: 'brush',
    brushSize: 3, 
    paused: false,
    hover: null,
    treePattern: generateTree(3),
};

export function initUI({onClear, onPauseToggle, onSizeChange}) {
    const matButtons = document.querySelectorAll('[data-mat]');
    const toolButtons = document.querySelectorAll('[data-tool]');

    matButtons.forEach(b => {
        b.addEventListener('click', () => {
            ui.selectedMat = parseInt(b.dataset.mat, 10);
            ui.tool = 'brush';
            matButtons.forEach(x => x.classList.toggle('active', x === b));
            toolButtons.forEach(x => x.classList.remove('active'));
        });
    });

    toolButtons.forEach(b => {
        b.addEventListener('click', () => {
            ui.tool = b.dataset.tool;
            toolButtons.forEach(x => x.classList.toggle('active', x === b));
            matButtons.forEach(x => x.classList.remove('active'));
        });
    });

    const sizeEl = document.getElementById('size');
    pauseBtn.addEventListener('click', () => {
        const paused = onPauseToggle();
        pauseBtn.textContent = Paused ? '▶ Play' : '⏸ Pause';
    });
}