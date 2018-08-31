/**
 * Entry point of the service provider(FS) demo app.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import sessionstore from 'sessionstore';
import config from './config/config.json';
import { getAuthorizationUrl, getLogoutUrl } from './helpers/utils';
import getAccessToken from './controllers/accessToken';
import getFDData from './controllers/callFD';

const app = express();

let isAuth;

/**
 * Session config
 * About the warning on connect.session()
 * @see {@link https://github.com/expressjs/session/issues/556}
 * @see {@link https://github.com/expressjs/session/blob/master/README.md#compatible-session-stores}
 */
app.use(session({
  store: sessionstore.createSessionStore(),
  secret: 'demo secret', // put your own secret
  cookie: {},
  saveUninitialized: true,
  resave: true,
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes (@see @link{ see https://expressjs.com/en/guide/routing.html }
app.get('/', (req, res) => {
  isAuth = false;
  if(req.session.accessToken === undefined) {
    console.log('hello')
    res.render('pages/index', { isAuth });
  }else {
    res.redirect('profile');
  }
});

app.get('/login', (req, res) => {
  res.redirect(getAuthorizationUrl());
});

app.get('/callback', (req, res) => {
  // check if the mandatory Authorization code is there.
  if (!req.query.code) {
    res.sendStatus(400);
  }
  getAccessToken(res, req);
});

app.get('/profile', (req, res) => {
  isAuth = true;
  // get user info from session
  const user = req.session.userInfo;
  const isUsingFDMock = config.USING_FD_MOCK;
  const isFdData = false;
  if (req.session.accessToken !== undefined) {
    res.render('pages/profile', {
      user,
      isAuth,
      isFdData,
      isUsingFDMock,
    });
  } else {
    res.sendStatus(401).send('You need to be Authenticate.');
  }
});

app.get('/callFd', (req, res) => {
  getFDData(req, res);
});

app.get('/logout', (req, res) => {
  res.redirect(getLogoutUrl(req));
});

app.get('/logged-out', (req, res) => {
  isAuth = false;
  // Resetting the id token hint.
  req.session.id_token = null;
  // Resetting the userInfo.
  req.session.userInfo = null;
  res.render('pages/logged-out', { isAuth });
});

// Setting app port
const port = process.env.PORT || '3000';
// Starting server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`\x1b[32mServer listening on http://localhost:${port}\x1b[0m`);
});

export default server;
