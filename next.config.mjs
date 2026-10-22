/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline the (12 KB) CSS into the HTML: Lighthouse mobile flagged the two
  // stylesheet requests as render-blocking (~860 ms on a throttled phone).
  experimental: { inlineCss: true },
  reactStrictMode: true,
  // Production hygiene: no "X-Powered-By: Next.js" header, no source maps
  // shipped to the browser. Static assets are plain <img>/<svg> so the image
  // optimizer is not needed.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
