/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../config/config.json';

chai.use(chaiHttp);
const { expect } = chai;
const { done } = chai;

describe('controllers/callFD', () => {
  it('getFDData() should get a status 200 with valid request', () => {
    chai.request(config.FC_URL)
      .get(config.TOKEN_URL)
      .set('Authorization', 'Bearer 0631752ca22134a1433a6ca951fee85dfd7fe9ac93e2d67d230ad935e8106423')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('getFDData() should get a status 401 with a request without token', () => {
    chai.request(config.FD_MOCK_URL)
      .get(config.FD_MOCK_URL_DGFIP_END_POINT)
      .end((err, res) => {
        expect(err).to.be.not.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('getFDData() should get a status 401 with a request if access token is wrongly formatted', () => {
    chai.request(config.FC_URL)
      .get(config.TOKEN_URL)
      .set('Authorization', 'Bearer wrong_access_token')
      .end((err, res) => {
        expect(err).to.be.not.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('getFDData() should get a status 401 with a request if access token is not found by France Connect', () => {
    chai.request(config.FC_URL)
      .get(config.TOKEN_URL)
      .set('Authorization', 'Bearer unknown_access_token')
      .end((err, res) => {
        expect(err).to.be.not.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('getFDData() should get a status 401 with a request if access token matches no user', () => {
    chai.request(config.FC_URL)
      .get(config.TOKEN_URL)
      .set('Authorization', 'Bearer none_matching_access_token')
      .end((err, res) => {
        expect(err).to.be.not.null;
        expect(res).to.have.status(401);
        done();
      });
  });
})