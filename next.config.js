/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode is intentionally OFF so the WebGL context isn't
  // double-created in dev. Do not turn it back on.
  reactStrictMode: false,
};

module.exports = nextConfig;
