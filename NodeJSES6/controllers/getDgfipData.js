/**
 * Use to send the access token to an data provider.
 * @return Response with the queried data from the provider.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees }
 * @see @link{ https://github.com/france-connect/data-providers-examples }
 */
import axios from 'axios/index';
import config from '../config/configManager';

const dgfipDataUrl = `${config.FD_URL}${config.DGFIP_DATA_FD_PATH}`;

const getDgfipData = async (req, res, next) => {
  try {
    const { data: dgfipData } = await axios({
      method: 'GET',
      // only valid if it's used with data-providers-example/nodejs ES6 code from France Connect
      // repo. If you want to use your own code change the url's value in the config/config.json
      // file.
      url: dgfipDataUrl,
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });

    return res.render('pages/profile', {
      user: req.session.userInfo,
      isUserAuthenticated: true,
      france_connect_kit_url: req.app.get('france_connect_kit_url'),
      dgfipData,
      isUsingFDMock: config.USE_FD,
    });
  } catch (error) {
    return next(error);
  }
};

export default getDgfipData;
