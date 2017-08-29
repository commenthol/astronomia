/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnring
 */
/**
 * Saturnrings: Chapter 45, The Ring of Saturn
 */

const base = require('./base')
const coord = require('./coord')
const nutation = require('./nutation')
const planetposition = require('./planetposition')

const M = exports

/**
 * Ring computes quantities of the ring of Saturn.
 *
 *  B  Saturnicentric latitude of the Earth referred to the plane of the ring.
 *  Bʹ  Saturnicentric latitude of the Sun referred to the plane of the ring.
 *  gDU  Difference between Saturnicentric longitudes of the Sun and the Earth.
 *  P  Geometric position angle of the northern semiminor axis of the ring.
 *  aEdge  Major axis of the out edge of the outer ring.
 *  bEdge  Minor axis of the out edge of the outer ring.
 *
 * All results in radians.
 */
M.ring = function (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (B, Bʹ, gDU, P, aEdge, bEdge float64)
  let [f1, f2] = cl(jde, earth, saturn)
  let [gDU, B] = f1()
  let [Bʹ, P, aEdge, bEdge] = f2()
  return [B, Bʹ, gDU, P, aEdge, bEdge]
}

/**
 * UB computes quantities required by illum.Saturn().
 *
 * Same as gDU and B returned by Ring().  Results in radians.
 */
M.ub = function (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (gDU, B float64)
  let [f1, f2] = cl(jde, earth, saturn) // eslint-disable-line no-unused-vars
  return f1()
}

/**
 * cl splits the work into two closures.
 */
function cl (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (f1 func() (gDU, B float64),
  // f2 func() (Bʹ, P, aEdge, bEdge float64))
  const p = Math.PI / 180
  var i, gw
  var l0, b0, R
  let gD = 9.0
  var gl, gb
  var si, ci, sgb, cgb, sB
  var sbʹ, cbʹ, slʹgw, clʹgw
  var f1 = function () { // (gDU, B float64)
    // (45.1), p. 318
    let T = base.J2000Century(jde)
    i = base.horner(T, 28.075216 * p, -0.012998 * p, 0.000004 * p)
    gw = base.horner(T, 169.50847 * p, 1.394681 * p, 0.000412 * p)
    // Step 2.0
    let earthPos = earth.position(jde)
    R = earthPos.range
    let fk5 = planetposition.toFK5(earthPos.lon, earthPos.lat, jde)
    l0 = fk5.lon
    b0 = fk5.lat
    let [sl0, cl0] = base.sincos(l0)
    let sb0 = Math.sin(b0)
    // Steps 3, 4.0
    var l, b, r, x, y, z
    let f = function () {
      let gt = base.lightTime(gD)
      let saturnPos = saturn.position(jde - gt)
      r = saturnPos.range
      let fk5 = planetposition.toFK5(saturnPos.lon, saturnPos.lat, jde)
      l = fk5.lon
      b = fk5.lat
      let [sl, cl] = base.sincos(l)
      let [sb, cb] = base.sincos(b)
      x = r * cb * cl - R * cl0
      y = r * cb * sl - R * sl0
      z = r * sb - R * sb0
      gD = Math.sqrt(x * x + y * y + z * z)
    }
    f()
    f()
    // Step 5.0
    gl = Math.atan2(y, x)
    gb = Math.atan(z / Math.hypot(x, y))
    // First part of step 6.0
    si = Math.sin(i)
    ci = Math.cos(i)
    sgb = Math.sin(gb)
    cgb = Math.cos(gb)
    sB = si * cgb * Math.sin(gl - gw) - ci * sgb
    var B = Math.asin(sB) // return value
    // Step 7.0
    let N = 113.6655 * p + 0.8771 * p * T
    let lʹ = l - 0.01759 * p / r
    let bʹ = b - 0.000764 * p * Math.cos(l - N) / r
    // Setup for steps 8, 9.0
    sbʹ = Math.sin(bʹ)
    cbʹ = Math.cos(bʹ)
    slʹgw = Math.sin(lʹ - gw)
    clʹgw = Math.cos(lʹ - gw)
    // Step 9.0
    let [sglgw, cglgw] = base.sincos(gl - gw)
    let U1 = Math.atan2(si * sbʹ + ci * cbʹ * slʹgw, cbʹ * clʹgw)
    let U2 = Math.atan2(si * sgb + ci * cgb * sglgw, cgb * cglgw)
    var gDU = Math.abs(U1 - U2) // return value
    return [gDU, B]
  }
  var f2 = function () { // (Bʹ, P, aEdge, bEdge) {
    // Remainder of step 6.0
    var aEdge = 375.35 / 3600 * p / gD // return value
    var bEdge = aEdge * Math.abs(sB)  // return value
    // Step 8.0
    let sBʹ = si * cbʹ * slʹgw - ci * sbʹ
    var Bʹ = Math.asin(sBʹ) // return value
    // Step 10.0
    let [gDgps, gDge] = nutation.nutation(jde)
    let ge = nutation.meanObliquity(jde) + gDge
    // Step 11.0
    let gl0 = gw - Math.PI / 2
    let gb0 = Math.PI / 2 - i
    // Step 12.0
    let [sl0gl, cl0gl] = base.sincos(l0 - gl)
    gl += 0.005693 * p * cl0gl / cgb
    gb += 0.005693 * p * sl0gl * sgb
    // Step 13.0
    gl0 += gDgps
    gl += gDgps
    // Step 14.0
    let eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge)
    let [ga0, gd0] = [eq.ra, eq.dec]
    eq = new coord.Ecliptic(gl, gb).toEquatorial(ge)
    let [ga, gd] = [eq.ra, eq.dec]
    // Step 15.0
    let [sgd0, cgd0] = base.sincos(gd0)
    let [sgd, cgd] = base.sincos(gd)
    let [sga0ga, cga0ga] = base.sincos(ga0 - ga)
    var P = Math.atan2(cgd0 * sga0ga, sgd0 * cgd - cgd0 * sgd * cga0ga) // return value
    return [Bʹ, P, aEdge, bEdge]
  }
  return [f1, f2]
}
