'use strict'

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const initRouter = require('./routerUtils').initRouter;

/**
 *  express app initialize, keeping logic out of index
 *
 * @param  {Object} app         [description]
 * @param  {Object} router      [description]
 * @param  {Array} middleWares [description]
 * @param  {Object} passport    [description]
 * @param  {Object} config      [description]
 * @param  {Object} customAxios [descript  ion]
 * @return {}             [description]
 */
const initExpressApp = (app, router, config, customAxios, dirname) => {
  passport.serializeUser((user, done) => {
    done(null, user)
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj)
  });

   app.use(express.static(dirname + '/public'));
   app.use(session({
      secret: 'Some Secret !!!',
      key: 'sid',
      saveUninitialized: true,
      resave: true,
    }));
   app.use(passport.initialize());
   app.use(passport.session());

   app.set('views', dirname + '/views');
   app.set('view engine', 'ejs');
   app.use('/', initRouter(router, passport, config, customAxios));
   app.locals.FCUrl = config.fcURL;
}


module.exports = {
  initExpressApp
}
