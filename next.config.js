/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/icecream',
        destination: '/ice-cream',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig
