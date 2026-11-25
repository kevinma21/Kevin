"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Cited from "./citation";
import Container from "./container";
import { PROFILE } from "../data/profile";
import { SOURCES } from "../data/sources";

const SOCIALS = [
    { label: "github", href: PROFILE.github },
    { label: "linkedin", href: PROFILE.linkedin },
    { label: "Gmail", href: "mailto:kpratama1201@gmail.com" },
];

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const QuoteLines = () => (
    <>
        the tide turns.
        <br />
        the deep keeps its own time.
        <span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
        />
    </>
);

const Socials = ({ className }: { className?: string }) => (
    <p className={className}>
        {SOCIALS.map(({ label, href }, i) => (
            <span key={label}>
                {i > 0 && <span className="opacity-40"> / </span>}
                <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`${UNDERLINE} opacity-60 hover:opacity-100 focus-visible:opacity-100`}
                >
                    {label}
                </a>
            </span>
        ))}
    </p>
);

const Introduction = ({ Mention }: { Mention: typeof Cited }) => (
    <div className="space-y-3 [text-wrap:pretty]">
        <h1 className="font-medium">Hi, I&apos;m Kevin.</h1>
        <p className="max-w-[70ch]">
            Software engineer curious about how artificial intelligence can make everyday software more useful.
        </p>
        <div className="space-y-1.5">
            <p>
                Building <Mention source="journalPilot">JournalPilot</Mention>, an AI-assisted journal.
            </p>
            <p>
                Studied how language models read{" "}
                <Mention source="sentimentResearch">Indonesian political sentiment</Mention>.
            </p>
        </div>
        <p>Somehow, there&apos;s usually a database involved.</p>
    </div>
);

const FrontPage = () => (
    <>
        {mobilePage()}
        {desktopPage()}
    </>
);

const desktopPage = () => {
    return (
        <Container
            as="header"
            className="relative flex h-full flex-col justify-end gap-10 max-lg:hidden bg-transparent pb-32 pt-32 text-foreground [@media(max-height:720px)]:gap-6 [@media(max-height:720px)]:pb-12 [@media(max-height:720px)]:pt-20"
        >
            <motion.blockquote
                data-ocean-protect
                className="font-geistMono text-[14px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-ocean-protect
                className="cited-prose max-w-[54rem] font-geistMono text-[15px] leading-[1.6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Introduction Mention={Cited} />
                <Socials className="mt-4" />
            </motion.div>
        </Container>
    );
};

// On touch, mentions open their destinations directly.
const MobileLink: typeof Cited = ({ source, children }) => {
    const { href } = SOURCES[source];
    if (href.startsWith("/")) {
        return (
            <Link href={href} className={UNDERLINE}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={UNDERLINE}>
            {children}
        </a>
    );
};

const mobilePage = () => {
    return (
        // Top padding clears the floating nav pill.
        <Container
            as="header"
            className="flex h-full flex-col justify-end gap-8 lg:hidden bg-transparent pb-12 pt-28 font-geistMono text-foreground [@media(max-height:640px)]:gap-5 [@media(max-height:640px)]:pb-8"
        >
            <motion.blockquote
                data-ocean-protect
                className="text-[13px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-ocean-protect
                className="flex flex-col gap-3 text-[14px] leading-[1.6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Introduction Mention={MobileLink} />
                <Socials className="mt-2" />
            </motion.div>
        </Container>
    );
};

export default FrontPage;
