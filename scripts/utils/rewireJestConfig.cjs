"use strict";

const path = require("node:path");
const paths = require("./paths.cjs");

module.exports = (config) => {
  for (const key of Object.keys(config.transform)) {
    if (config.transform[key].endsWith("babelTransform.js")) {
      config.transform[key] = path.resolve(__dirname + "/babelTransform.js");
    }
  }
  const overrides = Object.assign({}, require(paths.appPackageJson).jest);

  // Jest configuration in package.json will be added to the the default config
  for (const key of Object.keys(overrides)) {
    // We don't overwrite the default config, but add to each property if not a string
    if (key in config) {
      if (
        typeof overrides[key] === "string" ||
        typeof overrides[key] === "number" ||
        typeof overrides[key] === "boolean"
      ) {
        config[key] = overrides[key];
      } else if (Array.isArray(overrides[key])) {
        config[key] = overrides[key].concat(config[key]);
      } else if (typeof overrides[key] === "object") {
        config[key] = Object.assign({}, config[key], overrides[key]);
      }
    } else {
      config[key] = overrides[key];
    }
  }
  return config;
};
