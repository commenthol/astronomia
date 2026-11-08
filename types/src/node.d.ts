/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module node
 */
/**
 * Node: Chapter 39, Passages through the Nodes.
 */
/**
 * EllipticAscending computes time and distance of passage through the ascending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 * @param {number} axis - Semimajor axis in AU.
 * @param {number} ecc - Eccentricity.
 * @param {number} argP - Argument of perihelion in radians.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function ellipticAscending(axis: number, ecc: number, argP: number, timeP: number): [number, number];
/**
 * EllipticAscending computes time and distance of passage through the descending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 * @param {number} axis - Semimajor axis in AU.
 * @param {number} ecc - Eccentricity.
 * @param {number} argP - Argument of perihelion in radians.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function ellipticDescending(axis: number, ecc: number, argP: number, timeP: number): [number, number];
/**
 * Compute passage time and heliocentric distance at true anomaly ν.
 * @param {number} ν - True anomaly in radians.
 * @param {number} axis - Semimajor axis in AU.
 * @param {number} ecc - Eccentricity.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function el(ν: number, axis: number, ecc: number, timeP: number): [number, number];
/**
 * ParabolicAscending computes time and distance of passage through the ascending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 * @param {number} q - Perihelion distance in AU.
 * @param {number} argP - Argument of perihelion in radians.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function parabolicAscending(q: number, argP: number, timeP: number): [number, number];
/**
 * ParabolicDescending computes time and distance of passage through the descending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 * @param {number} q - Perihelion distance in AU.
 * @param {number} argP - Argument of perihelion in radians.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function parabolicDescending(q: number, argP: number, timeP: number): [number, number];
/**
 * Compute passage time and heliocentric distance for a parabolic orbit.
 * @param {number} ν - True anomaly in radians.
 * @param {number} q - Perihelion distance in AU.
 * @param {number} timeP - Time of perihelion as a Julian day.
 * @returns {[number, number]} Julian ephemeris day and heliocentric distance in AU.
 */
export declare function pa(ν: number, q: number, timeP: number): [number, number];
declare const _default: {
    ellipticAscending: typeof ellipticAscending;
    ellipticDescending: typeof ellipticDescending;
    el: typeof el;
    parabolicAscending: typeof parabolicAscending;
    parabolicDescending: typeof parabolicDescending;
    pa: typeof pa;
};
export default _default;
