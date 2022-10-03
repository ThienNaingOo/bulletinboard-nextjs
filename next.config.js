/** @type {import('next').NextConfig} */
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/api/(.*)",
  //       headers: [
  //         {
  //           key: 'X-DNS-Prefetch-Control',
  //           value: 'on'
  //         },
  //         {
  //           key: 'Strict-Transport-Security',
  //           value: 'max-age=63072000; includeSubDomains; preload'
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block'
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN'
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff'
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin'
  //         },
          
  //         // { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: '*' },
  //         // { key: "Access-Control-Allow-Methods", value: "*" },
  //         // { key: "Access-Control-Allow-Headers", value: "*" },
  //       ]
  //     }
  //   ]
  // }
  // ,
  reactStrictMode: false,
}

module.exports = nextConfig
