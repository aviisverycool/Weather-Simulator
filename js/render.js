import {W, H} from './config.js';
import {VARIANTS} from './materials.js';
import {material, variationMap} from './world.js';

const canvas = document.getElementById('c');
canvas.width = W;
canvas.height = H;
const wrap = document.getElementById('wrap');

export function fitCanvas() {
    if (!wrap) return;

    const availW = wrap.clientWidth;
    const availH = wrap.clientHeight;
    if (availW <= 0 || availH <= 0) return;

    const scale = Math.min(availW / W, availH / H);
    canvas.style.width = `${W * scale}px`;
    canvas.style.height = `${H * scale}px`;
}

export function initCanvasResize() {
    fitCanvas();

    if (wrap && typeof ResizeObserver === 'function') {
        new ResizeObserver(fitCanvas).observe(wrap);
    }
    window.addEventListener('resize', fitCanvas);
    window.addEventListener('orientationchange', fitCanvas);
}

const ctx = canvas.getContext('2d');
const img = ctx.createImageData(W, H);
const buf = new Uint32Array(img.data.buffer);

export function render(hover, tool, brushSize, treePattern, treeBoundsFn) {
    for (let i = 0; i < W * H; i++) {
        buf[i] = VARIANTS[material[i]][variationMap[i]];
    }

    ctx.putImageData(img, 0, 0);

    if (!hover) return;
    ctx.lineWidth = 1;

    if (tool === 'tree') {
        const {px, py, w, h} = treeBoundsFn(treePattern, hover.x, hover.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.strokeRect(px + 0.5, py + 0.5, w - 1, h - 1);

        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.moveTo(hover.x + 0.5, hover.y + 0.5);
        ctx.lineTo(hover.x + 0.5, hover.y + 4.5);
        ctx.stroke();
    }
    else {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(
            hover.x - brushSize + 0.5,
            hover.y - brushSize + 0.5,
            brushSize * 2 + 1,
            brushSize * 2 + 1
        );
    }
}