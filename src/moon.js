/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moon
 */
/**
 * Moon: Chapter 53, Ephemeris for Physical Observations of the Moon.
 *
 * Incomplete.  Topocentric functions are commented out for lack of test data.
 */

import base from './base'
// import parallax from './parallax'
import coord from './coord'
import moonposition from './moonposition'
import nutation from './nutation'
// import planetposition from './planetposition'
import solar from './solar'

const p = Math.PI / 180
const _I = 1.54242 * p // IAU value of inclination of mean lunar equator

const [sI, cI] = base.sincos(_I)

/**
 * Physical returns quantities useful for physical observation of the Moon.
 *
 * Returned l, b are librations in selenographic longitude and latitude.
 * They represent combined optical and physical librations.  Topocentric
 * librations are not considered.
 *
 * Returned P is the the position angle of the Moon's axis of rotation.
 *
 * Returned l0, b0 are the selenographic coordinates of the Sun.
 *
 * Returned values all in radians.

 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 Planet Earth
 * @return {Array}
 *    {base.Coord} cMoon - selenographic longitude, latitude of the Moon
 *    {number} P - position angle of the Moon's axis of rotation
 *    {base.Coord} cSun - selenographic longitude, latitude of the Sun.
 */
export function physical (jde, earth) {
  const {lon, lat, range} = moonposition.position(jde) // (λ without nutation)
  // [λ, β, Δ]
  const m = new Moon(jde)
  const [l, b] = m.lib(lon, lat)
  const P = m.pa(lon, lat, b)
  const [l0, b0] = m.sun(lon, lat, range, earth)
  const cMoon = new base.Coord(l, b)
  const cSun = new base.Coord(l0, b0)
  return [cMoon, P, cSun]
}

/**
 * Quantities computed for a jde and used in computing return values of
 * physical().  Computations are broken into several methods to organize
 * the code.
 */
export class Moon {
  constructor (jde) {
    this.jde = jde
    // Δψ, F, Ω, p. 372.0
    const [Δψ, Δε] = nutation.nutation(jde)
    this.Δψ = Δψ
    const T = base.J2000Century(jde)
    const F = this.F = base.horner(T, 93.272095 * p, 483202.0175233 * p, -0.0036539 * p, -p / 3526000, p / 863310000)
    this.Ω = base.horner(T, 125.0445479 * p, -1934.1362891 * p, 0.0020754 * p,
      p / 467441, -p / 60616000)
    // true ecliptic
    this.ε = nutation.meanObliquity(jde) + Δε
    this.sε = Math.sin(this.ε)
    this.cε = Math.cos(this.ε)
    // ρ, σ, τ, p. 372,373
    const D = base.horner(T, 297.8501921 * p, 445267.1114034 * p, -0.0018819 * p, p / 545868, -p / 113065000)
    const M = base.horner(T, 357.5291092 * p, 35999.0502909 * p, -0.0001535 * p, p / 24490000)
    const M_ = base.horner(T, 134.9633964 * p, 477198.8675055 * p,
      0.0087414 * p, p / 69699, -p / 14712000)
    const E = base.horner(T, 1, -0.002516, -0.0000074)
    const K1 = 119.75 * p + 131.849 * p * T
    const K2 = 72.56 * p + 20.186 * p * T
    this.ρ = -0.02752 * p * Math.cos(M_) +
      -0.02245 * p * Math.sin(F) +
      0.00684 * p * Math.cos(M_ - 2 * F) +
      -0.00293 * p * Math.cos(2 * F) +
      -0.00085 * p * Math.cos(2 * (F - D)) +
      -0.00054 * p * Math.cos(M_ - 2 * D) +
      -0.0002 * p * Math.sin(M_ + F) +
      -0.0002 * p * Math.cos(M_ + 2 * F) +
      -0.0002 * p * Math.cos(M_ - F) +
      0.00014 * p * Math.cos(M_ + 2 * (F - D))
    this.σ = -0.02816 * p * Math.sin(M_) +
      0.02244 * p * Math.cos(F) +
      -0.00682 * p * Math.sin(M_ - 2 * F) +
      -0.00279 * p * Math.sin(2 * F) +
      -0.00083 * p * Math.sin(2 * (F - D)) +
      0.00069 * p * Math.sin(M_ - 2 * D) +
      0.0004 * p * Math.cos(M_ + F) +
      -0.00025 * p * Math.sin(2 * M_) +
      -0.00023 * p * Math.sin(M_ + 2 * F) +
      0.0002 * p * Math.cos(M_ - F) +
      0.00019 * p * Math.sin(M_ - F) +
      0.00013 * p * Math.sin(M_ + 2 * (F - D)) +
      -0.0001 * p * Math.cos(M_ - 3 * F)
    this.τ = 0.0252 * p * Math.sin(M) * E +
      0.00473 * p * Math.sin(2 * (M_ - F)) +
      -0.00467 * p * Math.sin(M_) +
      0.00396 * p * Math.sin(K1) +
      0.00276 * p * Math.sin(2 * (M_ - D)) +
      0.00196 * p * Math.sin(this.Ω) +
      -0.00183 * p * Math.cos(M_ - F) +
      0.00115 * p * Math.sin(M_ - 2 * D) +
      -0.00096 * p * Math.sin(M_ - D) +
      0.00046 * p * Math.sin(2 * (F - D)) +
      -0.00039 * p * Math.sin(M_ - F) +
      -0.00032 * p * Math.sin(M_ - M - D) +
      0.00027 * p * Math.sin(2 * (M_ - D) - M) +
      0.00023 * p * Math.sin(K2) +
      -0.00014 * p * Math.sin(2 * D) +
      0.00014 * p * Math.cos(2 * (M_ - F)) +
      -0.00012 * p * Math.sin(M_ - 2 * F) +
      -0.00012 * p * Math.sin(2 * M_) +
      0.00011 * p * Math.sin(2 * (M_ - M - D))
  }

  /**
   * lib() curiously serves for computing both librations and solar coordinates,
   * depending on the coordinates λ, β passed in.  Quantity A not described in
   * the book, but clearly depends on the λ, β of the current context and so
   * does not belong in the moon struct.  Instead just return it from optical
   * and pass it along to physical.
   */
  lib (λ, β) {
    const [l_, b_, A] = this.optical(λ, β)
    const [l$, b$] = this.physical(A, b_)
    let l = l_ + l$
    if (l > Math.PI) {
      l -= 2 * Math.PI
    }
    const b = b_ + b$
    return [l, b]
  }

  optical (λ, β) {
    // (53.1) p. 372
    const W = λ - this.Ω // (λ without nutation)
    const [sW, cW] = base.sincos(W)
    const [sβ, cβ] = base.sincos(β)
    const A = Math.atan2(sW * cβ * cI - sβ * sI, cW * cβ)
    const l_ = base.pmod(A - this.F, 2 * Math.PI)
    const b_ = Math.asin(-sW * cβ * sI - sβ * cI)
    return [l_, b_, A]
  }

  physical (A, b_) {
    // (53.2) p. 373
    const [sA, cA] = base.sincos(A)
    const l$ = -this.τ + (this.ρ * cA + this.σ * sA) * Math.tan(b_)
    const b$ = this.σ * cA - this.ρ * sA
    return [l$, b$]
  }

  pa (λ, β, b) {
    const V = this.Ω + this.Δψ + this.σ / sI
    const [sV, cV] = base.sincos(V)
    const [sIρ, cIρ] = base.sincos(_I + this.ρ)
    const X = sIρ * sV
    const Y = sIρ * cV * this.cε - cIρ * this.sε
    const ω = Math.atan2(X, Y)
    const ecl = new coord.Ecliptic(λ + this.Δψ, β).toEquatorial(this.ε) // eslint-disable-line no-unused-vars
    let P = Math.asin(Math.hypot(X, Y) * Math.cos(ecl.ra - ω) / Math.cos(b))
    if (P < 0) {
      P += 2 * Math.PI
    }
    return P
  }

  sun (λ, β, Δ, earth) {
    const {lon, lat, range} = solar.apparentVSOP87(earth, this.jde) // eslint-disable-line no-unused-vars
    const ΔR = Δ / (range * base.AU)
    const λH = lon + Math.PI + ΔR * Math.cos(β) * Math.sin(lon - λ)
    const βH = ΔR * β
    return this.lib(λH, βH)
  }
}

/* commented out for lack of test data
export function Topocentric (jde, ρsφ_, ρcφ_, L) { // (jde, ρsφ_, ρcφ_, L float64)  (l, b, P float64)
  λ, β, Δ := moonposition.Position(jde) // (λ without nutation)
  Δψ, Δε := nutation.Nutation(jde)
  sε, cε := base.sincos(nutation.MeanObliquity(jde) + Δε)
  α, δ := coord.EclToEq(λ+Δψ, β, sε, cε)
  α, δ = parallax.Topocentric(α, δ, Δ/base.AU, ρsφ_, ρcφ_, L, jde)
  λ, β = coord.EqToEcl(α, δ, sε, cε)
  const m = newMoon(jde)
  l, b = m.lib(λ, β)
  P = m.pa(λ, β, b)
  return
}

export function TopocentricCorrections (jde, b, P, φ, δ, H, π) { // (jde, b, P, φ, δ, H, π float64)  (Δl, Δb, ΔP float64)
  sφ, cφ := base.sincos(φ)
  sH, cH := base.sincos(H)
  sδ, cδ := base.sincos(δ)
  const Q = Math.atan(cφ * sH / (cδ*sφ - sδ*cφ*cH))
  const z = Math.acos(sδ*sφ + cδ*cφ*cH)
  const π_ = π * (Math.sin(z) + 0.0084*Math.sin(2*z))
  sQP, cQP := base.sincos(Q - P)
  Δl = -π_ * sQP / Math.cos(b)
  Δb = π_ * cQP
  ΔP = Δl*Math.sin(b+Δb) - π_*Math.sin(Q)*Math.tan(δ)
  return
}
*/

/**
 * SunAltitude returns altitude of the Sun above the lunar horizon.
 *
 * @param {base.Coords} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {base.Coords} cSun - selenographic coordinates of the Sun (as returned by physical(), for example.)
 * @return altitude in radians.
 */
export function sunAltitude (cOnMoon, cSun) { // (η, θ, l0, b0 float64)  float64
  const c0 = Math.PI / 2 - cSun.lon
  const [sb0, cb0] = base.sincos(cSun.lat)
  const [sθ, cθ] = base.sincos(cOnMoon.lat)
  return Math.asin(sb0 * sθ + cb0 * cθ * Math.sin(c0 + cOnMoon.lon))
}

/**
 * Sunrise returns time of sunrise for a point on the Moon near the given date.
 *
 * @param {base.Coord} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 Planet Earth
 * @return time of sunrise as a jde nearest the given jde.
 */
export function sunrise (cOnMoon, jde, earth) { // (η, θ, jde float64, earth *pp.V87Planet)  float64
  jde -= srCorr(cOnMoon, jde, earth)
  return jde - srCorr(cOnMoon, jde, earth)
}

/**
 * Sunset returns time of sunset for a point on the Moon near the given date.
 *
 * @param {base.Coords} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 Planet Earth
 * @return time of sunset as a jde nearest the given jde.
 */
export function sunset (cOnMoon, jde, earth) { // (η, θ, jde float64, earth *pp.V87Planet)  float64
  jde += srCorr(cOnMoon, jde, earth)
  return jde + srCorr(cOnMoon, jde, earth)
}

/**
 * @private
 */
function srCorr (cOnMoon, jde, earth) {
  const phy = physical(jde, earth)
  const h = sunAltitude(cOnMoon, phy[2])
  return h / (12.19075 * p * Math.cos(cOnMoon.lat))
}

export default {
  physical,
  Moon,
  // Topocentric,
  // TopocentricCorrections,
  sunAltitude,
  sunrise,
  sunset
}
