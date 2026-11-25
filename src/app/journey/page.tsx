import Link from "next/link";
import Container from "../components/container";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import { JOURNEY_CHAPTERS } from "../data/journey";
import JourneyChapters from "./journey-chapters";
import JourneyCover from "./journey-cover";

export default function JourneyPage() {
    return (
        <div className="h-screen w-full overflow-hidden bg-background text-foreground">
            <h1 className="sr-only">Journey</h1>
            <TopNav />
            <JourneyChapters />
            <div className="h-full w-full overflow-y-auto bg-background lg:hidden">
                <MobileNav />
                <Container as="main" className="flex flex-col pt-[20vw] pb-[12vh]">
                    {JOURNEY_CHAPTERS.map((chapter, index) => (
                        <article key={chapter.id} className="flex flex-col pb-[16vw]">
                            <div className="relative h-[65vw] w-full overflow-hidden rounded-2xl">
                                <JourneyCover chapter={chapter} sizes="90vw" eager={index === 0} />
                            </div>
                            <h2 className="mt-[5vw] mb-2 font-inter text-[21px] text-foreground">{chapter.label}</h2>
                            <p className="font-inter text-[17px] text-foreground opacity-60">{chapter.summary}</p>
                            {chapter.date && (
                                <div className="mt-5">
                                    <p className="mb-1 font-inter text-[17px] text-foreground opacity-60">Year</p>
                                    <p className="font-inter text-[17px] text-foreground">{chapter.date}</p>
                                </div>
                            )}
                            <Link
                                href={`/journey/${chapter.id}`}
                                aria-label={`View chapter: ${chapter.label}`}
                                className="mt-5 inline-flex items-center justify-center self-start whitespace-nowrap rounded-full bg-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] px-4 py-1 text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground active:scale-95 motion-reduce:transition-none"
                            >
                                View chapter
                            </Link>
                        </article>
                    ))}
                </Container>
            </div>
        </div>
    );
}
