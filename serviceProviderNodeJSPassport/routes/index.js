const express = require('express');
const passport = require('passport');
const router = express.Router();
const config = (new (require('../helpers/configManager.js'))());
const url = require('url');
const jwt = require('jwt-simple');
const crypto = require('crypto');
const indexController = new (require('../controllers/index.js').IndexController)();
const querystring = require('querystring');
const http = require('http');
const https = require('https');
const session = require('express-session');

const configuration = config._rawConfig;
const eIDASLVLTable = {
    'eidas1': 1,
    'eidas1r': 1.1,
    'eidas2': 2,
    'eidas3': 3
};

function checkStateParams(req, res, next) {
    if (req.query && req.query.state && !req.query.error && req.session.state !== req.query.state) {
        return res.status(401).send({ error: { 'name': 'invalid_state', 'message': 'invalid state' } });
    } else {
        next();
    }
}

router.get('/', checkStateParams, indexController.handleMain);

router.get('/login_org', (req, res, next) => {
    req.session.state = crypto.randomBytes(25).toString('hex');
    req.session.nonce = crypto.randomBytes(25).toString('hex');

    if (config.isModeAgents()) {
        req.session.eIDASLVL = 'eidas1 siren NAF_code organisation_name';
    } else {
        req.session.eIDASLVL = req.query.acr_values || 'eidas1';
    }

    res.redirect(`${configuration.oauth.authorizationURL}?response_type=code&client_id=${configuration.openIdConnectStrategyParameters.clientID}&acr_values=${req.session.eIDASLVL}&redirect_uri=${configuration.openIdConnectStrategyParameters.callbackURL}&scope=openid ${configuration.openIdConnectStrategyParameters.scope.join(' ')}&state=${req.session.state}&nonce=${req.session.nonce}`);
}, function (req, res) {
});

router.get('/oidc_callback', checkStateParams, function (req, res, next) {

    const tokenURL = new (url.URL)(configuration.openIdConnectStrategyParameters.tokenURL);

    const reqData = querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: configuration.openIdConnectStrategyParameters.callbackURL,
        client_id: configuration.openIdConnectStrategyParameters.clientID,
        client_secret: configuration.openIdConnectStrategyParameters.clientSecret,
        code: req.query.code
    });

    const reqOptions = {
        hostname: tokenURL.hostname,
        path: tokenURL.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(reqData)
        }
    };


    const request = https.request(reqOptions, (response) => {
        response.setEncoding('utf8');

        let buffer = '';

        response.on('data', (chunk) => {
            buffer += chunk;
        });

        response.on('end', () => {
            try {
                buffer = JSON.parse(buffer);

                /*
                ** Decoding token to get eIDAS acr level to compare to asked eIDAS level
                ** Access will not be granted if different.
                */

                if (req.session.state !== req.query.state) {
                    res.status(400).send({
                        status: 'fail',
                        message: `Invalid state:\nExpected "${req.session.state}", got "${req.query.state}."`
                    });
                    return;
                }

                const decodedJWT = jwt.decode(buffer.id_token, configuration.openIdConnectStrategyParameters.clientSecret);

                if (req.session.nonce !== decodedJWT.nonce) {
                    res.status(400).send({
                        status: 'fail',
                        message: `Invalid nonce:\nExpected "${req.session.nonce}", got "${decodedJWT.nonce}."`
                    });
                    return;
                }

                /*
                ** TODO : Check token validity (exp, iat)
                */

                // if asked_lvl > identity_provider_lvl -> Nop, denied, authenticate with correct level !
                if (eIDASLVLTable[req.session.eIDASLVL] > eIDASLVLTable[decodedJWT.acr]) {
                    console.error(`FI did not authenticate with sufficient privileges: Expected "${req.session.eIDASLVL}", got "${decodedJWT.acr}."`);

                    req.session.state = crypto.randomBytes(25).toString('hex');
                    req.session.nonce = crypto.randomBytes(25).toString('hex');
                    req.session.eIDASLVL = req.session.eIDASLVL;

                    // https://mairielyon-franceconnect.fr/login_org?acr_values=eidas3

                    res.redirect(`${configuration.oauthProviderURL}?response_type=code&client_id=${configuration.openIdConnectStrategyParameters.clientID}&acr_values=${req.session.eIDASLVL}&redirect_uri=${configuration.openIdConnectStrategyParameters.callbackURL}&scope=openid ${configuration.openIdConnectStrategyParameters.scope.join(' ')}&state=${req.session.state}&nonce=${req.session.nonce}`);
                    return;
                } else {
                    req.session.currentOpenId = {
                        tokenRes: buffer,
                        decodedIdToken: decodedJWT
                    }
                    next();
                }
            } catch (e) {
                // dont forget to check jwt decode error 
                console.error(e);
                res.status(500).send(e);
            }
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.write(reqData);
    request.end();
}, function (req, res, next) {
    const userInfoURL = new (url.URL)(configuration.openIdConnectStrategyParameters.userInfoURL);

    const reqOptions = {
        hostname: userInfoURL.hostname,
        path: `${userInfoURL.pathname}?schema=openid`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${req.session.currentOpenId.tokenRes.access_token}`,
        }
    };

    let buffer = '';

    const request = https.request(reqOptions, (response) => {
        response.on('data', (chunk) => {
            buffer += chunk;
        });

        response.on('end', () => {
            try {

                buffer = JSON.parse(buffer);
                if (config.isModeAgents()) {
                    const claimSourcesDecode = JSON.parse(jwt.decode(buffer._claim_sources.src1.JWT, configuration.openIdConnectStrategyParameters.clientSecret));
                    // clear acr_values added into buffer (userinfos send by FCA)
                    const userInfos = {...claimSourcesDecode, ...buffer};
                    buffer = userInfos;
                }

                req.session.userinfos = buffer;
                next();

            } catch (e) {
                // dont forget to check jwt decode error
                console.error(e);
                res.status(500).send(e);
            }
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    request.end();
}, function (req, res) {
    res.redirect(302, '/demarche/etape1');
});

router.get('/demarche/etape1', function (req, res) {
    if (req.session.userinfos !== undefined) {
        const templateParams = {
            title: 'Démonstrateur France Connect - Inscription à la cantine scolaire',
            user: req.session.userinfos, demoMode: false, agentMode: true
        };

        if (configuration.env === 'development' && req.session.passport && req.session.userinfos) {
            templateParams.demoMode = true;
            templateParams.sub = req.session.userinfos.sub;
        }

        const given_name = (req.session.userinfos.given_name) ? req.session.userinfos.given_name : '';
        const family_name = (req.session.userinfos.family_name) ? req.session.userinfos.family_name : '';
        req.session.user = given_name + ' ' + family_name;

        templateParams.formattedUser = req.session.user;
        templateParams.userInfo = req.session.userinfos;
        templateParams.acr = req.session.currentOpenId.decodedIdToken.acr;

        res.redirect('/');
    } else {
        return res.status(500).send({ error: { 'name': 'userinfos_undefined', 'message': ' undefined userinfos' } });
    }
});

router.get('/get-data', function (req, res) {
    res.redirect(302, configuration.authorizationURL + '?client_id=123&scope=data&redirect_uri=' + config.oauth2AllowCallbackURL);
});

router.get('/logout', function (req, res) {
    delete req.session.userinfos;
    delete req.session.user;

    req.session.state = crypto.randomBytes(25).toString('hex');
    var idTokenHint = jwt.encode({ aud: config.openIdConnectStrategyParameters.clientID }, configuration.openIdConnectStrategyParameters.clientSecret);
    res.redirect(configuration.openIdConnectStrategyParameters.logoutURL + '?id_token_hint=' + idTokenHint + '&state=' + req.session.state);

});

/**
 * USELESS
 */
router.get('/get-user-displayable-data', function (req, res) {
    res.json({ user: req.session.user });
});

router.get('/debug', function (req, res) {
    var idToken = null;
    var sub = null;
    if (req.session.idToken) {
        var idTokenSegments = req.session.idToken.split('.');
        idToken = new Buffer(idTokenSegments[1], 'base64').toString();
        sub = JSON.parse(new Buffer(idTokenSegments[1], 'base64').toString()).sub;
    }
    res.render('debug', { headers: req.headers, session: req.session, idToken: idToken, sub: sub });
});

module.exports = router;