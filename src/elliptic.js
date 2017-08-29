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
const apparent = require('./apparent')
const base = require('./base')
const coord = require('./coord')
const kepler = require('./kepler')
const nutation = require('./nutation')
const planetposition = require('./planetposition')
const solarxyz = require('./solarxyz')

const M = exports

/**
 * Position returns observed equatorial coordinates of a planet at a given time.
 *
 * Argument p must be a valid V87Planet object for the observed planet.
 * Argument earth must be a valid V87Planet object for Earth.
 *
 * Results are right ascension and declination, ga and gd in radians.
 */
M.position = function (planet, earth, jde) { // (p, earth *pp.V87Planet, jde float64)  (ga, gd float64)
  let x
  let y
  let z
  let posEarth = earth.position(jde)
  let [L0, B0, R0] = [posEarth.lon, posEarth.lat, posEarth.range]
  let [sB0, cB0] = base.sincos(B0)
  let [sL0, cL0] = base.sincos(L0)

  function pos (gt = 0) {
    let pos = planet.position(jde - gt)
    let [L, B, R] = [pos.lon, pos.lat, pos.range]
    let [sB, cB] = base.sincos(B)
    let [sL, cL] = base.sincos(L)
    x = R * cB * cL - R0 * cB0 * cL0
    y = R * cB * sL - R0 * cB0 * sL0
    z = R * sB - R0 * sB0
  }

  pos()
  let gD = Math.sqrt(x * x + y * y + z * z) // (33.4) p. 224
  let gt = base.lightTime(gD)
  // repeating with jde-gt
  pos(gt)

  let gl = Math.atan2(y, x)                // (33.1) p. 223
  let gb = Math.atan2(z, Math.hypot(x, y)) // (33.2) p. 223
  let [gDgl, gDgb] = apparent.eclipticAberration(gl, gb, jde)
  let fk5 = planetposition.toFK5(gl + gDgl, gb + gDgb, jde)
  gl = fk5.lon
  gb = fk5.lat
  let [gDgps, gDge] = nutation.nutation(jde)
  gl += gDgps
  let ge = nutation.meanObliquity(jde) + gDge
  return new coord.Ecliptic(gl, gb).toEquatorial(ge)
  // Meeus gives a formula for elongation but doesn't spell out how to
  // obtaion term gl0 and doesn't give an example solution.
}

/**
 * Elements holds keplerian elements.
 */
class Elements {
  /*
  Axis  float64 // Semimajor axis, a, in AU
  Ecc   float64 // Eccentricity, e
  Inc   float64 // Inclination, i, in radians
  ArgP  float64 // Argument of perihelion, gwa, in radians
  Node  float64 // Longitude of ascending node, gw, in radians
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
   * Results are right ascension and declination ga and gd, and elongation gps,
   * all in radians.
   */
  position (jde, earth) { // (ga, gd, gps float64) {
    // (33.6) p. 227
    let n = base.K / this.axis / Math.sqrt(this.axis)
    const sge = base.SOblJ2000
    const cge = base.COblJ2000
    let [sgw, cgw] = base.sincos(this.node)
    let [si, ci] = base.sincos(this.inc)
    // (33.7) p. 228
    let F = cgw
    let G = sgw * cge
    let H = sgw * sge
    let P = -sgw * ci
    let Q = cgw * ci * cge - si * sge
    let R = cgw * ci * sge + si * cge
    // (33.8) p. 229
    let A = Math.atan2(F, P)
    let B = Math.atan2(G, Q)
    let C = Math.atan2(H, R)
    let a = Math.hypot(F, P)
    let b = Math.hypot(G, Q)
    let c = Math.hypot(H, R)

    let f = (jde) => { // (x, y, z float64) {
      let M = n * (jde - this.timeP)
      let E
      try {
        E = kepler.kepler2b(this.ecc, M, 15)
      } catch (e) {
        E = kepler.kepler3(this.ecc, M)
      }
      let gn = kepler.true(E, this.ecc)
      let r = kepler.radius(E, this.ecc, this.axis)
      // (33.9) p. 229
      let x = r * a * Math.sin(A + this.argP + gn)
      let y = r * b * Math.sin(B + this.argP + gn)
      let z = r * c * Math.sin(C + this.argP + gn)
      return {x, y, z}
    }
    return M.astrometricJ2000(f, jde, earth)
  }
}
M.Elements = Elements

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
M.astrometricJ2000 = function (f, jde, earth) { // (f func(float64)  (x, y, z float64), jde float64, e *pp.V87Planet) (ga, gd, gps float64)
  let sol = solarxyz.positionJ2000(earth, jde)
  let [X, Y, Z] = [sol.x, sol.y, sol.z]
  let gks
  let gh
  let gz
  let gD

  function fn (gt = 0) {
    // (33.10) p. 229
    let {x, y, z} = f(jde - gt)
    gks = X + x
    gh = Y + y
    gz = Z + z
    gD = Math.sqrt(gks * gks + gh * gh + gz * gz)
  }

  fn()
  let gt = base.lightTime(gD)
  fn(gt)

  let ga = Math.atan2(gh, gks)
  if (ga < 0) {
    ga += 2 * Math.PI
  }
  let gd = Math.asin(gz / gD)
  let R0 = Math.sqrt(X * X + Y * Y + Z * Z)
  let gps = Math.acos((gks * X + gh * Y + gz * Z) / R0 / gD)
  return new base.Coord(ga, gd, undefined, gps)
}

/**
 * Velocity returns instantaneous velocity of a body in elliptical orbit around the Sun.
 *
 * Argument a is the semimajor axis of the body, r is the instaneous distance
 * to the Sun, both in AU.
 *
 * Result is in Km/sec.
 */
M.velocity = function (a, r) { // (a, r float64)  float64
  return 42.1219 * Math.sqrt(1 / r - 0.5 / a)
}

/**
 * Velocity returns the velocity of a body at aphelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
M.vAphelion = function (a, e) { // (a, e float64)  float64
  return 29.7847 * Math.sqrt((1 - e) / (1 + e) / a)
}

/**
 * Velocity returns the velocity of a body at perihelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
M.vPerihelion = function (a, e) { // (a, e float64)  float64
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
M.length1 = function (a, e) { // (a, e float64)  float64
  let b = a * Math.sqrt(1 - e * e)
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
M.length2 = function (a, e) { // (a, e float64)  float64
  let b = a * Math.sqrt(1 - e * e)
  let s = a + b
  let p = a * b
  let A = s * 0.5
  let G = Math.sqrt(p)
  let H = 2 * p / s
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
M.length3 = function (a, e) { // (a, e float64)  float64
  let sum0 = 1.0
  let e2 = e * e
  let term = e2 * 0.25
  let sum1 = 1.0 - term
  let nf = 1.0
  let df = 2.0
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
M.length4 = function (a, e) { // (a, e float64)  float64
  let b = a * Math.sqrt(1 - e * e)
  let m = (a - b) / (a + b)
  let m2 = m * m
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
