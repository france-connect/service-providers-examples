
const axios = require('axios');
const express = require('express');
const https = require('https');
const configFCA = require('./config/configFCA.json');
// const configFCP = require('./config/configFCP.json');

const initExpressApp = require('./utils/expressUtils').initExpressApp;

const app = express();
const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

// initExpressApp(app, configFCP, customAxios, __dirname);
initExpressApp(app, configFCA, customAxios, __dirname);
app.listen(process.env.PORT || 8000);
console.log('App listening on :', process.env.PORT || 8000);
console.log("Pour tester le service DINSIC d'exemple : 247095301100810 en compte et 123 en mot de passe");
module.exports = app;
