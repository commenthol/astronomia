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
 *    {number} gw1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} gw2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} P -  Geocentric position angle of Jupiter's northern rotation pole.
 */
M.physical = function (jde, earth, jupiter) { // (jde float64, earth, jupiter *pp.V87Planet)  (DS, DE, gw1, gw2, P float64)
  // Step 1.0
  let d = jde - 2433282.5
  let T1 = d / base.JulianCentury
  const p = Math.PI / 180
  let ga0 = 268 * p + 0.1061 * p * T1
  let gd0 = 64.5 * p - 0.0164 * p * T1
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
  let gD = 4.0 // surely better than 0.0

  let l, b, r, x, y, z
  let f = function () {
    let gt = base.lightTime(gD)
    let pos = jupiter.position(jde - gt)
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
    gD = Math.sqrt(x * x + y * y + z * z)
  }
  f()
  f()

  // Step 8.0
  let ge0 = nutation.meanObliquity(jde)
  // Step 9.0
  let [sge0, cge0] = base.sincos(ge0)
  let [sl, cl] = base.sincos(l)
  let [sb, cb] = base.sincos(b)
  let gas = Math.atan2(cge0 * sl - sge0 * sb / cb, cl)
  let gds = Math.asin(cge0 * sb + sge0 * cb * sl)
  // Step 10.0
  let [sgds, cgds] = base.sincos(gds)
  let [sgd0, cgd0] = base.sincos(gd0)
  let DS = Math.asin(-sgd0 * sgds - cgd0 * cgds * Math.cos(ga0 - gas))
  // Step 11.0
  let u = y * cge0 - z * sge0
  let v = y * sge0 + z * cge0
  let ga = Math.atan2(u, x)
  let gd = Math.atan(v / Math.hypot(x, u))
  let [sgd, cgd] = base.sincos(gd)
  let [sga0ga, cga0ga] = base.sincos(ga0 - ga)
  let gz = Math.atan2(sgd0 * cgd * cga0ga - sgd * cgd0, cgd * sga0ga)
  // Step 12.0
  let DE = Math.asin(-sgd0 * sgd - cgd0 * cgd * Math.cos(ga0 - ga))
  // Step 13.0
  let gw1 = W1 - gz - 5.07033 * p * gD
  let gw2 = W2 - gz - 5.02626 * p * gD
  // Step 14.0
  let C = (2 * r * gD + R * R - r * r - gD * gD) / (4 * r * gD)
  if (Math.sin(l - l0) < 0) {
    C = -C
  }
  gw1 = base.pmod(gw1 + C, 2 * Math.PI)
  gw2 = base.pmod(gw2 + C, 2 * Math.PI)
  // Step 15.0
  let [gDgps, gDge] = nutation.nutation(jde)
  let ge = ge0 + gDge
  // Step 16.0
  let [sge, cge] = base.sincos(ge)
  let [sga, cga] = base.sincos(ga)
  ga += 0.005693 * p * (cga * cl0 * cge + sga * sl0) / cgd
  gd += 0.005693 * p * (cl0 * cge * (sge / cge * cgd - sga * sgd) + cga * sgd * sl0)
  // Step 17.0
  let tgd = sgd / cgd
  let gDga = (cge + sge * sga * tgd) * gDgps - cga * tgd * gDge
  let gDgd = sge * cga * gDgps + sga * gDge
  let gaʹ = ga + gDga
  let gdʹ = gd + gDgd
  let [sga0, cga0] = base.sincos(ga0)
  let tgd0 = sgd0 / cgd0
  let gDga0 = (cge + sge * sga0 * tgd0) * gDgps - cga0 * tgd0 * gDge
  let gDgd0 = sge * cga0 * gDgps + sga0 * gDge
  let ga0ʹ = ga0 + gDga0
  let gd0ʹ = gd0 + gDgd0
  // Step 18.0
  let [sgdʹ, cgdʹ] = base.sincos(gdʹ)
  let [sgd0ʹ, cgd0ʹ] = base.sincos(gd0ʹ)
  let [sga0ʹgaʹ, cga0ʹgaʹ] = base.sincos(ga0ʹ - gaʹ)
  // (42.4) p. 290
  let P = Math.atan2(cgd0ʹ * sga0ʹgaʹ, sgd0ʹ * cgdʹ - cgd0ʹ * sgdʹ * cga0ʹgaʹ)
  if (P < 0) {
    P += 2 * Math.PI
  }
  return [DS, DE, gw1, gw2, P]
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
 *    {number} gw1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} gw2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 */
M.physical2 = function (jde) { // (jde float64)  (DS, DE, gw1, gw2 float64)
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
  let gD = Math.sqrt(r * r + R * R - 2 * r * R * cK)
  let gps = Math.asin(R / gD * sK)
  let dd = d - gD / 173
  let gw1 = 210.98 * p + 877.8169088 * p * dd + gps - B
  let gw2 = 187.23 * p + 870.1869088 * p * dd + gps - B
  let C = Math.sin(gps / 2)
  C *= C
  if (sK > 0) {
    C = -C
  }
  gw1 = base.pmod(gw1 + C, 2 * Math.PI)
  gw2 = base.pmod(gw2 + C, 2 * Math.PI)
  let gl = 34.35 * p + 0.083091 * p * d + 0.329 * p * sV + B
  let DS = 3.12 * p * Math.sin(gl + 42.8 * p)
  let DE = DS - 2.22 * p * Math.sin(gps) * Math.cos(gl + 22 * p) -
    1.3 * p * (r - gD) / gD * Math.sin(gl - 100.5 * p)
  return [DS, DE, gw1, gw2]
}
