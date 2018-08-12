/* config-overrides.js */
const rewireDecorators = require("react-app-rewire-decorators-legacy");

module.exports = function override(config, env) {
  config = rewireDecorators(config, env);
  //do stuff with the webpack config...
  return config;
};