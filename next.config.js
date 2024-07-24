/** @type {import('next').NextConfig} */
const withPwa = require("next-pwa")({
  dest: "public",
  swSrc: "/public/custom-service-worker.js",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPwa({
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/challenge-users",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
            // value: process.env.NEXT_PUBLIC_BACKEND_PUSH_NOTIFICATION_URL,
          }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
});

module.exports = nextConfig;
