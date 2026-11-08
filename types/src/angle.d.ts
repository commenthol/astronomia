/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module angle
 */
/**
 * Angle: Chapter 17: Angular Separation.
 *
 * Functions in this package are useful for Ecliptic, Equatorial, or any
 * similar coordinate frame.  To avoid suggestion of a particular frame,
 * function parameters are specified simply as "r1, d1" to correspond to a
 * right ascenscion, declination pair or to a longitude, latitude pair.
 *
 * In function Sep, Meeus recommends 10 arc min as a threshold.  This
 * value is in package base as base.SmallAngle because it has general utility.
 *
 * All angles are in radians.
 */
import { Coord } from './base.js';
/**
 * `sep` returns the angular separation between two celestial bodies.
 *
 * The algorithm is numerically naïve, and while patched up a bit for
 * small separations, remains unstable for separations near π.
 *
 * @param {Coord} c1 - coordinate of celestial body 1
 * @param {Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
export declare function sep(c1: Coord, c2: Coord): number;
/**
 * `minSep` returns the minimum separation between two moving objects.
 *
 * The motion is represented as an ephemeris of three rows, equally spaced
 * in time.  Jd1, jd3 are julian day times of the first and last rows.
 * R1, d1, r2, d2 are coordinates at the three times.  They must each be
 * slices of length 3.0
 *
 * Result is obtained by computing separation at each of the three times
 * and interpolating a minimum.  This may be invalid for sufficiently close
 * approaches.
 *
 * @throws Error
 * @param {Number} jd1 - Julian day - time at cs1[0], cs2[0]
 * @param {Number} jd3 - Julian day - time at cs1[2], cs2[2]
 * @param {Coord[]} cs1 - 3 coordinates of moving object 1
 * @param {Coord[]} cs2 - 3 coordinates of moving object 2
 * @param {function} [fnSep] - alternative `sep` function e.g. `angle.sepPauwels`, `angle.sepHav`
 * @return {Number} angular separation between two celestial bodies
 */
export declare function minSep(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[], fnSep?: Function): number;
/**
 * `minSepRect` returns the minimum separation between two moving objects.
 *
 * Like `minSep`, but using a method of rectangular coordinates that gives
 * accurate results even for close approaches.
 *
 * @throws Error
 * @param {Number} jd1 - Julian day - time at cs1[0], cs2[0]
 * @param {Number} jd3 - Julian day - time at cs1[2], cs2[2]
 * @param {Coord[]} cs1 - 3 coordinates of moving object 1
 * @param {Coord[]} cs2 - 3 coordinates of moving object 2
 * @return {Number} angular separation between two celestial bodies
 */
export declare function minSepRect(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;
/**
 * haversine function (17.5) p. 115
 * @param {number} a - Angle in radians.
 * @returns {number} Haversine of the angle.
 */
export declare function hav(a: number): number;
/**
 * `sepHav` returns the angular separation between two celestial bodies.
 *
 * The algorithm uses the haversine function and is superior to the naïve
 * algorithm of the Sep function.
 *
 * @param {Coord} c1 - coordinate of celestial body 1
 * @param {Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
export declare function sepHav(c1: Coord, c2: Coord): number;
/**
 * Same as `minSep` but uses function `sepHav` to return the minimum separation
 * between two moving objects.
 * @param {number} jd1 - Julian day at the first ephemeris row.
 * @param {number} jd3 - Julian day at the final ephemeris row.
 * @param {Coord[]} cs1 - Three coordinates for the first object.
 * @param {Coord[]} cs2 - Three coordinates for the second object.
 * @returns {number} Minimum angular separation in radians.
 */
export declare function minSepHav(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;
/**
 * `sepPauwels` returns the angular separation between two celestial bodies.
 *
 * The algorithm is a numerically stable form of that used in `sep`.
 *
 * @param {Coord} c1 - coordinate of celestial body 1
 * @param {Coord} c2 - coordinate of celestial body 2
 * @return {Number} angular separation between two celestial bodies
 */
export declare function sepPauwels(c1: Coord, c2: Coord): number;
/**
 * Same as `minSep` but uses function `sepPauwels` to return the minimum
 * separation between two moving objects.
 * @param {number} jd1 - Julian day at the first ephemeris row.
 * @param {number} jd3 - Julian day at the final ephemeris row.
 * @param {Coord[]} cs1 - Three coordinates for the first object.
 * @param {Coord[]} cs2 - Three coordinates for the second object.
 * @returns {number} Minimum angular separation in radians.
 */
export declare function minSepPauwels(jd1: number, jd3: number, cs1: Coord[], cs2: Coord[]): number;
/**
 * RelativePosition returns the position angle of one body with respect to
 * another.
 *
 * The position angle result `p` is measured counter-clockwise from North.
 * If negative then `p` is in the range of 90° ... 270°
 *
 * ````
 *                  North
 *                    |
 *             (p)  ..|
 *                 .  |
 *                V   |
 *    c1 x------------x c2
 *                    |
 * ````
 *
 * @param {Coord} c1 - coordinate of celestial body 1
 * @param {Coord} c2 - coordinate of celestial body 2
 * @return {Number} position angle (p)
 */
export declare function relativePosition(c1: Coord, c2: Coord): number;
declare const _default: {
    sep: typeof sep;
    minSep: typeof minSep;
    minSepRect: typeof minSepRect;
    hav: typeof hav;
    sepHav: typeof sepHav;
    minSepHav: typeof minSepHav;
    sepPauwels: typeof sepPauwels;
    minSepPauwels: typeof minSepPauwels;
    relativePosition: typeof relativePosition;
};
export default _default;
