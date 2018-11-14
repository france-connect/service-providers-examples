/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import axios from 'axios';
import querystring from 'querystring';
import config from '../config/configManager';
import getDgfipData from './getDgfipData';

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
const oauthCallbackGetData = async (req, res, next) => {
  // check if the mandatory Authorization code is there.
  if (!req.query.code) {
    return res.sendStatus(400);
  }

  // Set request params.
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_GETDATA_PATH}`,
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code: req.query.code,
  };

  try {
    // Request access token.
    const { data: { access_token: accessToken, id_token: idToken } } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    // Make a call to the France Connect API endpoint to get user data.
    if (!accessToken) {
      return res.sendStatus(401);
    }

    req.accessToken = accessToken;
    req.session.accessToken = accessToken;
    req.session.idToken = idToken;

    // eslint-disable-next-line no-console
    console.info(`[INFO] Scopes list : ${config.SCOPES}`);

    getDgfipData(req, res, next);
  } catch (error) {
    return next(error);
  }
};

export default oauthCallbackGetData;
