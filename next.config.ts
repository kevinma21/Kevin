import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        agentUpgrade: "security",
    },
    images: {
        // AVIF where the browser supports it (roughly 20–30% smaller than WebP for the same quality), WebP otherwise.
        formats: ["image/avif", "image/webp"],
        // Optimized images are cached for 31 days instead of the default 60 seconds, so repeat visits don't refetch.
        // Replacing an image means giving it a new filename.
        minimumCacheTTL: 2678400,
        // Next 16 only serves listed qualities; project pages request 90.
        qualities: [75, 90],
    },
    async redirects() {
        return [{ source: "/gallery/:path*", destination: "/journey/:path*", permanent: true }];
    },
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
