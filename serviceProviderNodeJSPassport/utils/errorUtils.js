'use strict';

const getErrorFromAxiosRes = function(res){
  if (res.code && res.response && res.response.data.message) {
    return `Error fetching user infos : err Code : ${res.code}` + `, err message : ${res.response.data.message}`;
  } else if (res.code) {
    return `Error fetching user infos : err Code : ${res.code}`;
  } else if (res.response && res.response.data.message) {
    return `Error fetching user infos : err message : ${res.response.data.message}`;
  }
};

module.exports = {
  getErrorFromAxiosRes
};
