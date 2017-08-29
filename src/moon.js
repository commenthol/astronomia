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

const base = require('./base')
// const parallax = require('./parallax')
const coord = require('./coord')
const moonposition = require('./moonposition')
const nutation = require('./nutation')
// const planetposition = require('./planetposition')
const solar = require('./solar')

const M = exports

const p = Math.PI / 180
const _I = 1.54242 * p // IAU value of inclination of mean lunar equator

let [sI, cI] = base.sincos(_I)

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
M.physical = function (jde, earth) {
  let {lon, lat, range} = moonposition.position(jde) // (gl without nutation)
  // [gl, gb, gD]
  let m = new Moon(jde)
  let [l, b] = m.lib(lon, lat)
  let P = m.pa(lon, lat, b)
  let [l0, b0] = m.sun(lon, lat, range, earth)
  let cMoon = new base.Coord(l, b)
  let cSun = new base.Coord(l0, b0)
  return [cMoon, P, cSun]
}

/**
 * Quantities computed for a jde and used in computing return values of
 * physical().  Computations are broken into several methods to organize
 * the code.
 */
class Moon {
  constructor (jde) {
    this.jde = jde
      // gDgps, F, gw, p. 372.0
    let [gDgps, gDge] = nutation.nutation(jde)
    this.gDgps = gDgps
    let T = base.J2000Century(jde)
    let F = this.F = base.horner(T, 93.272095 * p, 483202.0175233 * p, -0.0036539 * p, -p / 3526000, p / 863310000)
    this.gw = base.horner(T, 125.0445479 * p, -1934.1362891 * p, 0.0020754 * p,
        p / 467441, -p / 60616000)
      // true ecliptic
    this.ge = nutation.meanObliquity(jde) + gDge
    this.sge = Math.sin(this.ge)
    this.cge = Math.cos(this.ge)
      // gr, gs, gt, p. 372,373
    let D = base.horner(T, 297.8501921 * p, 445267.1114034 * p, -0.0018819 * p, p / 545868, -p / 113065000)
    let M = base.horner(T, 357.5291092 * p, 35999.0502909 * p, -0.0001535 * p, p / 24490000)
    let M_ = base.horner(T, 134.9633964 * p, 477198.8675055 * p,
      0.0087414 * p, p / 69699, -p / 14712000)
    let E = base.horner(T, 1, -0.002516, -0.0000074)
    let K1 = 119.75 * p + 131.849 * p * T
    let K2 = 72.56 * p + 20.186 * p * T
    this.gr = -0.02752 * p * Math.cos(M_) +
      -0.02245 * p * Math.sin(F) +
      0.00684 * p * Math.cos(M_ - 2 * F) +
      -0.00293 * p * Math.cos(2 * F) +
      -0.00085 * p * Math.cos(2 * (F - D)) +
      -0.00054 * p * Math.cos(M_ - 2 * D) +
      -0.0002 * p * Math.sin(M_ + F) +
      -0.0002 * p * Math.cos(M_ + 2 * F) +
      -0.0002 * p * Math.cos(M_ - F) +
      0.00014 * p * Math.cos(M_ + 2 * (F - D))
    this.gs = -0.02816 * p * Math.sin(M_) +
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
    this.gt = 0.0252 * p * Math.sin(M) * E +
      0.00473 * p * Math.sin(2 * (M_ - F)) +
      -0.00467 * p * Math.sin(M_) +
      0.00396 * p * Math.sin(K1) +
      0.00276 * p * Math.sin(2 * (M_ - D)) +
      0.00196 * p * Math.sin(this.gw) +
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
   * depending on the coordinates gl, gb passed in.  Quantity A not described in
   * the book, but clearly depends on the gl, gb of the current context and so
   * does not belong in the moon struct.  Instead just return it from optical
   * and pass it along to physical.
   */
  lib (gl, gb) {
    let [l_, b_, A] = this.optical(gl, gb)
    let [l$, b$] = this.physical(A, b_)
    let l = l_ + l$
    if (l > Math.PI) {
      l -= 2 * Math.PI
    }
    let b = b_ + b$
    return [l, b]
  }

  optical (gl, gb) {
    // (53.1) p. 372
    let W = gl - this.gw // (gl without nutation)
    let [sW, cW] = base.sincos(W)
    let [sgb, cgb] = base.sincos(gb)
    let A = Math.atan2(sW * cgb * cI - sgb * sI, cW * cgb)
    let l_ = base.pmod(A - this.F, 2 * Math.PI)
    let b_ = Math.asin(-sW * cgb * sI - sgb * cI)
    return [l_, b_, A]
  }

  physical (A, b_) {
    // (53.2) p. 373
    let [sA, cA] = base.sincos(A)
    let l$ = -this.gt + (this.gr * cA + this.gs * sA) * Math.tan(b_)
    let b$ = this.gs * cA - this.gr * sA
    return [l$, b$]
  }

  pa (gl, gb, b) {
    let V = this.gw + this.gDgps + this.gs / sI
    let [sV, cV] = base.sincos(V)
    let [sIgr, cIgr] = base.sincos(_I + this.gr)
    let X = sIgr * sV
    let Y = sIgr * cV * this.cge - cIgr * this.sge
    let gwa = Math.atan2(X, Y)
    let ecl = new coord.Ecliptic(gl + this.gDgps, gb).toEquatorial(this.ge) // eslint-disable-line no-unused-vars
    let P = Math.asin(Math.hypot(X, Y) * Math.cos(ecl.ra - gwa) / Math.cos(b))
    if (P < 0) {
      P += 2 * Math.PI
    }
    return P
  }

  sun (gl, gb, gD, earth) {
    let {lon, lat, range} = solar.apparentVSOP87(earth, this.jde)  // eslint-disable-line no-unused-vars
    let gDR = gD / (range * base.AU)
    let glH = lon + Math.PI + gDR * Math.cos(gb) * Math.sin(lon - gl)
    let gbH = gDR * gb
    return this.lib(glH, gbH)
  }
}
M.Moon = Moon

/* commented out for lack of test data
M.Topocentric = function (jde, grsgf_, grcgf_, L) { // (jde, grsgf_, grcgf_, L float64)  (l, b, P float64)
  gl, gb, gD := moonposition.Position(jde) // (gl without nutation)
  gDgps, gDge := nutation.Nutation(jde)
  sge, cge := base.sincos(nutation.MeanObliquity(jde) + gDge)
  ga, gd := coord.EclToEq(gl+gDgps, gb, sge, cge)
  ga, gd = parallax.Topocentric(ga, gd, gD/base.AU, grsgf_, grcgf_, L, jde)
  gl, gb = coord.EqToEcl(ga, gd, sge, cge)
  let m = newMoon(jde)
  l, b = m.lib(gl, gb)
  P = m.pa(gl, gb, b)
  return
}

M.TopocentricCorrections = function (jde, b, P, gf, gd, H, gp) { // (jde, b, P, gf, gd, H, gp float64)  (gDl, gDb, gDP float64)
  sgf, cgf := base.sincos(gf)
  sH, cH := base.sincos(H)
  sgd, cgd := base.sincos(gd)
  let Q = Math.atan(cgf * sH / (cgd*sgf - sgd*cgf*cH))
  let z = Math.acos(sgd*sgf + cgd*cgf*cH)
  let gp_ = gp * (Math.sin(z) + 0.0084*Math.sin(2*z))
  sQP, cQP := base.sincos(Q - P)
  gDl = -gp_ * sQP / Math.cos(b)
  gDb = gp_ * cQP
  gDP = gDl*Math.sin(b+gDb) - gp_*Math.sin(Q)*Math.tan(gd)
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
M.sunAltitude = function (cOnMoon, cSun) { // (gh, gth, l0, b0 float64)  float64
  let c0 = Math.PI / 2 - cSun.lon
  let [sb0, cb0] = base.sincos(cSun.lat)
  let [sgth, cgth] = base.sincos(cOnMoon.lat)
  return Math.asin(sb0 * sgth + cb0 * cgth * Math.sin(c0 + cOnMoon.lon))
}

/**
 * Sunrise returns time of sunrise for a point on the Moon near the given date.
 *
 * @param {base.Coord} cOnMoon - selenographic longitude and latitude of a site on the Moon
 * @param {Number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 Planet Earth
 * @return time of sunrise as a jde nearest the given jde.
 */
M.sunrise = function (cOnMoon, jde, earth) { // (gh, gth, jde float64, earth *pp.V87Planet)  float64
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
M.sunset = function (cOnMoon, jde, earth) { // (gh, gth, jde float64, earth *pp.V87Planet)  float64
  jde += srCorr(cOnMoon, jde, earth)
  return jde + srCorr(cOnMoon, jde, earth)
}

/**
 * @private
 */
function srCorr (cOnMoon, jde, earth) {
  let phy = M.physical(jde, earth)
  let h = M.sunAltitude(cOnMoon, phy[2])
  return h / (12.19075 * p * Math.cos(cOnMoon.lat))
}
