export type Project = {
    /** URL segment for the project's own page. */
    slug: string;
    index: string;
    name: string;
    description: string;
    tech: string[];
    year: string;
    status?: string;
    /** Omit to show the project without sending anyone anywhere. */
    link?: string;
    liveUrl?: string;
    /** Small raster preview, rendered from the original artwork. */
    thumb: string;
    /** A project with its own page on the site; its tiles link there instead of out. */
    page?: {
        tagline: string;
        /** The write-up under the tagline, so the page doesn't repeat it. */
        about: Prose;
        /** Omit for a project without a demo; the poster then stands alone as the lead image. */
        video?: string;
        poster: string;
        /** Wide banner across the top of the page, like a Notion cover. */
        cover?: string;
        /** 1200×630 card for link previews when the page is shared. */
        share?: string;
        /** How the project got here, as prose with the clips placed between paragraphs. */
        story?: StoryBlock[];
    };
};

/** Plain text with inline links. */
export type Prose = (string | { text: string; href: string })[];

/** A paragraph is plain text with inline links; a clip is a short muted video. */
export type StoryBlock =
    | { kind: "heading"; text: string }
    | { kind: "text"; parts: Prose }
    | { kind: "clip"; src: string; poster?: string; label: string }
    | { kind: "image"; src: string; alt: string; width: number; height: number }
    /** `start` is the panel open before anyone interacts; lead with the strongest shot. */
    | { kind: "gallery"; title?: string; shots: Shot[]; start?: number };

/** A captioned still of the product, shown on its own or in a gallery grid. */
export type Shot = {
    /** Tight crop of the UI, for the swipeable cards on small screens. */
    src: string;
    /** The full 16:9 frame, for the accordion panels on desktop. */
    frame: string;
    alt: string;
    title: string;
    caption: string;
    width: number;
    height: number;
};

function artwork(slug: string) {
    const base = `/projects/${slug}`;
    return {
        thumb: `${base}/preview.webp`,
        cover: `${base}/cover.webp`,
        poster: `${base}/poster.webp`,
        share: `${base}/share.jpg`,
        shot(key: string, title: string, alt: string, caption: string): Shot {
            return {
                src: `${base}/${key}.webp`,
                frame: `${base}/${key}-frame.webp`,
                title,
                alt,
                caption,
                width: 1440,
                height: 900,
            };
        },
    };
}

const journal = artwork("journalpilot");
const vault = artwork("devvault");
const annotation = artwork("annotator-web");
const cms = artwork("atlantis-cms");
const collection = artwork("x-api-crawling-based");

export const projects: Project[] = [
    {
        index: "01",
        slug: "journalpilot",
        name: "JournalPilot",
        description:
            "A private journal workspace for organizing entries, revisiting past notes, and building toward assisted recall.",
        tech: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Supabase"],
        year: "2026",
        status: "In progress",
        link: "https://github.com/kevinma21/Journal-RAG",
        thumb: journal.thumb,
        page: {
            tagline: "A place to write and find your way back to what you wrote.",
            about: [
                "JournalPilot brings separate journals, their entries, and their timelines into one workspace. The ",
                {
                    text: "project roadmap",
                    href: "https://github.com/kevinma21/Journal-RAG/blob/main/docs/03-roadmap/roadmap.md",
                },
                " also lays out how retrieval could support assisted recall. The screens below use sample journal entries.",
            ],
            cover: journal.cover,
            poster: journal.poster,
            share: journal.share,
            story: [
                { kind: "heading", text: "Separate spaces for different parts of life" },
                {
                    kind: "text",
                    parts: [
                        "The library gives each journal a name, description, color, and icon. Inside a journal, the timeline keeps dates and filters nearby while leaving the main pane for reading and writing.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Reading and writing",
                    start: 1,
                    shots: [
                        journal.shot(
                            "library",
                            "Journal library",
                            "Three sample journals with search and creation controls",
                            "Find a journal by name or description, or start a new one."
                        ),
                        journal.shot(
                            "workspace",
                            "Entry timeline",
                            "Dated journal entries beside an open Markdown entry",
                            "Read an entry while keeping the timeline, search, and date filters in view."
                        ),
                        journal.shot(
                            "editor",
                            "Entry editor",
                            "A new entry form with a title field, date, and Markdown tabs",
                            "Set when the entry happened and switch between writing and preview."
                        ),
                    ],
                },
                { kind: "heading", text: "Keeping entries scoped to their owner" },
                {
                    kind: "text",
                    parts: [
                        "The app separates journal and entry operations from authentication. PostgreSQL row-level security adds a database boundary around journal data, and the editor has a local draft mechanism for unfinished entries.",
                    ],
                },
            ],
        },
    },
    {
        index: "02",
        slug: "devvault",
        name: "DevVault",
        description:
            "A project-based workspace for managing application secrets and the team members who can access them.",
        tech: ["React", "TypeScript", "ASP.NET Core", "PostgreSQL"],
        year: "2026",
        link: "https://github.com/kevinma21/DevVault",
        thumb: vault.thumb,
        page: {
            tagline: "Project secrets with explicit access controls.",
            about: [
                "DevVault puts project configuration behind a workspace boundary. Teams can browse their projects, manage named secrets, and assign access through the dashboard. The screens below use demo workspaces and masked sample values.",
            ],
            cover: vault.cover,
            poster: vault.poster,
            share: vault.share,
            story: [
                { kind: "heading", text: "Start with the project" },
                {
                    kind: "text",
                    parts: [
                        "Each workspace has its own list of secrets. The table shows a key name and creation date while hiding the value until an authorized user requests it. The UI keeps membership management alongside the secrets it protects.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Projects and access",
                    start: 1,
                    shots: [
                        vault.shot(
                            "projects",
                            "Project list",
                            "DevVault project cards for three sample workspaces",
                            "Open a workspace to manage its configuration."
                        ),
                        vault.shot(
                            "secrets",
                            "Secret inventory",
                            "A project secrets table with hidden values and access controls",
                            "Browse configuration keys without exposing their values in the list."
                        ),
                        vault.shot(
                            "users",
                            "User management",
                            "A table of sample users with roles and account status",
                            "The administrator view groups account status and roles in one place."
                        ),
                    ],
                },
                { kind: "heading", text: "Separate metadata from secret values" },
                {
                    kind: "text",
                    parts: [
                        "The ASP.NET Core implementation separates listing a secret from revealing its decrypted value. Its service layer includes encryption, project membership checks, and audit records.",
                    ],
                },
            ],
        },
    },
    {
        index: "03",
        slug: "annotator-web",
        name: "Annotator Web",
        description:
            "A collaborative research tool for importing text and manually labeling Indonesian replies for sentiment datasets.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
        year: "2025",
        link: "https://github.com/kevinma21/Annotation-Web",
        liveUrl: "https://annotation-r95ew2au4-kevinmas-projects-b65e5ef1.vercel.app/dashboard",
        thumb: annotation.thumb,
        page: {
            tagline: "A focused workspace for manual sentiment labeling.",
            about: [
                "Annotator Web is a team-built tool for labeling replies in a research dataset. It separates project management from the labeling session so an annotator can focus on one reply at a time. The screenshots use sample Indonesian replies about public transit.",
            ],
            cover: annotation.cover,
            poster: annotation.poster,
            share: annotation.share,
            story: [
                { kind: "heading", text: "From a CSV to a labeling session" },
                {
                    kind: "text",
                    parts: [
                        "Each project tracks its total and completed replies. The workspace pairs a progress indicator and item list with a reading pane and three sentiment choices: positive, neutral, and negative.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Annotation workflow",
                    start: 1,
                    shots: [
                        annotation.shot(
                            "projects",
                            "Project overview",
                            "Two sample annotation projects with completion counts and statuses",
                            "Check how much work is complete before entering a project."
                        ),
                        annotation.shot(
                            "workspace",
                            "Labeling workspace",
                            "Indonesian sample reply alongside progress and sentiment options",
                            "Read one item at a time, choose its sentiment, and move to the next reply."
                        ),
                    ],
                },
                { kind: "heading", text: "Saving progress and exporting data" },
                {
                    kind: "text",
                    parts: [
                        "Items load in pages, and the workspace batches pending label updates. The project API includes an export endpoint so the annotated dataset can leave the tool and be used in analysis.",
                    ],
                },
            ],
        },
    },
    {
        index: "04",
        slug: "atlantis-cms",
        name: "Atlantis Subsea CMS",
        description: "Bilingual frontend interfaces for the PT Atlantis Subsea content management system.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "next-intl"],
        year: "2025",
        link: "https://github.com/kevinma21/content-management-system",
        thumb: cms.thumb,
        page: {
            tagline: "An Indonesian and English content management frontend.",
            about: [
                "During my internship at ",
                { text: "PT. Meissa Berkah Teknologi", href: "/journey/experience" },
                ", I built frontend CMS interfaces for PT Atlantis Subsea. The work covered reusable React components, Indonesian and English localization, and dark theme support. The gallery shows the repository's demo interface.",
            ],
            cover: cms.cover,
            poster: cms.poster,
            share: cms.share,
            story: [
                { kind: "heading", text: "A consistent interface for content lists" },
                {
                    kind: "text",
                    parts: [
                        "News and project content each have their own workspace. The frontend reuses navigation, tables, filters, and row actions so editors can scan and manage different kinds of content with the same interaction patterns.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Content management",
                    shots: [
                        cms.shot(
                            "news",
                            "News list",
                            "English CMS news view with filters, status, date, and actions",
                            "Review news items and their publishing status."
                        ),
                        cms.shot(
                            "projects",
                            "Project list",
                            "Project management view in the CMS",
                            "Browse the projects managed through the same CMS navigation."
                        ),
                        cms.shot(
                            "localized",
                            "Indonesian dark theme",
                            "CMS news list displayed in Indonesian with the dark theme active",
                            "The same news workflow with Indonesian copy and dark theme styling."
                        ),
                    ],
                },
                { kind: "heading", text: "One layout across two languages" },
                {
                    kind: "text",
                    parts: [
                        "The locale-based routes supply Indonesian and English copy through next-intl. Shared React components and theme tokens keep the structure consistent as the language or theme changes.",
                    ],
                },
            ],
        },
    },
    {
        index: "05",
        slug: "x-api-crawling-based",
        name: "X Data Collection Pipeline",
        description:
            "A Python pipeline that turns public X timelines and replies into structured datasets for academic analysis.",
        tech: ["Python", "Requests", "CSV", "JSON"],
        year: "2026",
        link: "https://github.com/kevinma21/x-api-crawling-based",
        thumb: collection.thumb,
        page: {
            tagline: "From public timelines and replies to structured research data.",
            about: [
                "This academic project separates timeline collection from reply collection. It records post IDs and dates first, then exports conversation replies for downstream analysis. The gallery shows aggregate counts from the saved CSV exports.",
            ],
            cover: collection.cover,
            poster: collection.poster,
            share: collection.share,
            story: [
                { kind: "heading", text: "Build a dated list of posts" },
                {
                    kind: "text",
                    parts: [
                        "The first stage records post IDs and timestamps within a specified date window. That CSV provides a lightweight index the reply collector can process separately.",
                    ],
                },
                { kind: "heading", text: "Export replies and save progress" },
                {
                    kind: "text",
                    parts: [
                        "The second stage appends structured reply records to a CSV. A JSON checkpoint tracks completed conversations so a later run can resume from the remaining work.",
                    ],
                },
                {
                    kind: "gallery",
                    title: "Saved export summaries",
                    shots: [
                        collection.shot(
                            "timeline",
                            "Timeline export",
                            "Bar chart of collected post records by month from November 2024 through October 2025",
                            "Counts grouped by post date from the repository’s saved timeline CSV."
                        ),
                        collection.shot(
                            "replies",
                            "Reply export",
                            "Bar chart of collected reply records by day in October 2025",
                            "Counts grouped by reply date from the repository’s saved reply CSV."
                        ),
                    ],
                },
            ],
        },
    },
];

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];
// "Fall 2026" sorts after "Spring 2026"; a bare year counts as the start of that year.
const when = (p: Project) => {
    const [season, year] = p.year.includes(" ") ? p.year.split(" ") : ["", p.year];
    return Number(year) * 4 + Math.max(0, SEASONS.indexOf(season));
};

/** Newest first; projects from the same season keep their order above. */
export const projectsByDate = [...projects].sort((a, b) => when(b) - when(a));

/** sessionStorage key for the last project page viewed, so the strip can return to it. */
export const LAST_PROJECT_KEY = "projects-last-viewed";

/** Where a project's tile or button leads: its own page, its outside link, or nowhere. */
export const projectHref = (p: Project) => (p.page ? `/projects/${p.slug}` : p.link);

export const isExternal = (href: string) => /^https?:/.test(href);
