/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module circle
 */
/**
 * Circle: Chapter 20, Smallest Circle containing three Celestial Bodies.
 */

import { Coord } from './base.js' // eslint-disable-line no-unused-vars

/**
 * Smallest finds the smallest circle containing three points.
 *
 * Arguments should represent coordinates in right ascension and declination
 * or longitude and latitude.  Result Δ is the diameter of the circle, typeI
 * is true if solution is of type I.
 *
 * @param {Coord} c1 - ra, dec point 1
 * @param {Coord} c2 - ra, dec point 2
 * @param {Coord} c3 - ra, dec point 3
 * @returns {Array} [Δ, typeI]
 *  {Number} Δ - diameter of the circle
 *  {Number} typeI - true - Two points on circle, one interior.
 *                   false - All three points on circle.
 */
export function smallest (c1, c2, c3) {
  // Using haversine formula
  const cd1 = Math.cos(c1.dec)
  const cd2 = Math.cos(c2.dec)
  const cd3 = Math.cos(c3.dec)
  let a = 2 * Math.asin(Math.sqrt(hav(c2.dec - c1.dec) + cd1 * cd2 * hav(c2.ra - c1.ra)))
  let b = 2 * Math.asin(Math.sqrt(hav(c3.dec - c2.dec) + cd2 * cd3 * hav(c3.ra - c2.ra)))
  let c = 2 * Math.asin(Math.sqrt(hav(c1.dec - c3.dec) + cd3 * cd1 * hav(c1.ra - c3.ra)))
  if (b > a) {
    [a, b] = noswap(b, a)
  }
  if (c > a) {
    [a, c] = noswap(c, a)
  }
  if (a * a >= b * b + c * c) {
    return [a, true]
  }
  // (20.1) p. 128
  return [2 * a * b * c / Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (a + c - b)), false]
}

const noswap = function (a, b) {
  return [a, b]
}

/**
 * haversine function (17.5) p. 115
 */
const hav = function (a) {
  return 0.5 * (1 - Math.cos(a))
}

export default {
  smallest
}
