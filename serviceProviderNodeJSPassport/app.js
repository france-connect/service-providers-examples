'use strict'

// if(!process.env.NODE_ENV){
//     process.env.NODE_ENV = 'development';
// }

const debug = require('debug')('serviceProvider1');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const openIdConnectStrategy = require('passport-openidconnect').Strategy;
const passportAuthenticateWithAcrClaims = require('./helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;
const initExpress = require('./initExpress').initExpress;

const app = express();

const middleWares = [
      logger('dev'),
      bodyParser.json(),
      bodyParser.urlencoded({ extended: false }),
      cookieParser(),
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
// 'openidconnect'

initExpress(app, middleWares)

const server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
