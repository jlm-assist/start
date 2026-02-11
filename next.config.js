/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For Vercel
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'DermaLabs SkinScan',
  },
};

module.exports = nextConfig;
