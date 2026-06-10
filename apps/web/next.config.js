const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@fable/shared', '@fable/stickfigure', '@fable/db', '@fable/tts'],
  webpack: (config, { isServer }) => {
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
