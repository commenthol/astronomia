/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module angle
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
const {abs, acos, asin, atan2, cos, hypot, sin, sqrt, tan} = Math

const M = exports

/**
 * `sep` returns the angular separation between two celestial bodies.
 *
 * The algorithm is numerically naïve, and while patched up a bit for
 * small separations, remains unstable for separations near π.
 *
 * @param {base.Coord} c1 - coordinate of celestial body 1
 * @param {base.Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
M.sep = function (c1, c2) {
  let [sind1, cosd1] = base.sincos(c1.dec)
  let [sind2, cosd2] = base.sincos(c2.dec)
  let cd = sind1 * sind2 + cosd1 * cosd2 * cos(c1.ra - c2.ra) // (17.1) p. 109
  if (cd < base.CosSmallAngle) {
    return acos(cd)
  }
  return hypot((c2.ra - c1.ra) * cosd1, c2.dec - c1.dec) // (17.2) p. 109
}

/**
 * `minSep` returns the minimum separation between two moving objects.
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
 * @param {Number} jd1 - Julian day - time at cs1[0], cs2[0]
 * @param {Number} jd3 - Julian day - time at cs1[2], cs2[2]
 * @param {base.Coord[]} cs1 - 3 coordinates of moving object 1
 * @param {base.Coord[]} cs2 - 3 coordinates of moving object 2
 * @param {function} [fnSep] - alternative `sep` function e.g. `angle.sepPauwels`, `angle.sepHav`
 * @return {Number} angular separation between two celestial bodies
 */
M.minSep = function (jd1, jd3, cs1, cs2, fnSep) {
  fnSep = fnSep || M.sep
  if (cs1.length !== 3 || cs2.length !== 3) {
    throw interp.errorNot3
  }
  let y = new Array(3)
  cs1.forEach((c, x) => {
    y[x] = M.sep(cs1[x], cs2[x])
  })
  let d3 = new interp.Len3(jd1, jd3, y)
  let dMin = d3.extremum()[1]
  return dMin
}

/**
 * `minSepRect` returns the minimum separation between two moving objects.
 *
 * Like `minSep`, but using a method of rectangular coordinates that gives
 * accurate results even for close approaches.
 *
 * @throws Error
 * @param {Number} jd1 - Julian day - time at cs1[0], cs2[0]
 * @param {Number} jd3 - Julian day - time at cs1[2], cs2[2]
 * @param {base.Coord[]} cs1 - 3 coordinates of moving object 1
 * @param {base.Coord[]} cs2 - 3 coordinates of moving object 2
 * @return {Number} angular separation between two celestial bodies
 */
M.minSepRect = function (jd1, jd3, cs1, cs2) {
  if (cs1.length !== 3 || cs2.length !== 3) {
    throw interp.ErrorNot3
  }
  let uv = function (c1, c2) {
    let [sind1, cosd1] = base.sincos(c1.dec)
    let Δr = c2.ra - c1.ra
    let tanΔr = tan(Δr)
    let tanhΔr = tan(Δr / 2)
    let K = 1 / (1 + sind1 * sind1 * tanΔr * tanhΔr)
    let sinΔd = sin(c2.dec - c1.dec)
    let u = -K * (1 - (sind1 / cosd1) * sinΔd) * cosd1 * tanΔr
    let v = K * (sinΔd + sind1 * cosd1 * tanΔr * tanhΔr)
    return [u, v]
  }
  let us = new Array(3).fill(0)
  let vs = new Array(3).fill(0)
  cs1.forEach((c, x) => {
    [us[x], vs[x]] = uv(cs1[x], cs2[x])
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
    if (abs(dn) < 1e-5) {
      return hypot(u, v) // success
    }
    let up = up0 + n * up1
    let vp = vp0 + n * vp1
    dn = -(u * up + v * vp) / (up * up + vp * vp)
    n += dn
  }
  throw new Error('minSepRect: failure to converge')
}

/**
 * haversine function (17.5) p. 115
 */
M.hav = function (a) {
  return 0.5 * (1 - Math.cos(a))
}

/**
 * `sepHav` returns the angular separation between two celestial bodies.
 *
 * The algorithm uses the haversine function and is superior to the naïve
 * algorithm of the Sep function.
 *
 * @param {base.Coord} c1 - coordinate of celestial body 1
 * @param {base.Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
M.sepHav = function (c1, c2) {
  // using (17.5) p. 115
  return 2 * asin(sqrt(M.hav(c2.dec - c1.dec) +
    cos(c1.dec) * cos(c2.dec) * M.hav(c2.ra - c1.ra)))
}

/**
 * Same as `minSep` but uses function `sepHav` to return the minimum separation
 * between two moving objects.
 */
M.minSepHav = function (jd1, jd3, cs1, cs2) {
  return M.minSep(jd1, jd3, cs1, cs2, M.sepHav)
}

/**
 * `sepPauwels` returns the angular separation between two celestial bodies.
 *
 * The algorithm is a numerically stable form of that used in `sep`.
 *
 * @param {base.Coord} c1 - coordinate of celestial body 1
 * @param {base.Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
M.sepPauwels = function (c1, c2) {
  let [sind1, cosd1] = base.sincos(c1.dec)
  let [sind2, cosd2] = base.sincos(c2.dec)
  let cosdr = cos(c2.ra - c1.ra)
  let x = cosd1 * sind2 - sind1 * cosd2 * cosdr
  let y = cosd2 * sin(c2.ra - c1.ra)
  let z = sind1 * sind2 + cosd1 * cosd2 * cosdr
  return atan2(hypot(x, y), z)
}

/**
 * Same as `minSep` but uses function `sepPauwels` to return the minimum
 * separation between two moving objects.
 */
M.minSepPauwels = function (jd1, jd3, cs1, cs2) {
  return M.minSep(jd1, jd3, cs1, cs2, M.sepPauwels)
}

/**
 * RelativePosition returns the position angle of one body with respect to
 * another.
 *
 * The position angle result `p` is measured counter-clockwise from North.
 * If negative then `p` is in the range of 90° ... 270°
 *
 * ````
 *                  North
 *                    |
 *             (p)  ..|
 *                 .  |
 *                V   |
 *    c1 x------------x c2
 *                    |
 * ````
 *
 * @param {base.Coord} c1 - coordinate of celestial body 1
 * @param {base.Coord} c2 - coordinate of celestial body 2
 * @return {Number} position angle (p)
 */
M.relativePosition = function (c1, c2) {
  let [sinΔr, cosΔr] = base.sincos(c2.ra - c1.ra)
  let [sind2, cosd2] = base.sincos(c2.dec)
  let p = atan2(sinΔr, cosd2 * tan(c1.dec) - sind2 * cosΔr)
  return p
}
