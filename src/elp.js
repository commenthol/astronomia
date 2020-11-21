/**
 * @copyright 2020 mdmunir
 * @copyright 2020 commenthol
 * @license MIT
 * @module elp
 */

/**
 * Elp Mpp02
 * source ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02/elpmpp02.pdf
 * 
 */

import base from './base'
import coord from './coord'
import { eclipticPosition } from './precess'

const SEC2RAD = 1 / 3600 * Math.PI / 180

function sum(T, series) {
  const coeffs = []
  series.forEach((rows, index) => {
    coeffs[index] = 0.0
    let y = rows.length - 1
    for (y; y >= 0; y--) {
      // A, t0, t1, t2, t3, t4
      const row = rows[y]
      let φ = base.horner(T, row.slice(1))
      coeffs[index] += row[0] * Math.sin(φ)
    }
  })
  return base.horner(T, coeffs)
}


/**
 * 
 * @param {Number} T 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z 
 */
export function precess(T, x, y, z) {
  let P = base.horner(T, 0, 0.10180391e-4, 0.47020439e-6, -0.5417367e-9, -0.2507948e-11, 0.463486e-14)
  let Q = base.horner(T, 0, -0.113469002e-3, 0.12372674e-6, 0.12654170e-8, -0.1371808e-11, -0.320334e-14)
  var sq = Math.sqrt(1 - P * P - Q * Q)
  let p11 = 1 - 2 * P * P,
    p12 = 2 * P * Q,
    p13 = 2 * P * sq
  let p21 = 2 * P * Q,
    p22 = 1 - 2 * Q * Q,
    p23 = -2 * Q * sq
  let p31 = -2 * P * sq,
    p32 = 2 * Q * sq,
    p33 = 1 - 2 * P * P - 2 * Q * Q

  const result = {
    x: p11 * x + p12 * y + p13 * z,
    y: p21 * x + p22 * y + p23 * z,
    z: p31 * x + p32 * y + p33 * z,
  }
  return result
}

class Moon {
  /**
   * ELP representation of a Moon
   * @constructs Moon
   * @param {object} data - elp data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia'
   * const moon = new elp.Moon(data.elpMppDe)
   * ```
   */
  constructor(data) {
    if (typeof data !== 'object') throw new TypeError('need Elp data')
    this.series = data
  }

  /**
   * Position returns rectangular coordinates referenced to the mean equinox of date.
   * @param {Number} jde - Julian ephemeris day
   * @return {object} rectangular coordinates
   *   {Number} x
   *   {Number} y
   *   {Number} z
   */
  positionXYZ(jde) {
    const T = base.J2000Century(jde)

    let lon = base.horner(T, this.series.W) + sum(T, this.series.L) * SEC2RAD
    let lat = sum(T, this.series.B) * SEC2RAD
    let R = sum(T, this.series.R)

    let x = R * Math.cos(lon) * Math.cos(lat)
    let y = R * Math.sin(lon) * Math.cos(lat)
    let z = R * Math.sin(lat)

    return precess(T, x, y, z)
  }

  /**
   * Position2000 returns ecliptic position of moon by Elp Mpp theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {base.Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - geocentric longitude in radians.
   *  {Number} lat - geocentric latitude in radians.
   *  {Number} range - geocentric range in KM.
   */
  position2000(jde) {
    let { x, y, z } = this.positionXYZ(jde)
    let range = Math.hypot(x, y, z)
    let lat = Math.asin(z / range)
    let lon = Math.atan2(y, x)

    return new base.Coord(lon, lat, range)
  }

  /**
   * Position returns ecliptic position of moon at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {base.Coord} Results are positions consistent with those elp data,
   * that is, at equinox and ecliptic of date.
   *  {Number} lon - geocentric longitude in radians.
   *  {Number} lat - geocentric latitude in radians.
   *  {Number} range - geocentric range in KM.
   */
  position(jde) {
    const { lat, lon, range } = this.position2000(jde)
    const eclFrom = new coord.Ecliptic(lon, lat)
    const epochFrom = 2000.0
    const epochTo = base.JDEToJulianYear(jde)
    const eclTo = eclipticPosition(eclFrom, epochFrom, epochTo, 0, 0)
    return new base.Coord(
      eclTo.lon,
      eclTo.lat,
      range
    )
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
export function position(elpData, jde) {
  const moon = new Moon(elpData)
  return moon.position(jde)
}

export default {
  Moon,
  position,
  precess
}
