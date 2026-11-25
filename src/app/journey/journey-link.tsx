"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { pushWithTransition } from "../../lib/view-transition";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
    href: string;
    direction?: "forward" | "back";
};

export default function JourneyLink({ href, direction = "forward", ...props }: Props) {
    const router = useRouter();

    return (
        <Link
            {...props}
            href={href}
            onNavigate={(event) => {
                event.preventDefault();
                pushWithTransition(router, href, direction);
            }}
        />
    );
}
