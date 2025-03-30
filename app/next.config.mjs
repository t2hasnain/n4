/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for minification (faster than Terser)
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable static optimization and prerendering
  experimental: {
    optimizeCss: true, // CSS optimization
    scrollRestoration: true, // Scroll restoration between pages
    optimizeServerReact: true, // Optimize server-side React
  },
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build time and improve performance
  poweredByHeader: false,
};

export default nextConfig; 