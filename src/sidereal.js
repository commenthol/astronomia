/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sidereal
 */
/**
 * Sidereal: Chapter 12, Sidereal Time at Greenwich.
 */

const base = require('./base')
const nutation = require('./nutation')

const M = exports

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
  let [j0, f] = base.modf(jd + 0.5)
  return [base.J2000Century(j0 - 0.5), f] // (cen, dayFrac /* float */)
}

/**
 * iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
 *
 * The polynomial is in centuries from J2000.0, as given by JDToCFrac.
 * Coefficients are those adopted in 1982 by the International Astronomical
 * Union and are given in (12.2) p. 87.
 */
let iau82 = M.iau82 = [24110.54841, 8640184.812866, 0.093104, 0.0000062]

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
  return base.pmod(_mean(jd), 86400)
}

/**
 * @private
 */
function _mean (jd) {
  let [s, f] = _mean0UT(jd)
  return s + f * 1.00273790935 * 86400
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
  let [s, _] = _mean0UT(jd) // eslint-disable-line
  return base.pmod(s, 86400)
}

/**
 * @private
 */
function _mean0UT (jd /* float */) {
  let [cen, f] = M.JDToCFrac(jd)
  // (12.2) p. 87
  return [base.horner(cen, ...iau82), f] // (sidereal, dayFrac /* float */)
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
  let s = _mean(jd)                     // seconds of time
  let n = nutation.nutationInRA(jd)      // angle (radians) of RA
  let ns = n * 3600 * 180 / Math.PI / 15 // convert RA to time in seconds
  return base.pmod(s + ns, 86400)
}

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
  let [j0, f] = base.modf(jd + 0.5)
  let cen = (j0 - 0.5 - base.J2000) / 36525
  let s = base.horner(cen, ...iau82) + f * 1.00273790935 * 86400
  let n = nutation.nutationInRA(j0)      // angle (radians) of RA
  let ns = n * 3600 * 180 / Math.PI / 15 // convert RA to time in seconds
  return base.pmod(s + ns, 86400)
}
