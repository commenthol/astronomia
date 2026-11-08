/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module eqtime
 */
/**
 * Eqtime: Chapter 28, Equation of time.
 */
/**
 * e computes the "equation of time" for the given JDE.
 *
 * Parameter planet must be a planetposition.Planet object for Earth obtained
 * with `new planetposition.Planet('earth')`.
 *
 * @param {Number} jde - Julian ephemeris day
 * @param {import('./planetposition.js').Planet} earth - VSOP87 planet
 * @returns {Number} equation of time as an hour angle in radians.
 */
export declare function e(jde: number, earth: import('./planetposition.js').Planet): number;
/**
 * eSmart computes the "equation of time" for the given JDE.
 *
 * Result is less accurate that e() but the function has the advantage
 * of not requiring the V87Planet object.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} equation of time as an hour angle in radians.
 */
export declare function eSmart(jde: number): number;
declare const _default: {
    e: typeof e;
    eSmart: typeof eSmart;
};
export default _default;
