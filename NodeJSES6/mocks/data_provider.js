/* eslint-disable import/prefer-default-export */
import nock from 'nock';
import config from '../config/configManager';

export const startDataProviderMock = (req) => {
  let dgfipData = null;

  if (req.session.accessToken && typeof req.session.accessToken === 'string') {
    dgfipData = {
      nombreDeParts: '2.75',
      revenuFiscalDeReference: '17827',
      adresseFiscaleDeTaxation: '120 BOULEVARD FRANÇOIS ROBERT,,13016,MARSEILLE',
      adresseFiscaleDeTaxationDetail:
        {
          voie: '120 BOULEVARD FRANÇOIS ROBERT',
          complementAdresse: '',
          codePostal: '13016',
          commune: 'MARSEILLE',
        },
    };

    nock(`${config.FD_URL}`)
      .persist()
      .get(`${config.DGFIP_DATA_FD_PATH}`)
      .reply(200, dgfipData);

  } else {
    nock(`${config.FD_URL}`)
      .persist()
      .get(`${config.DGFIP_DATA_FD_PATH}`)
      .reply(401, 'Unauthorized');
  }
};
