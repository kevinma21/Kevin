/** Sources for the landing page's @-mentions: what the hover card shows, plus where a click lands. */

type Source = {
    name: string;
    role: string;
    dates: string;
    summary: string;
    href: string;
};

export const SOURCES = {
    journalPilot: {
        name: "JournalPilot",
        role: "AI-assisted journal",
        dates: "In progress",
        summary: "A journal designed to help you find and revisit earlier entries.",
        href: "https://github.com/kevinma21/Journal-RAG",
    },
    sentimentResearch: {
        name: "Indonesian sentiment research",
        role: "Accepted at ICICoS 2026",
        dates: "2026",
        summary:
            "Compared three language models for Indonesian political sentiment classification. IndoBERTweet performed best in the reported evaluation. Publication pending.",
        href: "/journey/research",
    },
} satisfies Record<string, Source>;
