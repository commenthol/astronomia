'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module binary
 */
/**
 * Binary: Chapter 57, Binary Stars
 */
var base = require('./base');
var atan = Math.atan,
    atan2 = Math.atan2,
    cos = Math.cos,
    sqrt = Math.sqrt,
    tan = Math.tan;


var M = exports;

/**
 * computes mean anomaly for the given date.
 *
 * @param {Number} year - is a decimal year specifying the date
 * @param {Number} T - is time of periastron, as a decimal year
 * @param {Number} P - is period of revolution in mean solar years
 * @returns {Number} mean anomaly in radians.
 */
M.meanAnomaly = function (year, T, P) {
  // (year, T, P float64)  float64
  var n = 2 * Math.PI / P;
  return base.pmod(n * (year - T), 2 * Math.PI);
};

/**
 * Position computes apparent position angle and angular distance of
 * components of a binary star.
 *
 * @param {Number} a - is apparent semimajor axis in arc seconds
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} Ω - is position angle of the ascending node
 * @param {Number} ω - is longitude of periastron
 * @param {Number} E - is eccentric anomaly, computed for example with package kepler
 *  and the mean anomaly as returned by function M in this package.
 * @returns {Number[]} [θ, ρ]
 *  {Number} θ -is the apparent position angle in radians,
 *  {Number} ρ is the angular distance in arc seconds.
 */
M.position = function (a, e, i, Ω, ω, E) {
  // (a, e, i, Ω, ω, E float64)  (θ, ρ float64)
  var r = a * (1 - e * cos(E));
  var ν = 2 * atan(sqrt((1 + e) / (1 - e)) * tan(E / 2));

  var _base$sincos = base.sincos(ν + ω),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sinνω = _base$sincos2[0],
      cosνω = _base$sincos2[1];

  var cosi = cos(i);
  var num = sinνω * cosi;
  var θ = atan2(num, cosνω) + Ω;
  if (θ < 0) {
    θ += 2 * Math.PI;
  }
  var ρ = r * sqrt(num * num + cosνω * cosνω);
  return [θ, ρ];
};

/**
 * ApparentEccentricity returns apparent eccenticity of a binary star
 * given true orbital elements.
 *
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} ω - is longitude of periastron
 * @returns {Number} apparent eccenticity of a binary star
 */
M.apparentEccentricity = function (e, i, ω) {
  // (e, i, ω float64)  float64
  var cosi = cos(i);

  var _base$sincos3 = base.sincos(ω),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sinω = _base$sincos4[0],
      cosω = _base$sincos4[1];

  var A = (1 - e * e * cosω * cosω) * cosi * cosi;
  var B = e * e * sinω * cosω * cosi;
  var C = 1 - e * e * sinω * sinω;
  var d = A - C;
  var sqrtD = sqrt(d * d + 4 * B * B);
  return sqrt(2 * sqrtD / (A + C + sqrtD));
};