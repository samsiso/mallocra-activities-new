#!/usr/bin/env node

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fs = require('fs');
const path = require('path');

// Create Next.js config for bundle analysis
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerPort: 8888,
  analyzerMode: 'server'
});

// Generate bundle analysis
console.log('🔍 Starting bundle analysis...');
console.log('📊 Building application with bundle analyzer...');

// Export the config for Next.js to use
module.exports = withBundleAnalyzer({
  // Next.js configuration
  experimental: {
    turbo: true
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: path.join(__dirname, '../.next/bundle-analysis.html'),
          generateStatsFile: true,
          statsFilename: path.join(__dirname, '../.next/bundle-stats.json')
        })
      );
    }
    return config;
  }
}); 