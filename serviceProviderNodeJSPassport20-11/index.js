// var debug = require('debug')('serviceProvider1');

// var config = (new (require('./helpers/configManager.js'))())._rawConfig;
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
// var OpenIdConnectStrategy = require('passport-openidconnect').Strategy;
// var passportAuthenticateWithAcrClaims = require('./helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;

var indexRoutes = require('./routes/index');
var dataRoutes = require('./routes/data');

const config = require('./config/config.json');
const initExpressApp = require('./initExpress').initExpressApp;
const errorHandlerDev = require('./utilsExpress').errorHandlerDev;

const app = express();
const router = express.Router()

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

initExpressApp(app, router, middleWares, passport, config)
// errorHandlerDev(app)

app.listen(process.env.PORT || 3001)
console.log('App listening on :', process.env.PORT || 3001);
// var server = app.listen(app.get('port'), function() {
//   debug('Express server listening on port ' + server.address().port);
// });

module.exports = app;
