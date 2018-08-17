/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../config/config.json';
import app from '../../app';

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;

describe('controllers/user', () => {
  it('getUser() should call the "/api/v1/userinfo". Endpoint: response status 200', () => {
    chai.request(config.FC_URL)
      .get(config.USERINFO_URL)
      .set('Authorization', 'Bearer 0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('getUser() should call the "/api/v1/userinfo" with wrong Authorization is not Bearer. Endpoint: response status 400', () => {
    chai.request(app)
      .get(config.USERINFO_URL)
      .set('Authorization', 'Basic 0631752ca22134a1433a6ca951fee85')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getUser() should call the "/api/v1/userinfo" with wrong access token. Endpoint: response status 400', () => {
    chai.request(config.FC_URL)
      .get(config.USERINFO_URL)
      .set('Authorization', 'Bearer 0631752ca22134a1433a6ca951fee85')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getUser() should call the "/api/v1/userinfo" with no access token. Endpoint: response status 400', () => {
    chai.request(config.FC_URL)
      .get(config.USERINFO_URL)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('getUser() should call the "/api/v1/userinfo". Endpoint response.body.data should be an object', () => {
    chai.request(config.FC_URL)
      .get(config.USERINFO_URL)
      .set('Authorization', 'Bearer 0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423')
      .end((err, res) => {
        expect(res.data).to.be.an('object');
        done();
      });
  });


  it('getUser() should call the "/api/v1/userinfo" endpoint and get the response.body.data should not be null', () => {
    chai.request(config.FC_URL)
      .get(config.USERINFO_URL)
      .set('Authorization', 'Bearer 0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423')
      .end((err, res) => {
        expect(res.data).to.not.equal(null);
        done();
      });
  });
});
