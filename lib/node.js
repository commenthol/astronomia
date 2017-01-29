'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module node
 */
/**
 * Node: Chapter 39, Passages through the Nodes.
 */

var base = require('./base');

var M = exports;

/**
 * EllipticAscending computes time and distance of passage through the ascending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.ellipticAscending = function (axis, ecc, argP, timeP) {
  // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return M.el(-argP, axis, ecc, timeP);
};

/**
 * EllipticAscending computes time and distance of passage through the descending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.ellipticDescending = function (axis, ecc, argP, timeP) {
  // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return M.el(Math.PI - argP, axis, ecc, timeP);
};

M.el = function (ν, axis, ecc, timeP) {
  // (ν, axis, ecc, timeP float64)  (jde, r float64)
  var E = 2 * Math.atan(Math.sqrt((1 - ecc) / (1 + ecc)) * Math.tan(ν * 0.5));

  var _base$sincos = base.sincos(E),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sE = _base$sincos2[0],
      cE = _base$sincos2[1];

  var M = E - ecc * sE;
  var n = base.K / axis / Math.sqrt(axis);
  var jde = timeP + M / n;
  var r = axis * (1 - ecc * cE);
  return [jde, r];
};

/**
 * ParabolicAscending computes time and distance of passage through the ascending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.parabolicAscending = function (q, argP, timeP) {
  // (q, argP, timeP float64)  (jde, r float64)
  return M.pa(-argP, q, timeP);
};

/**
 * ParabolicDescending computes time and distance of passage through the descending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.parabolicDescending = function (q, argP, timeP) {
  // (q, argP, timeP float64)  (jde, r float64)
  return M.pa(Math.PI - argP, q, timeP);
};

M.pa = function (ν, q, timeP) {
  // (ν, q, timeP float64)  (jde, r float64)
  var s = Math.tan(ν * 0.5);
  var jde = timeP + 27.403895 * s * (s * s + 3) * q * Math.sqrt(q);
  var r = q * (1 + s * s);
  return [jde, r];
};