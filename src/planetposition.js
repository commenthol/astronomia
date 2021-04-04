/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetposition
 */
/**
 * Planetposition: Chapter 32, Positions of the Planets.
 *
 * Incomplete:
 *
 * 1. The package does not implement algorithms that use appendix III,
 * but instead implements a full VSOP87 solution.  I do not have a copy
 * of the supplimentary disk with appendix III in machine readable form
 * and as the appendix is rather large, retyping it by hand is problematic.
 * The full VSOP87 data set on the other hand is freely downloadable from
 * the internet, so I implement here code that can use that data directly.
 *
 * 2. The formula for accuracy of results is not implemented.  It is
 * not needed for full VSOP87 solutions.
 *
 * 3. Polynomial expressions are not implemented.  Again, implementation
 * would involve typing rather large tables of numbers with associated
 * risk of typographical errors.
 */

import base, { Coord } from './base.js' // eslint-disable-line no-unused-vars
import sexa from './sexagesimal.js'
import coord from './coord.js'
import precess from './precess.js'

function sum (t, series) {
  const coeffs = []
  Object.keys(series).forEach((x) => {
    coeffs[x] = 0
    let y = series[x].length - 1
    for (y; y >= 0; y--) {
      const term = {
        a: series[x][y][0],
        b: series[x][y][1],
        c: series[x][y][2]
      }
      coeffs[x] += term.a * Math.cos(term.b + term.c * t)
    }
  })
  const res = base.horner(t, ...coeffs)
  return res
}

export class Planet {
  /**
   * VSOP87 representation of a Planet
   * @constructs Planet
   * @param {object} planet - planet data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia'
   * const earth = new planetposition.Planet(data.vsop87Bearth)
   * ```
   */
  constructor (planet) {
    if (typeof planet !== 'object') throw new TypeError('need planet vsop87 data')
    this.name = planet.name
    this.type = planet.type || 'B'
    this.series = planet
  }

  /**
   * Position2000 returns ecliptic position of planets by full VSOP87 theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position2000 (jde) {
    const T = base.J2000Century(jde)
    const τ = T * 0.1
    const lon = base.pmod(sum(τ, this.series.L), 2 * Math.PI)
    const lat = sum(τ, this.series.B)
    const range = sum(τ, this.series.R)

    switch (this.type) {
      case 'B':
        return new base.Coord(lon, lat, range)
      case 'D': {
        const eclFrom = new coord.Ecliptic(lon, lat)
        const epochFrom = base.JDEToJulianYear(jde)
        const epochTo = 2000.0
        const eclTo = precess.eclipticPosition(eclFrom, epochFrom, epochTo)
        return new base.Coord(eclTo.lon, eclTo.lat, range)
      }
    }
  }

  /**
   * Position returns ecliptic position of planets at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are positions consistent with those from Meeus's
   * Apendix III, that is, at equinox and ecliptic of date.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position (jde) {
    const T = base.J2000Century(jde)
    const τ = T * 0.1
    const lon = base.pmod(sum(τ, this.series.L), 2 * Math.PI)
    const lat = sum(τ, this.series.B)
    const range = sum(τ, this.series.R)

    switch (this.type) {
      case 'B': {
        const eclFrom = new coord.Ecliptic(lon, lat)
        const epochFrom = 2000.0
        const epochTo = base.JDEToJulianYear(jde)
        const eclTo = precess.eclipticPosition(eclFrom, epochFrom, epochTo)
        return new base.Coord(eclTo.lon, eclTo.lat, range)
      }
      case 'D':
        return new base.Coord(lon, lat, range)
    }
  }
}

/**
 * ToFK5 converts ecliptic longitude and latitude from dynamical frame to FK5.
 *
 * @param {Number} lon - ecliptic longitude in radians
 * @param {Number} lat - ecliptic latitude in radians
 * @param {Number} jde - Julian ephemeris day
 * @return {Coord}
 *    {Number} lon - FK5 longitude
 *    {Number} lat - FK5 latitude
 */
export function toFK5 (lon, lat, jde) {
  // formula 32.3, p. 219.
  const T = base.J2000Century(jde)
  // const Lp = lon - 1.397 * Math.PI / 180 * T - 0.00031 * Math.PI / 180 * T * T
  const Lp = lon - sexa.angleFromDeg((1.397 + 0.00031 * T) * T)
  const [sLp, cLp] = base.sincos(Lp)
  // (32.3) p. 219
  const L5 = lon + sexa.angleFromSec(-0.09033 + 0.03916 * (cLp + sLp) * Math.tan(lat))
  const B5 = lat + sexa.angleFromSec(0.03916 * (cLp - sLp))
  return new base.Coord(L5, B5)
}

export default {
  Planet,
  toFK5
}
