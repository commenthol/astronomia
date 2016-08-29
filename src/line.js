/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module line
 */
/**
 * Line: Chapter 19, Bodies in Straight Line
 */

const base = require('./base')
const interp = require('./interpolation')

const M = exports

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
 * @param {Number} r3 - right ascension Coordinate 3
 * @param {Number} d2 - declination Coordinate 3
 * @param {Array} d3 -
 * @param {Array} t1 - time in Julian Days
 * @param {Array} t5 - time in Julian Days
 * @returns {Number} time of alignment in Julian Days
 */
M.time = function (r1, d1, r2, d2, r3, d3, t1, t5) { // (r1, d1, r2, d2 float64, r3, d3 []float64, t1, t5 float64)  (float64, error)
  if (r3.length !== 5 || d3.length !== 5) {
    throw new Error('r3, d3 must be length 5')
  }
  let gc = new Array(5)
  r3.forEach((r3i, i) => {
    // (19.1) p. 121
    gc[i] = Math.tan(d1) * Math.sin(r2 - r3i) +
      Math.tan(d2) * Math.sin(r3i - r1) +
      Math.tan(d3[i]) * Math.sin(r1 - r2)
  })
  let l5 = new interp.Len5(t1, t5, gc)
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
M.angle = function (r1, d1, r2, d2, r3, d3) { // (r1, d1, r2, d2, r3, d3 float64)  float64
  let [sd2, cd2] = base.sincos(d2)
  let [sr21, cr21] = base.sincos(r2 - r1)
  let [sr32, cr32] = base.sincos(r3 - r2)
  let C1 = Math.atan2(sr21, cd2 * Math.tan(d1) - sd2 * cr21)
  let C2 = Math.atan2(sr32, cd2 * Math.tan(d3) - sd2 * cr32)
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
M.error = function (r1, d1, r2, d2, r0, d0) { // (r1, d1, r2, d2, r0, d0 float64)  float64
  let [sr1, cr1] = base.sincos(r1)
  let [sd1, cd1] = base.sincos(d1)
  let [sr2, cr2] = base.sincos(r2)
  let [sd2, cd2] = base.sincos(d2)
  let X1 = cd1 * cr1
  let X2 = cd2 * cr2
  let Y1 = cd1 * sr1
  let Y2 = cd2 * sr2
  let Z1 = sd1
  let Z2 = sd2
  let A = Y1 * Z2 - Z1 * Y2
  let B = Z1 * X2 - X1 * Z2
  let C = X1 * Y2 - Y1 * X2
  let m = Math.tan(r0)
  let n = Math.tan(d0) / Math.cos(r0)
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
M.angleError = function (r1, d1, r2, d2, r3, d3) {
  let [sr1, cr1] = base.sincos(r1)
  let [c1, cd1] = base.sincos(d1)
  let [sr2, cr2] = base.sincos(r2)
  let [c2, cd2] = base.sincos(d2)
  let [sr3, cr3] = base.sincos(r3)
  let [c3, cd3] = base.sincos(d3)
  let a1 = cd1 * cr1
  let a2 = cd2 * cr2
  let a3 = cd3 * cr3
  let b1 = cd1 * sr1
  let b2 = cd2 * sr2
  let b3 = cd3 * sr3
  let l1 = b1 * c2 - b2 * c1
  let l2 = b2 * c3 - b3 * c2
  let l3 = b1 * c3 - b3 * c1
  let m1 = c1 * a2 - c2 * a1
  let m2 = c2 * a3 - c3 * a2
  let m3 = c1 * a3 - c3 * a1
  let n1 = a1 * b2 - a2 * b1
  let n2 = a2 * b3 - a3 * b2
  let n3 = a1 * b3 - a3 * b1
  let ψ = Math.acos((l1 * l2 + m1 * m2 + n1 * n2) /
    (Math.sqrt(l1 * l1 + m1 * m1 + n1 * n1) * Math.sqrt(l2 * l2 + m2 * m2 + n2 * n2)))
  let ω = Math.asin((a2 * l3 + b2 * m3 + c2 * n3) /
    (Math.sqrt(a2 * a2 + b2 * b2 + c2 * c2) * Math.sqrt(l3 * l3 + m3 * m3 + n3 * n3)))
  return [ψ, ω]
}
