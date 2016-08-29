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
 *  ΔU  Difference between Saturnicentric longitudes of the Sun and the Earth.
 *  P  Geometric position angle of the northern semiminor axis of the ring.
 *  aEdge  Major axis of the out edge of the outer ring.
 *  bEdge  Minor axis of the out edge of the outer ring.
 *
 * All results in radians.
 */
M.ring = function (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (B, Bʹ, ΔU, P, aEdge, bEdge float64)
  let [f1, f2] = cl(jde, earth, saturn)
  let [ΔU, B] = f1()
  let [Bʹ, P, aEdge, bEdge] = f2()
  return [B, Bʹ, ΔU, P, aEdge, bEdge]
}

/**
 * UB computes quantities required by illum.Saturn().
 *
 * Same as ΔU and B returned by Ring().  Results in radians.
 */
M.ub = function (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (ΔU, B float64)
  let [f1, f2] = cl(jde, earth, saturn) // eslint-disable-line no-unused-vars
  return f1()
}

/**
 * cl splits the work into two closures.
 */
function cl (jde, earth, saturn) { // (jde float64, earth, saturn *pp.V87Planet)  (f1 func() (ΔU, B float64),
  // f2 func() (Bʹ, P, aEdge, bEdge float64))
  const p = Math.PI / 180
  var i, Ω
  var l0, b0, R
  let Δ = 9.0
  var λ, β
  var si, ci, sβ, cβ, sB
  var sbʹ, cbʹ, slʹΩ, clʹΩ
  var f1 = function () { // (ΔU, B float64)
    // (45.1), p. 318
    let T = base.J2000Century(jde)
    i = base.horner(T, 28.075216 * p, -0.012998 * p, 0.000004 * p)
    Ω = base.horner(T, 169.50847 * p, 1.394681 * p, 0.000412 * p)
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
      let τ = base.lightTime(Δ)
      let saturnPos = saturn.position(jde - τ)
      r = saturnPos.range
      let fk5 = planetposition.toFK5(saturnPos.lon, saturnPos.lat, jde)
      l = fk5.lon
      b = fk5.lat
      let [sl, cl] = base.sincos(l)
      let [sb, cb] = base.sincos(b)
      x = r * cb * cl - R * cl0
      y = r * cb * sl - R * sl0
      z = r * sb - R * sb0
      Δ = Math.sqrt(x * x + y * y + z * z)
    }
    f()
    f()
    // Step 5.0
    λ = Math.atan2(y, x)
    β = Math.atan(z / Math.hypot(x, y))
    // First part of step 6.0
    si = Math.sin(i)
    ci = Math.cos(i)
    sβ = Math.sin(β)
    cβ = Math.cos(β)
    sB = si * cβ * Math.sin(λ - Ω) - ci * sβ
    var B = Math.asin(sB) // return value
    // Step 7.0
    let N = 113.6655 * p + 0.8771 * p * T
    let lʹ = l - 0.01759 * p / r
    let bʹ = b - 0.000764 * p * Math.cos(l - N) / r
    // Setup for steps 8, 9.0
    sbʹ = Math.sin(bʹ)
    cbʹ = Math.cos(bʹ)
    slʹΩ = Math.sin(lʹ - Ω)
    clʹΩ = Math.cos(lʹ - Ω)
    // Step 9.0
    let [sλΩ, cλΩ] = base.sincos(λ - Ω)
    let U1 = Math.atan2(si * sbʹ + ci * cbʹ * slʹΩ, cbʹ * clʹΩ)
    let U2 = Math.atan2(si * sβ + ci * cβ * sλΩ, cβ * cλΩ)
    var ΔU = Math.abs(U1 - U2) // return value
    return [ΔU, B]
  }
  var f2 = function () { // (Bʹ, P, aEdge, bEdge) {
    // Remainder of step 6.0
    var aEdge = 375.35 / 3600 * p / Δ // return value
    var bEdge = aEdge * Math.abs(sB)  // return value
    // Step 8.0
    let sBʹ = si * cbʹ * slʹΩ - ci * sbʹ
    var Bʹ = Math.asin(sBʹ) // return value
    // Step 10.0
    let [Δψ, Δε] = nutation.nutation(jde)
    let ε = nutation.meanObliquity(jde) + Δε
    // Step 11.0
    let λ0 = Ω - Math.PI / 2
    let β0 = Math.PI / 2 - i
    // Step 12.0
    let [sl0λ, cl0λ] = base.sincos(l0 - λ)
    λ += 0.005693 * p * cl0λ / cβ
    β += 0.005693 * p * sl0λ * sβ
    // Step 13.0
    λ0 += Δψ
    λ += Δψ
    // Step 14.0
    let eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε)
    let [α0, δ0] = [eq.ra, eq.dec]
    eq = new coord.Ecliptic(λ, β).toEquatorial(ε)
    let [α, δ] = [eq.ra, eq.dec]
    // Step 15.0
    let [sδ0, cδ0] = base.sincos(δ0)
    let [sδ, cδ] = base.sincos(δ)
    let [sα0α, cα0α] = base.sincos(α0 - α)
    var P = Math.atan2(cδ0 * sα0α, sδ0 * cδ - cδ0 * sδ * cα0α) // return value
    return [Bʹ, P, aEdge, bEdge]
  }
  return [f1, f2]
}
