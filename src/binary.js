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
 * @param {Number} Ω - is position angle of the ascending node
 * @param {Number} ω - is longitude of periastron
 * @param {Number} E - is eccentric anomaly, computed for example with package kepler
 *  and the mean anomaly as returned by function M in this package.
 * @returns {Number[]} [θ, ρ]
 *  {Number} θ -is the apparent position angle in radians,
 *  {Number} ρ is the angular distance in arc seconds.
 */
M.position = function (a, e, i, Ω, ω, E) { // (a, e, i, Ω, ω, E float64)  (θ, ρ float64)
  let r = a * (1 - e * Math.cos(E))
  let ν = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2))
  let [sνω, cνω] = base.sincos(ν + ω)
  let ci = Math.cos(i)
  let num = sνω * ci
  let θ = Math.atan2(num, cνω) + Ω
  if (θ < 0) {
    θ += 2 * Math.PI
  }
  let ρ = r * Math.sqrt(num * num + cνω * cνω)
  return [θ, ρ]
}

/**
 * ApparentEccentricity returns apparent eccenticity of a binary star
 * given true orbital elements.
 *
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} ω - is longitude of periastron
 * @returns {Number} apparent eccenticity of a binary star
 */
M.apparentEccentricity = function (e, i, ω) { // (e, i, ω float64)  float64
  let ci = Math.cos(i)
  let [sω, cω] = base.sincos(ω)
  let A = (1 - e * e * cω * cω) * ci * ci
  let B = e * e * sω * cω * ci
  let C = 1 - e * e * sω * sω
  let d = A - C
  let sD = Math.sqrt(d * d + 4 * B * B)
  return Math.sqrt(2 * sD / (A + C + sD))
}
