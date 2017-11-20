// var express = require('express');
// var passport = require('passport');
// var router = express.Router();
// var request = require('request');
// var config = (new (require('../helpers/configManager.js'))())._rawConfig;
// var Oauth2Strategy = require('passport-openidconnect').Strategy;
// var passportAuthenticateWithCUstomClaims = require('../helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;
//
// var _ = require('lodash');
//
// var parameters = {
//     authorizationURL: config.oauth.authorizationURL,
//     tokenURL: config.oauth.tokenURL,
//     clientID: config.openIdConnectStrategyParameters.clientID,
//     clientSecret: config.openIdConnectStrategyParameters.clientSecret,
//     callbackURL: config.oauth.callbackURL,
//     scope: config.oauth.scopes,
//     skipUserProfile: true
// };
//
// var strat = function () {
//     var strategy = new Oauth2Strategy(
//         parameters,
//         function (iss, sub, profile, accessToken, refreshToken, done) {
//             profile = {};
//             profile.accessToken = accessToken;
//             profile.refreshToken = refreshToken;
//             done(null, profile);
//         });
//
//     var alternateAuthenticate = new passportAuthenticateWithCUstomClaims('', config.openIdConnectStrategyParameters.acr_values, 1);
//     strategy.authenticate = alternateAuthenticate.authenticate;
//     return strategy;
// };
//
// passport.use('provider', strat());
//
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
//
// passport.deserializeUser(function (obj, done) {
//     done(null, obj);
// });
//
// router.get('/', function (req, res, next) {
//     next();
// }, passport.authenticate('provider'), function (req, res, next) {
//     console.log('got through the oauth2 authentication process.');
// });
//
// router.get('/form', function (req, res) {
//     if (req.session.passport.user) {
//         res.render('demarche-form.ejs', {
//             title: 'Démonstrateur France Connect - Inscription à la cantine scolaire',
//             user: req.session.user,
//             userInfo: req.session.userInfo,
//             authUrl: config.oauth.authorizationURL
//         });
//     } else {
//         res.redirect('/');
//     }
// });
//
// router.post('/form', function (req, res) {
//     console.log(req.params);
//     req.session.cantineParams = req.body;
//     res.redirect('/data/');
// });
//
// router.get('/callback', passport.authenticate('provider', {
//     successRedirect: '/data/authOk',
//     failureRedirect: '/data/authKo',
//     scope: config.oauth.scopes
// }), function (req, res, next) {
//     console.log('got to the callback URL, at this point we should ve obtained an access token');
// });
//
// router.get('/authOk', function (req, res, next) {
//     var options = {
//         url: config.quotientFamilialURL,
//         headers: {
//             'Authorization': 'Bearer ' + req.session.passport.user.accessToken
//         }
//     };
//     request.get(options, function (err, response, body) {
//         console.log(body)
//         if (err) {
//             console.error('Error while reaching FD');
//             console.error(err);
//             next(err);
//         } else if (!body) {
//             console.log('No body ... ');
//             next(new Error('No Body'));
//         }
//         else if (response.statusCode != 200) {
//             console.log(response);
//             if (response.headers['www-authenticate']) {
//                 var error = new Error();
//                 var errorElements = response.headers['www-authenticate'].trim().match('Bearer: error="(.*?)",error_description="(.*?)"');
//                 if (errorElements.length == 3) {
//                     error.name = errorElements[1];
//                     error.message = errorElements[2];
//                 }
//                 else {
//                     error.message = "Wrongly formatted authentication header";
//                 }
//                 console.error(error);
//                 next(error);
//             } else {
//                 var error = new Error();
//                 error.name = 'errorTriggeredButNoDescriptionProvided';
//                 error.message = 'An error occurred but no error description was provided to the client';
//                 console.error(error);
//                 console.error(response.statusCode);
//                 console.error(response.body);
//                 next(error);
//             }
//         }
//         else {
//             var info = JSON.parse(body);
//             req.session.quotientFamilial = info.quotient;
//             req.session.pivotIdentityReturnedByFcToFd = info.pivotIdentity;
//             res.redirect('/blank?urlRedirect=/data/done');
//         }
//     });
// });
// router.get('/authKo', function (req, res, next) {
//     res.redirect(302, '/blank');
// });
//
// function userDoesNotHaveSessionDataYet(req) {
//     return _.isUndefined(req.session) ||
//         _.isUndefined(req.session.user) ||
//         _.isUndefined(req.session.passport) ||
//         _.isUndefined(req.session.passport.user) ||
//         _.isUndefined(req.session.quotientFamilial) ||
//         _.isUndefined(req.session.cantineParams);
// }
// router.get('/done', function (req, res, next) {
//     if (userDoesNotHaveSessionDataYet(req)) {
//         return res.redirect('/');
//     } else {
//         res.render('demarche-etape2.ejs', {
//             title: 'Démonstrateur France Connect - Confirmez votre inscription',
//             user: req.session.user,
//             data: req.session.quotientFamilial,
//             informationsCantine: req.session.cantineParams
//         });
//     }
// });
//
//
// router.get('/fin-demarche', function (req, res) {
//     if (req.session.user) {
//         res.render('demarche-fin.ejs', {
//             title: 'Démonstrateur France Connect - Confirmation de votre inscription',
//             user: req.session.user
//         });
//     } else {
//         res.redirect('/');
//     }
// });
//
// module.exports = router;
