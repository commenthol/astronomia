'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sidereal
 */
/**
 * Sidereal: Chapter 12, Sidereal Time at Greenwich.
 */

var base = require('./base');
var nutation = require('./nutation');

var M = exports;

/**
 * JDToCFrac returns values for use in computing sidereal time at Greenwich.
 *
 * Cen is centuries from J2000 of the JD at 0h UT of argument jd.  This is
 * the value to use for evaluating the IAU sidereal time polynomial.
 * DayFrac is the fraction of jd after 0h UT.  It is used to compute the
 * final value of sidereal time.
 *
 * @param {number} jd - Julian Days
 * @return {number[]} [century, fraction] century and fraction of jd after 0h UT
 */
M.JDToCFrac = function (jd) {
  var _base$modf = base.modf(jd + 0.5),
      _base$modf2 = _slicedToArray(_base$modf, 2),
      j0 = _base$modf2[0],
      f = _base$modf2[1];

  return [base.J2000Century(j0 - 0.5), f]; // (cen, dayFrac /* float */)
};

/**
 * iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
 *
 * The polynomial is in centuries from J2000.0, as given by JDToCFrac.
 * Coefficients are those adopted in 1982 by the International Astronomical
 * Union and are given in (12.2) p. 87.
 */
var iau82 = M.iau82 = [24110.54841, 8640184.812866, 0.093104, 0.0000062];

/**
 * Mean returns mean sidereal time at Greenwich for a given JD.
 *
 * Computation is by IAU 1982 coefficients.  The result is in seconds of
 * time and is in the range [0,86400).
 *
 * @param {number} jd - Julian Days
 * @return {number}
 */
M.mean = function (jd) {
  return base.pmod(_mean(jd), 86400);
};

/**
 * @private
 */
function _mean(jd) {
  var _mean0UT2 = _mean0UT(jd),
      _mean0UT3 = _slicedToArray(_mean0UT2, 2),
      s = _mean0UT3[0],
      f = _mean0UT3[1];

  return s + f * 1.00273790935 * 86400;
}

/**
 * Mean0UT returns mean sidereal time at Greenwich at 0h UT on the given JD.
 *
 * The result is in seconds of time and is in the range [0,86400).
 *
 * @param {number} jd - Julian Days
 * @return {number}
 */
M.mean0UT = function (jd /* float */) {
  var _mean0UT4 = _mean0UT(jd),
      _mean0UT5 = _slicedToArray(_mean0UT4, 2),
      s = _mean0UT5[0],
      _ = _mean0UT5[1]; // eslint-disable-line


  return base.pmod(s, 86400);
};

/**
 * @private
 */
function _mean0UT(jd /* float */) {
  var _M$JDToCFrac = M.JDToCFrac(jd),
      _M$JDToCFrac2 = _slicedToArray(_M$JDToCFrac, 2),
      cen = _M$JDToCFrac2[0],
      f = _M$JDToCFrac2[1];
  // (12.2) p. 87


  return [base.horner.apply(base, [cen].concat(iau82)), f]; // (sidereal, dayFrac /* float */)
}

/**
 * Apparent returns apparent sidereal time at Greenwich for the given JD.
 *
 * Apparent is mean plus the nutation in right ascension.
 *
 * The result is in seconds of time and is in the range [0,86400).
 *
 * @param {number} jd - Julian Days
 * @return {number}
 */
M.apparent = function (jd) {
  var s = _mean(jd); // seconds of time
  var n = nutation.nutationInRA(jd); // angle (radians) of RA
  var ns = n * 3600 * 180 / Math.PI / 15; // convert RA to time in seconds
  return base.pmod(s + ns, 86400);
};

/**
 * Apparent0UT returns apparent sidereal time at Greenwich at 0h UT
 * on the given JD.
 *
 * The result is in seconds of time and is in the range [0,86400).
 *
 * @param {number} jd - Julian Days
 * @return {number}
 */
M.apparent0UT = function (jd) {
  var _base$modf3 = base.modf(jd + 0.5),
      _base$modf4 = _slicedToArray(_base$modf3, 2),
      j0 = _base$modf4[0],
      f = _base$modf4[1];

  var cen = (j0 - 0.5 - base.J2000) / 36525;
  var s = base.horner.apply(base, [cen].concat(iau82)) + f * 1.00273790935 * 86400;
  var n = nutation.nutationInRA(j0); // angle (radians) of RA
  var ns = n * 3600 * 180 / Math.PI / 15; // convert RA to time in seconds
  return base.pmod(s + ns, 86400);
};