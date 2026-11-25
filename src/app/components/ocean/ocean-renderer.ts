import { drawRay } from "./ray";
import { WAVE_SPACING, waveOffset } from "./water";
import { SPLASH_LIFE, WAKE_LIFE, wakeSize, type OceanWorld, type Pellet, type Probe } from "./world";

const WATER = { dark: "#c8c5bf", light: "#595650" };
const FOOD = { dark: "#dcb38c", light: "#835733" };

function rippleGlyph(dx: number, dy: number) {
    if (Math.abs(dx) > Math.abs(dy) * 2.2) return "-";
    if (Math.abs(dy) > Math.abs(dx) * 2.2) return "|";
    return dx * dy < 0 ? "/" : "\\";
}

export class OceanRenderer {
    private light = false;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private visibility: (x: number, y: number) => number
    ) {}

    setTheme(light: boolean) {
        this.light = light;
    }

    private ray(probe: Probe, world: OceanWorld, radius: number, reduced: boolean) {
        const { ctx } = this;
        const x = probe.x * world.width;
        const y = probe.y * world.height;
        if (this.visibility(x, y) < 0.05) return;

        const phase = probe.phase + (reduced ? 0 : world.time * 1.65);
        const bite = reduced ? 0 : Math.max(0, 1 - probe.biteAge / 0.45);
        ctx.save();
        ctx.translate(x, y);
        drawRay(
            ctx,
            radius,
            probe.facing,
            probe.bank,
            phase,
            bite,
            (dx, dy) => this.visibility(x + dx, y + dy),
            this.light
        );
        ctx.restore();
    }

    private waterWake(world: OceanWorld, reduced: boolean) {
        const { ctx } = this;
        ctx.font = "8px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = WATER[this.light ? "light" : "dark"];

        for (const wake of world.wakes) {
            const dx = Math.cos(wake.heading);
            const dy = Math.sin(wake.heading);
            for (let crest = 0; crest < 2; crest++) {
                const age = (reduced ? 0.75 : wake.age) - crest * 0.24;
                if (age <= 0) continue;
                const fade = Math.min(1, age / 0.18) * Math.max(0, 1 - age / WAKE_LIFE) ** 2;
                const { backward, length, spread } = wakeSize(wake, age);
                const originX = wake.x * world.width - dx * backward;
                const originY = wake.y * world.height - dy * backward;
                const marks = Math.ceil(spread / 2.1);

                for (let mark = 0; mark <= marks; mark++) {
                    const angle = (mark / marks - 0.5) * 2.7;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const forward = length * cos;
                    const side = spread * sin;
                    const x = originX + dx * forward - dy * side;
                    const y = originY + dy * forward + dx * side;
                    const alpha = fade * wake.strength * cos * this.visibility(x, y) * (crest ? 0.46 : 1);
                    if (alpha < 0.035) continue;

                    ctx.globalAlpha = alpha;
                    const tangentX = -dx * length * sin - dy * spread * cos;
                    const tangentY = -dy * length * sin + dx * spread * cos;
                    ctx.fillText(crest ? "." : rippleGlyph(tangentX, tangentY), x, y);
                }
            }
        }
    }

    private surfaceWaves({ width, height, time }: OceanWorld, reduced: boolean) {
        const { ctx } = this;
        const clock = reduced ? 0 : time;
        const start = Math.floor((-clock * 3.5) / WAVE_SPACING) - 1;
        const rows = Math.ceil(height / WAVE_SPACING) + 3;
        ctx.font = "9px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = WATER[this.light ? "light" : "dark"];
        for (let row = start; row < start + rows; row++) {
            for (let x = 0; x <= width; x += 8) {
                const section = Math.cos(x / 92 + row * 1.7 - clock * 0.24);
                const shimmer = Math.max(0, (section - 0.28) / 0.72);
                if (shimmer === 0) continue;
                const y = row * WAVE_SPACING + waveOffset(x, clock);
                if (y < 4 || y > height - 4) continue;
                ctx.globalAlpha = shimmer * this.visibility(x, y) * (this.light ? 0.15 : 0.2);
                ctx.fillText("-", x, y);
            }
        }
    }

    private splash(x: number, y: number, age: number) {
        const progress = age / SPLASH_LIFE;
        const { ctx } = this;
        ctx.strokeStyle = WATER[this.light ? "light" : "dark"];
        ctx.globalAlpha = (1 - progress) * 0.32 * this.visibility(x, y);
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.arc(x, y, 3 + progress * 31, 0, 2 * Math.PI);
        ctx.stroke();
    }

    private floatingFood(pellet: Pellet, { width, height }: OceanWorld) {
        const { ctx } = this;
        const x = pellet.x * width;
        const y = pellet.y * height;
        const angle = Math.sin(pellet.age * 2.4) * 0.15 + Math.atan(pellet.vy / 18) * 0.48;
        const opacity = this.visibility(x, y);
        const float = 0.87 + 0.13 * Math.sin(pellet.age * 3.2 + x / 17);
        ctx.fillStyle = FOOD[this.light ? "light" : "dark"];
        ctx.globalAlpha = float * opacity;
        ctx.beginPath();
        ctx.ellipse(x, y, 3.4, 1.4, angle, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 0.62 * opacity;
        ctx.beginPath();
        ctx.arc(x - Math.cos(angle) * 3.8, y - Math.sin(angle) * 3.8 + 1.4, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    draw(world: OceanWorld, reduced: boolean) {
        const { ctx } = this;
        const { width, height } = world;
        ctx.clearRect(0, 0, width, height);
        this.surfaceWaves(world, reduced);
        this.waterWake(world, reduced);
        for (const arrival of world.arrivals) {
            this.splash(arrival.x * width, arrival.y * height, reduced ? 0.6 : arrival.age);
        }
        for (const probe of world.activeProbes) {
            for (const pellet of probe.waypoints) {
                const landed = pellet.age - pellet.landsAt;
                if (landed < 0) {
                    const x = pellet.drop.x * width;
                    const y = pellet.drop.y * height + (landed / pellet.landsAt) * 15;
                    ctx.fillStyle = FOOD[this.light ? "light" : "dark"];
                    ctx.globalAlpha = 0.68 * this.visibility(x, y);
                    ctx.font = "10px ui-monospace, Menlo, monospace";
                    ctx.fillText("'", x, y);
                } else {
                    if (landed < SPLASH_LIFE) this.splash(pellet.drop.x * width, pellet.drop.y * height, landed);
                    this.floatingFood(pellet, world);
                }
            }
            this.ray(probe, world, world.radiusFor(probe), reduced);
        }
        ctx.globalAlpha = 1;
    }
}
