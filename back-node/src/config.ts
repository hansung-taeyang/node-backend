import dotenvx from "@dotenvx/dotenvx";

const config = (() => {
  dotenvx.config();
  return process.env;
})();

export default config;
