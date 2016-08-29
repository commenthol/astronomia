/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module node
 */
/**
 * Node: Chapter 39, Passages through the Nodes.
 */

const base = require('./base')

const M = exports

/**
 * EllipticAscending computes time and distance of passage through the ascending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.ellipticAscending = function (axis, ecc, argP, timeP) { // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return M.el(-argP, axis, ecc, timeP)
}

/**
 * EllipticAscending computes time and distance of passage through the descending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.ellipticDescending = function (axis, ecc, argP, timeP) { // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return M.el(Math.PI - argP, axis, ecc, timeP)
}

M.el = function (ν, axis, ecc, timeP) { // (ν, axis, ecc, timeP float64)  (jde, r float64)
  let E = 2 * Math.atan(Math.sqrt((1 - ecc) / (1 + ecc)) * Math.tan(ν * 0.5))
  let [sE, cE] = base.sincos(E)
  let M = E - ecc * sE
  let n = base.K / axis / Math.sqrt(axis)
  let jde = timeP + M / n
  let r = axis * (1 - ecc * cE)
  return [jde, r]
}

/**
 * ParabolicAscending computes time and distance of passage through the ascending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.parabolicAscending = function (q, argP, timeP) { // (q, argP, timeP float64)  (jde, r float64)
  return M.pa(-argP, q, timeP)
}

/**
 * ParabolicDescending computes time and distance of passage through the descending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
M.parabolicDescending = function (q, argP, timeP) { // (q, argP, timeP float64)  (jde, r float64)
  return M.pa(Math.PI - argP, q, timeP)
}

M.pa = function (ν, q, timeP) { // (ν, q, timeP float64)  (jde, r float64)
  let s = Math.tan(ν * 0.5)
  let jde = timeP + 27.403895 * s * (s * s + 3) * q * Math.sqrt(q)
  let r = q * (1 + s * s)
  return [jde, r]
}
