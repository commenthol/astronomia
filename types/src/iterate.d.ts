/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module iterate
 */
/**
 * Iterate: Chapter 5, Iteration.
 *
 * This package is best considered illustrative.  While the functions are
 * usable, they are minimal in showing the points of the chapter text.  More
 * robust functions would handle more cases of overflow, loss of precision,
 * and divergence.
 */
/**
 * decimalPlaces iterates to a fixed number of decimal places.
 *
 * Inputs are an improvement function, a starting value, the number of
 * decimal places desired in the result, and an iteration limit.
 *
 * @throws Error
 * @param {Function} better
 * @param {Number} start - (float)
 * @param {Number} places - (int)
 * @param {Number} maxIterations - (int)
 * @returns {Number}
 */
export declare function decimalPlaces(better: Function, start: number, places: number, maxIterations: number): number;
/**
 * fullPrecison iterates to (nearly) the full precision of a float64.
 *
 * To allow for a little bit of floating point jitter, FullPrecision iterates
 * to 15 significant figures, which is the maximum number of full significant
 * figures representable in a float64, but still a couple of bits shy of the
 * full representable precision.
 *
 * @throws Error
 * @param {Function} better
 * @param {Number} start - (float)
 * @param {Number} maxIterations - (int)
 * @returns {Number}
 */
export declare function fullPrecision(better: Function, start: number, maxIterations: number): number;
/**
 * binaryRoot finds a root between given bounds by binary search.
 *
 * Inputs are a function on x and the bounds on x.  A root must exist between
 * the given bounds, otherwise the result is not meaningful.
 *
 * @param {Function} f - root function
 * @param {Number} lower - (float)
 * @param {Number} upper - (float)
 * @returns {Number}
 */
export declare function binaryRoot(f: Function, lower: number, upper: number): number;
declare const _default: {
    decimalPlaces: typeof decimalPlaces;
    fullPrecision: typeof fullPrecision;
    binaryRoot: typeof binaryRoot;
};
export default _default;
