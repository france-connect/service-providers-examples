/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import axios from 'axios';
import querystring from 'querystring';
import config from '../config/config.json';

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
const oauthCallback = async (req, res, next) => {
  // check if the mandatory Authorization code is there.
  if (!req.query.code) {
    return res.sendStatus(400);
  }

  // Set request params.
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: config.REDIRECT_URL,
    client_id: config.CLIENT_ID,
    client_secret: config.SECRET_KEY,
    code: req.query.code,
  };

  try {
    // Request access token.
    const { data: { access_token: accessToken, id_token: idToken } } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: config.TOKEN_URL,
    });

    // Make a call to the France Connect API endpoint to get user data.
    if (!accessToken) {
      return res.sendStatus(401);
    }

    req.accessToken = accessToken;
    req.session.accessToken = accessToken;
    req.session.idToken = idToken;

    const { data: userInfo } = await axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: config.USERINFO_URL,
    });

    // Helper to set userInfo value available to the profile page.
    req.session.userInfo = userInfo;

    return res.redirect('profile');
  } catch (error) {
    return next(error);
  }
};

export default oauthCallback;
