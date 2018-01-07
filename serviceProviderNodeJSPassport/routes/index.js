var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = (new (require('../helpers/configManager.js'))())._rawConfig;
var url = require('url');
var jwt = require('jwt-simple');
var crypto = require('crypto');
var indexController = new (require('../controllers/index.js').IndexController)();

function checkStateParams(req, res, next) {
    if (req.query && req.query.state && !req.query.error && req.session.state !== req.query.state) {
        return res.status(401).send({error: {'name': 'invalid_state', 'message': 'invalid state'}});
    } else {
        next();
    }
}

router.get('/', checkStateParams,indexController.handleMain);

router.get('/login_org', passport.authenticate('openidconnect'), function (req, res) {
});

router.get('/oidc_callback', checkStateParams, function (req, res, next) {
    passport.authenticate('openidconnect', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var errorName = res.req.query.error;
            var errorDescription = res.req.query.error_description;
            return res.send({error: {'name': errorName, 'message': errorDescription}});
        }

        // Let's put the userInfo in session for the debug page
        req.session.userInfo = user._json;
        // Let's also add the callback url that was actually called
        req.session.calledCallbackUrl = req.url;

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect(302, '/blank');
        });
    })(req, res, next);
});

router.get('/demarche/etape1', function (req, res) {
    if (req.session.passport.user !== undefined) {
        var given_name = (req.session.passport.user._json.given_name) ? req.session.passport.user._json.given_name : '';
        var family_name = (req.session.passport.user._json.family_name) ? req.session.passport.user._json.family_name : '';
        req.session.user = given_name + ' ' + family_name;

        res.render('demarche-etape1', {
            title: 'Démonstrateur France Connect - Inscription à la cantine scolaire',
            user: req.session.user
        });
    } else {
        res.redirect(302, '/');
    }
});

router.get('/get-data', function (req, res) {
    res.redirect(302, config.authorizationURL + '?client_id=123&scope=data&redirect_uri=' + config.oauth2AllowCallbackURL);
});

router.get('/logout', function (req, res) {
    delete req.session.passport.user;
    delete req.session.user;
    var idTokenHint = jwt.encode({aud:config.openIdConnectStrategyParameters.clientID}, config.openIdConnectStrategyParameters.clientSecret);
    req.session.state = crypto.randomBytes(25).toString('hex');
    if (req.query.hasOwnProperty('force')) {
        res.redirect(config.openIdConnectStrategyParameters.logoutURL+'?id_token_hint='+idTokenHint+'&force&state='+req.session.state);
    } else {
        res.redirect(config.openIdConnectStrategyParameters.logoutURL+'?id_token_hint='+idTokenHint+'&state='+req.session.state);
    }
});

router.get('/blank', function (req, res) {
    var urlRedirect = req.query.urlRedirect || '/';
    res.render('wait_screen', {urlRedirect: urlRedirect});
});

router.get('/get-user-displayable-data', function (req, res) {
    res.json({user: req.session.user});
});

router.get('/debug', function (req, res) {
    var idToken = null;
    var sub = null;
    if (req.session.idToken) {
        var idTokenSegments = req.session.idToken.split('.');
        idToken = new Buffer(idTokenSegments[1], 'base64').toString();
        sub = JSON.parse(new Buffer(idTokenSegments[1], 'base64').toString()).sub;
    }
    res.render('debug', {headers: req.headers, session: req.session, idToken: idToken, sub: sub});
});

module.exports = router;
