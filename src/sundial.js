/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sundial
 */
/**
 * Sundial: Chapter 58, Calculation of a Planar Sundial.
 */

import base from './base.js'

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
  this.hour = hour // 0 to 24
  this.points = points || [] // One or more points corresponding to the hour.
}

const m = [-23.44, -20.15, -11.47, 0, 11.47, 20.15, 23.44]

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
export function general (φ, D, a, z) { // (φ, D, a, z float64)  (lines []Line, center Point, u, ψ float64)
  const [sφ, cφ] = base.sincos(φ)
  const tφ = sφ / cφ
  const [sD, cD] = base.sincos(D)
  const [sz, cz] = base.sincos(z)
  const P = sφ * cz - cφ * sz * cD
  const lines = []
  for (let i = 0; i < 24; i++) {
    const l = new Line(i)
    const H = (i - 12) * 15 * Math.PI / 180
    const aH = Math.abs(H)
    const [sH, cH] = base.sincos(H)
    for (const d of m) {
      const tδ = Math.tan(d * Math.PI / 180)
      const H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      const Q = sD * sz * sH + (cφ * cz + sφ * sz * cD) * cH + P * tδ
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      const Nx = cD * sH - sD * (sφ * cH - cφ * tδ)
      const Ny = cz * sD * sH - (cφ * sz - sφ * cz * cD) * cH - (sφ * sz + cφ * cz * cD) * tδ
      l.points.push(new Point(a * Nx / Q, a * Ny / Q))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  const center = new Point()
  center.x = a / P * cφ * sD
  center.y = -a / P * (sφ * sz + cφ * cz * cD)
  const aP = Math.abs(P)
  const u = a / aP
  const ψ = Math.asin(aP)
  return {
    lines,
    center,
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
export function equatorial (φ, a) { // (φ, a float64)  (n, s []Line)
  const tφ = Math.tan(φ)
  const n = []
  const s = []
  for (let i = 0; i < 24; i++) {
    const nl = new Line(i)
    const sl = new Line(i)
    const H = (i - 12) * 15 * Math.PI / 180
    const aH = Math.abs(H)
    const [sH, cH] = base.sincos(H)
    for (const d of m) {
      const tδ = Math.tan(d * Math.PI / 180)
      const H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue
      }
      const x = -a * sH / tδ
      const yy = a * cH / tδ
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
export function horizontal (φ, a) { // (φ, a float64)  (lines []Line, center Point, u float64)
  const [sφ, cφ] = base.sincos(φ)
  const tφ = sφ / cφ
  const lines = []
  for (let i = 0; i < 24; i++) {
    const l = new Line(i)
    const H = (i - 12) * 15 * Math.PI / 180
    const aH = Math.abs(H)
    const [sH, cH] = base.sincos(H)
    for (const d of m) {
      const tδ = Math.tan(d * Math.PI / 180)
      const H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      const Q = cφ * cH + sφ * tδ
      const x = a * sH / Q
      const y = a * (sφ * cH - cφ * tδ) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  const center = new Point(0, -a / tφ)
  const u = a / Math.abs(sφ)
  return {
    lines,
    center,
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
export function vertical (φ, D, a) { // (φ, D, a float64)  (lines []Line, center Point, u float64)
  const [sφ, cφ] = base.sincos(φ)
  const tφ = sφ / cφ
  const [sD, cD] = base.sincos(D)
  const lines = []
  for (let i = 0; i < 24; i++) {
    const l = new Line(i)
    const H = (i - 12) * 15 * Math.PI / 180
    const aH = Math.abs(H)
    const [sH, cH] = base.sincos(H)
    for (const d of m) {
      const tδ = Math.tan(d * Math.PI / 180)
      const H0 = Math.acos(-tφ * tδ)
      if (aH > H0) {
        continue // sun below horizon
      }
      const Q = sD * sH + sφ * cD * cH - cφ * cD * tδ
      if (Q < 0) {
        continue // sun below plane of sundial
      }
      const x = a * (cD * sH - sφ * sD * cH + cφ * sD * tδ) / Q
      const y = -a * (cφ * cH + sφ * tδ) / Q
      l.points.push(new Point(x, y))
    }
    if (l.points.length > 0) {
      lines.push(l)
    }
  }
  const center = new Point()
  center.x = -a * sD / cD
  center.y = a * tφ / cD
  const u = a / Math.abs(cφ * cD)
  return {
    lines,
    center,
    length: u
  }
}

export default {
  general,
  equatorial,
  horizontal,
  vertical
}
