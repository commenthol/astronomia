/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module elementequinox
 */
/**
 * Elementequinox: Chapter 24, Reduction of Ecliptical Elements
 * from one Equinox to another one.
 *
 * See package precess for the method EclipticPrecessor.ReduceElements and
 * associated example.  The method is described in this chapter but located
 * in package precess so that it can be a method of EclipticPrecessor.
 */

import base from './base'

/**
 * Elements are the orbital elements of a solar system object which change
 * from one equinox to another.
 *
 * @param {Number} inc  - inclination
 * @param {Number} node - longitude of ascending node (Ω)
 * @param {Number} peri - argument of perihelion (ω)
 */
export class Elements {
  constructor (inc, node, peri) {
    if (typeof inc === 'object') {
      node = inc.pode
      peri = inc.peri
      inc = inc.inc
    }
    this.inc = inc || 0
    this.node = node || 0
    this.peri = peri || 0
  }
}

// (24.4) p. 161
const S = 0.0001139788
const C = 0.9999999935
/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 to J2000.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
export function reduceB1950ToJ2000 (eFrom) {
  const W = eFrom.node - 174.298782 * Math.PI / 180
  const [si, ci] = base.sincos(eFrom.inc)
  const [sW, cW] = base.sincos(W)
  const A = si * sW
  const B = C * si * cW - S * ci
  const eTo = new Elements()
  eTo.inc = Math.asin(Math.hypot(A, B))
  eTo.node = base.pmod(174.997194 * Math.PI / 180 + Math.atan2(A, B),
    2 * Math.PI)
  eTo.peri = base.pmod(eFrom.peri + Math.atan2(-S * sW, C * si - S * ci * cW),
    2 * Math.PI)
  return eTo
}

const Lp = 4.50001688 * Math.PI / 180
const L = 5.19856209 * Math.PI / 180
const J = 0.00651966 * Math.PI / 180

/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 in the FK4 system to equinox J2000 in the FK5 system.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
export function reduceB1950FK4ToJ2000FK5 (eFrom) {
  const W = L + eFrom.node
  const [si, ci] = base.sincos(eFrom.inc)
  const [sJ, cJ] = base.sincos(J)
  const [sW, cW] = base.sincos(W)
  const eTo = new Elements()
  eTo.inc = Math.acos(ci * cJ - si * sJ * cW)
  eTo.node = base.pmod(Math.atan2(si * sW, ci * sJ + si * cJ * cW) - Lp,
    2 * Math.PI)
  eTo.peri = base.pmod(eFrom.peri + Math.atan2(sJ * sW, si * cJ + ci * sJ * cW),
    2 * Math.PI)
  return eTo
}

export default {
  Elements,
  reduceB1950ToJ2000,
  reduceB1950FK4ToJ2000FK5
}
