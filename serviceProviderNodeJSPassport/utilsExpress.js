/**
*   call app[method] for each middleware
*  @param {Object} app
*  @param {String} method
*  @param {Array} arr
*/

const applyMethod = (app, method, arr) => arr.forEach(el => app[method](el))

const initMiddleWares = (app, method, arr) => {
  return method === 'use' || method === 'get' || method === 'set'
  ? applyMethod(app, method, arr)
  : console.log('Error Fatal')
}

const setPort => port => applyMethod(app, 'set', )

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = {
  initMiddleWares
}
