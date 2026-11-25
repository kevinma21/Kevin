type JourneyEntry = {
    title: string;
    role: string;
    date: string;
    description: string;
};

export type JourneyChapter = {
    id: string;
    label: string;
    number: string;
    cover: string;
    cardArtwork: string;
    heading: string;
    summary: string;
    date?: string;
    introduction?: string;
    portrait?: { src: string; alt: string; width: number; height: number };
    facts?: { label: string; value: string }[];
    experience?: JourneyEntry[];
    publication?: {
        title: string;
        citation: string;
        venue: string;
        status: string;
        finding: string;
        acceptanceLetter?: { href: string; issued: string };
    };
};

export const LAST_JOURNEY_CHAPTER_KEY = "journey:last-chapter";

export const JOURNEY_CHAPTERS: readonly JourneyChapter[] = [
    {
        id: "background",
        label: "Background",
        number: "01",
        cover: "/journey/background-cover.webp",
        cardArtwork: "/journey/background-card.webp",
        heading: "Building software, exploring ideas.",
        summary: "A journey through software engineering, applied AI, and the systems behind meaningful applications.",
        portrait: {
            src: "/journey/kevin-pratama.webp",
            alt: "Kevin Pratama on a balcony overlooking the city",
            width: 900,
            height: 1200,
        },
        introduction:
            "I'm Kevin Pratama, an Informatics graduate with an interest in software engineering and applied artificial intelligence. I enjoy understanding how things work beneath the surface, from designing application architecture and working with databases to exploring how intelligent systems can solve real-world problems. My technical interests span full-stack development, backend engineering, machine learning, and natural language processing, particularly for Indonesian text. I believe good software comes from understanding the problem deeply, making thoughtful engineering decisions, and continuously learning along the way.",
    },
    {
        id: "education",
        label: "Education",
        number: "02",
        cover: "/journey/education-cover.webp",
        cardArtwork: "/journey/education-card.webp",
        heading: "Universitas Mercu Buana",
        summary: "Building a foundation in computer science, software engineering, and artificial intelligence.",
        date: "2022–2026",
        introduction:
            "I pursued a Bachelor's degree in Informatics at Universitas Mercu Buana, where I developed a foundation in computer science and software development. Throughout my studies, I became particularly interested in artificial intelligence and software engineering, exploring how computational methods and engineering principles can be applied to practical problems. My academic journey also introduced me to natural language processing and machine learning, which eventually led me to research Indonesian political sentiment classification. It was a period of learning not only how to build software, but also how to approach problems analytically and think critically about the systems behind it.",
        facts: [
            { label: "Degree", value: "Bachelor of Informatics" },
            { label: "GPA", value: "3.87 / 4.00" },
            { label: "Concentration", value: "Artificial Intelligence & Software Engineering" },
            { label: "University", value: "Universitas Mercu Buana" },
        ],
    },
    {
        id: "experience",
        label: "Experience",
        number: "03",
        cover: "/journey/experience-cover.webp",
        cardArtwork: "/journey/experience-card.webp",
        heading: "Software and applied AI",
        summary: "Frontend development and AI data annotation.",
        date: "2025–Present",
        experience: [
            {
                title: "PT. Meissa Berkah Teknologi",
                role: "Frontend Web Developer Intern",
                date: "May–July 2025",
                description:
                    "Built frontend CMS interfaces for PT Atlantis Subsea with Next.js, Tailwind CSS, and reusable React components. Added Indonesian and English localization with next-intl and implemented dark theme support.",
            },
            {
                title: "Independent Freelance Work",
                role: "AI Data Annotator and Evaluator",
                date: "July 2026–Present",
                description:
                    "Annotate data and evaluate AI responses for projects across multiple platforms. Follow project-specific guidelines and review submissions against each project's evaluation rubric.",
            },
        ],
    },
    {
        id: "research",
        label: "Research & Publications",
        number: "04",
        cover: "/journey/research-cover.webp",
        cardArtwork: "/journey/research-card.webp",
        heading: "Indonesian political sentiment",
        summary: "Indonesian political sentiment classification. Accepted at ICICoS 2026.",
        date: "2026",
        publication: {
            title: "Comparing IndoBERT-base, IndoBERTweet, and XLM-R for Indonesian Political Sentiment Classification Using Pseudo-Labeling.",
            citation: "Pratama, K., et al. (2026).",
            venue: "9th International Conference on Informatics and Computational Sciences (ICICoS 2026)",
            status: "Accepted; publication pending",
            finding: "IndoBERTweet outperformed the general-domain and multilingual models in the reported evaluation.",
            acceptanceLetter: {
                href: "/journey/icicos-2026-letter-of-acceptance.pdf",
                issued: "July 16, 2026",
            },
        },
    },
];
