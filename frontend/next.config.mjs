/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*'
      }
    ];
  },
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '192.168.0.101',
    '192.168.0.101:3000',
    '192.168.0.105',
    '192.168.0.105:3000',
    '192.168.0.100',
    '192.168.0.102',
    '192.168.0.103',
    '192.168.0.104',
    '192.168.0.106',
    '192.168.0.107',
    '192.168.0.108',
    '192.168.0.109',
    '192.168.0.110',
    '192.168.1.101',
    '192.168.1.105'
  ],
};

export default nextConfig;
