/**
 * Use to send the access token to an data provider.
 * @return Response with the queried data from the provider.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees }
 * @see @link{ https://github.com/france-connect/data-providers-examples }
 */
import axios from 'axios/index';
import querystring from 'querystring';
import config from '../config/configManager';

const dgfipDataUrl = `${config.FD_URL}${config.DGFIP_DATA_FD_PATH}`;

const getDgfipData = async (req, res, next) => {
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

    const { data: dgfipData } = await axios({
      method: 'GET',
      // only valid if it's used with data-providers-example/nodejs ES6 code from France Connect
      // repo. If you want to use your own code change the url's value in the config/config.json
      // file.
      url: dgfipDataUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.render('pages/dgfip_via_fc', {
      user: req.session.userInfo,
      isUserAuthenticated: true,
      dgfipData,
      dgfipDataRaw: JSON.stringify(dgfipData, null, 2),
      isUsingFDMock: config.USE_FD,
      franceConnectKitUrl: `${config.FC_URL}${config.FRANCE_CONNECT_KIT_PATH}`,
    });
  } catch (error) {
    return next(error);
  }
};

export default getDgfipData;
