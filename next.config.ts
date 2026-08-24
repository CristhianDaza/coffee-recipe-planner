import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generates a portable static site in /out, ready for cPanel's public_html.
  output: "export",
  // cPanel resolves `/espresso/` as a directory, so export an index.html inside it.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
