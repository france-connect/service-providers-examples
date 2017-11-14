'use strict'

const utilsExpress = require('./utilsExpress')
const path = require('path')
const passport = require('passport')
const initMiddleWares = utilsExpress.initMiddleWares
const config = (new (require('./helpers/configManager.js'))())._rawConfig;
const passportAuthenticateWithAcrClaims = require('./helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;
const openIdConnectStrategy = require('passport-openidconnect').Strategy;
const indexRoutes = require('./routes/index');
const dataRoutes = require('./routes/data');

//  error handler
// will print stacktrace for dev not for pro
const errorHandlerDev = () => {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
      let err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
  }
  app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  })
}

const getStrategy = () => {
  const strategy = new openIdConnectStrategy(config.openIdConnectStrategyParameters, function (iss, sub, profile, accesstoke, refreshtoken, done) {
    process.nextTick(() => {
      done(null, profile);
    })
  });

  const alternateAuthenticate = new passportAuthenticateWithAcrClaims(config.openIdConnectStrategyParameters.userInfoURL, config.openIdConnectStrategyParameters.acr_values);
  strategy.authenticate = alternateAuthenticate.authenticate;
  return strategy;
}

const initExpress = (app, middleWares) => {
   initMiddleWares(app, 'use', middleWares);
   app.set('port', process.env.PORT || 3001);
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');

   passport.use('provider', getStrategy());
   passport.serializeUser((user, done) => done(null, user));
   passport.deserializeUser((obj, done) => done(null, obj));

   app.use('/', indexRoutes);
   app.use('/data', dataRoutes);
   app.locals.FCUrl = config.fcURL;
}

module.exports = {
  initExpress
}
