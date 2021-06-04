const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const settings = {
  pwa: {
    dest: "public",
    runtimeCaching,
  },
};

module.exports = withPWA(settings);
