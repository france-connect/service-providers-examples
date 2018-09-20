'use strict';

let  configPath = '../config.config.json';

if (process.env.name) {
  configPath = `../config-${process.env.name}.json`;
}
const config = require(configPath)
module.exports(configuration);
