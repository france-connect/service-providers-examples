'use strict'

const path = require('path');
const initMiddleWares = require('./utilsExpress').initMiddleWares;
const getRouter = require('./routes/index');


/**
 * [initExpressApp description]
 * @param  {Object} app         [description]
 * @param  {Object} router      [description]
 * @param  {Array} middleWares [description]
 * @param  {Object} passport    [description]
 * @param  {Object} config      [description]
 * @param  {Object} customAxios [description]
 * @return {}             [description]
 */
const initExpressApp = (app, router, middleWares, passport, config, customAxios) => {
   initMiddleWares(app, 'use', middleWares);
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');

   passport.serializeUser((user, done) => done(null, user));
   passport.deserializeUser((obj, done) => done(null, obj));

   app.use('/', getRouter(router, passport, config, customAxios));
   app.locals.FCUrl = config.fcURL;

   app.listen(process.env.PORT || 8000);
   console.log('App listening on :', process.env.PORT || 8000);
}

module.exports = {
  initExpressApp
}
