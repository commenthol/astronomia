/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module elliptic
 */
/**
 * Elliptic: Chapter 33, Elliptic Motion.
 *
 * Partial: Various formulas and algorithms are unimplemented for lack of
 * examples or test cases.
 */
import apparent from './apparent'
import base from './base'
import coord from './coord'
import kepler from './kepler'
import nutation from './nutation'
import planetposition from './planetposition'
import solarxyz from './solarxyz'

/**
 * Position returns observed equatorial coordinates of a planet at a given time.
 *
 * Argument p must be a valid V87Planet object for the observed planet.
 * Argument earth must be a valid V87Planet object for Earth.
 *
 * Results are right ascension and declination, α and δ in radians.
 */
export function position (planet, earth, jde) { // (p, earth *pp.V87Planet, jde float64)  (α, δ float64)
  let x
  let y
  let z
  const posEarth = earth.position(jde)
  const [L0, B0, R0] = [posEarth.lon, posEarth.lat, posEarth.range]
  const [sB0, cB0] = base.sincos(B0)
  const [sL0, cL0] = base.sincos(L0)

  function pos (τ = 0) {
    const pos = planet.position(jde - τ)
    const [L, B, R] = [pos.lon, pos.lat, pos.range]
    const [sB, cB] = base.sincos(B)
    const [sL, cL] = base.sincos(L)
    x = R * cB * cL - R0 * cB0 * cL0
    y = R * cB * sL - R0 * cB0 * sL0
    z = R * sB - R0 * sB0
  }

  pos()
  const Δ = Math.sqrt(x * x + y * y + z * z) // (33.4) p. 224
  const τ = base.lightTime(Δ)
  // repeating with jde-τ
  pos(τ)

  let λ = Math.atan2(y, x) // (33.1) p. 223
  let β = Math.atan2(z, Math.hypot(x, y)) // (33.2) p. 223
  const [Δλ, Δβ] = apparent.eclipticAberration(λ, β, jde)
  const fk5 = planetposition.toFK5(λ + Δλ, β + Δβ, jde)
  λ = fk5.lon
  β = fk5.lat
  const [Δψ, Δε] = nutation.nutation(jde)
  λ += Δψ
  const ε = nutation.meanObliquity(jde) + Δε
  return new coord.Ecliptic(λ, β).toEquatorial(ε)
  // Meeus gives a formula for elongation but doesn't spell out how to
  // obtaion term λ0 and doesn't give an example solution.
}

/**
 * Elements holds keplerian elements.
 */
export class Elements {
  /*
  Axis  float64 // Semimajor axis, a, in AU
  Ecc   float64 // Eccentricity, e
  Inc   float64 // Inclination, i, in radians
  ArgP  float64 // Argument of perihelion, ω, in radians
  Node  float64 // Longitude of ascending node, Ω, in radians
  TimeP float64 // Time of perihelion, T, as jde
  */
  constructor (axis, ecc, inc, argP, node, timeP) {
    let o = {}
    if (typeof axis === 'object') {
      o = axis
    }
    this.axis = o.axis || axis
    this.ecc = o.ecc || ecc
    this.inc = o.inc || inc
    this.argP = o.argP || argP
    this.node = o.node || node
    this.timeP = o.timeP || timeP
  }

  /**
   * Position returns observed equatorial coordinates of a body with Keplerian elements.
   *
   * Argument e must be a valid V87Planet object for Earth.
   *
   * Results are right ascension and declination α and δ, and elongation ψ,
   * all in radians.
   */
  position (jde, earth) { // (α, δ, ψ float64) {
    // (33.6) p. 227
    const n = base.K / this.axis / Math.sqrt(this.axis)
    const sε = base.SOblJ2000
    const cε = base.COblJ2000
    const [sΩ, cΩ] = base.sincos(this.node)
    const [si, ci] = base.sincos(this.inc)
    // (33.7) p. 228
    const F = cΩ
    const G = sΩ * cε
    const H = sΩ * sε
    const P = -sΩ * ci
    const Q = cΩ * ci * cε - si * sε
    const R = cΩ * ci * sε + si * cε
    // (33.8) p. 229
    const A = Math.atan2(F, P)
    const B = Math.atan2(G, Q)
    const C = Math.atan2(H, R)
    const a = Math.hypot(F, P)
    const b = Math.hypot(G, Q)
    const c = Math.hypot(H, R)

    const f = (jde) => { // (x, y, z float64) {
      const M = n * (jde - this.timeP)
      let E
      try {
        E = kepler.kepler2b(this.ecc, M, 15)
      } catch (e) {
        E = kepler.kepler3(this.ecc, M)
      }
      const ν = kepler.trueAnomaly(E, this.ecc)
      const r = kepler.radius(E, this.ecc, this.axis)
      // (33.9) p. 229
      const x = r * a * Math.sin(A + this.argP + ν)
      const y = r * b * Math.sin(B + this.argP + ν)
      const z = r * c * Math.sin(C + this.argP + ν)
      return {x, y, z}
    }
    return astrometricJ2000(f, jde, earth)
  }
}

/**
 * AstrometricJ2000 is a utility function for computing astrometric coordinates.
 *
 * It is used internally and only exported so that it can be used from
 * multiple packages.  It is not otherwise expected to be used.
 *
 * Argument f is a function that returns J2000 equatorial rectangular
 * coodinates of a body.
 *
 * Results are J2000 right ascention, declination, and elongation.
 */
export function astrometricJ2000 (f, jde, earth) { // (f func(float64)  (x, y, z float64), jde float64, e *pp.V87Planet) (α, δ, ψ float64)
  const sol = solarxyz.positionJ2000(earth, jde)
  const [X, Y, Z] = [sol.x, sol.y, sol.z]
  let ξ
  let η
  let ζ
  let Δ

  function fn (τ = 0) {
    // (33.10) p. 229
    const {x, y, z} = f(jde - τ)
    ξ = X + x
    η = Y + y
    ζ = Z + z
    Δ = Math.sqrt(ξ * ξ + η * η + ζ * ζ)
  }

  fn()
  const τ = base.lightTime(Δ)
  fn(τ)

  let α = Math.atan2(η, ξ)
  if (α < 0) {
    α += 2 * Math.PI
  }
  const δ = Math.asin(ζ / Δ)
  const R0 = Math.sqrt(X * X + Y * Y + Z * Z)
  const ψ = Math.acos((ξ * X + η * Y + ζ * Z) / R0 / Δ)
  return new base.Coord(α, δ, undefined, ψ)
}

/**
 * Velocity returns instantaneous velocity of a body in elliptical orbit around the Sun.
 *
 * Argument a is the semimajor axis of the body, r is the instaneous distance
 * to the Sun, both in AU.
 *
 * Result is in Km/sec.
 */
export function velocity (a, r) { // (a, r float64)  float64
  return 42.1219 * Math.sqrt(1 / r - 0.5 / a)
}

/**
 * Velocity returns the velocity of a body at aphelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
export function vAphelion (a, e) { // (a, e float64)  float64
  return 29.7847 * Math.sqrt((1 - e) / (1 + e) / a)
}

/**
 * Velocity returns the velocity of a body at perihelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
export function vPerihelion (a, e) { // (a, e float64)  float64
  return 29.7847 * Math.sqrt((1 + e) / (1 - e) / a)
}

/**
 * Length1 returns Ramanujan's approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 */
export function length1 (a, e) { // (a, e float64)  float64
  const b = a * Math.sqrt(1 - e * e)
  return Math.PI * (3 * (a + b) - Math.sqrt((a + 3 * b) * (3 * a + b)))
}

/**
 * Length2 returns an alternate approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 */
export function length2 (a, e) { // (a, e float64)  float64
  const b = a * Math.sqrt(1 - e * e)
  const s = a + b
  const p = a * b
  const A = s * 0.5
  const G = Math.sqrt(p)
  const H = 2 * p / s
  return Math.PI * (21 * A - 2 * G - 3 * H) * 0.125
}

/**
 * Length3 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 */
/* As Meeus notes, Length4 converges faster.  There is no reason to use
this function
export function length3 (a, e) { // (a, e float64)  float64
  const sum0 = 1.0
  const e2 = e * e
  const term = e2 * 0.25
  const sum1 = 1.0 - term
  const nf = 1.0
  const df = 2.0
  while (sum1 !== sum0) {
    term *= nf
    nf += 2
    df += 2
    term *= nf * e2 / (df * df)
    sum0 = sum1
    sum1 -= term
  }
  return 2 * Math.PI * a * sum0
} */

/**
 * Length4 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 */
export function length4 (a, e) { // (a, e float64)  float64
  const b = a * Math.sqrt(1 - e * e)
  const m = (a - b) / (a + b)
  const m2 = m * m
  let sum0 = 1.0
  let term = m2 * 0.25
  let sum1 = 1.0 + term
  let nf = -1.0
  let df = 2.0
  while (sum1 !== sum0) {
    nf += 2
    df += 2
    term *= nf * nf * m2 / (df * df)
    sum0 = sum1
    sum1 += term
  }
  return 2 * Math.PI * a * sum0 / (1 + m)
}

export default {
  position,
  Elements,
  astrometricJ2000,
  velocity,
  vAphelion,
  vPerihelion,
  length1,
  length2,
  // length3,
  length4
}
