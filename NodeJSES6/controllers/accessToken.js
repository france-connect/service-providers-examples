/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import axios from 'axios';
import querystring from 'querystring';
import getUser from './user';
import config from '../config/config.json';

const tokenUrl = config.TOKEN_URL;
const redirectUrl = config.REDIRECT_URL;
const clientId = config.CLIENT_SECRET;
const secretKey = config.SECRET_KEY;

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
const getAccessToken = async (res, req) => {
  // Set request params.
  const url = tokenUrl;
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl,
    client_id: clientId,
    client_secret: secretKey,
    code: req.query.code,
  };
  const headerConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Request access token.
  await axios.post(url, querystring.stringify(body), headerConfig)
    .then(response => response.data)
    .then((tokenData) => {
      req.accessToken = tokenData.access_token;
      req.session.id_token = tokenData.id_token;
      // Make a call to the France Connect API endpoint to get user data.
      getUser(req, res);
    })
    .catch(err => res.send(err.message));
};

export default getAccessToken;
