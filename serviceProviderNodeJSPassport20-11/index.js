var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var indexRoutes = require('./routes/index');

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

app.listen(process.env.PORT || 8000);
console.log('App listening on :', process.env.PORT || 8000);

module.exports = app;
