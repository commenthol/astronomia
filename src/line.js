/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module line
 */
/**
 * Line: Chapter 19, Bodies in Straight Line
 */

import base from './base.js'
import interp from './interpolation.js'

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
 * @param {Number[]} r3 - right ascension Coordinate 3
 * @param {Number[]} d3 - declination Coordinate 3
 * @param {Number} t1 - time in Julian Days
 * @param {Number} t5 - time in Julian Days
 * @returns {Number} time of alignment in Julian Days
 */
export function time (r1, d1, r2, d2, r3, d3, t1, t5) { // (r1, d1, r2, d2 float64, r3, d3 []float64, t1, t5 float64)  (float64, error)
  if (r3.length !== 5 || d3.length !== 5) {
    throw new Error('r3, d3 must be length 5')
  }
  const gc = new Array(5)
  r3.forEach((r3i, i) => {
    // (19.1) p. 121
    gc[i] = Math.tan(d1) * Math.sin(r2 - r3i) +
      Math.tan(d2) * Math.sin(r3i - r1) +
      Math.tan(d3[i]) * Math.sin(r1 - r2)
  })
  const l5 = new interp.Len5(t1, t5, gc)
  return l5.zero(false)
}

/**
 * Angle returns the angle between great circles defined by three points.
 *
 * Coordinates may be right ascensions and declinations or longitudes and
 * latitudes.  If r1, d1, r2, d2 defines one line and r2, d2, r3, d3 defines
 * another, the result is the angle between the two lines.
 *
 * Algorithm by Meeus.
 */
export function angle (r1, d1, r2, d2, r3, d3) { // (r1, d1, r2, d2, r3, d3 float64)  float64
  const [sd2, cd2] = base.sincos(d2)
  const [sr21, cr21] = base.sincos(r2 - r1)
  const [sr32, cr32] = base.sincos(r3 - r2)
  const C1 = Math.atan2(sr21, cd2 * Math.tan(d1) - sd2 * cr21)
  const C2 = Math.atan2(sr32, cd2 * Math.tan(d3) - sd2 * cr32)
  return C1 + C2
}

/**
 * Error returns an error angle of three nearly co-linear points.
 *
 * For the line defined by r1, d1, r2, d2, the result is the anglular distance
 * between that line and r0, d0.
 *
 * Algorithm by Meeus.
 */
export function error (r1, d1, r2, d2, r0, d0) { // (r1, d1, r2, d2, r0, d0 float64)  float64
  const [sr1, cr1] = base.sincos(r1)
  const [sd1, cd1] = base.sincos(d1)
  const [sr2, cr2] = base.sincos(r2)
  const [sd2, cd2] = base.sincos(d2)
  const X1 = cd1 * cr1
  const X2 = cd2 * cr2
  const Y1 = cd1 * sr1
  const Y2 = cd2 * sr2
  const Z1 = sd1
  const Z2 = sd2
  const A = Y1 * Z2 - Z1 * Y2
  const B = Z1 * X2 - X1 * Z2
  const C = X1 * Y2 - Y1 * X2
  const m = Math.tan(r0)
  const n = Math.tan(d0) / Math.cos(r0)
  return Math.asin((A + B * m + C * n) /
    (Math.sqrt(A * A + B * B + C * C) * Math.sqrt(1 + m * m + n * n)))
}

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
export function angleError (r1, d1, r2, d2, r3, d3) {
  const [sr1, cr1] = base.sincos(r1)
  const [c1, cd1] = base.sincos(d1)
  const [sr2, cr2] = base.sincos(r2)
  const [c2, cd2] = base.sincos(d2)
  const [sr3, cr3] = base.sincos(r3)
  const [c3, cd3] = base.sincos(d3)
  const a1 = cd1 * cr1
  const a2 = cd2 * cr2
  const a3 = cd3 * cr3
  const b1 = cd1 * sr1
  const b2 = cd2 * sr2
  const b3 = cd3 * sr3
  const l1 = b1 * c2 - b2 * c1
  const l2 = b2 * c3 - b3 * c2
  const l3 = b1 * c3 - b3 * c1
  const m1 = c1 * a2 - c2 * a1
  const m2 = c2 * a3 - c3 * a2
  const m3 = c1 * a3 - c3 * a1
  const n1 = a1 * b2 - a2 * b1
  const n2 = a2 * b3 - a3 * b2
  const n3 = a1 * b3 - a3 * b1
  const ψ = Math.acos((l1 * l2 + m1 * m2 + n1 * n2) /
    (Math.sqrt(l1 * l1 + m1 * m1 + n1 * n1) * Math.sqrt(l2 * l2 + m2 * m2 + n2 * n2)))
  const ω = Math.asin((a2 * l3 + b2 * m3 + c2 * n3) /
    (Math.sqrt(a2 * a2 + b2 * b2 + c2 * c2) * Math.sqrt(l3 * l3 + m3 * m3 + n3 * n3)))
  return [ψ, ω]
}

export default {
  time,
  angle,
  error,
  angleError
}
