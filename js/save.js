import {material} from "./world.js";
import {WATER} from "./materials.js";

export function toBase64(u8) {
    let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) {
        s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    }
    return btoa(s);
}

export function fromBase64(b64) {
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i<bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
}

export function saveWorld(slot = 'default') {
    localStorage.setItem('world:' + slot, toBase64(material));
}

export function loadWorld(slot = 'default') {
    const b64 = localStorage.getItem('world:' + slot);
    if (!b64) return false;
    const savedMaterial = fromBase64(b64);
    if (savedMaterial.length !== material.length) {
        throw new RangeError(`Saved world has ${savedMaterial.length} cells; expected ${material.length}.`);
    }
    if (savedMaterial.some((value) => value > WATER)) {
        throw new RangeError('Saved world contains an unknown material.');
    }
    pushHistory();
    material.set(savedMaterial);
    return true;
}

const history = [];
const MAX_HISTORY = 30;
export function pushHistory() {
    history.push(material.slice());
    if (history.length > MAX_HISTORY) history.shift();
}

export function undo() {
    if (history.length === 0) return false;
    material.set(history.pop());
    return true;
}