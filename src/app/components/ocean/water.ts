export const WAVE_SPACING = 104;

export function waveOffset(x: number, time: number) {
    return Math.sin(x / 140 - time * 0.48) * 18 + Math.sin(x / 64 + time * 0.22) * 5 + time * 3.5;
}

export function surfaceCurrent(x: number, y: number, time: number) {
    const phase = ((y - waveOffset(x, time)) / WAVE_SPACING) * 2 * Math.PI;
    return {
        x: 8 + Math.cos(phase) * 4.5,
        y: 3.5 + Math.sin(phase + x / 165) * 4,
    };
}
