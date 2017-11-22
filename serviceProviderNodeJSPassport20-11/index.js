'use strict'

const axios = require('axios')
const express = require('express');
const path = require('path');
const https = require('https');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/config.json');
const initExpressApp = require('./utils/expressUtils').initExpressApp;

const app = express();
const router = express.Router();

const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

const middleWares = [
      express.static(path.join(__dirname, 'public')),
      session({
         secret: 'Some Secret !!!',
         key: 'sid',
         saveUninitialized: true,
         resave: true,
       }),
      passport.initialize(),
      passport.session(),
];

//Using initExpressApp to keep logic out of index ( only requires, initialize and start )
initExpressApp(app, router, middleWares, passport, config, customAxios, __dirname);
app.listen(process.env.PORT || 8000);
console.log('App listening on :', process.env.PORT || 8000);

module.exports = app;
