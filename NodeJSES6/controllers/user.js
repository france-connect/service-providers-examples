/**
 * Call to the userInfo API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */

import axios from 'axios';
import config from '../config/config.json';

const getUser = async (req, res) => {
  if (!req.accessToken) {
    res.status(401).send('Access token is required');
    return;
  }
  // Set request header
  const headerConfig = {
    headers: {
      Authorization: `Bearer ${req.accessToken}`,
    },
  };
  await axios.get(config.USERINFO_URL, headerConfig)
    .then((response) => {
      // Helper to set userInfo value available to the profile page.
      req.session.userInfo = response.data;

      res.redirect('profile');
    })
    .catch(err => res.send(err.message));
};
export default getUser;
