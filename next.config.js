/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
});

const settings = {
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

module.exports = withPWA({ settings });
