/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../config/configManager';

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;

describe('controllers/accessToken', () => {
  it('getAccessToken() should get a status 200 with valid request', () => {
    // Setup
    const expected = {
      access_token: '0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423',
      token_type: 'Bearer',
      expires_in: 60,
      idToken: 'id_hint_token',
    };

    chai.request(config.FC_URL)
      .post(config.TOKEN_FC_PATH)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_PATH}`,
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        code: 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deepEqual(expected);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with none valid code param in request', () => {
    chai.request(config.FC_URL)
      .post('/api/v1/token')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_PATH}`,
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        code: 'unvalid_authorization_code',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with none valid grant_type param in request', () => {
    chai.request(config.FC_URL)
      .post('/api/v1/token')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'none_valid_grant_type',
        redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_PATH}`,
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        code: 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with an unknown client_id param in request', () => {
    chai.request(config.FC_URL)
      .post('/api/v1/token')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_PATH}`,
        client_id: 'unknown_client_id',
        client_secret: config.CLIENT_SECRET,
        code: 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getAccessToken() should get a error 400 with an unknown client_secret param in request', () => {
    chai.request(config.FC_URL)
      .post('/api/v1/token')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        redirect_uri: `${config.FS_URL}${config.CALLBACK_FS_PATH}`,
        client_id: config.CLIENT_ID,
        client_secret: 'unknown_client_secret',
        code: 'valid_authorization_code',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
