import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Desabilitar overlays de erro em desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        config.devtool = false;
      }
      return config;
    },
  }),
  // Configurações experimentais para reduzir warnings
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build (não recomendado para produção)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignorar erros de ESLint durante o build (não recomendado para produção)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
