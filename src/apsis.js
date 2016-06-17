/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Apsis: Chapter 50, Perigee and apogee of the Moon
 *
 * Incomplete:  PerigeeParallax not implemented for lack of test cases.
 * Implementation involves copying a table of coefficients, involving
 * risk of typographical error.
 */

const base = require('./base')

const M = exports

/**
 * conversion factor from k to T, given in (50.3) p. 356
 */
const ck = 1 / 1325.55

/**
 * (50.1) p. 355
 */
const mean = function (T) { // (T float64)  float64
  return base.horner(T, 2451534.6698, 27.55454989 / ck,
    -0.0006691, -0.000001098, 0.0000000052)
}

/**
 * snap returns k at half h nearest year y.
 */
const snap = function (y, h) { // (y, h float64)  float64
  let k = (y - 1999.97) * 13.2555 // (50.2) p. 355
  return Math.floor(k - h + 0.5) + h
}

/**
 * MeanPerigee returns the jde of the mean perigee of the Moon nearest the given date.
 *
 * Year is a decimal year specifying a date.
 */
M.MeanPerigee = function (year) { // (year float64)  float64
  return mean(snap(year, 0) * ck)
}

/**
 * Perigee returns the jde of perigee of the Moon nearest the given date.
 *
 * Year is a decimal year specifying a date.
 */
M.Perigee = function (year) { // (year float64)  float64
  let l = new La(year, 0)
  return mean(l.T) + l.pc()
}

/**
 * MeanApogee returns the jde of the mean apogee of the Moon nearest the given date.
 *
 * Year is a decimal year specifying a date.
 */
M.MeanApogee = function (year) { // (year float64)  float64
  return mean(snap(year, 0.5) * ck)
}

/**
 * Apogee returns the jde of apogee of the Moon nearest the given date.
 *
 * Year is a decimal year specifying a date.
 */
M.Apogee = function (year) { // (year float64)  float64
  let l = new La(year, 0.5)
  return mean(l.T) + l.ac()
}

/**
 * ApogeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * Year is a decimal year specifying a date.
 *
 * Result in radians.
 */
M.ApogeeParallax = function (year) { // (year float64)  float64
  return new La(year, 0.5).ap()
}

const p = Math.PI / 180

class La {
  constructor (y, h) { // (y, h float64)  *la
    this.k = snap(y, h)
    this.T = this.k * ck // (50.3) p. 350
    this.D = base.horner(this.T, 171.9179 * p, 335.9106046 * p / ck,
    -0.0100383 * p, -0.00001156 * p, 0.000000055 * p)
    this.M = base.horner(this.T, 347.3477 * p, 27.1577721 * p / ck,
    -0.000813 * p, -0.000001 * p)
    this.F = base.horner(this.T, 316.6109 * p, 364.5287911 * p / ck,
    -0.0125053 * p, -0.0000148 * p)
    return this
  }

  /**
   * perigee correction
   */
  pc () {
    let l = this
    return -1.6769 * Math.sin(2 * l.D) +
    0.4589 * Math.sin(4 * l.D) +
    -0.1856 * Math.sin(6 * l.D) +
    0.0883 * Math.sin(8 * l.D) +
    (-0.0773 + 0.00019 * l.T) * Math.sin(2 * l.D - l.M) +
    (0.0502 - 0.00013 * l.T) * Math.sin(l.M) +
    -0.046 * Math.sin(10 * l.D) +
    (0.0422 - 0.00011 * l.T) * Math.sin(4 * l.D - l.M) +
    -0.0256 * Math.sin(6 * l.D - l.M) +
    0.0253 * Math.sin(12 * l.D) +
    0.0237 * Math.sin(l.D) +
    0.0162 * Math.sin(8 * l.D - l.M) +
    -0.0145 * Math.sin(14 * l.D) +
    0.0129 * Math.sin(2 * l.F) +
    -0.0112 * Math.sin(3 * l.D) +
    -0.0104 * Math.sin(10 * l.D - l.M) +
    0.0086 * Math.sin(16 * l.D) +
    0.0069 * Math.sin(12 * l.D - l.M) +
    0.0066 * Math.sin(5 * l.D) +
    -0.0053 * Math.sin(2 * (l.D + l.F)) +
    -0.0052 * Math.sin(18 * l.D) +
    -0.0046 * Math.sin(14 * l.D - l.M) +
    -0.0041 * Math.sin(7 * l.D) +
    0.004 * Math.sin(2 * l.D + l.M) +
    0.0032 * Math.sin(20 * l.D) +
    -0.0032 * Math.sin(l.D + l.M) +
    0.0031 * Math.sin(16 * l.D - l.M) +
    -0.0029 * Math.sin(4 * l.D + l.M) +
    0.0027 * Math.sin(9 * l.D) +
    0.0027 * Math.sin(4 * l.D + 2 * l.F) +
    -0.0027 * Math.sin(2 * (l.D - l.M)) +
    0.0024 * Math.sin(4 * l.D - 2 * l.M) +
    -0.0021 * Math.sin(6 * l.D - 2 * l.M) +
    -0.0021 * Math.sin(22 * l.D) +
    -0.0021 * Math.sin(18 * l.D - l.M) +
    0.0019 * Math.sin(6 * l.D + l.M) +
    -0.0018 * Math.sin(11 * l.D) +
    -0.0014 * Math.sin(8 * l.D + l.M) +
    -0.0014 * Math.sin(4 * l.D - 2 * l.F) +
    -0.0014 * Math.sin(6 * l.D + 2 * l.F) +
    0.0014 * Math.sin(3 * l.D + l.M) +
    -0.0014 * Math.sin(5 * l.D + l.M) +
    0.0013 * Math.sin(13 * l.D) +
    0.0013 * Math.sin(20 * l.D - l.M) +
    0.0011 * Math.sin(3 * l.D + 2 * l.M) +
    -0.0011 * Math.sin(2 * (2 * l.D + l.F - l.M)) +
    -0.001 * Math.sin(l.D + 2 * l.M) +
    -0.0009 * Math.sin(22 * l.D - l.M) +
    -0.0008 * Math.sin(4 * l.F) +
    0.0008 * Math.sin(6 * l.D - 2 * l.F) +
    0.0008 * Math.sin(2 * (l.D - l.F) + l.M) +
    0.0007 * Math.sin(2 * l.M) +
    0.0007 * Math.sin(2 * l.F - l.M) +
    0.0007 * Math.sin(2 * l.D + 4 * l.F) +
    -0.0006 * Math.sin(2 * (l.F - l.M)) +
    -0.0006 * Math.sin(2 * (l.D - l.F + l.M)) +
    0.0006 * Math.sin(24 * l.D) +
    0.0005 * Math.sin(4 * (l.D - l.F)) +
    0.0005 * Math.sin(2 * (l.D + l.M)) +
    -0.0004 * Math.sin(l.D - l.M)
  }

  /**
   * apogee correction
   */
  ac () {
    let l = this
    return 0.4392 * Math.sin(2 * l.D) +
    0.0684 * Math.sin(4 * l.D) +
    (0.0456 - 0.00011 * l.T) * Math.sin(l.M) +
    (0.0426 - 0.00011 * l.T) * Math.sin(2 * l.D - l.M) +
    0.0212 * Math.sin(2 * l.F) +
    -0.0189 * Math.sin(l.D) +
    0.0144 * Math.sin(6 * l.D) +
    0.0113 * Math.sin(4 * l.D - l.M) +
    0.0047 * Math.sin(2 * (l.D + l.F)) +
    0.0036 * Math.sin(l.D + l.M) +
    0.0035 * Math.sin(8 * l.D) +
    0.0034 * Math.sin(6 * l.D - l.M) +
    -0.0034 * Math.sin(2 * (l.D - l.F)) +
    0.0022 * Math.sin(2 * (l.D - l.M)) +
    -0.0017 * Math.sin(3 * l.D) +
    0.0013 * Math.sin(4 * l.D + 2 * l.F) +
    0.0011 * Math.sin(8 * l.D - l.M) +
    0.001 * Math.sin(4 * l.D - 2 * l.M) +
    0.0009 * Math.sin(10 * l.D) +
    0.0007 * Math.sin(3 * l.D + l.M) +
    0.0006 * Math.sin(2 * l.M) +
    0.0005 * Math.sin(2 * l.D + l.M) +
    0.0005 * Math.sin(2 * (l.D + l.M)) +
    0.0004 * Math.sin(6 * l.D + 2 * l.F) +
    0.0004 * Math.sin(6 * l.D - 2 * l.M) +
    0.0004 * Math.sin(10 * l.D - l.M) +
    -0.0004 * Math.sin(5 * l.D) +
    -0.0004 * Math.sin(4 * l.D - 2 * l.F) +
    0.0003 * Math.sin(2 * l.F + l.M) +
    0.0003 * Math.sin(12 * l.D) +
    0.0003 * Math.sin(2 * l.D + 2 * l.F - l.M) +
    -0.0003 * Math.sin(l.D - l.M)
  }

  /**
   * apogee parallax
   */
  ap () {
    const s = Math.PI / 180 / 3600
    let l = this
    return 3245.251 * s +
    -9.147 * s * Math.cos(2 * l.D) +
    -0.841 * s * Math.cos(l.D) +
    0.697 * s * Math.cos(2 * l.F) +
    (-0.656 * s + 0.0016 * s * l.T) * Math.cos(l.M) +
    0.355 * s * Math.cos(4 * l.D) +
    0.159 * s * Math.cos(2 * l.D - l.M) +
    0.127 * s * Math.cos(l.D + l.M) +
    0.065 * s * Math.cos(4 * l.D - l.M) +
    0.052 * s * Math.cos(6 * l.D) +
    0.043 * s * Math.cos(2 * l.D + l.M) +
    0.031 * s * Math.cos(2 * (l.D + l.F)) +
    -0.023 * s * Math.cos(2 * (l.D - l.F)) +
    0.022 * s * Math.cos(2 * (l.D - l.M)) +
    0.019 * s * Math.cos(2 * (l.D + l.M)) +
    -0.016 * s * Math.cos(2 * l.M) +
    0.014 * s * Math.cos(6 * l.D - l.M) +
    0.01 * s * Math.cos(8 * l.D)
  }
}
