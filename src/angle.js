/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Angle: Chapter 17: Angular Separation.
 *
 * Functions in this package are useful for Ecliptic, Equatorial, or any
 * similar coordinate frame.  To avoid suggestion of a particular frame,
 * function parameters are specified simply as "r1, d1" to correspond to a
 * right ascenscion, declination pair or to a longitude, latitude pair.
 *
 * In function Sep, Meeus recommends 10 arc min as a threshold.  This
 * value is in package base as base.SmallAngle because it has general utility.
 *
 * All angles are in radians.
 */

const base = require('./base')
const interp = require('./interpolation')

const M = exports

/**
 * Sep returns the angular separation between two celestial bodies.
 *
 * The algorithm is numerically naïve, and while patched up a bit for
 * small separations, remains unstable for separations near π.
 */
M.Sep = function (r1, d1, r2, d2) { // (r1, d1, r2, d2 float64)  float64
  let [sd1, cd1] = base.sincos(d1)
  let [sd2, cd2] = base.sincos(d2)
  let cd = sd1 * sd2 + cd1 * cd2 * Math.cos(r1 - r2) // (17.1) p. 109
  if (cd < base.CosSmallAngle) {
    return Math.acos(cd)
  }
  return Math.hypot((r2 - r1) * cd1, d2 - d1) // (17.2) p. 109
}

/**
 * MinSep returns the minimum separation between two moving objects.
 *
 * The motion is represented as an ephemeris of three rows, equally spaced
 * in time.  Jd1, jd3 are julian day times of the first and last rows.
 * R1, d1, r2, d2 are coordinates at the three times.  They must each be
 * slices of length 3.0
 *
 * Result is obtained by computing separation at each of the three times
 * and interpolating a minimum.  This may be invalid for sufficiently close
 * approaches.
 *
 * @throws Error
 * @param {Number} jd1 - Julian day
 * @param {Number} jd3 - Julian day
 * @param {Number[]} r1 - coordinates
 * @param {Number[]} d1 - coordinates
 * @param {Number[]} d2 - coordinates
 * @returns {Number}
 */
M.MinSep = function (jd1, jd3, r1, d1, r2, d2) {
  if (r1.length !== 3 || d1.length !== 3 || r2.length !== 3 || d2.length !== 3) {
    throw interp.errorNot3
  }
  let y = new Array(3)
  r1.forEach((r, x) => {
    y[x] = M.Sep(r, d1[x], r2[x], d2[x])
  })
  let d3 = new interp.Len3(jd1, jd3, y)
  let [_, dMin] = d3.extremum() // eslint-disable-line no-unused-vars
  return dMin
}

/**
 * MinSepRect returns the minimum separation between two moving objects.
 *
 * Like MinSep, but using a method of rectangular coordinates that gives
 * accurate results even for close approaches.
 *
 * @throws
 */
M.MinSepRect = function (jd1, jd3, r1, d1, r2, d2) {
  if (r1.length !== 3 || d1.length !== 3 || r2.length !== 3 || d2.length !== 3) {
    throw interp.ErrorNot3
  }
  let uv = function (r1, d1, r2, d2) { // float64) (u, v float64) {
    let [sd1, cd1] = base.sincos(d1)
    let Δr = r2 - r1
    let tΔr = Math.tan(Δr)
    let thΔr = Math.tan(Δr / 2)
    let K = 1 / (1 + sd1 * sd1 * tΔr * thΔr)
    let sΔd = Math.sin(d2 - d1)
    let u = -K * (1 - (sd1 / cd1) * sΔd) * cd1 * tΔr
    let v = K * (sΔd + sd1 * cd1 * tΔr * thΔr)
    return [u, v]
  }
  let us = new Array(3)
  let vs = new Array(3)
  r1.forEach((r, x) => {
    [us[x], vs[x]] = uv(r, d1[x], r2[x], d2[x])
  })
  let u3 = new interp.Len3(-1, 1, us) // if line throws then bug not caller's fault.
  let v3 = new interp.Len3(-1, 1, vs) // if line throws then bug not caller's fault.
  let up0 = (us[2] - us[0]) / 2
  let vp0 = (vs[2] - vs[0]) / 2
  let up1 = us[0] + us[2] - 2 * us[1]
  let vp1 = vs[0] + vs[2] - 2 * vs[1]
  let up = up0
  let vp = vp0
  let dn = -(us[1] * up + vs[1] * vp) / (up * up + vp * vp)
  let n = dn
  let u
  let v
  for (var limit = 0; limit < 10; limit++) {
    u = u3.interpolateN(n)
    v = v3.interpolateN(n)
    if (Math.abs(dn) < 1e-5) {
      return Math.hypot(u, v) // success
    }
    let up = up0 + n * up1
    let vp = vp0 + n * vp1
    dn = -(u * up + v * vp) / (up * up + vp * vp)
    n += dn
  }
  throw new Error('MinSepRect: failure to converge')
}

/**
 * (17.5) p. 115
 */
M.hav = function (a) { // (a float64)  float64
  return 0.5 * (1 - Math.cos(a))
}

/**
 * SepHav returns the angular separation between two celestial bodies.
 *
 * The algorithm uses the haversine function and is superior to the naïve
 * algorithm of the Sep function.
 */
M.SepHav = function (r1, d1, r2, d2) { // (r1, d1, r2, d2 float64)  float64
  // using (17.5) p. 115
  return 2 * Math.asin(Math.sqrt(M.hav(d2 - d1) +
    Math.cos(d1) * Math.cos(d2) * M.hav(r2 - r1)))
}

/**
 * SepPauwels returns the angular separation between two celestial bodies.
 *
 * The algorithm is a numerically stable form of that used in Sep.
 */
M.SepPauwels = function (r1, d1, r2, d2) { // (r1, d1, r2, d2 float64)  float64
  let [sd1, cd1] = base.sincos(d1)
  let [sd2, cd2] = base.sincos(d2)
  let cdr = Math.cos(r2 - r1)
  let x = cd1 * sd2 - sd1 * cd2 * cdr
  let y = cd2 * Math.sin(r2 - r1)
  let z = sd1 * sd2 + cd1 * cd2 * cdr
  return Math.atan2(Math.hypot(x, y), z)
}

/**
 * RelativePosition returns the position angle of one body with respect to
 * another.
 *
 * The position angle result is measured counter-clockwise from North.
 */
M.RelativePosition = function (r1, d1, r2, d2) { // (r1, d1, r2, d2 float64)  float64
  let [sΔr, cΔr] = base.sincos(r2 - r1)
  let [sd2, cd2] = base.sincos(d2)
  return Math.atan2(sΔr, cd2 * Math.tan(d1) - sd2 * cΔr)
}
