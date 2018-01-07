'use strict';

var configPath = '../config/config.json';
if (process.env.name) {
    configPath = '../config/config-' + process.env.name + '.json';
}

console.log('Loading configuration ' + configPath);
var config = require(configPath);
var Configuration = function(){};

Configuration.prototype._rawConfig = config;

Configuration.prototype.getMongoPort = function(){
    return this._rawConfig.mongo.port;
};

Configuration.prototype.getMongoHost = function(){
    return this._rawConfig.mongo.host;
};

var MODES = {
    PARTICULIERS: 'particuliers',
    AGENTS: 'agents'
};

Configuration.prototype.isModeAgents = function() {
    return this._rawConfig.mode === MODES.AGENTS;
};

Configuration.prototype.getFeatures = function () {
    return this._rawConfig.features || {};
};

Configuration.prototype.isAcrValuesActivated = function () {
    return this.getFeatures().acr_values;
};

module.exports = Configuration;
