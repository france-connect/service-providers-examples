'use strict'

const path = require('path');
const openIdConnectStrategy = require('passport-openidconnect').Strategy;
const initMiddleWares = require('./utilsExpress').initMiddleWares;
const initRouter = require('./routes/index');
const dataRoutes = require('./routes/data');

const initExpressApp = (app, router, middleWares, passport, config, customAxios) => {
   initMiddleWares(app, 'use', middleWares);
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');

   // passport.use(getStrategy());
   passport.use('fcOIDC',new openIdConnectStrategy(config.openIdConnectStrategyParameters))
   passport.serializeUser((user, done) => done(null, user));
   passport.deserializeUser((obj, done) => done(null, obj));

   app.use('/', initRouter(router, passport, config, customAxios));
   // app.use('/data', dataRoutes);
   app.locals.FCUrl = config.fcURL;
}

module.exports = {
  initExpressApp
}
