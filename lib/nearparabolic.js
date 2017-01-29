'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module nearparabolic
 */
/**
 * Nearparabolic: Chapter 35, Near-parabolic Motion.
 */
var base = require('./base');

var M = exports;

/**
 * Elements holds orbital elements for near-parabolic orbits.
 */

var Elements = function () {
  /**
   * @param {Number} timeP - time of Perihelion, T
   * @param {Number} pDis - Perihelion distance, q
   * @param {Number} ecc - eccentricity, e
   */
  function Elements(timeP, pDis, ecc) {
    _classCallCheck(this, Elements);

    this.timeP = timeP;
    this.pDis = pDis;
    this.ecc = ecc;
  }

  /**
   * AnomalyDistance returns true anomaly and distance for near-parabolic orbits.
   *
   * True anomaly ν returned in radians. Distance r returned in AU.
   * An error is returned if the algorithm fails to converge.
   */


  _createClass(Elements, [{
    key: 'anomalyDistance',
    value: function anomalyDistance(jde) {
      // fairly literal translation of code on p. 246
      var q1 = base.K * Math.sqrt((1 + this.ecc) / this.pDis) / (2 * this.pDis); // line 20
      var g = (1 - this.ecc) / (1 + this.ecc); // line 20

      var t = jde - this.timeP; // line 22
      if (t === 0) {
        // line 24
        return { ano: 0, dist: this.pDis, err: null };
      }
      var d1 = 1e4;
      var d = 1e-9; // line 14
      var q2 = q1 * t; // line 28
      var s = 2.0 / (3 * Math.abs(q2)); // line 30
      s = 2 / Math.tan(2 * Math.atan(Math.cbrt(Math.tan(Math.atan(s) / 2))));
      if (t < 0) {
        // line 34
        s = -s;
      }
      if (this.ecc !== 1) {
        // line 36
        var l = 0; // line 38
        for (;;) {
          var s0 = s; // line 40
          var z = 1.0;
          var y = s * s;
          var g1 = -y * s;
          var q3 = q2 + 2 * g * s * y / 3; // line 42
          for (;;) {
            z += 1; // line 44
            g1 = -g1 * g * y; // line 46
            var z1 = (z - (z + 1) * g) / (2 * z + 1); // line 48
            var f = z1 * g1; // line 50
            q3 += f; // line 52
            if (z > 50 || Math.abs(f) > d1) {
              // line 54
              return {
                err: new Error('No convergence')
              };
            }
            if (Math.abs(f) <= d) {
              // line 56
              break;
            }
          }
          l++; // line 58
          if (l > 50) {
            return {
              err: new Error('No convergence')
            };
          }
          for (;;) {
            var s1 = s; // line 60
            s = (2 * s * s * s / 3 + q3) / (s * s + 1);
            if (Math.abs(s - s1) <= d) {
              // line 62
              break;
            }
          }
          if (Math.abs(s - s0) <= d) {
            // line 64
            break;
          }
        }
      }
      var ν = 2 * Math.atan(s); // line 66
      var r = this.pDis * (1 + this.ecc) / (1 + this.ecc * Math.cos(ν)); // line 68
      if (ν < 0) {
        // line 70
        ν += 2 * Math.PI;
      }
      return {
        ano: ν,
        dist: r,
        err: null
      };
    }
  }]);

  return Elements;
}();

M.Elements = Elements;