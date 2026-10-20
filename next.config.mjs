/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production hygiene: no "X-Powered-By: Next.js" header, no source maps
  // shipped to the browser. Static assets are plain <img>/<svg> so the image
  // optimizer is not needed.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
