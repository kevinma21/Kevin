import Image from "next/image";
import type { JourneyChapter } from "../data/journey";
import styles from "./journey.module.css";

export default function JourneyCover({
    chapter,
    sizes,
    className,
    banner = false,
    eager = false,
}: {
    chapter: JourneyChapter;
    sizes: string;
    className?: string;
    banner?: boolean;
    eager?: boolean;
}) {
    return (
        <span
            aria-hidden="true"
            data-chapter={chapter.id}
            className={`${styles.illustration} ${banner ? styles.banner : ""} ${className ?? ""}`}
        >
            <Image
                src={banner ? chapter.cover : chapter.cardArtwork}
                alt=""
                fill
                sizes={sizes}
                loading={banner || eager ? "eager" : undefined}
                className="object-cover"
            />
            {banner ? (
                <span className={`font-playfairDisplay ${styles.bannerNumber}`}>{chapter.number}</span>
            ) : (
                <span className={`${styles.copy} font-geistSans`}>
                    <span className={`${styles.number} font-geistMono`}>{chapter.number}</span>
                    <span className={styles.title}>{chapter.label}</span>
                    <span className={styles.subtitle}>{chapter.heading}</span>
                </span>
            )}
        </span>
    );
}
