import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  }
};

export default nextConfig;
