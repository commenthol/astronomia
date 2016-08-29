/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solardisk
 */
/**
 * Solardisk: Chapter 29, Ephemeris for Physical Observations of the Sun.
 */

const base = require('./base')
const nutation = require('./nutation')
const solar = require('./solar')

const M = exports

/**
 * Ephemeris returns the apparent orientation of the sun at the given jd.
 *
 * Results:
 *  P:  Position angle of the solar north pole.
 *  B0: Heliographic latitude of the center of the solar disk.
 *  L0: Heliographic longitude of the center of the solar disk.
 *
 * All results in radians.
 */
M.ephemeris = function (jd, earth) { // (jd float64, e *pp.V87Planet)  (P, B0, L0 float64)
  let θ = (jd - 2398220) * 2 * Math.PI / 25.38
  let I = 7.25 * Math.PI / 180
  let K = 73.6667 * Math.PI / 180 +
    1.3958333 * Math.PI / 180 * (jd - 2396758) / base.JulianCentury

  let solarPos = solar.trueVSOP87(earth, jd)
  let L = solarPos.lon
  let R = solarPos.range
  let [Δψ, Δε] = nutation.nutation(jd)
  let ε0 = nutation.meanObliquity(jd)
  let ε = ε0 + Δε
  let λ = L - 20.4898 / 3600 * Math.PI / 180 / R
  let λp = λ + Δψ

  let [sλK, cλK] = base.sincos(λ - K)
  let [sI, cI] = base.sincos(I)

  let tx = -Math.cos(λp) * Math.tan(ε)
  let ty = -cλK * Math.tan(I)
  var P = Math.atan(tx) + Math.atan(ty)
  var B0 = Math.asin(sλK * sI)
  let η = Math.atan2(-sλK * cI, -cλK)
  var L0 = base.pmod(η - θ, 2 * Math.PI)
  return [P, B0, L0]
}

/**
 * Cycle returns the jd of the start of the given synodic rotation.
 *
 * Argument c is the "Carrington" cycle number.
 *
 * Result is a dynamical time (not UT).
 */
M.cycle = function (c) { // (c int)  (jde float64)
  let jde = 2398140.227 + 27.2752316 * c
  let m = 281.96 * Math.PI / 180 + 26.882476 * Math.PI / 180 * c
  let [s2m, c2m] = base.sincos(2 * m)
  return jde + 0.1454 * Math.sin(m) - 0.0085 * s2m - 0.0141 * c2m
}
