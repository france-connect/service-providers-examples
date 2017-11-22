'use strict'

const path = require('path');
const initRouter = require('./routerUtils').initRouter;


const useMiddleWares = (app, arr) => {
    arr.forEach((middleWare) => {
      app['use'](middleWare)
    })
};
/**
 *  express app initialize logic, to keep out of index
 *
 * @param  {Object} app         [description]
 * @param  {Object} router      [description]
 * @param  {Array} middleWares [description]
 * @param  {Object} passport    [description]
 * @param  {Object} config      [description]
 * @param  {Object} customAxios [description]
 * @return {}             [description]
 */
const initExpressApp = (app, router, middleWares, passport, config, customAxios, dirname) => {
   useMiddleWares(app, middleWares);

   app.set('views', path.join(dirname, 'views'));
   app.set('view engine', 'ejs');

   passport.serializeUser((user, done) => {
     done(null, user)
   });
   passport.deserializeUser((obj, done) => {
     done(null, obj)
   });

   app.use('/', initRouter(router, passport, config, customAxios));
   app.locals.FCUrl = config.fcURL;
}


module.exports = {
  initExpressApp
}
