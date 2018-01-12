var debug = require('debug')('serviceProvider1');

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'development';
}
var config = (new (require('./helpers/configManager.js'))())._rawConfig;

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var OpenIdConnectStrategy = require('passport-openidconnect').Strategy;
var passportAuthenticateWithAcrClaims = require('./helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;

var indexRoutes = require('./routes/index');
var dataRoutes = require('./routes/data');

var app = express();


app.set('port', process.env.PORT || 3001);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'Some Secret !!!', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.locals.FCUrl = config.fcURL;

var strat = function() {
    var strategy = new OpenIdConnectStrategy(config.openIdConnectStrategyParameters, function (iss, sub, profile, accesstoke, refreshtoken, done) {
        process.nextTick(function () {
            done(null, profile);
        })
    });

    var alternateAuthenticate = new passportAuthenticateWithAcrClaims(config.openIdConnectStrategyParameters.userInfoURL, config.openIdConnectStrategyParameters.acr_values);
    strategy.authenticate = alternateAuthenticate.authenticate;
    return strategy;
};

passport.use('openidconnect', strat());

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
    var err = new Error('Not Found');
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

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
