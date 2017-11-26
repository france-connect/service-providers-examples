'use strict';

const express = require('express');
const initRouter = require('./routerUtils').initRouter;

/**
 *  initialize app middlewares, keeping logic out of index
 *
 * @param  {Object} app
 * @param  {Object} config
 * @param  {Object} customAxios
 * @param  {String} dirname
 * @return {}
 */

const initExpressApp = (app, config, customAxios, dirname) => {
   app.use(express.static(dirname + '/public'));
   app.set('views', dirname + '/views');
   app.set('view engine', 'ejs');
   app.use('/', initRouter(config, customAxios));
   app.locals.FCUrl = config.fcURL;
}


module.exports = {
  initExpressApp
}
