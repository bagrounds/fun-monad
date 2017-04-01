/**
 *
 * @module fun-monad
 */
;(function () {
  'use strict'

  /* imports */
  var compose = require('fun-compose')
  var curry = require('fun-curry')
  var funAssert = require('fun-assert')
  var guarded = require('guarded')
  var flip = require('fun-flip')

  var TYPE = '{of:Function,type:Function,map:Function,join:Function,...}'
  var isValidOptions = funAssert.type(TYPE)

  /* exports */
  module.exports = guarded({
    inputs: [isValidOptions],
    f: funMonad,
    output: isValidOptions
  })

  /**
   *
   * @function module:fun-monad.funMonad
   *
   * @param {Object} options - all input parameters
   * @param {Function} options.type - contract
   * @param {Function} options.of - a -> m a
   * @param {Function} options.map - (a -> b, m a) -> m b
   * @param {Function} options.join - m m a -> m a
   *
   * @return {Function} the monadic type constructor
   */
  function funMonad (options) {
    var type = options.type
    var of = options.of
    var map = options.map
    var join = options.join

    function chain (ma, f) {
      return compose(join, map)(f, ma)
    }

    function fish (f, g) {
      return compose(curry(flip(chain))(g), f)
    }

    return {
      type: type,
      of: of,
      map: map,
      join: join,
      chain: chain,
      fish: fish
    }
  }
})()

