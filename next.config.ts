import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const path = require('path');

module.exports = {
  ...nextConfig,
  webpack: (config: { resolve: { alias: { [x: string]: any; }; }; }) => {
    config.resolve.alias['@'] = path.join(__dirname, '/');
    return config;
  },
};
export default nextConfig;
