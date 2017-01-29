'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module nutation
 */
/**
 * Nutation: Chapter 22, Nutation and the Obliquity of the Ecliptic.
 */

var base = require('./base');
var sexa = require('./sexagesimal');

var M = exports;

// Nutation: Chapter 22, Nutation and the Obliquity of the Ecliptic.

/**
 * Nutation returns nutation in longitude (Δψ) and nutation in obliquity (Δε)
 * for a given JDE.
 *
 * JDE = UT + ΔT, see package.
 *
 * Computation is by 1980 IAU theory, with terms < .0003″ neglected.
 *
 * Result units are radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {number[]} [Δψ, Δε] - [longitude, obliquity] in radians
 */
M.nutation = function (jde) {
  var T = base.J2000Century(jde);
  var D = base.horner(T, 297.85036, 445267.11148, -0.0019142, 1.0 / 189474) * Math.PI / 180;
  var M = base.horner(T, 357.52772, 35999.050340, -0.0001603, -1.0 / 300000) * Math.PI / 180;
  var N = base.horner(T, 134.96298, 477198.867398, 0.0086972, 1.0 / 5620) * Math.PI / 180;
  var F = base.horner(T, 93.27191, 483202.017538, -0.0036825, 1.0 / 327270) * Math.PI / 180;
  var Ω = base.horner(T, 125.04452, -1934.136261, 0.0020708, 1.0 / 450000) * Math.PI / 180;
  var Δψ = 0;
  var Δε = 0;
  // sum in reverse order to accumulate smaller terms first
  for (var i = table22A.length - 1; i >= 0; i--) {
    var row = table22A[i];
    var arg = row.d * D + row.m * M + row.n * N + row.f * F + row.ω * Ω;

    var _base$sincos = base.sincos(arg),
        _base$sincos2 = _slicedToArray(_base$sincos, 2),
        s = _base$sincos2[0],
        c = _base$sincos2[1];

    Δψ += s * (row.s0 + row.s1 * T);
    Δε += c * (row.c0 + row.c1 * T);
  }
  Δψ *= 0.0001 / 3600 * (Math.PI / 180);
  Δε *= 0.0001 / 3600 * (Math.PI / 180);
  return [Δψ, Δε]; // (Δψ, Δε float)
};
/**
 * ApproxNutation returns a fast approximation of nutation in longitude (Δψ)
 * and nutation in obliquity (Δε) for a given JDE.
 *
 * Accuracy is 0.5″ in Δψ, 0.1″ in Δε.
 *
 * Result units are radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {number[]} [Δψ, Δε] - [longitude, obliquity] in radians
 */
M.approxNutation = function (jde) {
  var T = (jde - base.J2000) / 36525;
  var Ω = (125.04452 - 1934.136261 * T) * Math.PI / 180;
  var L = (280.4665 + 36000.7698 * T) * Math.PI / 180;
  var N = (218.3165 + 481267.8813 * T) * Math.PI / 180;

  var _base$sincos3 = base.sincos(Ω),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sΩ = _base$sincos4[0],
      cΩ = _base$sincos4[1];

  var _base$sincos5 = base.sincos(2 * L),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      s2L = _base$sincos6[0],
      c2L = _base$sincos6[1];

  var _base$sincos7 = base.sincos(2 * N),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      s2N = _base$sincos8[0],
      c2N = _base$sincos8[1];

  var _base$sincos9 = base.sincos(2 * Ω),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      s2Ω = _base$sincos10[0],
      c2Ω = _base$sincos10[1];

  var Δψ = (-17.2 * sΩ - 1.32 * s2L - 0.23 * s2N + 0.21 * s2Ω) / 3600 * (Math.PI / 180);
  var Δε = (9.2 * cΩ + 0.57 * c2L + 0.1 * c2N - 0.09 * c2Ω) / 3600 * (Math.PI / 180);
  return [Δψ, Δε]; // (Δψ, Δε float)
};

/**
 * MeanObliquity returns mean obliquity (ε₀) following the IAU 1980
 * polynomial.
 *
 * Accuracy is 1″ over the range 1000 to 3000 years and 10″ over the range
 * 0 to 4000 years.
 *
 * Result unit is radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {number} mean obliquity (ε₀)
 */
M.meanObliquity = function (jde) {
  // (22.2) p. 147
  return base.horner(base.J2000Century(jde), new sexa.Angle(false, 23, 26, 21.448).rad(), -46.815 / 3600 * (Math.PI / 180), -0.00059 / 3600 * (Math.PI / 180), 0.001813 / 3600 * (Math.PI / 180));
};

/**
 * MeanObliquityLaskar returns mean obliquity (ε₀) following the Laskar
 * 1986 polynomial.
 *
 * Accuracy over the range 1000 to 3000 years is .01″.
 *
 * Accuracy over the valid date range of -8000 to +12000 years is
 * "a few seconds."
 *
 * Result unit is radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {number} mean obliquity (ε₀)
 */
M.meanObliquityLaskar = function (jde) {
  // (22.3) p. 147
  return base.horner(base.J2000Century(jde) * 0.01, new sexa.Angle(false, 23, 26, 21.448).rad(), -4680.93 / 3600 * (Math.PI / 180), -1.55 / 3600 * (Math.PI / 180), 1999.25 / 3600 * (Math.PI / 180), -51.38 / 3600 * (Math.PI / 180), -249.67 / 3600 * (Math.PI / 180), -39.05 / 3600 * (Math.PI / 180), 7.12 / 3600 * (Math.PI / 180), 27.87 / 3600 * (Math.PI / 180), 5.79 / 3600 * (Math.PI / 180), 2.45 / 3600 * (Math.PI / 180));
};

/**
 * NutationInRA returns "nutation in right ascension" or "equation of the
 * equinoxes."
 *
 * Result is an angle in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {number} nutation in right ascension
 */
M.nutationInRA = function (jde) {
  var _M$nutation = M.nutation(jde),
      _M$nutation2 = _slicedToArray(_M$nutation, 2),
      Δψ = _M$nutation2[0],
      Δε = _M$nutation2[1];

  var ε0 = M.meanObliquity(jde);
  return Δψ * Math.cos(ε0 + Δε);
};

var table22A = function () {
  var PROPS = 'd,m,n,f,ω,s0,s1,c0,c1'.split(',');
  var tab = [[0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9], [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1], [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5], [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5], [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1], [0, 0, 1, 0, 0, 712, 0.1, -7, 0], [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6], [0, 0, 0, 2, 1, -386, -0.4, 200, 0], [0, 0, 1, 2, 2, -301, 0, 129, -0.1], [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3], [-2, 0, 1, 0, 0, -158, 0, 0, 0], [-2, 0, 0, 2, 1, 129, 0.1, -70, 0], [0, 0, -1, 2, 2, 123, 0, -53, 0], [2, 0, 0, 0, 0, 63, 0, 0, 0], [0, 0, 1, 0, 1, 63, 0.1, -33, 0], [2, 0, -1, 2, 2, -59, 0, 26, 0], [0, 0, -1, 0, 1, -58, -0.1, 32, 0], [0, 0, 1, 2, 1, -51, 0, 27, 0], [-2, 0, 2, 0, 0, 48, 0, 0, 0], [0, 0, -2, 2, 1, 46, 0, -24, 0], [2, 0, 0, 2, 2, -38, 0, 16, 0], [0, 0, 2, 2, 2, -31, 0, 13, 0], [0, 0, 2, 0, 0, 29, 0, 0, 0], [-2, 0, 1, 2, 2, 29, 0, -12, 0], [0, 0, 0, 2, 0, 26, 0, 0, 0], [-2, 0, 0, 2, 0, -22, 0, 0, 0], [0, 0, -1, 2, 1, 21, 0, -10, 0], [0, 2, 0, 0, 0, 17, -0.1, 0, 0], [2, 0, -1, 0, 1, 16, 0, -8, 0], [-2, 2, 0, 2, 2, -16, 0.1, 7, 0], [0, 1, 0, 0, 1, -15, 0, 9, 0], [-2, 0, 1, 0, 1, -13, 0, 7, 0], [0, -1, 0, 0, 1, -12, 0, 6, 0], [0, 0, 2, -2, 0, 11, 0, 0, 0], [2, 0, -1, 2, 1, -10, 0, 5, 0], [2, 0, 1, 2, 2, -8, 0, 3, 0], [0, 1, 0, 2, 2, 7, 0, -3, 0], [-2, 1, 1, 0, 0, -7, 0, 0, 0], [0, -1, 0, 2, 2, -7, 0, 3, 0], [2, 0, 0, 2, 1, -7, 0, 3, 0], [2, 0, 1, 0, 0, 6, 0, 0, 0], [-2, 0, 2, 2, 2, 6, 0, -3, 0], [-2, 0, 1, 2, 1, 6, 0, -3, 0], [2, 0, -2, 0, 1, -6, 0, 3, 0], [2, 0, 0, 0, 1, -6, 0, 3, 0], [0, -1, 1, 0, 0, 5, 0, 0, 0], [-2, -1, 0, 2, 1, -5, 0, 3, 0], [-2, 0, 0, 0, 1, -5, 0, 3, 0], [0, 0, 2, 2, 1, -5, 0, 3, 0], [-2, 0, 2, 0, 1, 4, 0, 0, 0], [-2, 1, 0, 2, 1, 4, 0, 0, 0], [0, 0, 1, -2, 0, 4, 0, 0, 0], [-1, 0, 1, 0, 0, -4, 0, 0, 0], [-2, 1, 0, 0, 0, -4, 0, 0, 0], [1, 0, 0, 0, 0, -4, 0, 0, 0], [0, 0, 1, 2, 0, 3, 0, 0, 0], [0, 0, -2, 2, 2, -3, 0, 0, 0], [-1, -1, 1, 0, 0, -3, 0, 0, 0], [0, 1, 1, 0, 0, -3, 0, 0, 0], [0, -1, 1, 2, 2, -3, 0, 0, 0], [2, -1, -1, 2, 2, -3, 0, 0, 0], [0, 0, 3, 2, 2, -3, 0, 0, 0], [2, -1, 0, 2, 2, -3, 0, 0, 0]];

  return tab.map(function (row) {
    var o = {};
    PROPS.forEach(function (p, i) {
      o[p] = row[i];
    });
    return o;
  });
}();