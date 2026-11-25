export type Point = { x: number; y: number };

export type Wake = Point & { age: number; heading: number; radius: number; strength: number };
type Waypoint = Point & { age: number };
export type Pellet = Waypoint & { drop: Point; landsAt: number; vx: number; vy: number };
type Course = { start: Point; lead: Point; bend: Point; length: number; progress: number };

export type Probe = Point & {
    heading: number;
    facing: number;
    phase: number;
    speed: number;
    bank: number;
    nextWake: number;
    absorbed: number;
    scale: number;
    biteAge: number;
    waypoints: Pellet[];
    course?: Course;
};

const MAX_WAYPOINTS = 16;
export const WAKE_LIFE = 2.9;
export const SPLASH_LIFE = 1.4;
export const MOUTH_OFFSET = 1.18;
const wrap = (value: number) => ((value % 1) + 1) % 1;
const turnAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function wakeSize(wake: Wake, age: number) {
    return {
        backward: age * 13,
        length: wake.radius * 0.5 + age * 9,
        spread: wake.radius * 0.65 + age * 26,
    };
}

function growth(absorbed: number) {
    return 1 + 0.72 * (1 - Math.exp(-absorbed / 3.5));
}

function newProbe(x: number, y: number, heading: number, phase: number): Probe {
    return {
        x,
        y,
        heading,
        facing: heading,
        phase,
        speed: 22,
        bank: 0,
        nextWake: 0,
        absorbed: 0,
        scale: 1,
        biteAge: Infinity,
        waypoints: [],
    };
}

function coursePoint(course: Course, target: Point & { bend: Point }, t: number): Point {
    const left = 1 - t;
    return {
        x:
            left ** 3 * course.start.x +
            3 * left ** 2 * t * course.lead.x +
            3 * left * t ** 2 * target.bend.x +
            t ** 3 * target.x,
        y:
            left ** 3 * course.start.y +
            3 * left ** 2 * t * course.lead.y +
            3 * left * t ** 2 * target.bend.y +
            t ** 3 * target.y,
    };
}

export class OceanWorld {
    width = 1;
    height = 1;
    time = 0;
    private readonly probes: Probe[] = [
        newProbe(0.13, 0.26, 0.12, 0.8),
        newProbe(0.79, 0.33, -2.7, 2.8),
        newProbe(0.38, 0.18, 0.48, 3.8),
        newProbe(0.68, 0.48, -2.15, 1.7),
        newProbe(0.88, 0.7, -0.95, 5.2),
    ];
    arrivals: Waypoint[] = [];
    wakes: Wake[] = [];

    get activeProbes() {
        return this.width < 640 ? this.probes.slice(0, 4) : this.probes;
    }

    get pending() {
        return this.probes.reduce((count, probe) => count + probe.waypoints.length, 0);
    }

    radiusFor(probe: Probe) {
        return (this.width < 640 ? 16 : 24) * probe.scale * (0.95 + Math.sin(probe.phase) * 0.08);
    }

    resize(width: number, height: number) {
        const first = this.width === 1 && this.height === 1;
        const changed = width !== this.width || height !== this.height;
        this.width = width;
        this.height = height;
        if (!changed) return;

        for (const probe of this.probes) probe.course = undefined;
        // A probe hidden by the mobile breakpoint hands its remaining route to the visible probes.
        if (width < 640) {
            if (first) {
                this.probes[0].y = 0.18;
                this.probes[1].y = 0.19;
                this.probes[2].x = 0.28;
                this.probes[2].y = 0.3;
                this.probes[3].x = 0.7;
                this.probes[3].y = 0.32;
            }
            for (const pellet of this.probes[4].waypoints.splice(0)) this.assign(pellet);
        }
    }

    private distance(from: Point, to: Point) {
        return Math.hypot((to.x - from.x) * this.width, (to.y - from.y) * this.height);
    }

    place(waypoint: Point) {
        const count = Math.min(3, MAX_WAYPOINTS - this.pending);
        for (let i = 0; i < count; i++) {
            const angle = this.time * 1.1 + i * 2.4;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const spread = i * 6;
            const drop = {
                x: clamp(waypoint.x + (dx * spread) / this.width, 0, 1),
                y: clamp(waypoint.y + (dy * spread) / this.height, 0, 1),
            };
            const current = surfaceCurrent(drop.x * this.width, drop.y * this.height, this.time);
            this.assign({
                ...drop,
                drop,
                age: 0,
                landsAt: 0.17 + i * 0.1,
                vx: current.x + dx * (3 + i),
                vy: current.y + dy * (3 + i),
            });
        }
        return count > 0;
    }

    private assign(pellet: Pellet) {
        let nearest = this.activeProbes[0];
        let minimum = Infinity;
        for (const probe of this.activeProbes) {
            let from: Point = probe;
            let distance = 0;
            for (const stop of probe.waypoints) {
                distance += this.distance(from, stop);
                from = stop;
            }
            distance += this.distance(from, pellet);
            if (distance < minimum) {
                nearest = probe;
                minimum = distance;
            }
        }

        nearest.waypoints.push(pellet);
    }

    private plan(probe: Probe, waypoint: Point): Course {
        const dx = (waypoint.x - probe.x) * this.width;
        const dy = (waypoint.y - probe.y) * this.height;
        const distance = Math.hypot(dx, dy);
        const bend = Math.min(distance * 0.28, 116) * Math.sign(Math.sin(probe.phase + this.time));
        const ratio = distance ? bend / distance : 0;
        const lead = Math.min(distance * 0.3, 55);

        return {
            start: { x: probe.x, y: probe.y },
            lead: {
                x: probe.x + (Math.cos(probe.heading) * lead) / this.width,
                y: probe.y + (Math.sin(probe.heading) * lead) / this.height,
            },
            bend: {
                x: Math.max(0, Math.min(1, waypoint.x - (dx * 0.27 + dy * ratio) / this.width)),
                y: Math.max(0, Math.min(1, waypoint.y - (dy * 0.27 - dx * ratio) / this.height)),
            },
            length: Math.max(1, distance + Math.abs(bend) * 0.25),
            progress: 0,
        };
    }

    private leaveWake(probe: Probe, strength: number) {
        const radius = this.radiusFor(probe);
        const behind = radius * 1.55;
        this.wakes.push({
            x: probe.x - (Math.cos(probe.heading) * behind) / this.width,
            y: probe.y - (Math.sin(probe.heading) * behind) / this.height,
            heading: probe.heading,
            radius,
            strength,
            age: 0,
        });
    }

    private move(probe: Probe, point: Point) {
        const dx = (point.x - probe.x) * this.width;
        const dy = (point.y - probe.y) * this.height;
        if (dx || dy) probe.heading = Math.atan2(dy, dx);
        probe.x = point.x;
        probe.y = point.y;
    }

    private arrive(probe: Probe, waypoint: Waypoint) {
        probe.waypoints.shift();
        probe.course = undefined;
        probe.biteAge = 0;
        probe.absorbed += 0.45;
        this.arrivals.push({ x: waypoint.x, y: waypoint.y, age: 0 });
    }

    private mouthApproach(probe: Probe, course: Course, pellet: Pellet) {
        const dx = (pellet.x - course.bend.x) * this.width;
        const dy = (pellet.y - course.bend.y) * this.height;
        const heading = Math.hypot(dx, dy) > 0.5 ? Math.atan2(dy, dx) : probe.heading;
        const reach = Math.min(this.radiusFor(probe) * MOUTH_OFFSET, this.distance(course.start, pellet));
        const offsetX = (Math.cos(heading) * reach) / this.width;
        const offsetY = (Math.sin(heading) * reach) / this.height;
        return {
            x: pellet.x - offsetX,
            y: pellet.y - offsetY,
            bend: { x: course.bend.x - offsetX, y: course.bend.y - offsetY },
            heading,
        };
    }

    private driftFood(dt: number) {
        const currents = this.wakes.map((wake) => ({
            ...wake,
            ...wakeSize(wake, wake.age),
            dx: Math.cos(wake.heading),
            dy: Math.sin(wake.heading),
        }));
        const follow = 1 - Math.exp(-dt * 0.9);
        for (const probe of this.activeProbes) {
            for (const pellet of probe.waypoints) {
                pellet.age += dt;
                if (pellet.age < pellet.landsAt) continue;
                let x = pellet.x * this.width;
                let y = pellet.y * this.height;
                const current = surfaceCurrent(x, y, this.time);
                pellet.vx += (current.x - pellet.vx) * follow;
                pellet.vy += (current.y - pellet.vy) * follow;
                for (const wake of currents) {
                    const offsetX = x - wake.x * this.width;
                    const offsetY = y - wake.y * this.height;
                    const along = (offsetX * wake.dx + offsetY * wake.dy + wake.backward) / wake.length;
                    const across = (-offsetX * wake.dy + offsetY * wake.dx) / wake.spread;
                    if (along <= 0.1) continue;
                    const distance = Math.hypot(along, across);
                    const contact = Math.max(0, 1 - Math.abs(distance - 1) / 0.34);
                    const push = dt * 210 * contact * wake.strength * (1 - wake.age / WAKE_LIFE);
                    pellet.vx += push * (along * wake.dx - across * wake.dy);
                    pellet.vy += push * (along * wake.dy + across * wake.dx);
                }

                x += clamp(pellet.vx, -36, 36) * dt;
                y += clamp(pellet.vy, -36, 36) * dt;
                if (x < 0 || x > this.width) pellet.vx *= -0.35;
                if (y < 0 || y > this.height) pellet.vy *= -0.35;
                pellet.x = clamp(x / this.width, 0, 1);
                pellet.y = clamp(y / this.height, 0, 1);
            }
        }
    }

    // Show the whole route immediately when the visitor prefers reduced motion.
    finishRoutes() {
        this.wakes = [];
        this.arrivals = this.arrivals.slice(-MAX_WAYPOINTS);
        for (const probe of this.activeProbes) {
            for (const waypoint of [...probe.waypoints]) {
                const course = probe.course ?? this.plan(probe, waypoint);
                const end = this.mouthApproach(probe, course, waypoint);
                this.move(probe, end);
                probe.heading = end.heading;
                this.arrive(probe, waypoint);
                probe.facing = probe.heading;
                this.leaveWake(probe, 0.48);
            }
            probe.scale = growth(probe.absorbed);
        }
    }

    step(dt: number) {
        this.time += dt;
        for (const arrival of this.arrivals) arrival.age += dt;
        this.arrivals = this.arrivals.filter(({ age }) => age < SPLASH_LIFE);
        for (const wake of this.wakes) wake.age += dt;
        this.wakes = this.wakes.filter(({ age }) => age < WAKE_LIFE);
        this.driftFood(dt);

        for (const probe of this.activeProbes) {
            probe.biteAge += dt;
            probe.scale += (growth(probe.absorbed) - probe.scale) * (1 - Math.exp(-dt * 5));
            const next = probe.waypoints[0];
            const target = next && next.age >= next.landsAt ? next : undefined;
            const heading = probe.heading;
            const pulse = 0.5 + 0.5 * Math.sin(this.time * 1.1 + probe.phase);
            const approach = target ? Math.min(1, this.distance(probe, target) / 75) : 0;
            const pace = target
                ? (Math.min(this.width * 0.18, 122) * (0.55 + 0.45 * approach) * (0.93 + 0.14 * pulse)) /
                  Math.sqrt(probe.scale)
                : 15 + 18 * pulse ** 2;
            probe.speed += (pace - probe.speed) * (1 - Math.exp(-dt * (target ? 2.8 : 1.45)));

            if (target) {
                const course = (probe.course ??= this.plan(probe, target));
                const end = this.mouthApproach(probe, course, target);
                course.progress = Math.min(1, course.progress + (dt * probe.speed) / course.length);
                this.move(probe, coursePoint(course, end, course.progress));
                if (course.progress === 1) {
                    probe.heading = end.heading;
                    this.arrive(probe, target);
                }
            } else {
                const edge = Math.min(
                    probe.x * this.width,
                    (1 - probe.x) * this.width,
                    probe.y * this.height,
                    (1 - probe.y) * this.height
                );
                const steer = Math.max(0, 1 - edge / 90);
                const inward = Math.atan2((0.43 - probe.y) * this.height, (0.5 - probe.x) * this.width);
                probe.heading +=
                    dt *
                    (Math.sin(this.time * 0.65 + probe.phase) * 0.38 + steer * turnAngle(inward - probe.heading) * 1.3);
                const x = probe.x + (Math.cos(probe.heading) * dt * probe.speed) / this.width;
                const y = probe.y + (Math.sin(probe.heading) * dt * probe.speed) / this.height;
                probe.x = wrap(x);
                probe.y = wrap(y);
            }
            probe.facing += turnAngle(probe.heading - probe.facing) * (1 - Math.exp(-dt * 4.2));
            const turn = turnAngle(probe.heading - heading);
            const bank = Math.max(-0.32, Math.min(0.32, (turn * 0.17) / Math.max(dt, 0.001)));
            probe.bank += (bank - probe.bank) * (1 - Math.exp(-dt * 6));
            if (this.time >= probe.nextWake && (target || pulse > 0.64)) {
                this.leaveWake(probe, target ? 0.69 : 0.38 + pulse * 0.19);
                probe.nextWake = this.time + (target ? 0.75 : 1.1);
            }
        }
    }
}
import { surfaceCurrent } from "./water";
