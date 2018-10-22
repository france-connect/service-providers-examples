/**
 * Use to send the access token to an data provider.
 * @return Response with the queried data from the provider.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees }
 * @see @link{ https://github.com/france-connect/data-providers-examples }
 */
import axios from 'axios/index';
import config from '../config/config.json';

const fdMockUrl = config.FD_MOCK_URL_DGFIP_END_POINT;

const getDgfipData = async (req, res, next) => {
  let fakeAccessToken;
  if (process.env.NODE_ENV !== 'production') {
    // This value is only for a demo purpose you should use the Access token send by FC
    fakeAccessToken = config.FAKE_ACCESS_TOKEN;
  } else {
    // Set the value with the access token send by FC
    fakeAccessToken = req.session.accessToken;
  }

  try {
    const { data: dgfipData } = await axios({
      method: 'GET',
      // only valid if it's used with data-providers-example/nodejs ES6 code from France Connect
      // repo. If you want to use your own code change the url's value in the config/config.json
      // file.
      url: fdMockUrl,
      headers: { Authorization: `Bearer ${fakeAccessToken}` },
    });

    return res.render('pages/profile', {
      user: req.session.userInfo,
      isUserAuthenticated: true,
      dgfipData,
      isUsingFDMock: config.USING_FD_MOCK,
    });
  } catch (error) {
    return next(error);
  }
};

export default getDgfipData;
