import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Launch placeholder imagery is authored locally as SVG (see
    // src/lib/images.ts) until real event photography replaces it.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
