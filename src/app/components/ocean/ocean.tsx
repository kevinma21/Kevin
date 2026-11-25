"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { OceanWorld, type Point } from "./world";
import { OceanRenderer } from "./ocean-renderer";
import styles from "./ocean.module.css";

type Box = { left: number; top: number; right: number; bottom: number };
type OceanCounts = { rays: number; waypoints: number };

const HOLD = "[data-ocean-protect]";
const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [data-ocean-ignore], " + HOLD;
const KEYBOARD_WAYPOINTS: Point[] = [
    { x: 0.23, y: 0.31 },
    { x: 0.79, y: 0.27 },
    { x: 0.42, y: 0.38 },
    { x: 0.69, y: 0.36 },
    { x: 0.31, y: 0.23 },
    { x: 0.88, y: 0.33 },
];
class OceanEngine {
    private world = new OceanWorld();
    private frame = 0;
    private previous = 0;
    private lastMeasure = 0;
    private suggestedWaypoint = 0;
    private boxes: Box[] = [];
    private counts?: OceanCounts;
    private renderer: OceanRenderer;
    private motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    private resizeObserver = new ResizeObserver(() => this.resize());

    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D,
        private root: HTMLElement,
        private announce: (message: string) => void,
        private report: (counts: OceanCounts) => void
    ) {
        this.renderer = new OceanRenderer(context, (x, y) => this.visibility(x, y));
        this.resizeObserver.observe(canvas);
        for (const overlay of root.querySelectorAll(HOLD)) this.resizeObserver.observe(overlay);
        root.addEventListener("click", this.onClick);
        document.addEventListener("visibilitychange", this.schedule);
        this.motion.addEventListener("change", this.onMotionChange);
        this.resize();
        this.schedule();
    }

    destroy() {
        cancelAnimationFrame(this.frame);
        this.resizeObserver.disconnect();
        this.root.removeEventListener("click", this.onClick);
        document.removeEventListener("visibilitychange", this.schedule);
        this.motion.removeEventListener("change", this.onMotionChange);
    }

    setTheme(isLight: boolean) {
        this.renderer.setTheme(isLight);
        this.draw();
    }

    dropFood = () => {
        this.measureContent();
        // The keyboard control picks an open patch away from the navigation and introduction.
        for (let i = 0; i < KEYBOARD_WAYPOINTS.length; i++) {
            const point = KEYBOARD_WAYPOINTS[this.suggestedWaypoint++ % KEYBOARD_WAYPOINTS.length];
            if (this.visibility(point.x * this.world.width, point.y * this.world.height) <= 0.6) continue;
            this.place(point);
            return;
        }
        this.place({ x: 0.5, y: 0.21 });
    };

    private place(point: Point) {
        if (!this.world.place(point)) {
            this.announce("Wait for a ray to eat before dropping more food.");
            return;
        }
        if (this.motion.matches) this.world.finishRoutes();
        this.draw();
        this.announce("Food dropped.");
    }

    private isOnInterface(event: Event) {
        return event.composedPath().some((node) => node instanceof Element && node.matches(INTERACTIVE));
    }

    private onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.detail === 0 || window.getSelection()?.toString()) return;
        if (this.isOnInterface(event)) return;
        const box = this.canvas.getBoundingClientRect();
        const point = { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height };
        if (point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1) this.place(point);
    };

    private measureContent() {
        const origin = this.canvas.getBoundingClientRect();
        this.boxes = [...this.root.querySelectorAll(HOLD)]
            .map((target) => target.getBoundingClientRect())
            .filter((rect) => rect.width > 0 && rect.height > 0)
            .map((rect) => ({
                left: rect.left - origin.left,
                right: rect.right - origin.left,
                top: rect.top - origin.top,
                bottom: rect.bottom - origin.top,
            }));
    }

    private resize() {
        const { width, height } = this.canvas.getBoundingClientRect();
        if (!width || !height) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(width * ratio);
        const pixelHeight = Math.round(height * ratio);
        if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
            this.canvas.width = pixelWidth;
            this.canvas.height = pixelHeight;
        }
        this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.world.resize(width, height);
        this.measureContent();
        this.draw();
    }

    private visibility(x: number, y: number) {
        let opacity = 1;
        for (const box of this.boxes) {
            const dx = Math.max(box.left - x, x - box.right, 0);
            const dy = Math.max(box.top - y, y - box.bottom, 0);
            opacity = Math.min(opacity, Math.hypot(dx, dy) / 34 + 0.04);
        }
        return opacity;
    }

    private draw() {
        this.renderer.draw(this.world, this.motion.matches);
        const rays = this.world.activeProbes.length;
        const waypoints = this.world.pending;
        if (this.counts?.rays === rays && this.counts.waypoints === waypoints) return;
        this.counts = { rays, waypoints };
        this.report(this.counts);
    }

    private schedule = () => {
        cancelAnimationFrame(this.frame);
        this.previous = 0;
        if (!this.motion.matches && !document.hidden) this.frame = requestAnimationFrame(this.tick);
    };

    private onMotionChange = () => {
        if (this.motion.matches) this.world.finishRoutes();
        this.draw();
        this.schedule();
    };

    private tick = (now: number) => {
        const elapsed = this.previous ? now - this.previous : 34;
        if (elapsed >= 32) {
            this.world.step(Math.min(elapsed / 1000, 0.08));
            this.previous = now;
            if (now - this.lastMeasure > 300) {
                this.measureContent();
                this.lastMeasure = now;
            }
            this.draw();
        }
        this.frame = requestAnimationFrame(this.tick);
    };
}

export default function Ocean() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engine = useRef<OceanEngine | null>(null);
    const { resolvedTheme } = useTheme();
    const [status, setStatus] = useState({ message: "", id: 0 });
    const [counts, setCounts] = useState<OceanCounts | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const root = canvas?.parentElement;
        const context = canvas?.getContext("2d");
        if (!canvas || !context || !root) return;
        const scene = new OceanEngine(
            canvas,
            context,
            root,
            (message) => setStatus(({ id }) => ({ message, id: id + 1 })),
            setCounts
        );
        engine.current = scene;
        return () => {
            scene.destroy();
            engine.current = null;
        };
    }, []);

    useEffect(() => {
        engine.current?.setTheme(resolvedTheme === "light");
    }, [resolvedTheme]);

    return (
        <>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                data-ocean
            />
            <div
                data-ocean-protect
                className="absolute right-4 top-[max(4.5rem,16vw)] z-[25] font-geistMono text-[11px] leading-relaxed tabular-nums lg:right-[20vw] lg:top-5"
            >
                {counts && (
                    <button
                        type="button"
                        className={`grid min-h-11 min-w-11 place-content-center text-foreground ${styles.counts}`}
                        onClick={() => engine.current?.dropFood()}
                        aria-label="Drop food"
                        aria-describedby="ocean-instructions"
                    >
                        <span className={styles.count} aria-hidden="true">
                            {counts.rays}
                        </span>
                        <span className={`${styles.count} ${styles.pulse}`} key={counts.waypoints} aria-hidden="true">
                            {counts.waypoints}
                        </span>
                        <span id="ocean-instructions" className="sr-only">
                            {counts.rays} rays, {counts.waypoints} food pellets. Activate this button or tap open water
                            to feed the rays.
                        </span>
                    </button>
                )}
                <span role="status" className="sr-only">
                    <span key={status.id}>{status.message}</span>
                </span>
            </div>
        </>
    );
}
