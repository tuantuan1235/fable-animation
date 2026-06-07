const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fable/shared', '@fable/stickfigure', '@fable/db', '@fable/tts'],
  webpack: (config, { isServer }) => {
    // sql.js WASM 文件处理：服务端不打包，用 Node.js 原生加载
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('sql.js');
      }
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['sql.js'],
  },
};

module.exports = nextConfig;
