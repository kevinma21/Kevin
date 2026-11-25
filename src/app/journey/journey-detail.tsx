"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { finishTransition, isTransitioning } from "../../lib/view-transition";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import { JOURNEY_CHAPTERS, LAST_JOURNEY_CHAPTER_KEY, type JourneyChapter } from "../data/journey";
import JourneyCover from "./journey-cover";
import JourneyLink from "./journey-link";

const BODY = "text-[16px] leading-[1.7] [text-wrap:pretty]";
const MUTED = "text-[var(--muted-color)]";

export default function JourneyDetail({ index }: { index: number }) {
    const chapter = JOURNEY_CHAPTERS[index];
    const { date, experience, facts, heading, id, introduction, label, number, portrait, publication } = chapter;
    const count = JOURNEY_CHAPTERS.length;
    const previous = JOURNEY_CHAPTERS[(index - 1 + count) % count];
    const next = JOURNEY_CHAPTERS[(index + 1) % count];

    const cover = useRef<HTMLDivElement>(null);
    const [overCover, setOverCover] = useState(false);
    const [arrivedSliding] = useState(() => typeof window !== "undefined" && isTransitioning());
    const still = useReducedMotion();

    useEffect(() => {
        sessionStorage.setItem(LAST_JOURNEY_CHAPTER_KEY, id);
        finishTransition();
    }, [id]);

    useEffect(() => {
        const update = () => setOverCover((cover.current?.getBoundingClientRect().bottom ?? 0) > 56);
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav overCover={overCover} />
            <div className="pt-20 lg:pt-0">
                <div ref={cover} className="relative h-[clamp(180px,26vw,440px)] w-full overflow-hidden">
                    <JourneyCover chapter={chapter} sizes="100vw" banner />
                    <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-black/65 to-transparent lg:block" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,transparent,var(--background-color))]" />
                </div>
            </div>
            <motion.main
                initial={arrivedSliding ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: still ? 0 : 0.5, ease: "easeOut" }}
                className="mx-auto w-full max-w-[56rem] px-6 pt-10 pb-40 font-geistSans lg:box-content lg:pt-14 motion-reduce:!opacity-100"
            >
                <header>
                    <JourneyLink
                        href="/journey"
                        direction="back"
                        className={`text-[14px] ${MUTED} outline-none transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Journey
                    </JourneyLink>
                    <h1 className="mt-10 text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">{label}</h1>
                    <p className={`mt-1 text-[16px] ${MUTED}`}>{heading}</p>
                    {date && <p className={`mt-3 font-geistMono text-[12px] ${MUTED}`}>{date}</p>}
                    {(introduction || portrait) && (
                        <div
                            className={
                                portrait
                                    ? "mt-8 grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-10"
                                    : "mt-8"
                            }
                        >
                            {introduction && <p className={BODY}>{introduction}</p>}
                            {portrait && (
                                <Image
                                    src={portrait.src}
                                    alt={portrait.alt}
                                    width={portrait.width}
                                    height={portrait.height}
                                    sizes="(min-width: 640px) 240px, (min-width: 352px) 288px, calc(100vw - 3rem)"
                                    className="h-auto w-full max-w-72 rounded-lg sm:max-w-none"
                                />
                            )}
                        </div>
                    )}
                </header>
                {facts && (
                    <dl className="mt-8 max-w-lg">
                        {facts
                            .filter(({ label }) => label !== "Years")
                            .map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="grid gap-1 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] py-3 sm:grid-cols-[9rem_1fr]"
                                >
                                    <dt className={`font-geistMono text-[12px] ${MUTED}`}>{label}</dt>
                                    <dd className={BODY}>{value}</dd>
                                </div>
                            ))}
                    </dl>
                )}
                {experience && (
                    <ol className="mt-10 grid max-w-2xl gap-8 border-l border-[color-mix(in_srgb,var(--foreground-color)_15%,transparent)] pl-5">
                        {experience.map(({ title, role, date, description }) => (
                            <li
                                key={title}
                                className="relative before:absolute before:top-2 before:-left-[1.45rem] before:size-[7px] before:rounded-full before:bg-foreground"
                            >
                                <p className={`font-geistMono text-[12px] ${MUTED}`}>{date}</p>
                                <h2 className="mt-2 text-[18px] font-medium">{title}</h2>
                                <p className={`mt-1 text-[15px] ${MUTED}`}>{role}</p>
                                <p className={`${BODY} mt-3`}>{description}</p>
                            </li>
                        ))}
                    </ol>
                )}
                {publication && (
                    <section className="mt-8 max-w-2xl">
                        <p className={`font-geistMono text-[12px] ${MUTED}`}>{publication.status}</p>
                        <h2 className="mt-3 text-[18px] font-medium">
                            <cite>{publication.title}</cite>
                        </h2>
                        <p className={`${BODY} mt-3`}>{publication.citation}</p>
                        <p className={BODY}>Accepted at the {publication.venue}.</p>
                        <p className={`${BODY} mt-5`}>{publication.finding}</p>
                        {publication.acceptanceLetter && (
                            <div className="mt-8 border-t border-[color-mix(in_srgb,var(--foreground-color)_15%,transparent)] pt-5">
                                <h3 className="text-[16px] font-medium">Letter of acceptance</h3>
                                <p className={`mt-1 text-[14px] ${MUTED}`}>
                                    Issued {publication.acceptanceLetter.issued} by the ICICoS 2026 committee. The
                                    letter confirms acceptance for oral presentation.
                                </p>
                                <a
                                    href={publication.acceptanceLetter.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-[14px] underline decoration-[var(--muted-color)] underline-offset-4 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                                >
                                    View acceptance letter (PDF)
                                </a>
                            </div>
                        )}
                    </section>
                )}
                <nav
                    aria-label="More chapters"
                    className="mt-24 flex items-start justify-between gap-6 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] pt-6"
                >
                    <ChapterPager chapter={previous} direction="back" />
                    <span className={`sr-only font-geistMono text-[12px] ${MUTED}`}>
                        Chapter {number} of {count}
                    </span>
                    <ChapterPager chapter={next} direction="forward" />
                </nav>
            </motion.main>
        </div>
    );
}

function ChapterPager({ chapter, direction }: { chapter: JourneyChapter; direction: "back" | "forward" }) {
    const back = direction === "back";
    const card = useRef<HTMLSpanElement>(null);
    const follow = useRef({ x: 0, y: 0, tx: 0, ty: 0, frame: 0 });
    const still = useReducedMotion();

    useEffect(() => {
        const point = follow.current;
        return () => cancelAnimationFrame(point.frame);
    }, []);

    function move(x: number, y: number, immediately = false) {
        const preview = card.current;
        if (!preview) return;

        const point = follow.current;
        point.tx = Math.max(12, Math.min(window.innerWidth - preview.offsetWidth - 12, x - preview.offsetWidth / 2));
        const above = y - preview.offsetHeight - 18;
        point.ty = above < 12 ? y + 18 : above;

        function place() {
            preview?.style.setProperty("transform", `translate3d(${point.x}px, ${point.y}px, 0)`);
        }

        if (immediately || still) {
            cancelAnimationFrame(point.frame);
            point.frame = 0;
            point.x = point.tx;
            point.y = point.ty;
            place();
        } else if (!point.frame) {
            const step = () => {
                point.x += (point.tx - point.x) * 0.25;
                point.y += (point.ty - point.y) * 0.25;
                place();
                point.frame =
                    Math.abs(point.tx - point.x) + Math.abs(point.ty - point.y) > 0.5 ? requestAnimationFrame(step) : 0;
            };
            point.frame = requestAnimationFrame(step);
        }
    }

    return (
        <JourneyLink
            href={`/journey/${chapter.id}`}
            direction={direction}
            onPointerEnter={(event) => move(event.clientX, event.clientY, true)}
            onPointerMove={(event) => move(event.clientX, event.clientY)}
            onFocus={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                move(bounds.left + bounds.width / 2, bounds.top, true);
            }}
            className={`group relative flex flex-col gap-1 outline-none ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-[12px] ${MUTED}`}>{back ? "previous" : "next"}</span>
            <span className="text-[16px] decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${chapter.label}` : `${chapter.label} →`}
            </span>
            <span
                ref={card}
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-50 hidden w-[17rem] scale-[0.96] rounded-[8px] border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-background p-2 text-left opacity-0 shadow-[0_12px_32px_rgb(0_0_0/0.25)] transition-[opacity,scale] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none lg:block"
            >
                <span className="relative block aspect-[3/2] overflow-hidden rounded-[4px]">
                    <JourneyCover chapter={chapter} sizes="256px" />
                </span>
                <span className="mt-2 flex items-baseline gap-2 px-1">
                    <span className="text-[14px]">{chapter.label}</span>
                    <span className={`font-geistMono text-[11px] ${MUTED}`}>{chapter.date ?? chapter.number}</span>
                </span>
                <span className={`mt-0.5 block px-1 pb-1 text-[13px] leading-[1.45] ${MUTED}`}>{chapter.summary}</span>
            </span>
        </JourneyLink>
    );
}
