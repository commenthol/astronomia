'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module kepler
 */
/**
 * Kepler: Chapter 30, Equation of Kepler.
 */

var base = require('./base');
var iterate = require('./iterate');

var M = exports;

/**
 * True returns true anomaly ν for given eccentric anomaly E.
 *
 * @param {number} e - eccentricity
 * @param {number} E - eccentric anomaly in radians.
 * @return true anomaly ν in radians.
 */
M.true = function (E, e) {
  // (30.1) p. 195
  return 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E * 0.5));
};

/**
 * Radius returns radius distance r for given eccentric anomaly E.
 *
 * Result unit is the unit of semimajor axis a (typically AU.)
 *
 * @param {number} e - eccentricity
 * @param {number} E - eccentric anomaly in radians
 * @param {number} a - semimajor axis
 * @return {number} radius distance in unit of `a`
 */
M.radius = function (E, e, a) {
  // (E, e, a float64)  float64
  // (30.2) p. 195
  return a * (1 - e * Math.cos(E));
};

/**
 * Kepler1 solves Kepler's equation by iteration.
 *
 * The iterated formula is
 *
 *  E1 = m + e * sin(E0)
 *
 * For some vaues of e and M it will fail to converge and the
 * function will return an error.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler1 = function (e, m, places) {
  var f = function f(E0) {
    return m + e * Math.sin(E0); // (30.5) p. 195
  };
  return iterate.decimalPlaces(f, m, places, places * 5);
};

/**
 * Kepler2 solves Kepler's equation by iteration.
 *
 * The iterated formula is
 *
 *  E1 = E0 + (m + e * sin(E0) - E0) / (1 - e * cos(E0))
 *
 * The function converges over a wider range of inputs than does Kepler1
 * but it also fails to converge for some values of e and M.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler2 = function (e, m, places) {
  // (e, M float64, places int)  (E float64, err error)
  var f = function f(E0) {
    var _base$sincos = base.sincos(E0),
        _base$sincos2 = _slicedToArray(_base$sincos, 2),
        se = _base$sincos2[0],
        ce = _base$sincos2[1];

    return E0 + (m + e * se - E0) / (1 - e * ce); // (30.7) p. 199
  };
  return iterate.decimalPlaces(f, m, places, places);
};

/**
 * Kepler2a solves Kepler's equation by iteration.
 *
 * The iterated formula is the same as in Kepler2 but a limiting function
 * avoids divergence.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler2a = function (e, m, places) {
  // (e, M float64, places int)  (E float64, err error)
  var f = function f(E0) {
    var _base$sincos3 = base.sincos(E0),
        _base$sincos4 = _slicedToArray(_base$sincos3, 2),
        se = _base$sincos4[0],
        ce = _base$sincos4[1];
    // method of Leingärtner, p. 205


    return E0 + Math.asin(Math.sin((m + e * se - E0) / (1 - e * ce)));
  };
  return iterate.decimalPlaces(f, m, places, places * 5);
};

/**
 * Kepler2b solves Kepler's equation by iteration.
 *
 * The iterated formula is the same as in Kepler2 but a (different) limiting
 * function avoids divergence.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler2b = function (e, m, places) {
  // (e, M float64, places int)  (E float64, err error)
  var f = function f(E0) {
    var _base$sincos5 = base.sincos(E0),
        _base$sincos6 = _slicedToArray(_base$sincos5, 2),
        se = _base$sincos6[0],
        ce = _base$sincos6[1];

    var d = (m + e * se - E0) / (1 - e * ce);
    // method of Steele, p. 205
    if (d > 0.5) {
      d = 0.5;
    } else if (d < -0.5) {
      d = -0.5;
    }
    return E0 + d;
  };
  return iterate.decimalPlaces(f, m, places, places);
};

/**
 * Kepler3 solves Kepler's equation by binary search.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler3 = function (e, m) {
  // (e, m float64)  (E float64)
  // adapted from BASIC, p. 206
  m = base.pmod(m, 2 * Math.PI);
  var f = 1;
  if (m > Math.PI) {
    f = -1;
    m = 2 * Math.PI - m;
  }
  var E0 = Math.PI * 0.5;
  var d = Math.PI * 0.25;
  for (var i = 0; i < 53; i++) {
    var M1 = E0 - e * Math.sin(E0);
    if (m - M1 < 0) {
      E0 -= d;
    } else {
      E0 += d;
    }
    d *= 0.5;
  }
  if (f < 0) {
    return -E0;
  }
  return E0;
};

/**
 * Kepler4 returns an approximate solution to Kepler's equation.
 *
 * It is valid only for small values of e.
 *
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @return {number} eccentric anomaly `E` in radians.
 */
M.kepler4 = function (e, m) {
  // (e, m float64)  (E float64)
  var _base$sincos7 = base.sincos(m),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sm = _base$sincos8[0],
      cm = _base$sincos8[1];

  return Math.atan2(sm, cm - e); // (30.8) p. 206
};