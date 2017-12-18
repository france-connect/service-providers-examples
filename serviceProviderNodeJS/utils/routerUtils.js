/**
* separating router logic
* @param  {Object} config
* @param  {Object} axios
* @return {}
*/

const getErrorFromAxiosRes = require('./errorUtils').getErrorFromAxiosRes;
const checkErrorInConfig = require('./errorUtils').checkErrorInConfig;


const getRenderObj = (infosRes) => {
  const toRender = {
    title: 'Démonstrateur France Connect',
  };

  if (infosRes.data.given_name) toRender.user = infosRes.data.given_name;
  if (infosRes.data.phone_number) toRender.phone_number = infosRes.data.phone_number;
  if (infosRes.data.email) toRender.email = infosRes.data.email;

  return toRender;
};

const getAuthRoute = params =>
  `${params.authorizationURL}?response_type=code`
  + `&client_id=${params.clientID}&redirect_uri=${params.callbackURL}`
  + `&scope=${encodeURIComponent(params.scope)}&state=${params.state}&nonce=${params.nonce}`;

/**
* request on token url with customAxios to prevent self signed error
* @param  {Object} params
* @param  {String} code   [code retrieved with authorize]
* @param  {Object} axios
* @return {Promise}
*/

const requestTokenWithCode = (params, code, axios) => {
  if (!code) {
    return Promise.reject(new Error(`Error fetching your code
      verify your openIdParameters : ${params}`));
  }

  return axios.post(`${params.tokenURL}`, {
    redirect_uri: params.callbackURL,
    client_id: params.clientID,
    client_secret: params.clientSecret,
    grant_type: 'authorization_code',
    code: code,
  })
    .catch((err) => {
      return Promise.reject(new Error(getErrorFromAxiosRes(err)));
    });
};

  /**
  * get userInfo with axios to prevent self signed error
  * @param  {Object} params
  * @param  {String} access_token
  * @param  {Object} axios
  * @return {Promise}
  */

const requestUserInfo = (params, accessToken, axios) => {
  if (!accessToken) {
    return Promise.reject(new Error(`Error fetching token.
      Verify your openIdParameters.tokenUrl : ${params.tokenURL}`));
  }

  return axios.get(`${params.userInfoURL}?schema=openid`,
    { headers: { Authorization: `Bearer ${accessToken}` } })
    .catch((err) => {
      Promise.reject(new Error(getErrorFromAxiosRes(err)));
    });
};

const initRouter = (router, config, axios) => {
  router.get('/', (req, res) => {
    res.render('index', {
      title: 'Démonstrateur France Connect',
      user: undefined,
    });
  });

  // route set up in 'views/index.ejs'
  router.get('/login', (req, res) => {
    const error = checkErrorInConfig(config.openIdParameters);

    if (error) {
      res.send(`Error in config openIdParameters : ${error}`);
    } else {
      res.redirect(getAuthRoute(config.openIdParameters));
    }
  });

  router.get('/callback', (req, res) => {
    if (req.query.state !== config.openIdParameters.state) {
      console.log('[Wrong state]');
      res.sendStatus(403);
    } else {
      requestTokenWithCode(config.openIdParameters, req.query.code, axios)
        .then((tokenRes) => {
          return requestUserInfo(config.openIdParameters, tokenRes.data.access_token, axios);
        })
        .then((infosRes) => {
          console.log('user infos : ', infosRes.data);
          res.render('userInfo', getRenderObj(infosRes));
        })
        .catch((err) => {
          res.send(err.message);
        });
    }
  });
  return router;
};

module.exports = {
  initRouter,
};
