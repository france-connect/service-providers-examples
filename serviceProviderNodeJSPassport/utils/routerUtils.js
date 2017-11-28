'use strict';

const express = require('express');

/**
* separating router logic
* @param  {Object} router
* @param  {Object} config
* @param  {Object} axios
* @return {}
*/

const initRouter = (config, axios) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.render('index', {
      title: 'Démonstrateur France Connect',
      user: undefined
    });
  });

  router.get('/login_org', (req, res) => {
    res.redirect(getAuthRoute(config.openIdParameters));
  });

  router.get('/oidc_callback', (req, res) => {
    if (req.query.state !== config.openIdParameters.state) {
      console.log('[Wrong state]');
      res.sendStatus(403);
    } else {
      requestTokenWithCode(config.openIdParameters, req.query.code, axios)
      .then((tokenRes) => {
        return requestUserInfoWithAccesToken(config.openIdParameters, tokenRes.data.access_token, axios)
        })
        .then((infosRes) => {
          console.log('[Success] User Infos : ', getRenderObj(infosRes));
          res.render('userInfo', getRenderObj(infosRes));
        })
        .catch((response) => {
          console.log('Caught Exception of type : ', Object.keys(response.response.data));
          console.log(response.response.data);
          res.send(response);
        })
      }
    })
    return router;
  }

  const getRenderObj = (infosRes) => {
    let toRender = {};

    toRender.user = infosRes.data.given_name;
    toRender.title = 'Démonstrateur France Connect';
    if (infosRes.data.phone_number) {
      toRender.phone_number = infosRes.data.phone_number;
    }
    if (infosRes.data.email) {
      toRender.email = infosRes.data.email;
    }
    return toRender;
  }

  const getAuthRoute = (params) => {
    return `${params.authorizationURL}?response_type=code`
    + `&client_id=${params.clientID}&redirect_uri=${params.callbackURL}`
    + `&scope=${encodeURIComponent(params.scope)}&state=${params.state}&nonce=${params.nonce}`
  };

  /**
  * request on token url with customAxios to prevent self signed error
  * @param  {String} url
  * @param  {Object} params
  * @param  {String} code   [code retrieved with authorize]
  * @param  {Object} customAxios
  * @return {Promise}
  */

  const requestTokenWithCode = (params, code, customAxios) => {
    return customAxios.post(`${params.tokenURL}BUG`, {
      redirect_uri: params.callbackURL,
      client_id: params.clientID,
      client_secret: params.clientSecret,
      grant_type: 'authorization_code',
      code: code
    })
    .catch((err) => {
      console.log('pou');
      Promise.reject({
      type: 'requestTokenWithCode',
      err: err
    })
  })
  };

  /**
  * get userInfo with customAxios to prevent self signed error
  * @param  {String} url
  * @param  {String} access_token
  * @param  {Object} customAxios
  * @return {Promise}
  */

  const requestUserInfoWithAccesToken = (params, access_token, customAxios) => {
    return customAxios.get(`${params.userInfoURL}?schema=openid`,
      { headers: { Authorization: `Bearer ${access_token}`}})
    };

    module.exports = {
      initRouter
    };
