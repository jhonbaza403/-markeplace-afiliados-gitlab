import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true, // Activa oficialmente el compilador de React 19
  },
};

export default nextConfig;