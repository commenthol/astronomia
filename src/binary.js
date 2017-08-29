/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module binary
 */
/**
 * Binary: Chapter 57, Binary Stars
 */
const base = require('./base')
const {atan, atan2, cos, sqrt, tan} = Math

const M = exports

/**
 * computes mean anomaly for the given date.
 *
 * @param {Number} year - is a decimal year specifying the date
 * @param {Number} T - is time of periastron, as a decimal year
 * @param {Number} P - is period of revolution in mean solar years
 * @returns {Number} mean anomaly in radians.
 */
M.meanAnomaly = function (year, T, P) { // (year, T, P float64)  float64
  let n = 2 * Math.PI / P
  return base.pmod(n * (year - T), 2 * Math.PI)
}

/**
 * Position computes apparent position angle and angular distance of
 * components of a binary star.
 *
 * @param {Number} a - is apparent semimajor axis in arc seconds
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} gw - is position angle of the ascending node
 * @param {Number} gwa - is longitude of periastron
 * @param {Number} E - is eccentric anomaly, computed for example with package kepler
 *  and the mean anomaly as returned by function M in this package.
 * @returns {Number[]} [gth, gr]
 *  {Number} gth -is the apparent position angle in radians,
 *  {Number} gr is the angular distance in arc seconds.
 */
M.position = function (a, e, i, gw, gwa, E) { // (a, e, i, gw, gwa, E float64)  (gth, gr float64)
  let r = a * (1 - e * cos(E))
  let gn = 2 * atan(sqrt((1 + e) / (1 - e)) * tan(E / 2))
  let [singngwa, cosgngwa] = base.sincos(gn + gwa)
  let cosi = cos(i)
  let num = singngwa * cosi
  let gth = atan2(num, cosgngwa) + gw
  if (gth < 0) {
    gth += 2 * Math.PI
  }
  let gr = r * sqrt(num * num + cosgngwa * cosgngwa)
  return [gth, gr]
}

/**
 * ApparentEccentricity returns apparent eccenticity of a binary star
 * given true orbital elements.
 *
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} gwa - is longitude of periastron
 * @returns {Number} apparent eccenticity of a binary star
 */
M.apparentEccentricity = function (e, i, gwa) { // (e, i, gwa float64)  float64
  let cosi = cos(i)
  let [singwa, cosgwa] = base.sincos(gwa)
  let A = (1 - e * e * cosgwa * cosgwa) * cosi * cosi
  let B = e * e * singwa * cosgwa * cosi
  let C = 1 - e * e * singwa * singwa
  let d = A - C
  let sqrtD = sqrt(d * d + 4 * B * B)
  return sqrt(2 * sqrtD / (A + C + sqrtD))
}
