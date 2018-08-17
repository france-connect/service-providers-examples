/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../config/config.json';

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;

describe('controllers/accessToken', () => {
  it('getAccessToken() should get a status 200 with valid request', () => {
    // Setup
    const expected = {
      'access_token': '0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423',
      'token_type': 'Bearer',
      'expires_in': 60,
      'id_token': 'id_hint_token'
    }

    chai.request(config.FC_URL)
      .post(config.TOKEN_URL)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'authorization_code',
        'redirect_uri': config.REDIRECT_URL,
        'client_id': config.CLIENT_SECRET,
        'client_secret': config.SECRET_KEY,
        'code': 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.deepEqual(expected);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with none valid code param in request', () => {
    chai.request(config.FC_URL)
      .post(config.TOKEN_URL)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'authorization_code',
        'redirect_uri': config.REDIRECT_URL,
        'client_id': config.CLIENT_SECRET,
        'client_secret': config.SECRET_KEY,
        'code': 'unvalid_authorization_code',
      })
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with none valid grant_type param in request', () => {
    chai.request(config.FC_URL)
      .post(config.TOKEN_URL)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'none_valid_grant_type',
        'redirect_uri': config.REDIRECT_URL,
        'client_id': config.CLIENT_SECRET,
        'client_secret': config.SECRET_KEY,
        'code': 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with an unknown client_id param in request', () => {
    chai.request(config.FC_URL)
      .post(config.TOKEN_URL)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'authorization_code',
        'redirect_uri': config.REDIRECT_URL,
        'client_id': 'unknown_client_id',
        'client_secret': config.SECRET_KEY,
        'code': 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with an unknown client_secret param in request', () => {
    chai.request(config.FC_URL)
      .post(config.TOKEN_URL)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'authorization_code',
        'redirect_uri': config.REDIRECT_URL,
        'client_id': config.CLIENT_SECRET,
        'client_secret': 'unknown_client_secret',
        'code': 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
})