'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parabolic
 */
/**
 * Parabolic: Chapter 34, Parabolic Motion.
 */
var base = require('./base');

var M = exports;

/**
 * Elements holds parabolic elements needed for computing true anomaly and distance.
 */

var Elements = function () {
  /**
   * @param {Number} timeP - time of perihelion, T
   * @param {Number} pDis - perihelion distance, q
   */
  function Elements(timeP, pDis) {
    _classCallCheck(this, Elements);

    this.timeP = timeP;
    this.pDis = pDis;
  }

  /**
   * AnomalyDistance returns true anomaly and distance of a body in a parabolic orbit of the Sun.
   *
   * @param {Number} jde - Julian ephemeris day
   * @returns {Object} {ano, dist}
   *   {Number} ano - True anomaly ν in radians.
   *   {Number} dist - Distance r returned in AU.
   */


  _createClass(Elements, [{
    key: 'anomalyDistance',
    value: function anomalyDistance(jde) {
      var W = 3 * base.K / Math.SQRT2 * (jde - this.timeP) / this.pDis / Math.sqrt(this.pDis);
      var G = W * 0.5;
      var Y = Math.cbrt(G + Math.sqrt(G * G + 1));
      var s = Y - 1 / Y;
      var ν = 2 * Math.atan(s);
      var r = this.pDis * (1 + s * s);
      return {
        ano: ν,
        dist: r
      };
    }
  }]);

  return Elements;
}();

M.Elements = Elements;