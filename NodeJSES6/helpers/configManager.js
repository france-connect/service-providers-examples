'use strict';

let  configPath = '../config/config.json';

if (process.env.name) {
  configPath = `../config/config-${process.env.name}.json`;
}
const config = require(configPath)

export default config;
