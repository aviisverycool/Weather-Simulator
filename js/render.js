import {W, H} from './config.js';
import {VARIANTS} from './materials.js';
import {material, variationMap} from './world.js';

const canvas = document.getElementById('c');
canvas.width = W;
canvas.height = H;

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
        ctx.beginPath();
        ctx.arc(hover.x + 0.5, hover.y + 0.5, brushSize, 0, Math.PI * 2);
        ctx.stroke();
    }
}