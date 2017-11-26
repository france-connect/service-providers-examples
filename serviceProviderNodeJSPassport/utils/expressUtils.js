'use strict';

const initRouter = require('./routerUtils').initRouter;
const express = require('express');
const session = require('express-session');

/**
 *  initialize app middleware, keeping logic out of index
 *
 * @param  {Object} app
 * @param  {Object} config
 * @param  {Object} customAxios
 * @param  {String} dirname
 * @return {}
 */

const initExpressApp = (app, config, customAxios, dirname) => {
   app.use(express.static(dirname + '/public'));
   app.use(session({
      secret: 'Some Secret !!!',
      key: 'sid',
      saveUninitialized: true,
      resave: true,
    }));

   app.set('views', dirname + '/views');
   app.set('view engine', 'ejs');
   app.use('/', initRouter(config, customAxios));
   app.locals.FCUrl = config.fcURL;
}


module.exports = {
  initExpressApp
}
