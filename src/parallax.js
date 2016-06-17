/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Parallax: Chapter 40, Correction for Parallax.
 */

const base = require('./base')
const globe = require('./globe')
const sidereal = require('./sidereal')
const sexa = require('./sexagesimal')

const M = exports

/**
 * Horizontal returns equatorial horizontal parallax of a body.
 *
 * Argument Δ is distance in AU.
 *
 * Result is parallax in radians.
 */
M.horizontal = function (Δ) { // (Δ float64)  (π float64)
  return 8.794 / 60 / 60 * Math.PI / 180 / Δ // (40.1) p. 279
}

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments α, δ are geocentric right ascension and declination in radians.
 * Δ is distance to the observed object in AU.  ρsφ_, ρcφ_ are parallax
 * constants (see package globe.) L is geographic longitude of the observer,
 * jde is time of observation.
 *
 * Results are observed topocentric ra and dec in radians.
 */
M.topocentric = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) { // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (α_, δ_ float64)
  let π = M.horizontal(Δ)
  let θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(θ0 - L - α, 2 * Math.PI)
  let sπ = Math.sin(π)
  let [sH, cH] = base.sincos(H)
  let [sδ, cδ] = base.sincos(δ)
  let Δα = Math.atan2(-ρcφ_ * sπ * sH, cδ - ρcφ_ * sπ * cH) // (40.2) p. 279
  let α_ = α + Δα
  let δ_ = Math.atan2((sδ - ρsφ_ * sπ) * Math.cos(Δα), cδ - ρcφ_ * sπ * cH) // (40.3) p. 279
  return [α_, δ_]
}

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 */
M.topocentric2 = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) { // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (Δα, Δδ float64)
  let π = M.horizontal(Δ)
  let θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(θ0 - L - α, 2 * Math.PI)
  let [sH, cH] = base.sincos(H)
  let [sδ, cδ] = base.sincos(δ)
  let Δα = -π * ρcφ_ * sH / cδ // (40.4) p. 280
  let Δδ = -π * (ρsφ_ * cδ - ρcφ_ * cH * sδ) // (40.5) p. 280
  return [Δα, Δδ]
}

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 */
M.topocentric3 = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) { // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (H_, δ_ float64)
  let π = M.horizontal(Δ)
  let θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(θ0 - L - α, 2 * Math.PI)
  let sπ = Math.sin(π)
  let [sH, cH] = base.sincos(H)
  let [sδ, cδ] = base.sincos(δ)
  let A = cδ * sH
  let B = cδ * cH - ρcφ_ * sπ
  let C = sδ - ρsφ_ * sπ
  let q = Math.sqrt(A * A + B * B + C * C)
  let H_ = Math.atan2(A, B)
  let δ_ = Math.asin(C / q)
  return [H_, δ_]
}

/**
 * TopocentricEcliptical returns topocentric ecliptical coordinates including parallax.
 *
 * Arguments λ, β are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. φ, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ε is the obliquity of the
 * ecliptic, θ is local sidereal time, π is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * Results are observed topocentric coordinates and semidiameter.
 */
M.topocentricEcliptical = function (λ, β, s, φ, h, ε, θ, π) {
  let [S, C] = globe.Earth76.parallaxConstants(φ, h)
  let [sλ, cλ] = base.sincos(λ)
  let [sβ, cβ] = base.sincos(β)
  let [sε, cε] = base.sincos(ε)
  let [sθ, cθ] = base.sincos(θ)
  let sπ = Math.sin(π)
  let N = cλ * cβ - C * sπ * cθ
  let λ_ = Math.atan2(sλ * cβ - sπ * (S * sε + C * cε * sθ), N)
  if (λ_ < 0) {
    λ_ += 2 * Math.PI
  }
  let cλ_ = Math.cos(λ_)
  let β_ = Math.atan(cλ_ * (sβ - sπ * (S * cε - C * sε * sθ)) / N)
  let s_ = Math.asin(cλ_ * Math.cos(β_) * Math.sin(s) / N)
  return [λ_, β_, s_]
}
