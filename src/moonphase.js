/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonphase
 */
/**
 * Moonphase: Chapter 49, Phases of the Moon
 */

import base from './base'

const {sin, cos} = Math
const ck = 1 / 1236.85
const D2R = Math.PI / 180

/**
 * mean synodial lunar month
 */
export const meanLunarMonth = 29.530588861

// (49.1) p. 349
function mean (T) {
  return base.horner(T, 2451550.09766, 29.530588861 / ck,
    0.00015437, -0.00000015, 0.00000000073)
}

/** snap returns k at specified quarter q nearest year y. */
function snap (y, q) {
  const k = (y - 2000) * 12.3685 // (49.2) p. 350
  return Math.floor(k - q + 0.5) + q
}

/**
 * MeanNew returns the jde of the mean New Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of New Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function meanNew (year) {
  return mean(snap(year, 0) * ck)
}

/**
 * MeanFirst returns the jde of the mean First Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of First Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function meanFirst (year) {
  return mean(snap(year, 0.25) * ck)
}

/**
 * MeanFull returns the jde of the mean Full Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Full Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function meanFull (year) {
  return mean(snap(year, 0.5) * ck)
}

/**
 * MeanLast returns the jde of the mean Last Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Last Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function meanLast (year) {
  return mean(snap(year, 0.75) * ck)
}

/**
 * New returns the jde of New Moon nearest the given date.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function newMoon (year) {
  const m = new Mp(year, 0)
  return mean(m.T) + m.nfc(nc) + m.a()
}

/**
 * First returns the jde of First Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function first (year, month, day) {
  const m = new Mp(year, 0.25)
  return mean(m.T) + m.flc() + m.w() + m.a()
}

/**
 * Full returns the jde of Full Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function full (year, month, day) {
  const m = new Mp(year, 0.5)
  return mean(m.T) + m.nfc(fc) + m.a()
}

/**
 * Last returns the jde of Last Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export function last (year, month, day) {
  const m = new Mp(year, 0.75)
  return mean(m.T) + m.flc() - m.w() + m.a()
}

class Mp {
  constructor (y, q) {
    this.A = new Array(14)
    const k = this.k = snap(y, q)
    const T = this.T = this.k * ck // (49.3) p. 350
    this.E = base.horner(T, 1, -0.002516, -0.0000074)
    this.M = base.horner(T, 2.5534 * D2R, 29.1053567 * D2R / ck,
      -0.0000014 * D2R, -0.00000011 * D2R)
    this.M_ = base.horner(T, 201.5643 * D2R, 385.81693528 * D2R / ck,
      0.0107582 * D2R, 0.00001238 * D2R, -0.000000058 * D2R)
    this.F = base.horner(T, 160.7108 * D2R, 390.67050284 * D2R / ck,
      -0.0016118 * D2R, -0.00000227 * D2R, 0.000000011 * D2R)
    this.Ω = base.horner(T, 124.7746 * D2R, -1.56375588 * D2R / ck,
      0.0020672 * D2R, 0.00000215 * D2R)
    this.A[0] = 299.7 * D2R + 0.107408 * D2R * k - 0.009173 * T * T
    this.A[1] = 251.88 * D2R + 0.016321 * D2R * k
    this.A[2] = 251.83 * D2R + 26.651886 * D2R * k
    this.A[3] = 349.42 * D2R + 36.412478 * D2R * k
    this.A[4] = 84.66 * D2R + 18.206239 * D2R * k
    this.A[5] = 141.74 * D2R + 53.303771 * D2R * k
    this.A[6] = 207.17 * D2R + 2.453732 * D2R * k
    this.A[7] = 154.84 * D2R + 7.30686 * D2R * k
    this.A[8] = 34.52 * D2R + 27.261239 * D2R * k
    this.A[9] = 207.19 * D2R + 0.121824 * D2R * k
    this.A[10] = 291.34 * D2R + 1.844379 * D2R * k
    this.A[11] = 161.72 * D2R + 24.198154 * D2R * k
    this.A[12] = 239.56 * D2R + 25.513099 * D2R * k
    this.A[13] = 331.55 * D2R + 3.592518 * D2R * k
  }

  // new or full corrections
  nfc (c) {
    const {M, M_, E, F, Ω} = this
    return c[0] * sin(M_) +
      c[1] * sin(M) * E +
      c[2] * sin(2 * M_) +
      c[3] * sin(2 * F) +
      c[4] * sin(M_ - M) * E +
      c[5] * sin(M_ + M) * E +
      c[6] * sin(2 * M) * E * E +
      c[7] * sin(M_ - 2 * F) +
      c[8] * sin(M_ + 2 * F) +
      c[9] * sin(2 * M_ + M) * E +
      c[10] * sin(3 * M_) +
      c[11] * sin(M + 2 * F) * E +
      c[12] * sin(M - 2 * F) * E +
      c[13] * sin(2 * M_ - M) * E +
      c[14] * sin(Ω) +
      c[15] * sin(M_ + 2 * M) +
      c[16] * sin(2 * (M_ - F)) +
      c[17] * sin(3 * M) +
      c[18] * sin(M_ + M - 2 * F) +
      c[19] * sin(2 * (M_ + F)) +
      c[20] * sin(M_ + M + 2 * F) +
      c[21] * sin(M_ - M + 2 * F) +
      c[22] * sin(M_ - M - 2 * F) +
      c[23] * sin(3 * M_ + M) +
      c[24] * sin(4 * M_)
  }

  // first or last corrections
  flc () {
    const {M, M_, E, F, Ω} = this
    return -0.62801 * sin(M_) +
      0.17172 * sin(M) * E +
      -0.01183 * sin(M_ + M) * E +
      0.00862 * sin(2 * M_) +
      0.00804 * sin(2 * F) +
      0.00454 * sin(M_ - M) * E +
      0.00204 * sin(2 * M) * E * E +
      -0.0018 * sin(M_ - 2 * F) +
      -0.0007 * sin(M_ + 2 * F) +
      -0.0004 * sin(3 * M_) +
      -0.00034 * sin(2 * M_ - M) * E +
      0.00032 * sin(M + 2 * F) * E +
      0.00032 * sin(M - 2 * F) * E +
      -0.00028 * sin(M_ + 2 * M) * E * E +
      0.00027 * sin(2 * M_ + M) * E +
      -0.00017 * sin(Ω) +
      -0.00005 * sin(M_ - M - 2 * F) +
      0.00004 * sin(2 * M_ + 2 * F) +
      -0.00004 * sin(M_ + M + 2 * F) +
      0.00004 * sin(M_ - 2 * M) +
      0.00003 * sin(M_ + M - 2 * F) +
      0.00003 * sin(3 * M) +
      0.00002 * sin(2 * M_ - 2 * F) +
      0.00002 * sin(M_ - M + 2 * F) +
      -0.00002 * sin(3 * M_ + M)
  }

  w () {
    const {M, M_, E, F} = this
    return 0.00306 -
      0.00038 * E * cos(M) +
      0.00026 * cos(M_) -
      0.00002 * (cos(M_ - M) -
        cos(M_ + M) -
        cos(2 * F)
      )
  }

  // additional corrections
  a () {
    let a = 0
    ac.forEach((c, i) => {
      a += c * sin(this.A[i])
    })
    return a
  }
}

// new coefficients
const nc = [
  -0.4072, 0.17241, 0.01608, 0.01039, 0.00739,
  -0.00514, 0.00208, -0.00111, -0.00057, 0.00056,
  -0.00042, 0.00042, 0.00038, -0.00024, -0.00017,
  -0.00007, 0.00004, 0.00004, 0.00003, 0.00003,
  -0.00003, 0.00003, -0.00002, -0.00002, 0.00002
]

// full coefficients
const fc = [
  -0.40614, 0.17302, 0.01614, 0.01043, 0.00734,
  -0.00515, 0.00209, -0.00111, -0.00057, 0.00056,
  -0.00042, 0.00042, 0.00038, -0.00024, -0.00017,
  -0.00007, 0.00004, 0.00004, 0.00003, 0.00003,
  -0.00003, 0.00003, -0.00002, -0.00002, 0.00002
]

// additional corrections
const ac = [
  0.000325, 0.000165, 0.000164, 0.000126, 0.00011,
  0.000062, 0.00006, 0.000056, 0.000047, 0.000042,
  0.000040, 0.000037, 0.000035, 0.000023
]

export default {
  meanLunarMonth,
  meanNew,
  meanFirst,
  meanFull,
  meanLast,
  newMoon,
  new: newMoon, // BACKWARDS-COMPATIBILITY
  first,
  full,
  last
}
