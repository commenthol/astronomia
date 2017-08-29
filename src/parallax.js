/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallax
 */
/**
 * Parallax: Chapter 40, Correction for Parallax.
 */

const base = require('./base')
const globe = require('./globe')
const sidereal = require('./sidereal')
const sexa = require('./sexagesimal')

const M = exports

const horPar = (8.794 / 3600) * Math.PI / 180 // 8".794 arcseconds in radians

/**
 * Horizontal returns equatorial horizontal parallax of a body.
 *
 * @param {number} gD - distance in AU.
 * @return {number} parallax in radians.
 */
M.horizontal = function (gD) {
  // (40.1) p. 279
  return Math.asin(Math.sin(horPar) / gD)
  // return horPar / gD // with sufficient accuracy
}

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments ga, gd are geocentric right ascension and declination in radians.
 * gD is distance to the observed object in AU. grsgf_, grcgf_ are parallax
 * constants (see package globe.) lon is geographic longitude of the observer,
 * jde is time of observation.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric = function (c, grsgf, grcgf, lon, jde) {
  let [ga, gd, gD] = [c.ra, c.dec, c.range]
  let gp = M.horizontal(gD)
  let gth0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(gth0 - lon - ga, 2 * Math.PI)
  let sgp = Math.sin(gp)
  let [sH, cH] = base.sincos(H)
  let [sgd, cgd] = base.sincos(gd)
  let gDga = Math.atan2(-grcgf * sgp * sH, cgd - grcgf * sgp * cH) // (40.2) p. 279
  let ga_ = ga + gDga
  let gd_ = Math.atan2((sgd - grsgf * sgp) * Math.cos(gDga), cgd - grcgf * sgp * cH) // (40.3) p. 279
  return new base.Coord(ga_, gd_)
}

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric2 = function (c, grsgf, grcgf, lon, jde) {
  let [ga, gd, gD] = [c.ra, c.dec, c.range]
  let gp = M.horizontal(gD)
  let gth0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(gth0 - lon - ga, 2 * Math.PI)
  let [sH, cH] = base.sincos(H)
  let [sgd, cgd] = base.sincos(gd)
  let gDga = -gp * grcgf * sH / cgd // (40.4) p. 280
  let gDgd = -gp * (grsgf * cgd - grcgf * cH * sgd) // (40.5) p. 280
  return new base.Coord(gDga, gDgd)
}

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Array}
 *    {number} H_ - topocentric hour angle
 *    {number} gd_ - topocentric declination
 */
M.topocentric3 = function (c, grsgf_, grcgf_, lon, jde) {
  let [ga, gd, gD] = [c.ra, c.dec, c.range]
  let gp = M.horizontal(gD)
  let gth0 = new sexa.Time(sidereal.apparent(jde)).rad()
  let H = base.pmod(gth0 - lon - ga, 2 * Math.PI)
  let sgp = Math.sin(gp)
  let [sH, cH] = base.sincos(H)
  let [sgd, cgd] = base.sincos(gd)
  let A = cgd * sH
  let B = cgd * cH - grcgf_ * sgp
  let C = sgd - grsgf_ * sgp
  let q = Math.sqrt(A * A + B * B + C * C)
  let H_ = Math.atan2(A, B)
  let gd_ = Math.asin(C / q)
  return [H_, gd_]
}

/**
 * TopocentricEcliptical returns topocentric ecliptical coordinates including parallax.
 *
 * Arguments `c` are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. gf, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ge is the obliquity of the
 * ecliptic, gth is local sidereal time, gp is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} s - geocentric semidiameter of `c`
 * @param {number} gf - observer's latitude
 * @param {number} h - observer's height above the ellipsoid in meters
 * @param {number} ge - is the obliquity of the ecliptic
 * @param {number} gth - local sidereal time
 * @param {number} gp - equatorial horizontal parallax of the body
 * @return {Array}
 *    {number} gl_ - observed topocentric longitude
 *    {number} gb_ - observed topocentric latitude
 *    {number} s_ - observed topocentric semidiameter
 */
M.topocentricEcliptical = function (c, s, gf, h, ge, gth, gp) {
  let [gl, gb] = [c.lon, c.lat]
  let [S, C] = globe.Earth76.parallaxConstants(gf, h)
  let [sgl, cgl] = base.sincos(gl)
  let [sgb, cgb] = base.sincos(gb)
  let [sge, cge] = base.sincos(ge)
  let [sgth, cgth] = base.sincos(gth)
  let sgp = Math.sin(gp)
  let N = cgl * cgb - C * sgp * cgth
  let gl_ = Math.atan2(sgl * cgb - sgp * (S * sge + C * cge * sgth), N)
  if (gl_ < 0) {
    gl_ += 2 * Math.PI
  }
  let cgl_ = Math.cos(gl_)
  let gb_ = Math.atan(cgl_ * (sgb - sgp * (S * cge - C * sge * sgth)) / N)
  let s_ = Math.asin(cgl_ * Math.cos(gb_) * Math.sin(s) / N)
  return [gl_, gb_, s_]
}
