'use strict';

var jwt = require('jwt-simple'),
    url = require('url');

var idTokenHelper = {};

idTokenHelper.convertIdTokenToJwt = function (idToken) {
    var idTokenSegments = idToken.split('.');
    try {
        var jwtClaimsStr = new Buffer(idTokenSegments[1], 'base64').toString();
        return JSON.parse(jwtClaimsStr);
    } catch (err) {
        console.error('error parsing jwt : ' + err);
        throw err;
    }
};

idTokenHelper.isDecodableToken = function (idToken, clientSecret) {
    if (!idToken) {
        console.error('ID Token not present in token response');
        return false;
    }
    // call decode function to validate the signature
    try {
        jwt.decode(idToken, clientSecret);
    } catch (err) {
        console.error('error validating idToken ' + idToken + ' : ' + err.message);
        return false;
    }
    return true;
};

idTokenHelper.validateIdToken = function (idToken, clientSecret, tokenUrl, nonce) {
    if (!this.isDecodableToken(idToken, clientSecret)) {
        console.error('IDP gave us an invalid id_token');
        return false;
    } else {
        var jwtClaims;
        try {
            jwtClaims = this.convertIdTokenToJwt(idToken);
        } catch (err) {
            return false;
        }
        if (this.validateJwtToken(jwtClaims, nonce, tokenUrl)) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = idTokenHelper;
