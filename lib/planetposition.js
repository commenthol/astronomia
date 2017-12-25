'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetposition
 */
/**
 * Planetposition: Chapter 32, Positions of the Planets.
 *
 * Incomplete:
 *
 * 1. The package does not implement algorithms that use appendix III,
 * but instead implements a full VSOP87 solution.  I do not have a copy
 * of the supplimentary disk with appendix III in machine readable form
 * and as the appendix is rather large, retyping it by hand is problematic.
 * The full VSOP87 data set on the other hand is freely downloadable from
 * the internet, so I implement here code that can use that data directly.
 *
 * 2. The formula for accuracy of results is not implemented.  It is
 * not needed for full VSOP87 solutions.
 *
 * 3. Polynomial expressions are not implemented.  Again, implementation
 * would involve typing rather large tables of numbers with associated
 * risk of typographical errors.
 */

var base = require('./base');
var sexa = require('./sexagesimal');
var coord = require('./coord');
var precess = require('./precess');

var M = exports;

// planet names used in Planet
M.mercury = 'mercury';
M.venus = 'venus';
M.earth = 'earth';
M.mars = 'mars';
M.jupiter = 'jupiter';
M.saturn = 'saturn';
M.uranus = 'uranus';
M.neptune = 'neptune';

function sum(t, series) {
  var coeffs = [];
  Object.keys(series).forEach(function (x) {
    coeffs[x] = 0;
    var y = series[x].length - 1;
    for (y; y >= 0; y--) {
      var term = {
        a: series[x][y][0],
        b: series[x][y][1],
        c: series[x][y][2]
      };
      coeffs[x] += term.a * Math.cos(term.b + term.c * t);
    }
  });
  var res = base.horner(t, coeffs);
  return res;
}

var Planet = function () {
  /**
   * VSOP87 representation of a Planet
   * @constructs Planet
   * @param {string|object} planet - name of planet or data series
   * @example
   * ```js
   * // for use in browser
   * const earthData = require('astronomia/data/vsop87Bearth')
   * const earth = new planetposition.Planet(earthData)
   * // otherwise
   * const saturn = new planetposition.Planet(planetposition.saturn)
   * ```
   */
  function Planet(planet) {
    _classCallCheck(this, Planet);

    if (typeof planet === 'string') {
      this.name = planet.toLowerCase();
      this.series = require('../data/vsop87B' + this.name);
    } else {
      this.name = planet.name;
      this.series = planet;
    }
  }

  /**
   * Position2000 returns ecliptic position of planets by full VSOP87 theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {base.Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */


  _createClass(Planet, [{
    key: 'position2000',
    value: function position2000(jde) {
      var T = base.J2000Century(jde);
      var τ = T * 0.1;
      var lon = base.pmod(sum(τ, this.series.L), 2 * Math.PI);
      var lat = sum(τ, this.series.B);
      var range = sum(τ, this.series.R);
      return new base.Coord(lon, lat, range);
    }

    /**
     * Position returns ecliptic position of planets at equinox and ecliptic of date.
     *
     * @param {Number} jde - the date for which positions are desired.
     * @returns {base.Coord} Results are positions consistent with those from Meeus's
     * Apendix III, that is, at equinox and ecliptic of date.
     *  {Number} lon - heliocentric longitude in radians.
     *  {Number} lat - heliocentric latitude in radians.
     *  {Number} range - heliocentric range in AU.
     */

  }, {
    key: 'position',
    value: function position(jde) {
      var _position = this.position2000(jde),
          lat = _position.lat,
          lon = _position.lon,
          range = _position.range;

      var eclFrom = new coord.Ecliptic(lon, lat);
      var epochFrom = 2000.0;
      var epochTo = base.JDEToJulianYear(jde);
      var eclTo = precess.eclipticPosition(eclFrom, epochFrom, epochTo, 0, 0);
      return new base.Coord(eclTo.lon, eclTo.lat, range);
    }
  }]);

  return Planet;
}();

M.Planet = Planet;

/**
 * ToFK5 converts ecliptic longitude and latitude from dynamical frame to FK5.
 *
 * @param {Number} lon - ecliptic longitude in radians
 * @param {Number} lat - ecliptic latitude in radians
 * @param {Number} jde - Julian ephemeris day
 * @return {base.Coord}
 *    {Number} lon - FK5 longitude
 *    {Number} lat - FK5 latitude
 */
M.toFK5 = function (lon, lat, jde) {
  // formula 32.3, p. 219.
  var T = base.J2000Century(jde);
  // let Lp = lon - 1.397 * Math.PI / 180 * T - 0.00031 * Math.PI / 180 * T * T
  var Lp = lon - sexa.angleFromDeg((1.397 + 0.00031 * T) * T);

  var _base$sincos = base.sincos(Lp),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sLp = _base$sincos2[0],
      cLp = _base$sincos2[1];
  // (32.3) p. 219


  var L5 = lon + sexa.angleFromSec(-0.09033 + 0.03916 * (cLp + sLp) * Math.tan(lat));
  var B5 = lat + sexa.angleFromSec(0.03916 * (cLp - sLp));
  return new base.Coord(L5, B5);
};