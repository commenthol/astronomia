/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
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

const base = require('./base')
const coord = require('./coord')
const precess = require('./precess')

const M = exports

function sum (t, series) {
  let coeffs = []
  Object.keys(series).forEach((x) => {
    coeffs[x] = 0
    let y = series[x].length - 1
    for (y; y >= 0; y--) {
      let term = {
        a: series[x][y][0],
        b: series[x][y][1],
        c: series[x][y][2]
      }
      coeffs[x] += term.a * Math.cos(term.b + term.c * t)
    }
  })
  let res = base.horner(t, coeffs)
  return res
}

class Planet {
  constructor (planet) {
    this.name = planet.toLowerCase()
    this.series = require('../data/vsop87B' + this.name)
  }

  /**
   * Position2000 returns ecliptic position of planets by full VSOP87 theory.
   *
   * @param jde - the date for which positions are desired.
   * @returns {Object} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position2000 (jde) {
    let T = base.J2000Century(jde)
    let τ = T * 0.1
    let lon = base.pmod(sum(τ, this.series.L), 2 * Math.PI)
    let lat = sum(τ, this.series.B)
    let range = sum(τ, this.series.R)
    return {lon, lat, range}
  }

  /**
   * Position returns ecliptic position of planets at equinox and ecliptic of date.
   *
   * @param jde - the date for which positions are desired.
   * @returns {Object} Results are positions consistent with those from Meeus's
   * Apendix III, that is, at equinox and ecliptic of date.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position (jde) {
    let {lat, lon, range} = this.position2000(jde)
    let eclFrom = new coord.Ecliptic(lon, lat)
    let epochFrom = 2000.0
    let epochTo = base.JDEToJulianYear(jde)
    let eclTo = precess.eclipticPosition(eclFrom, epochFrom, epochTo, 0, 0)
    return {
      lon: eclTo.lon,
      lat: eclTo.lat,
      range: range
    }
  }
}
M.Planet = Planet

/**
 * ToFK5 converts ecliptic longitude and latitude from dynamical frame to FK5.
 * (L, B, jde float64) (L5, B5 float64)
 */
M.toFK5 = function (L, B, jde) {
  // formula 32.3, p. 219.
  let T = base.J2000Century(jde)
  let Lp = L - 1.397 * Math.PI / 180 * T - 0.00031 * Math.PI / 180 * T * T
  let [sLp, cLp] = base.sincos(Lp)
  // (32.3) p. 219
  let L5 = L + -0.09033 / 3600 * Math.PI / 180 +
    0.03916 / 3600 * Math.PI / 180 * (cLp + sLp) * Math.tan(B)
  let B5 = B + 0.03916 / 3600 * Math.PI / 180 * (cLp - sLp)
  return [L5, B5]
}
