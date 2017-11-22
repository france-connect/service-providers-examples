'use strict'

const jwt = require('jsonwebtoken');

/**
 * separating router logic
 * @param  {Object} router
 * @param  {Object} passport
 * @param  {Object} config
 * @return {}
 */
const initRouter = (router, passport, config) => {
  router.get('/', (req, res) => {
    res.render('index', { title: 'Démonstrateur France Connect - Accueil' , user: undefined});
  });

  router.get('/login_org', (req, res) => {
    res.redirect(getAuthRoute(config.fcURL, config.openIdConnectStrategyParameters));
  });

  router.get('/oidc_callback', (req, res) => {
    if (req.query.state !== config.openIdConnectStrategyParameters.state) {
      console.log('[Wrong state]');
      res.sendStatus(403);
    } else {
      requestTokenWithCode(config.fcURL, config.openIdConnectStrategyParameters, req.query.code)
      .then((tokenResponse) => {
        return requestUserInfoWithAccesToken(config.fcURL, tokenResponse.data.access_token)
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


const getAuthRoute = (url, params) => {
  return `${url}/api/v1/authorize?response_type=code`
  + `&client_id=${params.clientID}&redirect_uri=${params.callbackURL}`
  + `&scope=${encodeURIComponent(params.scope)}&state=${params.state}&nonce=${params.nonce}`
};

/**
 * post request on /api/v1/token with customAxios to prevent self signed error
 * @param  {String} url
 * @param  {Object} params
 * @param  {String} code   [code retrieved with authorize]
 * @param  {Object} customAxios
 * @return {Promise}
 */
const requestTokenWithCode = (url, params, code, customAxios) => {
  return customAxios.post(`${url}/api/v1/token`, {
    redirect_uri: params.callbackURL,
    client_id: params.clientID,
    client_secret: params.clientSecret,
    grant_type: 'authorization_code',
    code: code
  })
};

/**
 * get userInfo with customAxios to prevent self signed error
 * @param  {String} url
 * @param  {String} access_token
 * @param  {Object} customAxios
 * @return {Promise}
 */
const requestUserInfoWithAccesToken = (url, access_token, customAxios) => {
  return customAxios.get(`${url}/api/v1/userinfo?schema=openid`,
    { headers: { Authorization: `Bearer ${access_token}`}})
};

module.exports = {
  initRouter
};
