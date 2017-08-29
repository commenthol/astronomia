/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sundial
 */
/**
 * Sundial: Chapter 58, Calculation of a Planar Sundial.
 */

const base = require('./base')

var M = module.exports

/**
 * Point return type represents a point to be used in constructing the sundial.
 */
function Point (x, y) {
  this.x = x || 0
  this.y = y || 0
}

/**
 * Line holds data to draw an hour line on the sundial.
 */
function Line (hour, points) {
  this.hour = hour            // 0 to 24
  this.points = points || []  // One or more points corresponding to the hour.
}

var m = [-23.44, -20.15, -11.47, 0, 11.47, 20.15, 23.44]

/**
 * General computes data for the general case of a planar sundial.
 *
 * Argument gf is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial, z is zenithal distance of the direction defined by the
 * stylus.  Angles gf, D, and z are in radians.  Units of stylus length a
 * are arbitrary.
 *
 * Results consist of a set of lines, a center point, u, the length of a
 * polar stylus, and gps, the angle which the polar stylus makes with the plane
 * of the sundial.  The center point, the points defining the hour lines, and
 * u are in units of a, the stylus length.  gps is in radians.
 */
M.general = function (gf, D, a, z) { // (gf, D, a, z float64)  (lines []Line, center Point, u, gps float64)
  let [sgf, cgf] = base.sincos(gf)
  let tgf = sgf / cgf
  let [sD, cD] = base.sincos(D)
  let [sz, cz] = base.sincos(z)
  let P = sgf * cz - cgf * sz * cD
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tgd = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tgf * tgd)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = sD * sz * sH + (cgf * cz + sgf * sz * cD) * cH + P * tgd
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      let Nx = cD * sH - sD * (sgf * cH - cgf * tgd)
      let Ny = cz * sD * sH - (cgf * sz - sgf * cz * cD) * cH - (sgf * sz + cgf * cz * cD) * tgd
      l.points.push(new Point(a * Nx / Q, a * Ny / Q))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point()
  center.x = a / P * cgf * sD
  center.y = -a / P * (sgf * sz + cgf * cz * cD)
  let aP = Math.abs(P)
  let u = a / aP
  let gps = Math.asin(aP)
  return {
    lines: lines,
    center: center,
    length: u,
    angle: gps
  }
}

/**
 * Equatorial computes data for a sundial level with the equator.
 *
 * Argument gf is geographic latitude at which the sundial will be located;
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * The sundial will have two sides, north and south.  Results n and s define
 * lines on the north and south sides of the sundial.  Result coordinates
 * are in units of a, the stylus length.
 */
M.equatorial = function (gf, a) { // (gf, a float64)  (n, s []Line)
  let tgf = Math.tan(gf)
  let n = []
  let s = []
  for (var i = 0; i < 24; i++) {
    let nl = new Line(i)
    let sl = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tgd = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tgf * tgd)
      if (aH > H0) {
        continue
      }
      let x = -a * sH / tgd
      let yy = a * cH / tgd
      if (tgd < 0) {
        sl.points.push(new Point(x, yy))
      } else {
        nl.points.push(new Point(x, -yy))
      }
    }
    if (nl.points.length > 0) {
      n.push(nl)
    }
    if (sl.points.length > 0) {
      s.push(sl)
    }
  }
  return {
    north: n,
    south: s
  }
}

/**
 * Horizontal computes data for a horizontal sundial.
 *
 * Argument gf is geographic latitude at which the sundial will be located,
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.horizontal = function (gf, a) { // (gf, a float64)  (lines []Line, center Point, u float64)
  let [sgf, cgf] = base.sincos(gf)
  let tgf = sgf / cgf
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tgd = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tgf * tgd)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = cgf * cH + sgf * tgd
      let x = a * sH / Q
      let y = a * (sgf * cH - cgf * tgd) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point(0, -a / tgf)
  let u = a / Math.abs(sgf)
  return {
    lines: lines,
    center: center,
    length: u
  }
}

/**
 * Vertical computes data for a vertical sundial.
 *
 * Argument gf is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.vertical = function (gf, D, a) { // (gf, D, a float64)  (lines []Line, center Point, u float64)
  let [sgf, cgf] = base.sincos(gf)
  let tgf = sgf / cgf
  let [sD, cD] = base.sincos(D)
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tgd = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tgf * tgd)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = sD * sH + sgf * cD * cH - cgf * cD * tgd
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      let x = a * (cD * sH - sgf * sD * cH + cgf * sD * tgd) / Q
      let y = -a * (cgf * cH + sgf * tgd) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point()
  center.x = -a * sD / cD
  center.y = a * tgf / cD
  let u = a / Math.abs(cgf * cD)
  return {
    lines: lines,
    center: center,
    length: u
  }
}
