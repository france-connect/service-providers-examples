const { initMiddleWares } = require('./utilsExpress')

const initExpress = (app, middleWares) => initMiddleWares(app, 'use', middleWares);

module.exports = {
  initExpress
}
