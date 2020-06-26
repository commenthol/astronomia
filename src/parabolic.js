/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parabolic
 */
/**
 * Parabolic: Chapter 34, Parabolic Motion.
 */
import base from './base'

/**
 * Elements holds parabolic elements needed for computing true anomaly and distance.
 */
export class Elements {
  /**
   * @param {Number} timeP - time of perihelion, T
   * @param {Number} pDis - perihelion distance, q
   */
  constructor (timeP, pDis) {
    this.timeP = timeP
    this.pDis = pDis
  }

  /**
   * AnomalyDistance returns true anomaly and distance of a body in a parabolic orbit of the Sun.
   *
   * @param {Number} jde - Julian ephemeris day
   * @returns {Object} {ano, dist}
   *   {Number} ano - True anomaly ν in radians.
   *   {Number} dist - Distance r returned in AU.
   */
  anomalyDistance (jde) {
    const W = 3 * base.K / Math.SQRT2 * (jde - this.timeP) / this.pDis / Math.sqrt(this.pDis)
    const G = W * 0.5
    const Y = Math.cbrt(G + Math.sqrt(G * G + 1))
    const s = Y - 1 / Y
    const ν = 2 * Math.atan(s)
    const r = this.pDis * (1 + s * s)
    return {
      ano: ν,
      dist: r
    }
  }
}

export default {
  Elements
}
