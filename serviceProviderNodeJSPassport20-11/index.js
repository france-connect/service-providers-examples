'use strict'

const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const indexRoutes = require('./routes/index');
const config = require('./config/config.json');
const initExpressApp = require('./initExpress').initExpressApp;

const app = express();
const router = express.Router();

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

initExpressApp(app, router, middleWares, passport, config);

module.exports = app;
