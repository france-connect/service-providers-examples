'use strict'

const axios = require('axios')
const express = require('express');
const https = require('https');
const config = require('./config/config.json');
const initExpressApp = require('./utils/expressUtils').initExpressApp;

const app = express();
const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

initExpressApp(app, config, customAxios, __dirname);
app.listen(process.env.PORT || 8000);
console.log('App listening on :', process.env.PORT || 8000);

module.exports = app;
