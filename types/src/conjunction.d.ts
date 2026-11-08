/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module conjunction
 */
/**
 * Conjunction: Chapter 18: Planetary Conjunctions.
 */
import { Coord } from './base.js';
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
 * @param {Coord[]} cs2 - ephemeris of the second moving object.
 * @return {[number, number]} Conjunction time in Julian days and the declination difference at conjunction.
 */
export declare function planetary(t1: number, t5: number, cs1: Coord[], cs2: Coord[]): [number, number];
/**
 * Stellar computes a conjunction between a moving and non-moving object.
 *
 * Arguments and return values same as with Planetary, except the non-moving
 * object is c1.  The ephemeris of the moving object is cs2.
 *
 * @param {Number} t1 - julian ephemeris day of first row
 * @param {Number} t5 - julian ephemeris day of fifth row
 * @param {Coord} c1 - ephemeris of non-moving object
 * @param {Coord[]} cs2 - Ephemeris of the moving object.
 * @return {[number, number]} Conjunction time in Julian days and the declination difference at conjunction.
 */
export declare function stellar(t1: number, t5: number, c1: Coord, cs2: Coord[]): [number, number];
declare const _default: {
    planetary: typeof planetary;
    stellar: typeof stellar;
};
export default _default;
