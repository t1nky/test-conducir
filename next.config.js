/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  assetPrefix: process.env.ASSET_PREFIX,
  basePath: process.env.BASE_PATH,
  images: {
    unoptimized: true
  },
};

export default config;
