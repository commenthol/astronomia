/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module stellar
 */
/**
 * Stellar: Chapter 56, Stellar Magnitudes.
 */
/**
 * Sum returns the combined apparent magnitude of two stars.
 * @param {number} m1 - Apparent magnitude of the first star.
 * @param {number} m2 - Apparent magnitude of the second star.
 * @returns {number} Combined apparent magnitude.
 */
export declare function sum(m1: number, m2: number): number;
/**
 * SumN returns the combined apparent magnitude of a number of stars.
 * @param {number[]} m - Apparent magnitudes of the stars.
 * @returns {number} Combined apparent magnitude.
 */
export declare function sumN(m: number[]): number;
/**
 * Ratio returns the brightness ratio of two stars.
 *
 * Arguments m1, m2 are apparent magnitudes.
 * @param {number} m1 - Apparent magnitude of the first star.
 * @param {number} m2 - Apparent magnitude of the second star.
 * @returns {number} Brightness ratio of the first star to the second.
 */
export declare function ratio(m1: number, m2: number): number;
/**
 * Difference returns the difference in apparent magnitude of two stars
 * given their brightness ratio.
 * @param {number} ratio - Brightness ratio.
 * @returns {number} Difference in apparent magnitudes.
 */
export declare function difference(ratio: number): number;
/**
 * AbsoluteByParallax returns absolute magnitude given annual parallax.
 *
 * Argument m is apparent magnitude, π is annual parallax in arc seconds.
 * @param {number} m - Apparent magnitude.
 * @param {number} π - Annual parallax in arc seconds.
 * @returns {number} Absolute magnitude.
 */
export declare function absoluteByParallax(m: number, π: number): number;
/**
 * AbsoluteByDistance returns absolute magnitude given distance.
 *
 * Argument m is apparent magnitude, d is distance in parsecs.
 * @param {number} m - Apparent magnitude.
 * @param {number} d - Distance in parsecs.
 * @returns {number} Absolute magnitude.
 */
export declare function absoluteByDistance(m: number, d: number): number;
declare const _default: {
    sum: typeof sum;
    sumN: typeof sumN;
    ratio: typeof ratio;
    difference: typeof difference;
    absoluteByParallax: typeof absoluteByParallax;
    absoluteByDistance: typeof absoluteByDistance;
};
export default _default;
