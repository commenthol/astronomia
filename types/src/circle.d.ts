/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module circle
 */
/**
 * Circle: Chapter 20, Smallest Circle containing three Celestial Bodies.
 */
import { Coord } from './base.js';
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
 * @returns {[number, boolean]} Circle diameter in radians and whether the solution is type I.
 */
export declare function smallest(c1: Coord, c2: Coord, c3: Coord): [number, boolean];
declare const _default: {
    smallest: typeof smallest;
};
export default _default;
