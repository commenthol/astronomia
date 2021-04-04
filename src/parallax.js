/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallax
 */
/**
 * Parallax: Chapter 40, Correction for Parallax.
 */

import base, { Coord } from './base.js' // eslint-disable-line no-unused-vars
import globe from './globe.js'
import sidereal from './sidereal.js'
import sexa from './sexagesimal.js'

const horPar = (8.794 / 3600) * Math.PI / 180 // 8".794 arcseconds in radians

/**
 * Horizontal returns equatorial horizontal parallax of a body.
 *
 * @param {number} Δ - distance in AU.
 * @return {number} parallax in radians.
 */
export function horizontal (Δ) {
  // (40.1) p. 279
  return Math.asin(Math.sin(horPar) / Δ)
  // return horPar / Δ // with sufficient accuracy
}

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments α, δ are geocentric right ascension and declination in radians.
 * Δ is distance to the observed object in AU. ρsφ, ρcφ are parallax
 * constants (see package globe.) lon is geographic longitude of the observer,
 * jde is time of observation.
 *
 * @param {Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Coord} observed topocentric ra and dec in radians.
 */
export function topocentric (c, ρsφ, ρcφ, lon, jde) {
  const [α, δ, Δ] = [c.ra, c.dec, c.range]
  const π = horizontal(Δ)
  const θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  const H = base.pmod(θ0 - lon - α, 2 * Math.PI)
  const sπ = Math.sin(π)
  const [sH, cH] = base.sincos(H)
  const [sδ, cδ] = base.sincos(δ)
  const Δα = Math.atan2(-ρcφ * sπ * sH, cδ - ρcφ * sπ * cH) // (40.2) p. 279
  const α_ = α + Δα
  const δ_ = Math.atan2((sδ - ρsφ * sπ) * Math.cos(Δα), cδ - ρcφ * sπ * cH) // (40.3) p. 279
  return new Coord(α_, δ_)
}

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 *
 * @param {Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Coord} observed topocentric ra and dec in radians.
 */
export function topocentric2 (c, ρsφ, ρcφ, lon, jde) {
  const [α, δ, Δ] = [c.ra, c.dec, c.range]
  const π = horizontal(Δ)
  const θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  const H = base.pmod(θ0 - lon - α, 2 * Math.PI)
  const [sH, cH] = base.sincos(H)
  const [sδ, cδ] = base.sincos(δ)
  const Δα = -π * ρcφ * sH / cδ // (40.4) p. 280
  const Δδ = -π * (ρsφ * cδ - ρcφ * cH * sδ) // (40.5) p. 280
  return new base.Coord(Δα, Δδ)
}

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 *
 * @param {Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Array}
 *    {number} H_ - topocentric hour angle
 *    {number} δ_ - topocentric declination
 */
export function topocentric3 (c, ρsφ, ρcφ, lon, jde) {
  const [α, δ, Δ] = [c.ra, c.dec, c.range]
  const π = horizontal(Δ)
  const θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  const H = base.pmod(θ0 - lon - α, 2 * Math.PI)
  const sπ = Math.sin(π)
  const [sH, cH] = base.sincos(H)
  const [sδ, cδ] = base.sincos(δ)
  const A = cδ * sH
  const B = cδ * cH - ρcφ * sπ
  const C = sδ - ρsφ * sπ
  const q = Math.sqrt(A * A + B * B + C * C)
  const H_ = Math.atan2(A, B)
  const δ_ = Math.asin(C / q)
  return [H_, δ_]
}

/**
 * TopocentricEcliptical returns topocentric ecliptical coordinates including parallax.
 *
 * Arguments `c` are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. φ, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ε is the obliquity of the
 * ecliptic, θ is local sidereal time, π is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * @param {Coord} c - geocentric right ascension and declination in radians
 * @param {number} s - geocentric semidiameter of `c`
 * @param {number} φ - observer's latitude
 * @param {number} h - observer's height above the ellipsoid in meters
 * @param {number} ε - is the obliquity of the ecliptic
 * @param {number} θ - local sidereal time
 * @param {number} π - equatorial horizontal parallax of the body
 * @return {Array}
 *    {number} λ_ - observed topocentric longitude
 *    {number} β_ - observed topocentric latitude
 *    {number} s_ - observed topocentric semidiameter
 */
export function topocentricEcliptical (c, s, φ, h, ε, θ, π) {
  const [λ, β] = [c.lon, c.lat]
  const [S, C] = globe.Earth76.parallaxConstants(φ, h)
  const [sλ, cλ] = base.sincos(λ)
  const [sβ, cβ] = base.sincos(β)
  const [sε, cε] = base.sincos(ε)
  const [sθ, cθ] = base.sincos(θ)
  const sπ = Math.sin(π)
  const N = cλ * cβ - C * sπ * cθ
  let λ_ = Math.atan2(sλ * cβ - sπ * (S * sε + C * cε * sθ), N)
  if (λ_ < 0) {
    λ_ += 2 * Math.PI
  }
  const cλ_ = Math.cos(λ_)
  const β_ = Math.atan(cλ_ * (sβ - sπ * (S * cε - C * sε * sθ)) / N)
  const s_ = Math.asin(cλ_ * Math.cos(β_) * Math.sin(s) / N)
  return [λ_, β_, s_]
}

export default {
  horizontal,
  topocentric,
  topocentric2,
  topocentric3,
  topocentricEcliptical
}
