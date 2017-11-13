
// if(!process.env.NODE_ENV){
//     process.env.NODE_ENV = 'development';
// }

const debug = require('debug')('serviceProvider1');
const config = (new (require('./helpers/configManager.js'))())._rawConfig;
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const OpenIdConnectStrategy = require('passport-openidconnect').Strategy;
const passportAuthenticateWithAcrClaims = require('./helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;
const indexRoutes = require('./routes/index');
const dataRoutes = require('./routes/data');
const { initExpress } = require('./initExpress');

const app = express();
const middleWares = [
  logger('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cookieParser(),
  express.static(path.join(__dirname, 'public')),
  session({ secret: 'Some Secret !!!', key: 'sid'}),
  passport.initialize(),
  passport.session(),
  // 'openidconnect'
];

initExpress(app, middleWares)

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.FCUrl = config.fcURL;

const strat = function() {
    const strategy = new OpenIdConnectStrategy(config.openIdConnectStrategyParameters, function (iss, sub, profile, accesstoke, refreshtoken, done) {
        process.nextTick(function () {
            done(null, profile);
        })
    });

    const alternateAuthenticate = new passportAuthenticateWithAcrClaims(config.openIdConnectStrategyParameters.userInfoURL, config.openIdConnectStrategyParameters.acr_values);
    strategy.authenticate = alternateAuthenticate.authenticate;
    return strategy;
};

passport.use('provider', strat());

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.use('/', indexRoutes);
app.use('/data', dataRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
