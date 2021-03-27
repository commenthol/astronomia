/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apsis
 */
/**
 * Apsis: Chapter 50, Perigee and apogee of the Moon
 */

import base from './base.js'
const { sin, cos } = Math

/**
 * conversion factor from k to T, given in (50.3) p. 356
 */
const ck = 1 / 1325.55
const D2R = Math.PI / 180

// from http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
export const EARTH_RADIUS = 6378.137 // km
// from http://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
export const MOON_RADIUS = 1738.1 // km

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
  const k = (y - 1999.97) * 13.2555 // (50.2) p. 355
  return Math.floor(k - h + 0.5) + h
}

/**
 * meanPerigee returns the jde of the mean perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export function meanPerigee (year) {
  return mean(snap(year, 0) * ck)
}

/**
 * perigee returns the jde of perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export function perigee (year) {
  const l = new La(year, 0)
  return mean(l.T) + l.perigeeCorr()
}

/**
 * meanApogee returns the jde of the mean apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export function meanApogee (year) { // (year float64)  float64
  return mean(snap(year, 0.5) * ck)
}

/**
 * apogee returns the jde of apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export function apogee (year) {
  const l = new La(year, 0.5)
  return mean(l.T) + l.apogeeCorr()
}

/**
 * apogeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
export function apogeeParallax (year) {
  return new La(year, 0.5).apogeeParallax()
}

/**
 * perigeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
export function perigeeParallax (year) {
  return new La(year, 0).perigeeParallax()
}

/**
 * Calculate the distance earth - moon (center to center) using the parallax angle in radians
 *
 * @param {Number} parallax - parallax angle in radians
 * @return {Number} distance in `km`
 */
export function distance (parallax) {
  return EARTH_RADIUS / sin(parallax)
}

class La {
  constructor (y, h) {
    this.k = snap(y, h)
    this.T = this.k * ck // (50.3) p. 350
    this.D = base.horner(this.T, 171.9179 * D2R, 335.9106046 * D2R / ck,
      -0.0100383 * D2R, -0.00001156 * D2R, 0.000000055 * D2R)
    this.M = base.horner(this.T, 347.3477 * D2R, 27.1577721 * D2R / ck,
      -0.000813 * D2R, -0.000001 * D2R)
    this.F = base.horner(this.T, 316.6109 * D2R, 364.5287911 * D2R / ck,
      -0.0125053 * D2R, -0.0000148 * D2R)
    return this
  }

  /**
   * perigee correction
   */
  perigeeCorr () {
    const l = this
    return -1.6769 * sin(2 * l.D) +
    0.4589 * sin(4 * l.D) +
    -0.1856 * sin(6 * l.D) +
    0.0883 * sin(8 * l.D) +
    (-0.0773 + 0.00019 * l.T) * sin(2 * l.D - l.M) +
    (0.0502 - 0.00013 * l.T) * sin(l.M) +
    -0.046 * sin(10 * l.D) +
    (0.0422 - 0.00011 * l.T) * sin(4 * l.D - l.M) +
    -0.0256 * sin(6 * l.D - l.M) +
    0.0253 * sin(12 * l.D) +
    0.0237 * sin(l.D) +
    0.0162 * sin(8 * l.D - l.M) +
    -0.0145 * sin(14 * l.D) +
    0.0129 * sin(2 * l.F) +
    -0.0112 * sin(3 * l.D) +
    -0.0104 * sin(10 * l.D - l.M) +
    0.0086 * sin(16 * l.D) +
    0.0069 * sin(12 * l.D - l.M) +
    0.0066 * sin(5 * l.D) +
    -0.0053 * sin(2 * (l.D + l.F)) +
    -0.0052 * sin(18 * l.D) +
    -0.0046 * sin(14 * l.D - l.M) +
    -0.0041 * sin(7 * l.D) +
    0.004 * sin(2 * l.D + l.M) +
    0.0032 * sin(20 * l.D) +
    -0.0032 * sin(l.D + l.M) +
    0.0031 * sin(16 * l.D - l.M) +
    -0.0029 * sin(4 * l.D + l.M) +
    0.0027 * sin(9 * l.D) +
    0.0027 * sin(4 * l.D + 2 * l.F) +
    -0.0027 * sin(2 * (l.D - l.M)) +
    0.0024 * sin(4 * l.D - 2 * l.M) +
    -0.0021 * sin(6 * l.D - 2 * l.M) +
    -0.0021 * sin(22 * l.D) +
    -0.0021 * sin(18 * l.D - l.M) +
    0.0019 * sin(6 * l.D + l.M) +
    -0.0018 * sin(11 * l.D) +
    -0.0014 * sin(8 * l.D + l.M) +
    -0.0014 * sin(4 * l.D - 2 * l.F) +
    -0.0014 * sin(6 * l.D + 2 * l.F) +
    0.0014 * sin(3 * l.D + l.M) +
    -0.0014 * sin(5 * l.D + l.M) +
    0.0013 * sin(13 * l.D) +
    0.0013 * sin(20 * l.D - l.M) +
    0.0011 * sin(3 * l.D + 2 * l.M) +
    -0.0011 * sin(2 * (2 * l.D + l.F - l.M)) +
    -0.001 * sin(l.D + 2 * l.M) +
    -0.0009 * sin(22 * l.D - l.M) +
    -0.0008 * sin(4 * l.F) +
    0.0008 * sin(6 * l.D - 2 * l.F) +
    0.0008 * sin(2 * (l.D - l.F) + l.M) +
    0.0007 * sin(2 * l.M) +
    0.0007 * sin(2 * l.F - l.M) +
    0.0007 * sin(2 * l.D + 4 * l.F) +
    -0.0006 * sin(2 * (l.F - l.M)) +
    -0.0006 * sin(2 * (l.D - l.F + l.M)) +
    0.0006 * sin(24 * l.D) +
    0.0005 * sin(4 * (l.D - l.F)) +
    0.0005 * sin(2 * (l.D + l.M)) +
    -0.0004 * sin(l.D - l.M)
  }

  /**
   * apogee correction
   */
  apogeeCorr () {
    const l = this
    return 0.4392 * sin(2 * l.D) +
    0.0684 * sin(4 * l.D) +
    (0.0456 - 0.00011 * l.T) * sin(l.M) +
    (0.0426 - 0.00011 * l.T) * sin(2 * l.D - l.M) +
    0.0212 * sin(2 * l.F) +
    -0.0189 * sin(l.D) +
    0.0144 * sin(6 * l.D) +
    0.0113 * sin(4 * l.D - l.M) +
    0.0047 * sin(2 * (l.D + l.F)) +
    0.0036 * sin(l.D + l.M) +
    0.0035 * sin(8 * l.D) +
    0.0034 * sin(6 * l.D - l.M) +
    -0.0034 * sin(2 * (l.D - l.F)) +
    0.0022 * sin(2 * (l.D - l.M)) +
    -0.0017 * sin(3 * l.D) +
    0.0013 * sin(4 * l.D + 2 * l.F) +
    0.0011 * sin(8 * l.D - l.M) +
    0.001 * sin(4 * l.D - 2 * l.M) +
    0.0009 * sin(10 * l.D) +
    0.0007 * sin(3 * l.D + l.M) +
    0.0006 * sin(2 * l.M) +
    0.0005 * sin(2 * l.D + l.M) +
    0.0005 * sin(2 * (l.D + l.M)) +
    0.0004 * sin(6 * l.D + 2 * l.F) +
    0.0004 * sin(6 * l.D - 2 * l.M) +
    0.0004 * sin(10 * l.D - l.M) +
    -0.0004 * sin(5 * l.D) +
    -0.0004 * sin(4 * l.D - 2 * l.F) +
    0.0003 * sin(2 * l.F + l.M) +
    0.0003 * sin(12 * l.D) +
    0.0003 * sin(2 * l.D + 2 * l.F - l.M) +
    -0.0003 * sin(l.D - l.M)
  }

  /**
   * apogee parallax
   */
  apogeeParallax () {
    const s = Math.PI / 180 / 3600
    const l = this
    return 3245.251 * s +
    -9.147 * s * cos(2 * l.D) +
    -0.841 * s * cos(l.D) +
    0.697 * s * cos(2 * l.F) +
    (-0.656 * s + 0.0016 * s * l.T) * cos(l.M) +
    0.355 * s * cos(4 * l.D) +
    0.159 * s * cos(2 * l.D - l.M) +
    0.127 * s * cos(l.D + l.M) +
    0.065 * s * cos(4 * l.D - l.M) +
    0.052 * s * cos(6 * l.D) +
    0.043 * s * cos(2 * l.D + l.M) +
    0.031 * s * cos(2 * (l.D + l.F)) +
    -0.023 * s * cos(2 * (l.D - l.F)) +
    0.022 * s * cos(2 * (l.D - l.M)) +
    0.019 * s * cos(2 * (l.D + l.M)) +
    -0.016 * s * cos(2 * l.M) +
    0.014 * s * cos(6 * l.D - l.M) +
    0.01 * s * cos(8 * l.D)
  }

  /**
   * perigee parallax
   */
  perigeeParallax () {
    const s = Math.PI / 180 / 3600
    const l = this
    return 3629.215 * s +
      63.224 * s * cos(2 * l.D) +
      -6.990 * s * cos(4 * l.D) +
      (2.834 * s - 0.0071 * l.T * s) * cos(2 * l.D - l.M) +
      1.927 * s * cos(6 * l.D) +
      -1.263 * s * cos(l.D) +
      -0.702 * s * cos(8 * l.D) +
      (0.696 * s - 0.0017 * l.T * s) * cos(l.M) +
      -0.690 * s * cos(2 * l.F) +
      (-0.629 * s + 0.0016 * l.T * s) * cos(4 * l.D - l.M) +
      -0.392 * s * cos(2 * (l.D - l.F)) +
      0.297 * s * cos(10 * l.D) +
      0.260 * s * cos(6 * l.D - l.M) +
      0.201 * s * cos(3 * l.D) +
      -0.161 * s * cos(2 * l.D + l.M) +
      0.157 * s * cos(l.D + l.M) +
      -0.138 * s * cos(12 * l.D) +
      -0.127 * s * cos(8 * l.D - l.M) +
      0.104 * s * cos(2 * (l.D + l.F)) +
      0.104 * s * cos(2 * (l.D - l.M)) +
      -0.079 * s * cos(5 * l.D) +
      0.068 * s * cos(14 * l.D) +
      0.067 * s * cos(10 * l.D - l.M) +
      0.054 * s * cos(4 * l.D + l.M) +
      -0.038 * s * cos(12 * l.D - l.M) +
      -0.038 * s * cos(4 * l.D - 2 * l.M) +
      0.037 * s * cos(7 * l.D) +
      -0.037 * s * cos(4 * l.D + 2 * l.F) +
      -0.035 * s * cos(16 * l.D) +
      -0.030 * s * cos(3 * l.D + l.M) +
      0.029 * s * cos(l.D - l.M) +
      -0.025 * s * cos(6 * l.D + l.M) +
      0.023 * s * cos(2 * l.M) +
      0.023 * s * cos(14 * l.D - l.M) +
      -0.023 * s * cos(2 * (l.D + l.M)) +
      0.022 * s * cos(6 * l.D - 2 * l.M) +
      -0.021 * s * cos(2 * l.D - 2 * l.F - l.M) +
      -0.020 * s * cos(9 * l.D) +
      0.019 * s * cos(18 * l.D) +
      0.017 * s * cos(6 * l.D + 2 * l.F) +
      0.014 * s * cos(2 * l.F - l.M) +
      -0.014 * s * cos(16 * l.D - l.M) +
      0.013 * s * cos(4 * l.D - 2 * l.F) +
      0.012 * s * cos(8 * l.D + l.M) +
      0.011 * s * cos(11 * l.D) +
      0.010 * s * cos(5 * l.D + l.M) +
      -0.010 * s * cos(20 * l.D)
  }
}

export default {
  EARTH_RADIUS,
  MOON_RADIUS,
  meanPerigee,
  perigee,
  meanApogee,
  apogee,
  apogeeParallax,
  perigeeParallax,
  distance
}
