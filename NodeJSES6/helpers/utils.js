/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import config from '../config/config.json';
// TODO hard code state et nonce because they normaly generate from every request
export const getAuthorizationUrl = () => `${config.AUTHORIZATION_URL}?response_type=code`
    + `&client_id=${config.CLIENT_SECRET}&redirect_uri=${config.REDIRECT_URL}`
    + `&scope=${config.SCOPE}&state=customState11&nonce=customNonce11`;


/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const getLogoutUrl = req => `${config.LOGOUT_URL}?id_token_hint=${req.session.id_token}`
  + `&state=customState11&post_logout_redirect_uri=${config.LOGOUT_REDIRECT_URL}`;
