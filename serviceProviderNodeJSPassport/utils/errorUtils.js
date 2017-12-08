'use strict';

const getErrorFromAxiosRes = (res) => {
  if (res.code && res.response && res.response.data.message) {
    return `Error fetching user infos : err Code : ${res.code}` + `, err message : ${res.response.data.message}`;
  } else if (res.code) {
    return `Error fetching user infos : err Code : ${res.code}`;
  } else if (res.response && res.response.data.message) {
    return `Error fetching user infos : err message : ${res.response.data.message}`;
  }
};
const checkErrorInConfig = (params) => {
  if (!params.authorizationURL || !params.authorizationURL.endsWith('api/v1/authorize')) {
    return `Error with authorizationURL : ${params.authorizationURL}`
  }
  if (!params.tokenURL || !params.tokenURL.endsWith('api/v1/token')) {
    return `Error with tokenURL: ${params.tokenURL}`
  }
  if (!params.userInfoURL || !params.userInfoURL.endsWith('api/v1/userinfo')) {
    return `Error with userInfoURL : ${params.userInfoURL}`
  }
  if (!params.logoutURL || !params.logoutURL.endsWith('api/v1/logout')) {
    return `Error with logoutURL : ${params.logoutURL}`
  }
}

module.exports = {
  getErrorFromAxiosRes,
  checkErrorInConfig
};
