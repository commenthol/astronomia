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
const sidereal = require('./sidereal')
const deltat = require('./deltat')
const julian = require('./julian')

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

const SECS_PER_DEGREE = 240 // = 86400 / 360
const SECS_PER_DAY = 86400
const D2R = Math.PI / 180

class Rise {
  /**
   * @param {number} lat - geographic latitude in degrees
   * @param {number} lon - geographic longitude in degrees (measured positively westward)
   * @param {number} jd - Julian Day
   * @param {number} h0 - "standard altitude" of the body in radians
   * @param {number|Array<number>} α - right ascension of the body.
   * @param {number|Array<number>} δ - declination of the body.
   */
  constructor (lat, lon, jd, h0, α, δ) {
    this.jd = jd
    lat *= D2R // convert to radians
    lon *= D2R
    let Th0 = sidereal.apparent0UT(jd)
    if (this._isArr3(α) && this._isArr3(δ)) {
      let cal = new julian.Calendar().fromJD(jd)
      let ΔT = deltat.deltaT(cal.toYear())
      this._val = M.times({lat, lon}, ΔT, h0, Th0, α, δ)
    } else {
      this._val = M.approxTimes({lat, lon}, h0, Th0, α, δ)
    }
  }
  /**
   * @return {number} rise of body in julian days
   */
  rise () {
    return this._toJD(this._val[0])
  }
  /**
   * @return {number} transit of body in julian days
   */
  transit () {
    return this._toJD(this._val[1])
  }
  /**
   * @return {number} set of body in julian days
   */
  set () {
    return this._toJD(this._val[2])
  }
  /**
   * @private
   */
  _isArr3 (a) {
    return Array.isArray(a) && a.length === 3
  }
  /**
   * @private
   */
  _toJD (secs) {
    return this.jd + secs / 86400
  }
}
M.Rise = Rise

/**
 * @return {number} local angle in seconds per day `[0, 86400[`
 */
function _H (lat, h0, δ) {
  // approximate local hour angle
  let [sLat, cLat] = base.sincos(lat)
  let [sδ1, cδ1] = base.sincos(δ)
  let cosH = (Math.sin(h0) - sLat * sδ1) / (cLat * cδ1) // (15.1) p. 102
  if (cosH < -1 || cosH > 1) {
    throw errorCircumpolar
  }
  let H = Math.acos(cosH) * SECS_PER_DEGREE * 180 / Math.PI // in degrees per day === seconds
  return H
}

/**
 * @param {number} lon - longitude in radians
 * @param {number} α - right ascension in radians
 * @param {number} th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @return {number} time of transit in seconds of day `[0, 86400[`
 */
function _mt (lon, α, th0) {
  // let mt = (((lon + α) * 180 / Math.PI - (th0 * 360 / 86400)) * 86400 / 360)
  let mt = (lon + α) * SECS_PER_DEGREE * 180 / Math.PI - th0
  return mt
}

/**
 * @param {number} Th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @param {number} m - motion in seconds of day `[0...86400[`
 * @return {number} new siderial time seconds of day `[0...86400[`
 */
function _th0 (Th0, m) {
  // in original formula Th0 = 0...360 and m = 0...1 -> return value would be in 0...360 degrees
  // Th0 /= 240
  // m /= 86400
  let th0 = base.pmod(Th0 + m * 360.985647 / 360, SECS_PER_DAY) // p103
  return th0 // 0...86400 in seconds angle
}

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
M.approxTimes = function (p, h0, Th0, α, δ) {
  let H0 = _H(p.lat, h0, δ)
  // approximate transit, rise, set times.
  // (15.2) p. 102.0
  let mt = _mt(p.lon, α, Th0)
  let mTransit = base.pmod(mt, SECS_PER_DAY)
  let mRise = base.pmod(mt - H0, SECS_PER_DAY)
  let mSet = base.pmod(mt + H0, SECS_PER_DAY)
  return [mRise, mTransit, mSet]
}

/**
 * Times computes UT rise, transit and set times for a celestial object on
 * a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * a number of values computed from the day.
 *
 * @param {coord.Globe} p - is geographic coordinates of observer.
 * @param {number} ΔT - is delta T in seconds
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {Array<number>} α3 - slices of three right ascensions
 * @param {Array<number>} δ3 - slices of three declinations.
 *        α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 *        and the day after the day of interest.  Units are radians.
 *
 * @return Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.times = function (p, ΔT, h0, Th0, α3, δ3) { // (p globe.Coord, ΔT, h0, Th0 float64, α3, δ3 []float64)  (mRise, mTransit, mSet float64, err error)
  let [mRise, mTransit, mSet] = M.approxTimes(p, h0, Th0, α3[1], δ3[1])
  let d3α = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, α3)
  let d3δ = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, δ3)

  // adjust mTransit
  let ut = mTransit + ΔT
  let α = d3α.interpolateX(ut)
  let th0 = _th0(Th0, mTransit)
  let H = -1 * _mt(p.lon, α, th0) // in secs // Hmeus = 0...360
  mTransit -= H

  // adjust mRise, mSet
  let [sLat, cLat] = base.sincos(p.lat)

  let adjustRS = function (m) {
    let ut = m + ΔT
    let α = d3α.interpolateX(ut)
    let δ = d3δ.interpolateX(ut)
    let th0 = _th0(Th0, m)
    let H = -1 * _mt(p.lon, α, th0)
    let Hrad = (H / SECS_PER_DEGREE) * D2R
    let [sδ, cδ] = base.sincos(δ)
    let h = Math.asin(((sLat * sδ) + (cLat * cδ * Math.cos(Hrad)))) // formula 13.6
    let Δm = (SECS_PER_DAY * (h - h0) / (cδ * cLat * Math.sin(Hrad) * 2 * Math.PI)) // formula p103 3
    return m + Δm
  }

  mRise = adjustRS(mRise)
  mSet = adjustRS(mSet)

  return [mRise, mTransit, mSet]
}
