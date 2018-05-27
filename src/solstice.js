/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solstice
 */
/**
 * Solstice: Chapter 27: Equinoxes and Solstices.
 */

import base from './base'
import solar from './solar'
const {abs, cos, sin} = Math
const D2R = Math.PI / 180

// table 27.a - for years from -1000 to +1000
const mc0 = [1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071]
const jc0 = [1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025]
const sc0 = [1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074]
const dc0 = [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006]

// table 27.b - for years from +1000 to +3000
const mc2 = [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057]
const jc2 = [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030]
const sc2 = [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078]
const dc2 = [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032]

// table 27.c
const terms = (function () {
  const term = [
    [485, 324.96, 1934.136],
    [203, 337.23, 32964.467],
    [199, 342.08, 20.186],
    [182, 27.85, 445267.112],
    [156, 73.14, 45036.886],
    [136, 171.52, 22518.443],
    [77, 222.54, 65928.934],
    [74, 296.72, 3034.906],
    [70, 243.58, 9037.513],
    [58, 119.81, 33718.147],
    [52, 297.17, 150.678],
    [50, 21.02, 2281.226],
    [45, 247.54, 29929.562],
    [44, 325.15, 31555.956],
    [29, 60.93, 4443.417],
    [18, 155.12, 67555.328],
    [17, 288.79, 4562.452],
    [16, 198.04, 62894.029],
    [14, 199.76, 31436.921],
    [12, 95.39, 14577.848],
    [12, 287.11, 31931.756],
    [12, 320.81, 34777.259],
    [9, 227.73, 1222.114],
    [8, 15.45, 16859.074]
  ]
  return term.map((t) => {
    return {
      a: t[0],
      b: t[1],
      c: t[2]
    }
  })
})()

/**
 * March returns the JDE of the March equinox for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export function march (y) {
  if (y < 1000) {
    return eq(y, mc0)
  }
  return eq(y - 2000, mc2)
}

/**
 * June returns the JDE of the June solstice for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export function june (y) {
  if (y < 1000) {
    return eq(y, jc0)
  }
  return eq(y - 2000, jc2)
}

/**
 * September returns the JDE of the September equinox for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export function september (y) {
  if (y < 1000) {
    return eq(y, sc0)
  }
  return eq(y - 2000, sc2)
}

/**
 * December returns the JDE of the December solstice for a given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export function december (y) {
  if (y < 1000) {
    return eq(y, dc0)
  }
  return eq(y - 2000, dc2)
}

/**
 * Fast calculation of solstices/ equinoxes
 * Accuracy is within one minute of time for the years 1951-2050.
 *
 * @param {Number} y - (int) year
 * @param {Array} c - term from table 27.a / 27.b
 * @returns {Number} JDE
 */
function eq (y, c) {
  const J0 = base.horner(y * 0.001, c)
  const T = base.J2000Century(J0)
  const W = 35999.373 * D2R * T - 2.47 * D2R
  const Δλ = 1 + 0.0334 * cos(W) + 0.0007 * cos(2 * W)
  let S = 0
  for (let i = terms.length - 1; i >= 0; i--) {
    const t = terms[i]
    S += t.a * cos((t.b + t.c * T) * D2R)
  }
  return J0 + 0.00001 * S / Δλ
}

/**
 * March2 returns a more accurate JDE of the March equinox.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {planetposition.Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export function march2 (year, planet) {
  return longitude(year, planet, 0)
}

/**
 * June2 returns a more accurate JDE of the June solstice.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {planetposition.Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export function june2 (year, planet) {
  return longitude(year, planet, Math.PI / 2)
}

/**
 * September2 returns a more accurate JDE of the September equinox.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {planetposition.Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export function september2 (year, planet) {
  return longitude(year, planet, Math.PI)
}

/**
 * December2 returns a more accurate JDE of the December solstice.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {planetposition.Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export function december2 (year, planet) {
  return longitude(year, planet, Math.PI * 3 / 2)
}

/**
 * Longitude returns the JDE for a given `year`, VSOP87 Planet `planet` at a
 * given geocentric solar longitude `lon`
 * @param {Number} year - (int)
 * @param {planetposition.Planet} planet
 * @param {Number} lon - geocentric solar longitude in radians
 * @returns {Number} JDE
 */
export function longitude (year, planet, lon) {
  let c
  let ct

  if (year < 1000) {
    ct = [mc0, jc0, sc0, dc0]
  } else {
    ct = [mc2, jc2, sc2, dc2]
    year -= 2000
  }

  lon = lon % (Math.PI * 2)

  if (lon < Math.PI / 2) {
    c = ct[0]
  } else if (lon < Math.PI) {
    c = ct[1]
  } else if (lon < Math.PI * 3 / 2) {
    c = ct[2]
  } else {
    c = ct[3]
  }

  return eq2(year, planet, lon, c)
}

/**
  * Accurate calculation of solstices/ equinoxes
  * Result is accurate to one second of time.
  *
  * @param {Number} year - (int) year
  * @param {planetposition.Planet} planet - vsop87 planet
  * @param {Number} lon - longitude in radians
  * @param {Array} c - term from table 27.a / 27.b
  * @returns {Number} JDE
  */
function eq2 (year, planet, lon, c) {
  let J0 = base.horner(year * 0.001, c)

  for (;;) {
    const a = solar.apparentVSOP87(planet, J0)
    const c = 58 * sin(lon - a.lon) // (27.1) p. 180
    J0 += c
    if (abs(c) < 0.000005) {
      break
    }
  }

  return J0
}

export default {
  march,
  june,
  september,
  december,
  march2,
  june2,
  september2,
  december2,
  longitude
}
