/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Apsis: Chapter 50, Perigee and apogee of the Moon
 */

const base = require('./base')

const M = exports

/**
 * conversion factor from k to T, given in (50.3) p. 356
 */
const ck = 1 / 1325.55

const p = Math.PI / 180

// from http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
const EARTH_RADIUS = 6378.137 // km
// from http://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
const MOON_RADIUS = M.MOON_RADIUS = 1738.1 // km

/**
 * mean time of perigee or apogee
 * (50.1) p. 355
 */
const mean = function (T) {
  return base.horner(T, 2451534.6698, 27.55454989 / ck,
    -0.0006691, -0.000001098, 0.0000000052)
}

/**
 * snap returns k at half h nearest year y.
 */
const snap = function (y, h) {
  let k = (y - 1999.97) * 13.2555 // (50.2) p. 355
  return Math.floor(k - h + 0.5) + h
}

/**
 * meanPerigee returns the jde of the mean perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
M.meanPerigee = function (year) {
  return mean(snap(year, 0) * ck)
}

/**
 * perigee returns the jde of perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
M.perigee = function (year) {
  let l = new La(year, 0)
  return mean(l.T) + l.perigeeCorr()
}

/**
 * meanApogee returns the jde of the mean apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
M.meanApogee = function (year) { // (year float64)  float64
  return mean(snap(year, 0.5) * ck)
}

/**
 * apogee returns the jde of apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
M.apogee = function (year) {
  let l = new La(year, 0.5)
  return mean(l.T) + l.apogeeCorr()
}

/**
 * apogeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
M.apogeeParallax = function (year) {
  return new La(year, 0.5).apogeeParallax()
}

/**
 * perigeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
M.perigeeParallax = function (year) {
  return new La(year, 0).perigeeParallax()
}

/**
 * Calculate the distance earth - moon using the parallax angle in radians
 *
 * @param {Number} parallax - parallax angle in radians
 * @return {Number} distance in `km`
 */
M.distance = function (parallax) {
  return EARTH_RADIUS / Math.sin(parallax) - MOON_RADIUS
}

class La {
  constructor (y, h) {
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
  perigeeCorr () {
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
  apogeeCorr () {
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
  apogeeParallax () {
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

  /**
   * perigee parallax
   */
  perigeeParallax () {
    const s = Math.PI / 180 / 3600
    let l = this
    return 3629.215 * s +
      63.224 * s * Math.cos(2 * l.D) +
      -6.990 * s * Math.cos(4 * l.D) +
      (2.834 * s - 0.0071 * l.T * s) * Math.cos(2 * l.D - l.M) +
      1.927 * s * Math.cos(6 * l.D) +
      -1.263 * s * Math.cos(l.D) +
      -0.702 * s * Math.cos(8 * l.D) +
      (0.696 * s - 0.0017 * l.T * s) * Math.cos(l.M) +
      -0.690 * s * Math.cos(2 * l.F) +
      (-0.629 * s + 0.0016 * l.T * s) * Math.cos(4 * l.D - l.M) +
      -0.392 * s * Math.cos(2 * (l.D - l.F)) +
      0.297 * s * Math.cos(10 * l.D) +
      0.260 * s * Math.cos(6 * l.D - l.M) +
      0.201 * s * Math.cos(3 * l.D) +
      -0.161 * s * Math.cos(2 * l.D + l.M) +
      0.157 * s * Math.cos(l.D + l.M) +
      -0.138 * s * Math.cos(12 * l.D) +
      -0.127 * s * Math.cos(8 * l.D - l.M) +
      0.104 * s * Math.cos(2 * (l.D + l.F)) +
      0.104 * s * Math.cos(2 * (l.D - l.M)) +
      -0.079 * s * Math.cos(5 * l.D) +
      0.068 * s * Math.cos(14 * l.D) +
      0.067 * s * Math.cos(10 * l.D - l.M) +
      0.054 * s * Math.cos(4 * l.D + l.M) +
      -0.038 * s * Math.cos(12 * l.D - l.M) +
      -0.038 * s * Math.cos(4 * l.D - 2 * l.M) +
      0.037 * s * Math.cos(7 * l.D) +
      -0.037 * s * Math.cos(4 * l.D + 2 * l.F) +
      -0.035 * s * Math.cos(16 * l.D) +
      -0.030 * s * Math.cos(3 * l.D + l.M) +
      0.029 * s * Math.cos(l.D - l.M) +
      -0.025 * s * Math.cos(6 * l.D + l.M) +
      0.023 * s * Math.cos(2 * l.M) +
      0.023 * s * Math.cos(14 * l.D - l.M) +
      -0.023 * s * Math.cos(2 * (l.D + l.M)) +
      0.022 * s * Math.cos(6 * l.D - 2 * l.M) +
      -0.021 * s * Math.cos(2 * l.D - 2 * l.F - l.M) +
      -0.020 * s * Math.cos(9 * l.D) +
      0.019 * s * Math.cos(18 * l.D) +
      0.017 * s * Math.cos(6 * l.D + 2 * l.F) +
      0.014 * s * Math.cos(2 * l.F - l.M) +
      -0.014 * s * Math.cos(16 * l.D - l.M) +
      0.013 * s * Math.cos(4 * l.D - 2 * l.F) +
      0.012 * s * Math.cos(8 * l.D + l.M) +
      0.011 * s * Math.cos(11 * l.D) +
      0.010 * s * Math.cos(5 * l.D + l.M) +
      -0.010 * s * Math.cos(20 * l.D)
  }
}
