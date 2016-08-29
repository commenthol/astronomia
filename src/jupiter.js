/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jupiter
 */
/**
 * Jupiter: Chapter 42, Ephemeris for Physical Observations of Jupiter.
 */

const base = require('./base')
const nutation = require('./nutation')
const planetposition = require('./planetposition')

const M = exports

/**
 * Physical computes quantities for physical observations of Jupiter.
 *
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth
 * @param {planetposition.Planet} jupiter
 * @return {Array}
 *    {number} DS - Planetocentric declination of the Sun.
 *    {number} DE - Planetocentric declination of the Earth.
 *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} P -  Geocentric position angle of Jupiter's northern rotation pole.
 */
M.physical = function (jde, earth, jupiter) { // (jde float64, earth, jupiter *pp.V87Planet)  (DS, DE, ω1, ω2, P float64)
  // Step 1.0
  let d = jde - 2433282.5
  let T1 = d / base.JulianCentury
  const p = Math.PI / 180
  let α0 = 268 * p + 0.1061 * p * T1
  let δ0 = 64.5 * p - 0.0164 * p * T1
  // Step 2.0
  let W1 = 17.71 * p + 877.90003539 * p * d
  let W2 = 16.838 * p + 870.27003539 * p * d
  // Step 3.0
  let pos = earth.position(jde)
  let [l0, b0, R] = [pos.lon, pos.lat, pos.range]
  let fk5 = planetposition.toFK5(l0, b0, jde)
  l0 = fk5.lon
  b0 = fk5.lat
  // Steps 4-7.
  let [sl0, cl0] = base.sincos(l0)
  let sb0 = Math.sin(b0)
  let Δ = 4.0 // surely better than 0.0

  let l, b, r, x, y, z
  let f = function () {
    let τ = base.lightTime(Δ)
    let pos = jupiter.position(jde - τ)
    l = pos.lon
    b = pos.lat
    r = pos.range
    let fk5 = planetposition.toFK5(l, b, jde)
    l = fk5.lon
    b = fk5.lat
    let [sb, cb] = base.sincos(b)
    let [sl, cl] = base.sincos(l)
    // (42.2) p. 289
    x = r * cb * cl - R * cl0
    y = r * cb * sl - R * sl0
    z = r * sb - R * sb0
    // (42.3) p. 289
    Δ = Math.sqrt(x * x + y * y + z * z)
  }
  f()
  f()

  // Step 8.0
  let ε0 = nutation.meanObliquity(jde)
  // Step 9.0
  let [sε0, cε0] = base.sincos(ε0)
  let [sl, cl] = base.sincos(l)
  let [sb, cb] = base.sincos(b)
  let αs = Math.atan2(cε0 * sl - sε0 * sb / cb, cl)
  let δs = Math.asin(cε0 * sb + sε0 * cb * sl)
  // Step 10.0
  let [sδs, cδs] = base.sincos(δs)
  let [sδ0, cδ0] = base.sincos(δ0)
  let DS = Math.asin(-sδ0 * sδs - cδ0 * cδs * Math.cos(α0 - αs))
  // Step 11.0
  let u = y * cε0 - z * sε0
  let v = y * sε0 + z * cε0
  let α = Math.atan2(u, x)
  let δ = Math.atan(v / Math.hypot(x, u))
  let [sδ, cδ] = base.sincos(δ)
  let [sα0α, cα0α] = base.sincos(α0 - α)
  let ζ = Math.atan2(sδ0 * cδ * cα0α - sδ * cδ0, cδ * sα0α)
  // Step 12.0
  let DE = Math.asin(-sδ0 * sδ - cδ0 * cδ * Math.cos(α0 - α))
  // Step 13.0
  let ω1 = W1 - ζ - 5.07033 * p * Δ
  let ω2 = W2 - ζ - 5.02626 * p * Δ
  // Step 14.0
  let C = (2 * r * Δ + R * R - r * r - Δ * Δ) / (4 * r * Δ)
  if (Math.sin(l - l0) < 0) {
    C = -C
  }
  ω1 = base.pmod(ω1 + C, 2 * Math.PI)
  ω2 = base.pmod(ω2 + C, 2 * Math.PI)
  // Step 15.0
  let [Δψ, Δε] = nutation.nutation(jde)
  let ε = ε0 + Δε
  // Step 16.0
  let [sε, cε] = base.sincos(ε)
  let [sα, cα] = base.sincos(α)
  α += 0.005693 * p * (cα * cl0 * cε + sα * sl0) / cδ
  δ += 0.005693 * p * (cl0 * cε * (sε / cε * cδ - sα * sδ) + cα * sδ * sl0)
  // Step 17.0
  let tδ = sδ / cδ
  let Δα = (cε + sε * sα * tδ) * Δψ - cα * tδ * Δε
  let Δδ = sε * cα * Δψ + sα * Δε
  let αʹ = α + Δα
  let δʹ = δ + Δδ
  let [sα0, cα0] = base.sincos(α0)
  let tδ0 = sδ0 / cδ0
  let Δα0 = (cε + sε * sα0 * tδ0) * Δψ - cα0 * tδ0 * Δε
  let Δδ0 = sε * cα0 * Δψ + sα0 * Δε
  let α0ʹ = α0 + Δα0
  let δ0ʹ = δ0 + Δδ0
  // Step 18.0
  let [sδʹ, cδʹ] = base.sincos(δʹ)
  let [sδ0ʹ, cδ0ʹ] = base.sincos(δ0ʹ)
  let [sα0ʹαʹ, cα0ʹαʹ] = base.sincos(α0ʹ - αʹ)
  // (42.4) p. 290
  let P = Math.atan2(cδ0ʹ * sα0ʹαʹ, sδ0ʹ * cδʹ - cδ0ʹ * sδʹ * cα0ʹαʹ)
  if (P < 0) {
    P += 2 * Math.PI
  }
  return [DS, DE, ω1, ω2, P]
}

/**
 * Physical2 computes quantities for physical observations of Jupiter.
 *
 * Results are less accurate than with Physical().
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {Array}
 *    {number} DS - Planetocentric declination of the Sun.
 *    {number} DE - Planetocentric declination of the Earth.
 *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 */
M.physical2 = function (jde) { // (jde float64)  (DS, DE, ω1, ω2 float64)
  let d = jde - base.J2000
  const p = Math.PI / 180
  let V = 172.74 * p + 0.00111588 * p * d
  let M = 357.529 * p + 0.9856003 * p * d
  let sV = Math.sin(V)
  let N = 20.02 * p + 0.0830853 * p * d + 0.329 * p * sV
  let J = 66.115 * p + 0.9025179 * p * d - 0.329 * p * sV
  let [sM, cM] = base.sincos(M)
  let [sN, cN] = base.sincos(N)
  let [s2M, c2M] = base.sincos(2 * M)
  let [s2N, c2N] = base.sincos(2 * N)
  let A = 1.915 * p * sM + 0.02 * p * s2M
  let B = 5.555 * p * sN + 0.168 * p * s2N
  let K = J + A - B
  let R = 1.00014 - 0.01671 * cM - 0.00014 * c2M
  let r = 5.20872 - 0.25208 * cN - 0.00611 * c2N
  let [sK, cK] = base.sincos(K)
  let Δ = Math.sqrt(r * r + R * R - 2 * r * R * cK)
  let ψ = Math.asin(R / Δ * sK)
  let dd = d - Δ / 173
  let ω1 = 210.98 * p + 877.8169088 * p * dd + ψ - B
  let ω2 = 187.23 * p + 870.1869088 * p * dd + ψ - B
  let C = Math.sin(ψ / 2)
  C *= C
  if (sK > 0) {
    C = -C
  }
  ω1 = base.pmod(ω1 + C, 2 * Math.PI)
  ω2 = base.pmod(ω2 + C, 2 * Math.PI)
  let λ = 34.35 * p + 0.083091 * p * d + 0.329 * p * sV + B
  let DS = 3.12 * p * Math.sin(λ + 42.8 * p)
  let DE = DS - 2.22 * p * Math.sin(ψ) * Math.cos(λ + 22 * p) -
    1.3 * p * (r - Δ) / Δ * Math.sin(λ - 100.5 * p)
  return [DS, DE, ω1, ω2]
}
