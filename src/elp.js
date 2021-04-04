/**
 * @copyright 2020 mdmunir
 * @copyright 2020 commenthol
 * @license MIT
 * @module elp
 */

/**
 * Elp Mpp02
 * source ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02/elpmpp02.pdf
 */

import base, { Coord } from './base.js'

const SEC2RAD = 1 / 3600 * Math.PI / 180

function sum (T, series) {
  const coeffs = []
  Object.keys(series).forEach((x) => {
    coeffs[x] = 0.0
    let y = series[x].length - 1
    for (y; y >= 0; y--) {
      // A, t0, t1, t2, t3, t4
      const row = series[x][y]
      const φ = base.horner(T, row.slice(1))
      coeffs[x] += row[0] * Math.sin(φ)
    }
  })
  return base.horner(T, ...coeffs)
}

/**
 *
 */
export class Moon {
  /**
   * ELP representation of a Moon
   * @constructs Moon
   * @param {object} data - elp data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia.js'
   * const moon = new elp.Moon(data.elpMppDe)
   * ```
   */
  constructor (data) {
    if (typeof data !== 'object') throw new TypeError('need Elp data')
    this.series = data
  }

  _calcLBR (T) {
    const L = base.horner(T, this.series.W1) + sum(T, this.series.L) * SEC2RAD
    const B = sum(T, this.series.B) * SEC2RAD
    const R = sum(T, this.series.R)
    return { L: base.pmod(L, 2 * Math.PI), B, R }
  }

  /**
   * Position returns rectangular coordinates referred to the inertial mean ecliptic and equinox of J2000.
   * @param {Number} jde - Julian ephemeris day
   * @return {object} rectangular coordinates
   *   {Number} x
   *   {Number} y
   *   {Number} z
   */
  positionXYZ (jde) {
    const T = base.J2000Century(jde)
    const { L, B, R } = this._calcLBR(T)

    const x = R * Math.cos(L) * Math.cos(B)
    const y = R * Math.sin(L) * Math.cos(B)
    const z = R * Math.sin(B)

    const P = base.horner(T, 0, 0.10180391e-4, 0.47020439e-6, -0.5417367e-9, -0.2507948e-11, 0.463486e-14)
    const Q = base.horner(T, 0, -0.113469002e-3, 0.12372674e-6, 0.12654170e-8, -0.1371808e-11, -0.320334e-14)
    const sq = Math.sqrt(1 - P * P - Q * Q)
    const p11 = 1 - 2 * P * P
    const p12 = 2 * P * Q
    const p13 = 2 * P * sq
    const p21 = 2 * P * Q
    const p22 = 1 - 2 * Q * Q
    const p23 = -2 * Q * sq
    const p31 = -2 * P * sq
    const p32 = 2 * Q * sq
    const p33 = 1 - 2 * P * P - 2 * Q * Q

    const result = {
      x: p11 * x + p12 * y + p13 * z,
      y: p21 * x + p22 * y + p23 * z,
      z: p31 * x + p32 * y + p33 * z
    }
    return result
  }

  /**
   * Delay effect of light time
   *
   * @param {Number} jde - Julian ephemeris day
   * @returns {Number} Delay time in days
   */
  lightTime (jde) {
    const T = base.J2000Century(jde)
    const R = sum(T, this.series.R)
    return base.lightTime(R / base.AU)
  }

  /**
   * Position returns ecliptic position of moon at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are positions consistent with those elp data,
   * that is, at equinox and ecliptic of date.
   *  {Number} lon - geocentric longitude in radians.
   *  {Number} lat - geocentric latitude in radians.
   *  {Number} range - geocentric range in KM.
   */
  position (jde) {
    const T = base.J2000Century(jde)
    const { L, B, R } = this._calcLBR(T)

    // precession
    const pA = base.horner(T, 0, 5029.0966 - 0.29965, 1.1120, 0.000077, -0.00002353) * SEC2RAD
    return new Coord(
      base.pmod(L + pA, 2 * Math.PI),
      B,
      R)
  }
}

/**
 * Position returns the true geometric position of the moon as ecliptic coordinates.
 *
 * Result computed by Elp theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {Object} elpData
 * @param {Number} jde - Julian ephemeris day
 * @returns {Object}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in KM
 */
export function position (elpData, jde) {
  const moon = new Moon(elpData)
  return moon.position(jde)
}

export default {
  Moon,
  position
}
