const INK = {
    dark: ["#577499", "#789bc2", "#aed0e9", "#e5f2ff"],
    light: ["#617a9b", "#4f6e97", "#32587d", "#243e61"],
};

export function drawRay(
    ctx: CanvasRenderingContext2D,
    radius: number,
    heading: number,
    bank: number,
    phase: number,
    bite: number,
    visibility: (x: number, y: number) => number,
    light: boolean
) {
    const colors = light ? INK.light : INK.dark;
    const cos = Math.cos(heading);
    const sin = Math.sin(heading);

    ctx.save();
    ctx.font = `600 ${radius * 0.34}px ui-monospace, Menlo, monospace`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const glyph = (character: string, x: number, y: number, shade: number, alpha: number) => {
        const screenX = radius * (x * cos - y * sin);
        const screenY = radius * (x * sin + y * cos);
        const opacity = visibility(screenX, screenY) * alpha;
        if (opacity < 0.06) return;
        ctx.fillStyle = colors[shade];
        ctx.globalAlpha = opacity;
        ctx.fillText(character, screenX, screenY);
    };

    // The tail lags behind the body's turn, with a wave that grows toward its tip.
    for (let i = 16; i >= 0; i--) {
        const t = i / 16;
        const x = -0.82 - t * 2.5;
        const y = t ** 1.45 * (Math.sin(phase - t * 4.8) * 0.47 - bank * 1.8);
        glyph(i < 5 ? ":" : ".", x, y, 1, 0.74 - t * 0.5);
    }

    for (let side = -1; side <= 1; side += 2) {
        for (let row = side === -1 ? 1 : 0; row <= 9; row++) {
            const span = row / 9;
            const flap = Math.sin(phase - span * 2.3 + side * 0.2);
            const sweep = span ** 1.5 * (0.29 * flap - side * bank * 0.66);
            const y = side * span * (1.91 + 0.35 * flap + side * bank * 1.4);
            const leading = MOUTH_OFFSET - span * 0.49 - span ** 2 * 1.53;
            const trailing = -1.08 + Math.sin(span * Math.PI) * 0.69;
            const length = leading - trailing;
            const cells = Math.max(1, Math.round(length / 0.21));
            for (let column = 0; column <= cells; column++) {
                if (bite > 0 && row === 0 && column === cells) continue;
                const chord = column / cells;
                const x = trailing + length * chord + sweep;
                const crest = Math.sin(chord * Math.PI);
                const edge = column === 0 || column === cells || row === 9;
                const rib = (column + 2 * row) % 5 === 0;
                const shade = edge ? 1 : crest > 0.76 ? 2 : 1;
                const char = edge ? (row < 7 ? ":" : ".") : rib ? "+" : crest > 0.76 ? "=" : ".";
                glyph(char, x, y, shade, 0.92 - span * 0.28);
            }
        }
    }

    for (const side of [-1, 1]) {
        glyph("+", 0.75, side * 0.22, 3, 0.95);
    }
    if (bite > 0) glyph(bite > 0.5 ? "o" : "-", MOUTH_OFFSET + bite * 0.09, 0, 3, 0.6 + bite * 0.4);
    ctx.restore();
}
import { MOUTH_OFFSET } from "./world";
