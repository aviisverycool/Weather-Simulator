import {DIRT} from './materials.js';
import {generateTree} from './trees.js';
import {saveWorld, loadWorld, undo} from './save.js';

export const ui = {
    selectedMat: DIRT,
    tool: 'brush',
    brushSize: 3,
    speed: 1,
    paused: false,
    hover: null,
    treePattern: generateTree(3),
    panelMode: 'materials',
    weather: {
        temperature: 20,
        humidity: 50,
        pressure: 1010,
        windSpeed: 10,
    },
};

function syncWeatherUI() {
    const weatherInputs = {
        temp: document.getElementById('wTemp'),
        humid: document.getElementById('wHumid'),
        press: document.getElementById('wPress'),
        wind: document.getElementById('wWindS'),
    };

    const weatherLabels = {
        temp: document.getElementById('wTempVal'),
        humid: document.getElementById('wHumidVal'),
        press: document.getElementById('wPressVal'),
        wind: document.getElementById('wWindSVal'),
    };

    if (weatherInputs.temp) {
        weatherInputs.temp.value = String(ui.weather.temperature);
    }
    if (weatherInputs.humid) {
        weatherInputs.humid.value = String(ui.weather.humidity);
    }
    if (weatherInputs.press) {
        weatherInputs.press.value = String(ui.weather.pressure);
    }
    if (weatherInputs.wind) {
        weatherInputs.wind.value = String(ui.weather.windSpeed);
    }

    if (weatherLabels.temp) weatherLabels.temp.textContent = `${ui.weather.temperature}°C`;
    if (weatherLabels.humid) weatherLabels.humid.textContent = `${ui.weather.humidity}%`;
    if (weatherLabels.press) weatherLabels.press.textContent = `${ui.weather.pressure} hPa`;
    if (weatherLabels.wind) weatherLabels.wind.textContent = `${ui.weather.windSpeed} m/s`;
}

function syncPanelMode() {
    const elementsUi = document.getElementById('elements-ui');
    const weatherUi = document.getElementById('weather-ui');
    const toggleButton = document.getElementById('toggle-panel');
    const isWeatherMode = ui.panelMode === 'weather';

    if (elementsUi) elementsUi.style.display = isWeatherMode ? 'none' : 'flex';
    if (weatherUi) weatherUi.style.display = isWeatherMode ? 'flex' : 'none';
    if (toggleButton) {
        toggleButton.textContent = isWeatherMode ? 'Switch to Materials' : 'Switch to Weather';
    }
}

export function initUI({onClear, onPauseToggle, onSizeChange}) {
    const matButtons = document.querySelectorAll('[data-mat]');
    const toolButtons = document.querySelectorAll('[data-tool]');
    const clearBtn = document.getElementById('clear');
    const pauseBtn = document.getElementById('pause');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('sizeval');
    const saveBtn = document.getElementById('save');
    const loadBtn = document.getElementById('load');
    const undoBtn = document.getElementById('undo');
    const togglePanelBtn = document.getElementById('toggle-panel');

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
            pauseBtn.textContent = paused ? '▶Play' : '⏸Pause';
        });
    }

    if (togglePanelBtn) {
        togglePanelBtn.addEventListener('click', () => {
            ui.panelMode = ui.panelMode === 'weather' ? 'materials' : 'weather';
            syncPanelMode();
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

    const weatherInputMap = [
        ['wTemp', 'temperature'],
        ['wHumid', 'humidity'],
        ['wPress', 'pressure'],
        ['wWindS', 'windSpeed'],
    ];

    weatherInputMap.forEach(([id, key]) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', (e) => {
            const value = Number(e.target.value);
            if (Number.isNaN(value)) return;
            ui.weather[key] = value;
            syncWeatherUI();
        });
    });

    syncWeatherUI();
    syncPanelMode();

    if (saveBtn) {
        saveBtn.addEventListener('click', () => saveWorld());
    }
    if (loadBtn) {
        loadBtn.addEventListener('click', () => loadWorld());
    }
    if (undoBtn) {
        undoBtn.addEventListener('click', () => undo());
    }
}