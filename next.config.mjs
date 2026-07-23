/**
 * Static export for GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH is set only for the production build (`/kayla-graduation`);
 * it stays empty in dev so the local server serves from the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
