/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Enable HMR
    if (!isServer) {
      config.optimization.moduleIds = 'named'
    }
    return config
  },
};

export default nextConfig;
