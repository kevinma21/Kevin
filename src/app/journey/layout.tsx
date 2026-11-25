import type { Metadata } from "next";

const title = "Journey";
const description = "Kevin Pratama’s background, education, professional experience, and research.";

export const metadata: Metadata = {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
};

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
