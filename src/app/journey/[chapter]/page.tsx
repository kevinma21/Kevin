import { notFound } from "next/navigation";
import { JOURNEY_CHAPTERS } from "../../data/journey";
import JourneyDetail from "../journey-detail";

export const dynamicParams = false;

export function generateStaticParams() {
    return JOURNEY_CHAPTERS.map(({ id }) => ({ chapter: id }));
}

type Props = { params: Promise<{ chapter: string }> };

export async function generateMetadata({ params }: Props) {
    const { chapter } = await params;
    const entry = JOURNEY_CHAPTERS.find(({ id }) => id === chapter);
    if (!entry) return {};

    const title = `${entry.label} | Journey`;
    const description = entry.summary;
    return {
        title,
        description,
        openGraph: { title, description, images: [] },
        twitter: { card: "summary" as const, title, description, images: [] },
    };
}

export default async function ChapterPage({ params }: Props) {
    const { chapter } = await params;
    const index = JOURNEY_CHAPTERS.findIndex(({ id }) => id === chapter);
    if (index === -1) notFound();

    return <JourneyDetail index={index} />;
}
