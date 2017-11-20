'use strict'

const makeAuthRoute = require('../utilsExpress').makeAuthRoute;
const requestToken = require('../utilsExpress').requestToken;
const getUserInfo = require('../utilsExpress').getUserInfo;
const jwt = require('jsonwebtoken');

const initRouter = (router, passport, config) => {
  router.get('/', (req, res) => {
    res.render('index', { title: 'Démonstrateur France Connect - Accueil' , user: undefined});
  });

  router.get('/login_org', (req, res) => {
    res.redirect(makeAuthRoute(config.fcURL, config.openIdConnectStrategyParameters));
  });

  router.get('/oidc_callback', (req, res) => {
    if (req.query.state !== config.openIdConnectStrategyParameters.state) {
      console.log('[Wrong state]');
      res.sendStatus(403);
    } else {
      requestToken(config.fcURL, config.openIdConnectStrategyParameters, req.query.code)
      .then((tokenResponse) => {
        return getUserInfo(config.fcURL, tokenResponse.data.access_token)
        .then((infosResponse) => {
          console.log('[Success] User Infos : ', JSON.stringify(infosResponse.data));
          res.send("[Success] User Infos : " + JSON.stringify(infosResponse.data));
        })
      })
      .catch((response) => {
        res.send(response);
      })
    }
  })

  return router;
}

module.exports = initRouter;
