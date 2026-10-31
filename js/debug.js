import {W, H} from './config.js';
import {material, variationMap} from './world.js';
import {moved} from './update.js';
import {ui} from './ui.js';
import {historyLength} from './save.js';

const NAMES = ['AIR', 'DIRT', 'STONE', 'GRASS', 'WOOD', 'LEAF', 'WATER', 'FIRE', 'SMOKE', 'STEAM', 'ICE', 'SNOW'];

const el = document.createElement('div');
el.id = 'debug';
document.body.appendChild(el);

const s = {
    visible: false,
    fps: 60, frameMs: 16.6,
    tps: 60, stepMs: 0, stepsThisFrame: 0, accumulator: 0,
    nonAir: 0, movedCount: 0,
    fpsWindowStart: performance.now(), fpsFrames: 0,
    tpsWindowStart: performance.now(), tpsTicks: 0,
    lastScan: 0, lastText: 0,
};

export function initDebug() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F3' || (e.shiftKey && e.code === 'Backquote')) {
            e.preventDefault();
            toggleDebug();
        }
    });
    document.getElementById('debug-toggle')?.addEventListener('click', toggleDebug);
}

export function toggleDebug() {
    s.visible = !s.visible;
    el.classList.toggle('visible', s.visible);
    return s.visible;
}

export function tickDebug(now, info) {
    if (!s.visible) return;

    s.fpsFrames++;
    s.frameMs += (info.frameMs - s.frameMs) * 0.15;
    s.stepMs = info.stepMs;
    s.stepsThisFrame = info.stepsThisFrame;
    s.accumulator = info.accumulator;
    s.tpsTicks += info.stepsThisFrame;

    if (now - s.fpsWindowStart >= 500) {
        const elapsed = now - s.fpsWindowStart;
        s.fps = s.fpsFrames * 1000 / elapsed;
        s.fpsFrames = 0;
        s.fpsWindowStart = now;
    }

    if (now - s.tpsWindowStart >= 500) {
        const elapsed = now - s.tpsWindowStart;
        s.tps = s.tpsTicks * 1000 / elapsed;
        s.tpsTicks = 0;
        s.tpsWindowStart = now;
    }

    if (now - s.lastScan >= 250) {
        s.lastScan = now;
        let nonAir = 0, movedN = 0;
        for (let i = 0; i < material.length; i++) if (material[i] !== 0) nonAir++;
        for (let i = 0; i < moved.length; i++) if (moved[i]) movedN++;
        s.nonAir = nonAir;
        s.movedCount = movedN;
    }

    if (now - s.lastText >= 100) {
        s.lastText = now;
        flush();
    }
}

function flush() {
    const total = W*H;
    const pct = (s.nonAir/total*100).toFixed(1);
    const hover = ui.hover;

    let cursor = '-', hoverMat = '';
    if (hover && hover.x >= 0 && hover.x < W && hover.y >= 0 && hover.y < H) {
        const i = hover.y * W+hover.x;
        cursor = `${hover.x}, ${hover.y} [${i}]`;
        hoverMat = `${NAMES[material[i]] ?? '?'} var ${variationMap[i]}`;
    }
    const mem = performance.memory;
    const heap = mem
    ? `heap ${(mem.usedJSHeapSize / 1048576).toFixed(1)} / ${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB`
    : 'heap -';

    const row = (k, v) => `${k.padEnd(9)}${v}`;

    el.textContent = [
        `Weather Simulator ${W}x${H} (${total})`,
        '',
        row('fps', `${s.fps.toFixed(0).padStart(3)} ${s.frameMs.toFixed(1)} ms`),
        row('tps', `${s.tps.toFixed(1).padStart(4)} ${s.stepMs.toFixed(2)} ms/tick steps ${s.stepsThisFrame}`),
        row('acc', `${s.accumulator.toFixed(1)} ms ${ui.paused ? 'PAUSED' : 'running'} *${ui.speed}`),
        '',
        row('cursor', `${cursor} ${hoverMat}`),
        row('tool', `${ui.tool} size ${ui.brushSize} mat ${ui.selectedMat}`),
        row('active', `${s.movedCount} (last tick) filled ${s.nonAir} (${pct}%)`),
        row('history', historyLength()),
        row('memory', heap),
        '',
        row('weather', `T ${ui.weather.temperature}C H ${ui.weather.humidity}%`),
        row('', `P ${ui.weather.pressure} hPa W ${ui.weather.windSpeed} m/s`),
    ].join('\n');
}