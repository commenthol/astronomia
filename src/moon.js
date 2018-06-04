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
import coord from './coord'
import moonposition from './moonposition'
import nutation from './nutation'
import solar from './solar'

const {sin, cos, asin, atan2} = Math
const D2R = Math.PI / 180
const _I = 1.54242 * D2R // IAU value of inclination of mean lunar equator

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
    const F = this.F = base.horner(T, 93.272095 * D2R, 483202.0175233 * D2R, -0.0036539 * D2R, -D2R / 3526000, D2R / 863310000)
    this.Ω = base.horner(T, 125.0445479 * D2R, -1934.1362891 * D2R, 0.0020754 * D2R,
      D2R / 467441, -D2R / 60616000)
    // true ecliptic
    this.ε = nutation.meanObliquity(jde) + Δε
    this.sε = sin(this.ε)
    this.cε = cos(this.ε)
    // ρ, σ, τ, p. 372,373
    const D = base.horner(T, 297.8501921 * D2R, 445267.1114034 * D2R, -0.0018819 * D2R, D2R / 545868, -D2R / 113065000)
    const M = base.horner(T, 357.5291092 * D2R, 35999.0502909 * D2R, -0.0001536 * D2R, D2R / 24490000)
    const M_ = base.horner(T, 134.9633964 * D2R, 477198.8675055 * D2R,
      0.0087414 * D2R, D2R / 69699, -D2R / 14712000)
    const E = base.horner(T, 1, -0.002516, -0.0000074)
    const K1 = 119.75 * D2R + 131.849 * D2R * T
    const K2 = 72.56 * D2R + 20.186 * D2R * T
    this.ρ = -0.02752 * D2R * cos(M_) +
      -0.02245 * D2R * sin(F) +
      0.00684 * D2R * cos(M_ - 2 * F) +
      -0.00293 * D2R * cos(2 * F) +
      -0.00085 * D2R * cos(2 * (F - D)) +
      -0.00054 * D2R * cos(M_ - 2 * D) +
      -0.0002 * D2R * sin(M_ + F) +
      -0.0002 * D2R * cos(M_ + 2 * F) +
      -0.0002 * D2R * cos(M_ - F) +
      0.00014 * D2R * cos(M_ + 2 * (F - D))
    this.σ = -0.02816 * D2R * sin(M_) +
      0.02244 * D2R * cos(F) +
      -0.00682 * D2R * sin(M_ - 2 * F) +
      -0.00279 * D2R * sin(2 * F) +
      -0.00083 * D2R * sin(2 * (F - D)) +
      0.00069 * D2R * sin(M_ - 2 * D) +
      0.0004 * D2R * cos(M_ + F) +
      -0.00025 * D2R * sin(2 * M_) +
      -0.00023 * D2R * sin(M_ + 2 * F) +
      0.0002 * D2R * cos(M_ - F) +
      0.00019 * D2R * sin(M_ - F) +
      0.00013 * D2R * sin(M_ + 2 * (F - D)) +
      -0.0001 * D2R * cos(M_ - 3 * F)
    this.τ = 0.0252 * D2R * sin(M) * E +
      0.00473 * D2R * sin(2 * (M_ - F)) +
      -0.00467 * D2R * sin(M_) +
      0.00396 * D2R * sin(K1) +
      0.00276 * D2R * sin(2 * (M_ - D)) +
      0.00196 * D2R * sin(this.Ω) +
      -0.00183 * D2R * cos(M_ - F) +
      0.00115 * D2R * sin(M_ - 2 * D) +
      -0.00096 * D2R * sin(M_ - D) +
      0.00046 * D2R * sin(2 * (F - D)) +
      -0.00039 * D2R * sin(M_ - F) +
      -0.00032 * D2R * sin(M_ - M - D) +
      0.00027 * D2R * sin(2 * (M_ - D) - M) +
      0.00023 * D2R * sin(K2) +
      -0.00014 * D2R * sin(2 * D) +
      0.00014 * D2R * cos(2 * (M_ - F)) +
      -0.00012 * D2R * sin(M_ - 2 * F) +
      -0.00012 * D2R * sin(2 * M_) +
      0.00011 * D2R * sin(2 * (M_ - M - D))
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
    const A = atan2(sW * cβ * cI - sβ * sI, cW * cβ)
    const l_ = base.pmod(A - this.F, 2 * Math.PI)
    const b_ = asin(-sW * cβ * sI - sβ * cI)
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
    let P = asin(Math.hypot(X, Y) * cos(ecl.ra - ω) / cos(b))
    if (P < 0) {
      P += 2 * Math.PI
    }
    return P
  }

  sun (λ, β, Δ, earth) {
    const {lon, lat, range} = solar.apparentVSOP87(earth, this.jde) // eslint-disable-line no-unused-vars
    const ΔR = Δ / (range * base.AU)
    const λH = lon + Math.PI + 57.296 * D2R * ΔR * cos(β) * sin(lon - λ)
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
  const π_ = π * (sin(z) + 0.0084*sin(2*z))
  sQP, cQP := base.sincos(Q - P)
  Δl = -π_ * sQP / cos(b)
  Δb = π_ * cQP
  ΔP = Δl*sin(b+Δb) - π_*sin(Q)*Math.tan(δ)
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
  return asin(sb0 * sθ + cb0 * cθ * sin(c0 + cOnMoon.lon))
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
  return h / (12.19075 * D2R * cos(cOnMoon.lat))
}

const lunarCoord = (η, θ) => new base.Coord(η * D2R, θ * D2R)
/**
 * selenographic coordinates of some lunar features
 * Table 53.A
 */
export const selenographic = {
  archimedes: lunarCoord(-3.9, 29.7),
  aristarchus: lunarCoord(-47.5, 23.7),
  aristillus: lunarCoord(1.2, 33.9),
  aristoteles: lunarCoord(17.3, 50.1),
  arzachel: lunarCoord(-1.9, -17.7),
  autolycus: lunarCoord(1.5, 30.7),
  billy: lunarCoord(-50, -13.8),
  birt: lunarCoord(-8.5, -22.3),
  campanus: lunarCoord(-27.7, -28),
  censorinus: lunarCoord(32.7, -0.4),
  clavius: lunarCoord(-14, -58),
  copernicus: lunarCoord(-20, 9.7),
  delambre: lunarCoord(17.5, -1.9),
  dionysius: lunarCoord(17.3, 2.8),
  endymion: lunarCoord(56.4, 53.6),
  eratosthenes: lunarCoord(-11.3, 14.5),
  eudoxus: lunarCoord(16.3, 44.3),
  fracastorius: lunarCoord(33.2, -21),
  fraMauro: lunarCoord(-17, -6),
  gassendi: lunarCoord(-39.9, -17.5),
  goclenius: lunarCoord(45, -10.1),
  grimaldi: lunarCoord(-68.5, -5.8),
  harpalus: lunarCoord(-43.4, 52.6),
  horrocks: lunarCoord(5.9, -4),
  kepler: lunarCoord(-38, 8.1),
  langrenus: lunarCoord(60.9, -8.9),
  lansberg: lunarCoord(-26.6, -0.3),
  letronne: lunarCoord(-43, -10),
  macrobius: lunarCoord(46, 21.2),
  manilius: lunarCoord(9.1, 14.5),
  menelaus: lunarCoord(16, 16.3),
  messier: lunarCoord(47.6, -1.9),
  petavius: lunarCoord(61, -25),
  pico: lunarCoord(-8.8, 45.8),
  pitatus: lunarCoord(-13.5, -29.8),
  piton: lunarCoord(-0.8, 40.8),
  plato: lunarCoord(-9.2, 51.4),
  plinius: lunarCoord(23.6, 15.3),
  posidonius: lunarCoord(30, 31.9),
  proclus: lunarCoord(46.9, 16.1),
  ptolemeusA: lunarCoord(-0.8, -8.5),
  pytheas: lunarCoord(-20.6, 20.5),
  reinhold: lunarCoord(-22.8, 3.2),
  riccioli: lunarCoord(-74.3, -3.2),
  schickard: lunarCoord(-54.5, -44),
  schiller: lunarCoord(-39, -52),
  tauruntius: lunarCoord(46.5, 5.6),
  theophilus: lunarCoord(26.5, -11.4),
  timocharis: lunarCoord(-13.1, 26.7),
  tycho: lunarCoord(-11, -43.2),
  vitruvius: lunarCoord(31.3, 17.6),
  walter: lunarCoord(1, -33)
}

export default {
  physical,
  Moon,
  // Topocentric,
  // TopocentricCorrections,
  sunAltitude,
  sunrise,
  sunset,
  selenographic
}
