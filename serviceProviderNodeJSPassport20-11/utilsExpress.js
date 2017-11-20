'use strict'

const axios = require('axios')
const https = require('https')

const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

const callObjMethodOnArray = (obj, method, arr) => arr.forEach(el => obj[method](el));

const initMiddleWares = (app, method, arr) => {
  return method === 'use' || method === 'get' || method === 'set'
  ? callObjMethodOnArray(app, method, arr)
  : console.og('Wrong method name : ', method)
};

const makeAuthRoute = (url, params) => {
  return `${url}/api/v1/authorize?response_type=code`
  + `&client_id=${params.clientID}&redirect_uri=${params.callbackURL}`
  + `&scope=${encodeURIComponent(params.scope)}&state=${params.state}&nonce=${params.nonce}`
};

const requestToken = (url, params, code) => {
  return customAxios.post(`${url}/api/v1/token`, {
    redirect_uri: params.callbackURL,
    client_id: params.clientID,
    client_secret: params.clientSecret,
    grant_type: 'authorization_code',
    code: code
  })
};

const getUserInfo = (url, access_token) => {
  return customAxios.get(`${url}/api/v1/userinfo?schema=openid`,
    { headers: { Authorization: `Bearer ${access_token}`}})
};

module.exports = {
  initMiddleWares,
  makeAuthRoute,
  requestToken,
  getUserInfo
}
