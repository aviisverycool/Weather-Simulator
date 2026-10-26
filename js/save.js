import {material, variationMap} from "./world.js";
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
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
}

function serializeWorld() {
    const payload = new Uint8Array(material.length * 2);
    payload.set(material, 0);
    payload.set(variationMap, material.length);
    return payload;
}

function deserializeWorld(payload) {
    if (payload.length !== material.length * 2) {
        throw new RangeError(`Saved world has ${payload.length} bytes; expected ${material.length * 2}.`);
    }

    const savedMaterial = payload.subarray(0, material.length);
    const savedVariation = payload.subarray(material.length);

    if (savedMaterial.some((value) => value > WATER)) {
        throw new RangeError('Saved world contains an unknown material.');
    }
    if (savedVariation.some((value) => value > 2)) {
        throw new RangeError('Saved world contains an invalid material variation.');
    }

    return { material: savedMaterial, variation: savedVariation };
}

export function saveWorld(slot = 'default') {
    localStorage.setItem('world:' + slot, toBase64(serializeWorld()));
}

export function loadWorld(slot = 'default') {
    const b64 = localStorage.getItem('world:' + slot);
    if (!b64) return false;

    const payload = deserializeWorld(fromBase64(b64));
    pushHistory();
    material.set(payload.material);
    variationMap.set(payload.variation);
    return true;
}

const history = [];
const MAX_HISTORY = 30;
export function pushHistory() {
    history.push({
        material: material.slice(),
        variation: variationMap.slice(),
    });
    if (history.length > MAX_HISTORY) history.shift();
}

export function undo() {
    if (history.length === 0) return false;

    const snapshot = history.pop();
    material.set(snapshot.material);
    variationMap.set(snapshot.variation);
    return true;
}