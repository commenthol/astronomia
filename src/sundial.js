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
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial, z is zenithal distance of the direction defined by the
 * stylus.  Angles φ, D, and z are in radians.  Units of stylus length a
 * are arbitrary.
 *
 * Results consist of a set of lines, a center point, u, the length of a
 * polar stylus, and ψ, the angle which the polar stylus makes with the plane
 * of the sundial.  The center point, the points defining the hour lines, and
 * u are in units of a, the stylus length.  ψ is in radians.
 */
M.general = function (φ, D, a, z) { // (φ, D, a, z float64)  (lines []Line, center Point, u, ψ float64)
  let [sφ, cφ] = base.sincos(φ)
  let tφ = sφ / cφ
  let [sD, cD] = base.sincos(D)
  let [sz, cz] = base.sincos(z)
  let P = sφ * cz - cφ * sz * cD
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tδ = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = sD * sz * sH + (cφ * cz + sφ * sz * cD) * cH + P * tδ
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      let Nx = cD * sH - sD * (sφ * cH - cφ * tδ)
      let Ny = cz * sD * sH - (cφ * sz - sφ * cz * cD) * cH - (sφ * sz + cφ * cz * cD) * tδ
      l.points.push(new Point(a * Nx / Q, a * Ny / Q))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point()
  center.x = a / P * cφ * sD
  center.y = -a / P * (sφ * sz + cφ * cz * cD)
  let aP = Math.abs(P)
  let u = a / aP
  let ψ = Math.asin(aP)
  return {
    lines: lines,
    center: center,
    length: u,
    angle: ψ
  }
}

/**
 * Equatorial computes data for a sundial level with the equator.
 *
 * Argument φ is geographic latitude at which the sundial will be located;
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * The sundial will have two sides, north and south.  Results n and s define
 * lines on the north and south sides of the sundial.  Result coordinates
 * are in units of a, the stylus length.
 */
M.equatorial = function (φ, a) { // (φ, a float64)  (n, s []Line)
  let tφ = Math.tan(φ)
  let n = []
  let s = []
  for (var i = 0; i < 24; i++) {
    let nl = new Line(i)
    let sl = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tδ = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue
      }
      let x = -a * sH / tδ
      let yy = a * cH / tδ
      if (tδ < 0) {
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
 * Argument φ is geographic latitude at which the sundial will be located,
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.horizontal = function (φ, a) { // (φ, a float64)  (lines []Line, center Point, u float64)
  let [sφ, cφ] = base.sincos(φ)
  let tφ = sφ / cφ
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tδ = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = cφ * cH + sφ * tδ
      let x = a * sH / Q
      let y = a * (sφ * cH - cφ * tδ) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point(0, -a / tφ)
  let u = a / Math.abs(sφ)
  return {
    lines: lines,
    center: center,
    length: u
  }
}

/**
 * Vertical computes data for a vertical sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.vertical = function (φ, D, a) { // (φ, D, a float64)  (lines []Line, center Point, u float64)
  let [sφ, cφ] = base.sincos(φ)
  let tφ = sφ / cφ
  let [sD, cD] = base.sincos(D)
  let lines = []
  for (var i = 0; i < 24; i++) {
    let l = new Line(i)
    let H = (i - 12) * 15 * Math.PI / 180
    let aH = Math.abs(H)
    let [sH, cH] = base.sincos(H)
    for (var d of m) {
      let tδ = Math.tan(d * Math.PI / 180)
      let H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      let Q = sD * sH + sφ * cD * cH - cφ * cD * tδ
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      let x = a * (cD * sH - sφ * sD * cH + cφ * sD * tδ) / Q
      let y = -a * (cφ * cH + sφ * tδ) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  let center = new Point()
  center.x = -a * sD / cD
  center.y = a * tφ / cD
  let u = a / Math.abs(cφ * cD)
  return {
    lines: lines,
    center: center,
    length: u
  }
}
