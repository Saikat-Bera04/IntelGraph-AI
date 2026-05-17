/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript strict mode - do not ignore build errors
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
