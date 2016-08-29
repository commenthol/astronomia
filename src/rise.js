/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module rise
 */
/**
 * Rise: Chapter 15, Rising, Transit, and Setting.
 */

const base = require('./base')
const interp = require('./interpolation')
const sexa = require('./sexagesimal')

const M = exports

const meanRefraction = new sexa.Angle(false, 0, 34, 0).rad()

/**
 * "Standard altitudes" for various bodies.
 *
 * The standard altitude is the geometric altitude of the center of body
 * at the time of apparent rising or setting.
 */
M.Stdh0Stellar = new sexa.Angle(true, 0, 34, 0).rad()
M.Stdh0Solar = new sexa.Angle(true, 0, 50, 0).rad()
M.Stdh0LunarMean = new sexa.Angle(false, 0, 0, 0.125).rad()

/**
 * Stdh0Lunar is the standard altitude of the Moon considering π, the
 * Moon's horizontal parallax.
 */
M.Stdh0Lunar = function (π) { // (π float64)  float64
  return new sexa.Angle(false, 0, 0, 0.7275).rad() * π - meanRefraction
}

/**
 * ErrorCircumpolar returned by Times when the object does not rise and
 * set on the day of interest.
 */
const errorCircumpolar = new Error('Circumpolar')

/**
 * ApproxTimes computes approximate UT rise, transit and set times for
 * a celestial object on a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * values computed from the day.
 *
 *  p is geographic coordinates of observer.
 *  h0 is "standard altitude" of the body.
 *  Th0 is apparent sidereal time at 0h UT at Greenwich.
 *  α, δ are right ascension and declination of the body.
 *
 * h0 unit is radians.
 *
 * Th0 must be the time on the day of interest, in seconds.
 * See sidereal.apparent0UT.
 *
 * α, δ must be values at 0h dynamical time for the day of interest.
 * Units are radians.
 *
 * Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.approxTimes = function (p, h0, Th0, α, δ) { // (p globe.Coord, h0, Th0 float64, α, δ float64)  (mRise, mTransit, mSet float64, err error)
  // Meeus works in a crazy mix of units.
  // This function and Times work with seconds of time as much as possible.

  // approximate local hour angle
  let [sLat, cLat] = base.sincos(p.lat)
  let [sδ1, cδ1] = base.sincos(δ)
  let cH0 = (Math.sin(h0) - sLat * sδ1) / (cLat * cδ1) // (15.1) p. 102
  if (cH0 < -1 || cH0 > 1) {
    throw errorCircumpolar
  }
  let H0 = Math.acos(cH0) * 43200 / Math.PI

  // approximate transit, rise, set times.
  // (15.2) p. 102.0
  let mt = (α + p.lon) * 43200 / Math.PI - Th0
  let mTransit = base.pmod(mt, 86400)
  let mRise = base.pmod(mt - H0, 86400)
  let mSet = base.pmod(mt + H0, 86400)
  return [mRise, mTransit, mSet]
}

/**
 * Times computes UT rise, transit and set times for a celestial object on
 * a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * a number of values computed from the day.
 *
 *  p is geographic coordinates of observer.
 *  ΔT is delta T.
 *  h0 is "standard altitude" of the body.
 *  Th0 is apparent sidereal time at 0h UT at Greenwich.
 *  α3, δ3 are slices of three right ascensions and declinations.
 *
 * ΔT unit is seconds.  See package deltat.
 *
 * h0 unit is radians.
 *
 * Th0 must be the time on the day of interest, in seconds.
 * See sidereal.apparent0UT.
 *
 * α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 * and the day after the day of interest.  Units are radians.
 *
 * Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.times = function (p, ΔT, h0, Th0, α3, δ3) { // (p globe.Coord, ΔT, h0, Th0 float64, α3, δ3 []float64)  (mRise, mTransit, mSet float64, err error)
  let [mRise, mTransit, mSet] = M.approxTimes(p, h0, Th0, α3[1], δ3[1])
  let d3α = new interp.Len3(-86400, 86400, α3)
  let d3δ = new interp.Len3(-86400, 86400, δ3)

  // adjust mTransit
  let th0 = base.pmod(Th0 + mTransit * 360.985647 / 360, 86400)
  let α = d3α.interpolateX(mTransit + ΔT)
  let H = th0 - (p.lon + α) * 43200 / Math.PI
  mTransit -= H

  // adjust mRise, mSet
  let [sLat, cLat] = base.sincos(p.lat)

  let adjustRS = function (m) { // (float64, error) {
    let th0 = base.pmod(Th0 + m * 360.985647 / 360, 86400)
    let ut = m + ΔT
    let α = d3α.interpolateX(ut)
    let δ = d3δ.interpolateX(ut)
    let H = th0 - (p.lon + α) * 43200 / Math.PI
    let [sδ, cδ] = base.sincos(δ)
    let h = sLat * sδ + cLat * cδ * Math.cos(H)
    return m + (h - h0) / cδ * cLat * Math.sin(H)
  }
  mRise = adjustRS(mRise)
  mSet = adjustRS(mSet)
  return [mRise, mTransit, mSet]
}
