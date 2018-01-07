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
  : console.og('Wrong method name :' , method)

module.exports = {
  initMiddleWares
}
