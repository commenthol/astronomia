/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallactic
 */
/**
 * Parallactic: Chapter 14, The Parallactic Angle, and three other Topics.
 */

const base = require('./base')

const M = exports

/**
 * ParallacticAngle returns parallactic angle of a celestial object.
 *
 *  gf is geographic latitude of observer.
 *  gd is declination of observed object.
 *  H is hour angle of observed object.
 *
 * All angles including result are in radians.
 */
M.parallacticAngle = function (gf, gd, H) { // (gf, gd, H float64)  float64
  let [sgd, cgd] = base.sincos(gd)
  let [sH, cH] = base.sincos(H)
  return Math.atan2(sH, Math.tan(gf) * cgd - sgd * cH) // (14.1) p. 98
}

/**
 * ParallacticAngleOnHorizon is a special case of ParallacticAngle.
 *
 * The hour angle is not needed as an input and the math inside simplifies.
 */
M.parallacticAngleOnHorizon = function (gf, gd) { // (gf, gd float64)  float64
  return Math.acos(Math.sin(gf) / Math.cos(gd))
}

/**
 * EclipticAtHorizon computes how the plane of the ecliptic intersects
 * the horizon at a given local sidereal time as observed from a given
 * geographic latitude.
 *
 *  ge is obliquity of the ecliptic.
 *  gf is geographic latitude of observer.
 *  gth is local sidereal time expressed as an hour angle.
 *
 *  gl1 and gl2 are ecliptic longitudes where the ecliptic intersects the horizon.
 *  I is the angle at which the ecliptic intersects the horizon.
 *
 * All angles, arguments and results, are in radians.
 */
M.eclipticAtHorizon = function (ge, gf, gth) { // (ge, gf, gth float64)  (gl1, gl2, I float64)
  let [sge, cge] = base.sincos(ge)
  let [sgf, cgf] = base.sincos(gf)
  let [sgth, cgth] = base.sincos(gth)
  let gl = Math.atan2(-cgth, sge * (sgf / cgf) + cge * sgth) // (14.2) p. 99
  if (gl < 0) {
    gl += Math.PI
  }
  return [gl, gl + Math.PI, Math.acos(cge * sgf - sge * cgf * sgth)] // (14.3) p. 99
}

/**
 * EclipticAtEquator computes the angle between the ecliptic and the parallels
 * of ecliptic latitude at a given ecliptic longitude.
 *
 * (The function name EclipticAtEquator is for consistency with the Meeus text,
 * and works if you consider the equator a nominal parallel of latitude.)
 *
 *  gl is ecliptic longitude.
 *  ge is obliquity of the ecliptic.
 *
 * All angles in radians.
 */
M.eclipticAtEquator = function (gl, ge) { // (gl, ge float64)  float64
  return Math.atan(-Math.cos(gl) * Math.tan(ge))
}

/**
 * DiurnalPathAtHorizon computes the angle of the path a celestial object
 * relative to the horizon at the time of its rising or setting.
 *
 *  gd is declination of the object.
 *  gf is geographic latitude of observer.
 *
 * All angles in radians.
 */
M.diurnalPathAtHorizon = function (gd, gf) { // (gd, gf float64)  (J float64)
  let tgf = Math.tan(gf)
  let b = Math.tan(gd) * tgf
  let c = Math.sqrt(1 - b * b)
  return Math.atan(c * Math.cos(gd) / tgf)
}
