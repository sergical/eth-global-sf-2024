/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v0.dev",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
