'use strict'

const axios = require('axios')
const express = require('express');
const https = require('https');
const config = require('./config/config.json');
const initExpressApp = require('./utils/expressUtils').initExpressApp;

const app = express();
const router = express.Router();

const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

//Using initExpressApp to keep logic out of index ( only requires, initialize and start )
initExpressApp(app, router, config, customAxios, __dirname);
app.listen(process.env.PORT || 8000);
console.log('App listening on :', process.env.PORT || 8000);

module.exports = app;
