/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In dev the FastAPI sidecar listens on :8080. In production nginx
  // already routes /api/* to it, so this rewrite is a dev-only convenience.
  async rewrites() {
    const target = process.env.CONFORMLY_API_URL || "http://127.0.0.1:8080";
    return [
      { source: "/api/:path*", destination: `${target}/api/:path*` },
    ];
  },
};

export default nextConfig;
