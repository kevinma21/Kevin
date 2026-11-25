"use client";

import { useEffect, useRef, useState } from "react";
import { finishTransition, isTransitioning } from "../../lib/view-transition";
import { JOURNEY_CHAPTERS, LAST_JOURNEY_CHAPTER_KEY } from "../data/journey";
import JourneyCover from "./journey-cover";
import JourneyLink from "./journey-link";

const GLIDE = 0.18;
const KEY_STEPS: Record<string, number> = {
    ArrowRight: 0.1,
    ArrowDown: 0.1,
    ArrowLeft: -0.1,
    ArrowUp: -0.1,
    PageDown: 0.8,
    PageUp: -0.8,
    " ": 0.8,
    End: Infinity,
    Home: -Infinity,
};

export default function JourneyChapters() {
    const mainRef = useRef<HTMLElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const main = mainRef.current;
        const strip = stripRef.current;
        if (!main || !strip) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (isTransitioning()) {
            const last = sessionStorage.getItem(LAST_JOURNEY_CHAPTER_KEY);
            const tile = Array.from(strip.children).find((child) => child.getAttribute("data-chapter") === last);
            if (tile instanceof HTMLElement)
                strip.scrollLeft = tile.offsetLeft - parseFloat(getComputedStyle(strip).paddingLeft);
        }
        finishTransition();

        let target = strip.scrollLeft;
        let frame = 0;

        function stop() {
            cancelAnimationFrame(frame);
            frame = 0;
        }

        function glide() {
            if (!strip) return;
            const before = strip.scrollLeft;
            strip.scrollLeft += (target - before) * GLIDE;
            if (strip.scrollLeft === before) {
                strip.scrollLeft = target;
                frame = 0;
                return;
            }
            frame = requestAnimationFrame(glide);
        }

        function glideBy(delta: number) {
            if (!strip) return;
            const max = strip.scrollWidth - strip.clientWidth;
            target = Math.max(0, Math.min(max, (frame ? target : strip.scrollLeft) + delta));
            if (still.matches) strip.scrollLeft = target;
            else if (!frame) frame = requestAnimationFrame(glide);
        }

        function onWheel(event: WheelEvent) {
            if (event.ctrlKey || event.defaultPrevented) return;
            const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            if (sideways && strip?.contains(event.target as Node)) {
                stop();
                return;
            }
            event.preventDefault();
            const delta = sideways ? event.deltaX : event.deltaY;
            glideBy(event.deltaMode === 1 ? delta * 16 : delta);
        }

        function onKeyDown(event: KeyboardEvent) {
            const step = KEY_STEPS[event.key];
            if (
                !strip ||
                step === undefined ||
                event.defaultPrevented ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
            )
                return;
            event.preventDefault();
            glideBy((event.key === " " && event.shiftKey ? -step : step) * strip.clientWidth);
        }

        main.addEventListener("wheel", onWheel, { passive: false });
        main.addEventListener("keydown", onKeyDown);
        strip.addEventListener("pointerdown", stop);
        return () => {
            stop();
            main.removeEventListener("wheel", onWheel);
            main.removeEventListener("keydown", onKeyDown);
            strip.removeEventListener("pointerdown", stop);
        };
    }, []);

    return (
        <main ref={mainRef} className="flex h-full flex-col justify-center pt-12 max-lg:hidden">
            <div
                ref={stripRef}
                role="region"
                aria-label="Journey chapters"
                tabIndex={0}
                onScroll={({ currentTarget }) => {
                    const inset = parseFloat(getComputedStyle(currentTarget).paddingLeft);
                    const nearest = Array.from(currentTarget.children).findLastIndex(
                        (child) =>
                            child instanceof HTMLElement &&
                            child.offsetLeft <= currentTarget.scrollLeft + inset + child.offsetWidth / 2
                    );
                    setActive(Math.max(0, nearest));
                }}
                className="relative flex gap-3 overflow-x-auto px-[max(1.5rem,calc((100vw-56rem)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {JOURNEY_CHAPTERS.map((chapter, index) => (
                    <JourneyLink
                        key={chapter.id}
                        href={`/journey/${chapter.id}`}
                        data-chapter={chapter.id}
                        aria-label={chapter.label}
                        aria-current={index === active ? "step" : undefined}
                        className="group block w-min shrink-0 outline-none focus-visible:underline"
                    >
                        <div className="relative aspect-[3/2] h-[min(62vh,42rem)] overflow-hidden bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)]">
                            <JourneyCover
                                chapter={chapter}
                                eager={index === 0}
                                sizes="(max-height: 1083px) 93vh, 1008px"
                                className="transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                            />
                            <span className="pointer-events-none absolute bottom-4 left-4 translate-y-1 rounded-full bg-[rgb(0_0_0/0.55)] px-3 py-1.5 font-geistMono text-[12px] text-dark-foreground opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                                view chapter
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-3">
                            <span className="whitespace-nowrap text-[15px]">{chapter.label}</span>
                            <span className="whitespace-nowrap font-geistMono text-[12px] text-[var(--muted-color)]">
                                {chapter.date ?? chapter.number}
                            </span>
                        </div>
                        <p className="mt-1 text-[14px] leading-[1.5] text-[var(--muted-color)]">{chapter.summary}</p>
                    </JourneyLink>
                ))}
            </div>
        </main>
    );
}
