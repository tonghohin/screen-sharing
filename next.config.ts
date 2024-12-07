import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    images: { unoptimized: true }
};

export default withNextIntl(nextConfig);
