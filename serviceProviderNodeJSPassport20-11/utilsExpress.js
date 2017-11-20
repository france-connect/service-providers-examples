'use strict'

/**
*   call obj[method] on each element in array
*  @param {Object} obj
*  @param {String} method
*  @param {Array} arr
*/

const callObjMethodOnArray = (obj, method, arr) => arr.forEach(el => obj[method](el))

const initMiddleWares = (app, method, arr) =>
  method === 'use' || method === 'get' || method === 'set'
  ? callObjMethodOnArray(app, method, arr)
  : console.og('Wrong method name : ', method)

  //  error handler
  // will print stacktrace for dev not for pro
const errorHandlerDev = app => {
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
      app.use((err, req, res, next) => {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
    }
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    })
}

module.exports = {
  initMiddleWares,
  errorHandlerDev
}
