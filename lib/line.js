'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module line
 */
/**
 * Line: Chapter 19, Bodies in Straight Line
 */

var base = require('./base');
var interp = require('./interpolation');

var M = exports;

/**
 * Time computes the time at which a moving body is on a straight line (great
 * circle) between two fixed points, such as stars.
 *
 * Coordinates may be right ascensions and declinations or longitudes and
 * latitudes.  Fixed points are r1, d1, r2, d2.  Moving body is an ephemeris
 * of 5 rows, r3, d3, starting at time t1 and ending at time t5.  Time scale
 * is arbitrary.
 *
 * @throws Error
 * @param {Number} r1 - right ascension Coordinate 1
 * @param {Number} d1 - declination Coordinate 1
 * @param {Number} r2 - right ascension Coordinate 2
 * @param {Number} d2 - declination Coordinate 2
 * @param {Number} r3 - right ascension Coordinate 3
 * @param {Number} d2 - declination Coordinate 3
 * @param {Array} d3 -
 * @param {Array} t1 - time in Julian Days
 * @param {Array} t5 - time in Julian Days
 * @returns {Number} time of alignment in Julian Days
 */
M.time = function (r1, d1, r2, d2, r3, d3, t1, t5) {
  // (r1, d1, r2, d2 float64, r3, d3 []float64, t1, t5 float64)  (float64, error)
  if (r3.length !== 5 || d3.length !== 5) {
    throw new Error('r3, d3 must be length 5');
  }
  var gc = new Array(5);
  r3.forEach(function (r3i, i) {
    // (19.1) p. 121
    gc[i] = Math.tan(d1) * Math.sin(r2 - r3i) + Math.tan(d2) * Math.sin(r3i - r1) + Math.tan(d3[i]) * Math.sin(r1 - r2);
  });
  var l5 = new interp.Len5(t1, t5, gc);
  return l5.zero(false);
};

/**
 * Angle returns the angle between great circles defined by three points.
 *
 * Coordinates may be right ascensions and declinations or longitudes and
 * latitudes.  If r1, d1, r2, d2 defines one line and r2, d2, r3, d3 defines
 * another, the result is the angle between the two lines.
 *
 * Algorithm by Meeus.
 */
M.angle = function (r1, d1, r2, d2, r3, d3) {
  // (r1, d1, r2, d2, r3, d3 float64)  float64
  var _base$sincos = base.sincos(d2),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sd2 = _base$sincos2[0],
      cd2 = _base$sincos2[1];

  var _base$sincos3 = base.sincos(r2 - r1),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sr21 = _base$sincos4[0],
      cr21 = _base$sincos4[1];

  var _base$sincos5 = base.sincos(r3 - r2),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sr32 = _base$sincos6[0],
      cr32 = _base$sincos6[1];

  var C1 = Math.atan2(sr21, cd2 * Math.tan(d1) - sd2 * cr21);
  var C2 = Math.atan2(sr32, cd2 * Math.tan(d3) - sd2 * cr32);
  return C1 + C2;
};

/**
 * Error returns an error angle of three nearly co-linear points.
 *
 * For the line defined by r1, d1, r2, d2, the result is the anglular distance
 * between that line and r0, d0.
 *
 * Algorithm by Meeus.
 */
M.error = function (r1, d1, r2, d2, r0, d0) {
  // (r1, d1, r2, d2, r0, d0 float64)  float64
  var _base$sincos7 = base.sincos(r1),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sr1 = _base$sincos8[0],
      cr1 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(d1),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sd1 = _base$sincos10[0],
      cd1 = _base$sincos10[1];

  var _base$sincos11 = base.sincos(r2),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sr2 = _base$sincos12[0],
      cr2 = _base$sincos12[1];

  var _base$sincos13 = base.sincos(d2),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sd2 = _base$sincos14[0],
      cd2 = _base$sincos14[1];

  var X1 = cd1 * cr1;
  var X2 = cd2 * cr2;
  var Y1 = cd1 * sr1;
  var Y2 = cd2 * sr2;
  var Z1 = sd1;
  var Z2 = sd2;
  var A = Y1 * Z2 - Z1 * Y2;
  var B = Z1 * X2 - X1 * Z2;
  var C = X1 * Y2 - Y1 * X2;
  var m = Math.tan(r0);
  var n = Math.tan(d0) / Math.cos(r0);
  return Math.asin((A + B * m + C * n) / (Math.sqrt(A * A + B * B + C * C) * Math.sqrt(1 + m * m + n * n)));
};

/**
 * AngleError returns both an angle as in the function Angle, and an error
 * as in the function Error.
 *
 * The algorithm is by B. Pessens.
 *
 * @returns {Number[]} [ψ, ω]
 *  {Number} ψ - angle between great circles defined by three points.
 *  {Number} ω - error angle of three nearly co-linear points
 */
M.angleError = function (r1, d1, r2, d2, r3, d3) {
  var _base$sincos15 = base.sincos(r1),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sr1 = _base$sincos16[0],
      cr1 = _base$sincos16[1];

  var _base$sincos17 = base.sincos(d1),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      c1 = _base$sincos18[0],
      cd1 = _base$sincos18[1];

  var _base$sincos19 = base.sincos(r2),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sr2 = _base$sincos20[0],
      cr2 = _base$sincos20[1];

  var _base$sincos21 = base.sincos(d2),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      c2 = _base$sincos22[0],
      cd2 = _base$sincos22[1];

  var _base$sincos23 = base.sincos(r3),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sr3 = _base$sincos24[0],
      cr3 = _base$sincos24[1];

  var _base$sincos25 = base.sincos(d3),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      c3 = _base$sincos26[0],
      cd3 = _base$sincos26[1];

  var a1 = cd1 * cr1;
  var a2 = cd2 * cr2;
  var a3 = cd3 * cr3;
  var b1 = cd1 * sr1;
  var b2 = cd2 * sr2;
  var b3 = cd3 * sr3;
  var l1 = b1 * c2 - b2 * c1;
  var l2 = b2 * c3 - b3 * c2;
  var l3 = b1 * c3 - b3 * c1;
  var m1 = c1 * a2 - c2 * a1;
  var m2 = c2 * a3 - c3 * a2;
  var m3 = c1 * a3 - c3 * a1;
  var n1 = a1 * b2 - a2 * b1;
  var n2 = a2 * b3 - a3 * b2;
  var n3 = a1 * b3 - a3 * b1;
  var ψ = Math.acos((l1 * l2 + m1 * m2 + n1 * n2) / (Math.sqrt(l1 * l1 + m1 * m1 + n1 * n1) * Math.sqrt(l2 * l2 + m2 * m2 + n2 * n2)));
  var ω = Math.asin((a2 * l3 + b2 * m3 + c2 * n3) / (Math.sqrt(a2 * a2 + b2 * b2 + c2 * c2) * Math.sqrt(l3 * l3 + m3 * m3 + n3 * n3)));
  return [ψ, ω];
};