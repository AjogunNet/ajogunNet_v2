/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Add CORS headers for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  // Add rewrites to proxy API requests during development
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://ajogun-willon-sui-2.onrender.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig