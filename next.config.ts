import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generates a portable static site in /out, ready for cPanel's public_html.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
