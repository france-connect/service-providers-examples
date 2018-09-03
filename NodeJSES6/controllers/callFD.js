/**
 * Use to send the access token to an data provider.
 * @return Response with the queried data from the provider.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees }
 * @see @link{ https://github.com/france-connect/data-providers-examples }
 */
import axios from 'axios/index';
import config from '../config/config.json';

const fdMockUrl = config.FD_MOCK_URL_DGFIP_END_POINT;
// this value is only for a demo purpose you should use the Access token send by FC
const fakeAccessToken = config.FAKE_ACCESS_TOKEN;

const getFDData = (req, res) => {
  axios({
    method: 'GET',
    /**
     * only valid if it's used with data-providers-example/nodejs ES6 code from France Connect repo.
     * If you want to use your own code change the url's value in the config/config.json file.
     */
    url: fdMockUrl,
    headers: { Authorization: `Bearer ${fakeAccessToken}` },
  })
    .then((fdResponse) => {
      const isFdData = true;
      const isAuth = true;
      // Put user information in session
      const user = req.session.userInfo;
      const dgfipData = [];
      const responsedata = Object.entries(fdResponse.data);

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of responsedata) {
        dgfipData[key] = value;
      }
      res.render('pages/profile', {
        user, isAuth, isFdData, dgfipData,
      });
    })
    .catch(err => res.send(err.message));
};

export default getFDData;
