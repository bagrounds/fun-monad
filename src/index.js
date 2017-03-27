/**
 *
 * @module fun-monad
 */
;(function () {
  'use strict'

  /* imports */
  var compose = require('fun-compose')
  var funAssert = require('fun-assert')
  var guarded = require('guarded')

  var TYPE = '{of: Function, type: Function, map: Function, join: Function}'
  var isValidOptions = funAssert.type(TYPE)
  var isFunction = funAssert.type('Function')

  /* exports */
  module.exports = guarded({
    inputs: [isValidOptions],
    f: funMonad,
    output: isFunction
  })

  /**
   *
   * @function module:fun-monad.funMonad
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.type - constructor for the type to lift
   * @param {Function} options.of - a -> m a
   * @param {Function} options.map - (a -> b, m a) -> m b
   * @param {Function} options.join - m m a -> m a
   *
   * @return {Function} the monadic type constructor
   */
  function funMonad (options) {
    var type = options.type

    type.of = options.of
    type.map = options.map
    type.join = options.join

    type.bind = function bind (ma, f) {
      return type.join(type.map(f, ma))
    }

    type.fish = function fish (f, g) {
      return [g, type.join, f].reduce(compose)
    }

    type.prototype.map = function map (f) {
      return type.map(f, this)
    }

    type.prototype.join = function join () {
      return type.join(this)
    }

    type.prototype.bind = function bind (f) {
      return type.bind(this, f)
    }

    return type
  }
})()

