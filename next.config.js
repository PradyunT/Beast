/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(mp4|webm)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/", // Updated publicPath to the root
            name: "videos/[name].[ext]", // Adjust the output path and filename as needed
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
