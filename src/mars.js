/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module mars
 */
/**
 * Mars: Chapter 42, Ephemeris for Physical Observations of Mars.
 */

import base from './base.js'
import coord from './coord.js'
import illum from './illum.js'
import nutation from './nutation.js'
import planetposition, { Planet } from './planetposition.js' // eslint-disable-line no-unused-vars

/**
 * Physical computes quantities for physical observations of Mars.
 *
 * Results:
 *  DE  planetocentric declination of the Earth.
 *  DS  planetocentric declination of the Sun.
 *  ω   Areographic longitude of the central meridian, as seen from Earth.
 *  P   Geocentric position angle of Mars' northern rotation pole.
 *  Q   Position angle of greatest defect of illumination.
 *  d   Apparent diameter of Mars.
 *  k   Illuminated fraction of the disk.
 *  q   Greatest defect of illumination.
 *
 * All angular results (all results except k) are in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth
 * @param {Planet} mars
 */
export function physical (jde, earth, mars) { // (jde float64, earth, mars *pp.V87Planet)  (DE, DS, ω, P, Q, d, k, q float64)
  // Step 1.0
  const T = base.J2000Century(jde)
  const p = Math.PI / 180
  // (42.1) p. 288
  let λ0 = 352.9065 * p + 1.1733 * p * T
  const β0 = 63.2818 * p - 0.00394 * p * T
  // Step 2.0
  const earthPos = earth.position(jde)
  const R = earthPos.range
  const fk5 = planetposition.toFK5(earthPos.lon, earthPos.lat, jde)
  const [l0, b0] = [fk5.lon, fk5.lat]
  // Steps 3, 4.0
  const [sl0, cl0] = base.sincos(l0)
  const sb0 = Math.sin(b0)
  let Δ = 0.5 // surely better than 0.0
  let τ = base.lightTime(Δ)
  let l = 0
  let b = 0
  let r = 0
  let x = 0
  let y = 0
  let z = 0

  function f () {
    const marsPos = mars.position(jde - τ)
    r = marsPos.range
    const fk5 = planetposition.toFK5(marsPos.lon, marsPos.lat, jde)
    l = fk5.lon
    b = fk5.lat
    const [sb, cb] = base.sincos(b)
    const [sl, cl] = base.sincos(l)
    // (42.2) p. 289
    x = r * cb * cl - R * cl0
    y = r * cb * sl - R * sl0
    z = r * sb - R * sb0
    // (42.3) p. 289
    Δ = Math.sqrt(x * x + y * y + z * z)
    τ = base.lightTime(Δ)
  }

  f()
  f()
  // Step 5.0
  let λ = Math.atan2(y, x)
  let β = Math.atan(z / Math.hypot(x, y))
  // Step 6.0
  const [sβ0, cβ0] = base.sincos(β0)
  const [sβ, cβ] = base.sincos(β)
  const DE = Math.asin(-sβ0 * sβ - cβ0 * cβ * Math.cos(λ0 - λ))
  // Step 7.0
  const N = 49.5581 * p + 0.7721 * p * T
  const lʹ = l - 0.00697 * p / r
  const bʹ = b - 0.000225 * p * Math.cos(l - N) / r
  // Step 8.0
  const [sbʹ, cbʹ] = base.sincos(bʹ)
  const DS = Math.asin(-sβ0 * sbʹ - cβ0 * cbʹ * Math.cos(λ0 - lʹ))
  // Step 9.0
  const W = 11.504 * p + 350.89200025 * p * (jde - τ - 2433282.5)
  // Step 10.0
  const ε0 = nutation.meanObliquity(jde)
  const [sε0, cε0] = base.sincos(ε0)
  let eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε0)
  const [α0, δ0] = [eq.ra, eq.dec]
  // Step 11.0
  const u = y * cε0 - z * sε0
  const v = y * sε0 + z * cε0
  const α = Math.atan2(u, x)
  const δ = Math.atan(v / Math.hypot(x, u))
  const [sδ, cδ] = base.sincos(δ)
  const [sδ0, cδ0] = base.sincos(δ0)
  const [sα0α, cα0α] = base.sincos(α0 - α)
  const ζ = Math.atan2(sδ0 * cδ * cα0α - sδ * cδ0, cδ * sα0α)
  // Step 12.0
  const ω = base.pmod(W - ζ, 2 * Math.PI)
  // Step 13.0
  const [Δψ, Δε] = nutation.nutation(jde)
  // Step 14.0
  const [sl0λ, cl0λ] = base.sincos(l0 - λ)
  λ += 0.005693 * p * cl0λ / cβ
  β += 0.005693 * p * sl0λ * sβ
  // Step 15.0
  λ0 += Δψ
  λ += Δψ
  const ε = ε0 + Δε
  // Step 16.0
  const [sε, cε] = base.sincos(ε)
  eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε)
  const [α0ʹ, δ0ʹ] = [eq.ra, eq.dec]
  eq = new coord.Ecliptic(λ, β).toEquatorial(ε)
  const [αʹ, δʹ] = [eq.ra, eq.dec]
  // Step 17.0
  const [sδ0ʹ, cδ0ʹ] = base.sincos(δ0ʹ)
  const [sδʹ, cδʹ] = base.sincos(δʹ)
  const [sα0ʹαʹ, cα0ʹαʹ] = base.sincos(α0ʹ - αʹ)
  // (42.4) p. 290
  let P = Math.atan2(cδ0ʹ * sα0ʹαʹ, sδ0ʹ * cδʹ - cδ0ʹ * sδʹ * cα0ʹαʹ)
  if (P < 0) {
    P += 2 * Math.PI
  }
  // Step 18.0
  const s = l0 + Math.PI
  const [ss, cs] = base.sincos(s)
  const αs = Math.atan2(cε * ss, cs)
  const δs = Math.asin(sε * ss)
  const [sδs, cδs] = base.sincos(δs)
  const [sαsα, cαsα] = base.sincos(αs - α)
  const χ = Math.atan2(cδs * sαsα, sδs * cδ - cδs * sδ * cαsα)
  const Q = χ + Math.PI
  // Step 19.0
  const d = 9.36 / 60 / 60 * Math.PI / 180 / Δ
  const k = illum.fraction(r, Δ, R)
  const q = (1 - k) * d
  return [DE, DS, ω, P, Q, d, k, q]
}

export default {
  physical
}
