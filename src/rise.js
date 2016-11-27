/* eslint key-spacing: 1 */
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
const deltat = require('./deltat')
const elliptic = require('./elliptic')
const interp = require('./interpolation')
const julian = require('./julian')
const sexa = require('./sexagesimal')
const sidereal = require('./sidereal')
const {acos, asin, cos, sin} = Math

const SECS_PER_DEGREE = 240 // = 86400 / 360
const SECS_PER_DAY = 86400
const D2R = Math.PI / 180

const M = exports

const errorAboveHorizon = base.errorCode('always above horizon', -1)
const errorBelowHorizon = base.errorCode('always below horizon', 1)
M.errorAboveHorizon = errorAboveHorizon
M.errorBelowHorizon = errorBelowHorizon

/**
 * mean refraction of the atmosphere
 */
M.meanRefraction = new sexa.Angle(false, 0, 34, 0).rad()

/**
 * "Standard altitudes" for various bodies already including `meanRefraction` of 0°34'
 *
 * The standard altitude is the geometric altitude of the center of body
 * at the time of apparent rising or seting.
 */
M.stdh0 = {
  stellar: -M.meanRefraction,
  solar: new sexa.Angle(true, 0, 50, 0).rad(),
  // not containing meanRefraction
  lunar: new sexa.Angle(false, 0, 0, 0.7275).rad(),
  lunarMean: new sexa.Angle(false, 0, 0, 0.125).rad()
}

/**
 * Helper function to obtain corrected refraction
 * @param {number} h0 - altitude of the body in radians containing `meanRefraction` of 0°34'
 * @param {number} corr - the calcluated refraction e.g. from package `refraction` in radians
 * @return {number} refraction value in radians
 */
M.refraction = function (h0, corr) {
  if (!corr) {
    return h0
  } else {
    return h0 - M.meanRefraction - corr
  }
}

/**
 * standard altitude for stars, planets at apparent rising, seting
 */
M.stdh0Stellar = (refraction) => M.refraction(M.stdh0.stellar, refraction)
M.Stdh0Stellar = M.stdh0Stellar() // for backward-compatibility
/**
 * standard altitude for sun for upper limb of the disk
 */
M.stdh0Solar = (refraction) => M.refraction(M.stdh0.solar, refraction)
M.Stdh0Solar = M.stdh0Solar() // for backward-compatibility

/**
 * standard altitude for moon (low accuracy)
 */
M.stdh0LunarMean = (refraction) => {
  return M.stdh0.lunarMean - M.refraction(refraction)
}
M.Stdh0LunarMean = M.stdh0LunarMean() // for backward-compatibility
/**
 * Stdh0Lunar is the standard altitude of the Moon considering π, the
 * Moon's horizontal parallax.
 * @param {number} π - the Moon's horizontal parallax
 * @param {number} [refraction] - optional value for refraction in radians if
 *        omitted than meanRefraction is used
 * @return {number} altitude of Moon in radians
 */
M.stdh0Lunar = (π, refraction) => {
  refraction = refraction || M.meanRefraction
  return M.stdh0.lunar * π - refraction
}
M.Stdh0Lunar = M.stdh0Lunar // for backward-compatibility

/**
 * @return {number} local angle in radians
 */
M.hourAngle = function (lat, h0, δ) {
  // approximate local hour angle
  let cosH = (sin(h0) - sin(lat) * sin(δ)) / (cos(lat) * cos(δ)) // (15.1) p. 102
  if (cosH < -1) {
    throw errorAboveHorizon
  } else if (cosH > 1) {
    throw errorBelowHorizon
  }
  let H = acos(cosH)
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

// maintain backward compatibility - will be removed in v2
// return value in future will be an object not an array
function _compatibility (rs) {
  let _rs = [rs.rise, rs.transit, rs.set]
  _rs.rise = rs.rise
  _rs.transit = rs.transit
  _rs.set = rs.set
  return _rs
}

/**
 * ApproxTimes computes approximate UT rise, transit and set times for
 * a celestial object on a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * values computed from the day.
 *
 * @param {coord.Globe} p - is geographic coordinates of observer.
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {Array<number>} α3 - slices of three right ascensions
 * @param {Array<number>} δ3 - slices of three declinations.
 *        α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 *        and the day after the day of interest.  Units are radians.
 * @return Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.approxTimes = function (p, h0, Th0, α, δ) {
  let H0 = M.hourAngle(p.lat, h0, δ) * SECS_PER_DEGREE * 180 / Math.PI // in degrees per day === seconds
  // approximate transit, rise, set times.
  // (15.2) p. 102.0
  let mt = _mt(p.lon, α, Th0)
  let rs = {}
  rs.transit = base.pmod(mt, SECS_PER_DAY)
  rs.rise = base.pmod(mt - H0, SECS_PER_DAY)
  rs.set = base.pmod(mt + H0, SECS_PER_DAY)
  return _compatibility(rs)
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
  let rs = M.approxTimes(p, h0, Th0, α3[1], δ3[1])
  let d3α = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, α3)
  let d3δ = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, δ3)

  // adjust mTransit
  let ut = rs.transit + ΔT
  let α = d3α.interpolateX(ut)
  let th0 = _th0(Th0, rs.transit)
  let H = -1 * _mt(p.lon, α, th0) // in secs // Hmeus = 0...360
  rs.transit -= H

  // adjust mRise, mSet
  let [sLat, cLat] = base.sincos(p.lat)

  let adjustRS = function (m) {
    let ut = m + ΔT
    let α = d3α.interpolateX(ut)
    let δ = d3δ.interpolateX(ut)
    let th0 = _th0(Th0, m)
    let H = -1 * _mt(p.lon, α, th0)
    let Hrad = (H / SECS_PER_DEGREE) * D2R
    let h = asin(((sLat * sin(δ)) + (cLat * cos(δ) * cos(Hrad)))) // formula 13.6
    let Δm = (SECS_PER_DAY * (h - h0) / (cos(δ) * cLat * sin(Hrad) * 2 * Math.PI)) // formula p103 3
    return m + Δm
  }

  rs.rise = adjustRS(rs.rise)
  rs.set = adjustRS(rs.set)

  return _compatibility(rs)
}

/**
 * RisePlanet computes rise, transit and set times for a planet on a day of interest.
 */
class PlanetRise {
  /**
   * @param {number|Date} jd - Julian Day starting at midnight or Date object
   * @param {number} lat - geographic latitude of the observerin degrees
   * @param {number} lon - geographic longitude of the observer in degrees (measured positively westward)
   * @param {planetposition.Planet} earth - VSOP87 Planet object for Earth
   * @param {planetposition.Planet} planet - VSOP87 Planet object of observed body
   * @param {object} opts
   * @param {boolean} opts.date - return times as Date objects
   * @param {number} opts.refraction - use different refraction than `stdh0Stellar`
   */
  constructor (jd, lat, lon, earth, planet, opts) {
    this.opts = opts || {}
    this.refraction = this.opts.refraction || M.stdh0Stellar()
    if (jd instanceof Date) {
      jd = new julian.Calendar().fromDate(jd).toJD()
    }
    this.jd = Math.floor(jd - 0.5) + 0.5 // start at midnight
    this.lat = lat * D2R // convert to radians
    this.lon = lon * D2R
    let cal = new julian.Calendar().fromJD(this.jd)
    this.jde = cal.toJDE()
    this.ΔT = deltat.deltaT(cal.toYear())
    this.earth = earth
    this.planet = planet
  }

  approxTimes () {
    let body = elliptic.position(this.planet, this.earth, this.jde)
    let Th0 = sidereal.apparent0UT(this.jd)
    let rs = M.approxTimes(
      {lat: this.lat, lon: this.lon}, this.refraction,
      Th0, body.ra, body.dec
    )
    return this._rsToJD(rs)
  }

  times () {
    let body = [
      elliptic.position(this.planet, this.earth, this.jde - 1),
      elliptic.position(this.planet, this.earth, this.jde),
      elliptic.position(this.planet, this.earth, this.jde + 1)
    ]
    let Th0 = sidereal.apparent0UT(this.jd)
    let rs = M.times(
      {lat: this.lat, lon: this.lon}, this.ΔT, this.refraction,
      Th0, this._toArr(body, 'ra'), this._toArr(body, 'dec')
    )
    return this._rsToJD(rs)
  }
  /** @private */
  _toArr (body, p) {
    return body.map((item) => {
      return item[p]
    })
  }
  /** @private */
  _rsToJD (rs) {
    return {
      rise: this._toJD(rs.rise),
      transit: this._toJD(rs.transit),
      set: this._toJD(rs.set)
    }
  }
  /** @private */
  _toJD (secs) {
    let jd = this.jd + secs / 86400
    if (this.opts.date) {
      return new julian.Calendar().fromJD(jd).toDate()
    } else {
      return jd
    }
  }
}
M.PlanetRise = PlanetRise
