/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module mars
 */
/**
 * Mars: Chapter 42, Ephemeris for Physical Observations of Mars.
 */

const base = require('./base')
const coord = require('./coord')
const illum = require('./illum')
const nutation = require('./nutation')
const planetposition = require('./planetposition')

const M = exports

/**
 * Physical computes quantities for physical observations of Mars.
 *
 * Results:
 *  DE  planetocentric declination of the Earth.
 *  DS  planetocentric declination of the Sun.
 *  gw   Areographic longitude of the central meridian, as seen from Earth.
 *  P   Geocentric position angle of Mars' northern rotation pole.
 *  Q   Position angle of greatest defect of illumination.
 *  d   Apparent diameter of Mars.
 *  k   Illuminated fraction of the disk.
 *  q   Greatest defect of illumination.
 *
 * All angular results (all results except k) are in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth
 * @param {planetposition.Planet} mars
 */
M.physical = function (jde, earth, mars) { // (jde float64, earth, mars *pp.V87Planet)  (DE, DS, gw, P, Q, d, k, q float64)
  // Step 1.0
  let T = base.J2000Century(jde)
  const p = Math.PI / 180
  // (42.1) p. 288
  let gl0 = 352.9065 * p + 1.1733 * p * T
  let gb0 = 63.2818 * p - 0.00394 * p * T
  // Step 2.0
  let earthPos = earth.position(jde)
  let R = earthPos.range
  let fk5 = planetposition.toFK5(earthPos.lon, earthPos.lat, jde)
  let [l0, b0] = [fk5.lon, fk5.lat]
  // Steps 3, 4.0
  let [sl0, cl0] = base.sincos(l0)
  let sb0 = Math.sin(b0)
  let gD = 0.5 // surely better than 0.0
  let gt = base.lightTime(gD)
  var l, b, r, x, y, z
  let f = function () {
    let marsPos = mars.position(jde - gt)
    r = marsPos.range
    let fk5 = planetposition.toFK5(marsPos.lon, marsPos.lat, jde)
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
    gt = base.lightTime(gD)
  }
  f()
  f()
  // Step 5.0
  let gl = Math.atan2(y, x)
  let gb = Math.atan(z / Math.hypot(x, y))
  // Step 6.0
  let [sgb0, cgb0] = base.sincos(gb0)
  let [sgb, cgb] = base.sincos(gb)
  let DE = Math.asin(-sgb0 * sgb - cgb0 * cgb * Math.cos(gl0 - gl))
  // Step 7.0
  let N = 49.5581 * p + 0.7721 * p * T
  let lʹ = l - 0.00697 * p / r
  let bʹ = b - 0.000225 * p * Math.cos(l - N) / r
  // Step 8.0
  let [sbʹ, cbʹ] = base.sincos(bʹ)
  let DS = Math.asin(-sgb0 * sbʹ - cgb0 * cbʹ * Math.cos(gl0 - lʹ))
  // Step 9.0
  let W = 11.504 * p + 350.89200025 * p * (jde - gt - 2433282.5)
  // Step 10.0
  let ge0 = nutation.meanObliquity(jde)
  let [sge0, cge0] = base.sincos(ge0)
  let eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge0)
  let [ga0, gd0] = [eq.ra, eq.dec]
  // Step 11.0
  let u = y * cge0 - z * sge0
  let v = y * sge0 + z * cge0
  let ga = Math.atan2(u, x)
  let gd = Math.atan(v / Math.hypot(x, u))
  let [sgd, cgd] = base.sincos(gd)
  let [sgd0, cgd0] = base.sincos(gd0)
  let [sga0ga, cga0ga] = base.sincos(ga0 - ga)
  let gz = Math.atan2(sgd0 * cgd * cga0ga - sgd * cgd0, cgd * sga0ga)
  // Step 12.0
  let gw = base.pmod(W - gz, 2 * Math.PI)
  // Step 13.0
  let [gDgps, gDge] = nutation.nutation(jde)
  // Step 14.0
  let [sl0gl, cl0gl] = base.sincos(l0 - gl)
  gl += 0.005693 * p * cl0gl / cgb
  gb += 0.005693 * p * sl0gl * sgb
  // Step 15.0
  gl0 += gDgps
  gl += gDgps
  let ge = ge0 + gDge
  // Step 16.0
  let [sge, cge] = base.sincos(ge)
  eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge)
  let [ga0ʹ, gd0ʹ] = [eq.ra, eq.dec]
  eq = new coord.Ecliptic(gl, gb).toEquatorial(ge)
  let [gaʹ, gdʹ] = [eq.ra, eq.dec]
  // Step 17.0
  let [sgd0ʹ, cgd0ʹ] = base.sincos(gd0ʹ)
  let [sgdʹ, cgdʹ] = base.sincos(gdʹ)
  let [sga0ʹgaʹ, cga0ʹgaʹ] = base.sincos(ga0ʹ - gaʹ)
  // (42.4) p. 290
  let P = Math.atan2(cgd0ʹ * sga0ʹgaʹ, sgd0ʹ * cgdʹ - cgd0ʹ * sgdʹ * cga0ʹgaʹ)
  if (P < 0) {
    P += 2 * Math.PI
  }
  // Step 18.0
  let s = l0 + Math.PI
  let [ss, cs] = base.sincos(s)
  let gas = Math.atan2(cge * ss, cs)
  let gds = Math.asin(sge * ss)
  let [sgds, cgds] = base.sincos(gds)
  let [sgasga, cgasga] = base.sincos(gas - ga)
  let gx = Math.atan2(cgds * sgasga, sgds * cgd - cgds * sgd * cgasga)
  let Q = gx + Math.PI
  // Step 19.0
  let d = 9.36 / 60 / 60 * Math.PI / 180 / gD
  let k = illum.fraction(r, gD, R)
  let q = (1 - k) * d
  return [DE, DS, gw, P, Q, d, k, q]
}
