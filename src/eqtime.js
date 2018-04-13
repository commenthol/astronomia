/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module eqtime
 */
/**
 * Eqtime: Chapter 28, Equation of time.
 */

import base from './base'
import coord from './coord'
import nutation from './nutation'
import solar from './solar'
const {cos, sin, tan} = Math

/**
 * e computes the "equation of time" for the given JDE.
 *
 * Parameter planet must be a planetposition.Planet object for Earth obtained
 * with `new planetposition.Planet('earth')`.
 *
 * @param {Number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 planet
 * @returns {Number} equation of time as an hour angle in radians.
 */
export function e (jde, earth) {
  const τ = base.J2000Century(jde) * 0.1
  const L0 = l0(τ)
  // code duplicated from solar.ApparentEquatorialVSOP87 so that
  // we can keep Δψ and cε
  const {lon, lat, range} = solar.trueVSOP87(earth, jde)
  const [Δψ, Δε] = nutation.nutation(jde)
  const a = -20.4898 / 3600 * Math.PI / 180 / range
  const λ = lon + Δψ + a
  const ε = nutation.meanObliquity(jde) + Δε
  const eq = new coord.Ecliptic(λ, lat).toEquatorial(ε)
  // (28.1) p. 183
  const E = L0 - 0.0057183 * Math.PI / 180 - eq.ra + Δψ * cos(ε)
  return base.pmod(E + Math.PI, 2 * Math.PI) - Math.PI
}

/**
 * (28.2) p. 183
 */
const l0 = function (τ) {
  return base.horner(τ, 280.4664567, 360007.6982779, 0.03032028,
    1.0 / 49931, -1.0 / 15300, -1.0 / 2000000) * Math.PI / 180
}

/**
 * eSmart computes the "equation of time" for the given JDE.
 *
 * Result is less accurate that e() but the function has the advantage
 * of not requiring the V87Planet object.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} equation of time as an hour angle in radians.
 */
export function eSmart (jde) {
  const ε = nutation.meanObliquity(jde)
  const t = tan(ε * 0.5)
  const y = t * t
  const T = base.J2000Century(jde)
  const L0 = l0(T * 0.1)
  const e = solar.eccentricity(T)
  const M = solar.meanAnomaly(T)
  const [sin2L0, cos2L0] = base.sincos(2 * L0)
  const sinM = sin(M)
  // (28.3) p. 185
  return y * sin2L0 - 2 * e * sinM + 4 * e * y * sinM * cos2L0 -
    y * y * sin2L0 * cos2L0 - 1.25 * e * e * sin(2 * M)
}

export default {
  e,
  eSmart
}
