/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module conjunction
 */
/**
 * Conjunction: Chapter 18: Planetary Conjunctions.
 */

import { Coord } from './base.js' // eslint-disable-line no-unused-vars
import interp from './interpolation.js'

/**
 * Planetary computes a conjunction between two moving objects, such as planets.
 *
 * Conjunction is found with interpolation against length 5 ephemerides.
 *
 * t1, t5 are times of first and last rows of ephemerides.  The scale is
 * arbitrary.
 *
 * cs1 is the ephemeris of the first object. The columns may be celestial
 * coordinates in right ascension and declination or ecliptic coordinates in
 * longitude and latitude.
 *
 * cs2 is the ephemeris of the second object, in the same frame as the first.
 *
 * Return value t is time of conjunction in the scale of t1, t5.
 *
 * @param {Number} t1 - julian ephemeris day of first row
 * @param {Number} t5 - julian ephemeris day of fifth row
 * @param {Coord[]} cs1 - ephemeris of first moving object
 * @param {Coord[]} cs2 - ephemeris of decond moving object
 * @return {Array}
 *    {Number} t - time of conjunction in JDE
 *    {Number} Δd - is the amount that object 2 was "above" object 1 at the time of conjunction.
 */
export function planetary (t1, t5, cs1, cs2) {
  if (cs1.length !== 5 || cs2.length !== 5) {
    throw new Error('Five rows required in ephemerides')
  }
  const dr = new Array(5)
  const dd = new Array(5)
  cs1.forEach((r, i) => {
    dr[i] = cs2[i].ra - cs1[i].ra
    dd[i] = cs2[i].dec - cs1[i].dec
  })
  return conj(t1, t5, dr, dd)
}

/**
 * Stellar computes a conjunction between a moving and non-moving object.
 *
 * Arguments and return values same as with Planetary, except the non-moving
 * object is c1.  The ephemeris of the moving object is cs2.
 *
 * @param {Number} t1 - julian ephemeris day of first row
 * @param {Number} t5 - julian ephemeris day of fifth row
 * @param {Coord} c1 - ephemeris of non-moving object
 * @param {Coord[]} cs2 - ephemeris of moving object
 * @return {Array}
 *    {Number} t - time of conjunction in JDE
 *    {Number} Δd - is the amount that object 2 was "above" object 1 at the time of conjunction.
 */
export function stellar (t1, t5, c1, cs2) {
  if (cs2.length !== 5) {
    throw new Error('Five rows required in ephemerides')
  }
  const dr = new Array(5)
  const dd = new Array(5)
  cs2.forEach((r, i) => {
    dr[i] = cs2[i].ra - c1.ra
    dd[i] = cs2[i].dec - c1.dec
  })
  return conj(t1, t5, dr, dd)
}

const conj = function (t1, t5, dr, dd) { // (t1, t5 float64, dr, dd []float64)  (t, Δd float64, err error)
  let l5 = new interp.Len5(t1, t5, dr)
  const t = l5.zero(true)
  l5 = new interp.Len5(t1, t5, dd)
  const Δd = l5.interpolateXStrict(t)
  return [t, Δd]
}

export default {
  planetary,
  stellar
}
