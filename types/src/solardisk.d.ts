/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solardisk
 */
/**
 * Solardisk: Chapter 29, Ephemeris for Physical Observations of the Sun.
 */
/**
 * Ephemeris returns the apparent orientation of the sun at the given jd.
 *
 * Results:
 *  P:  Position angle of the solar north pole.
 *  B0: Heliographic latitude of the center of the solar disk.
 *  L0: Heliographic longitude of the center of the solar disk.
 *
 * All results in radians.
 * @param {number} jd - Julian day.
 * @param {import('./planetposition.js').Planet} earth - Earth ephemeris.
 * @returns {[number, number, number]} Solar position angle, disk-center latitude, and disk-center longitude, in radians.
 */
export declare function ephemeris(jd: number, earth: import('./planetposition.js').Planet): [number, number, number];
/**
 * Cycle returns the jd of the start of the given synodic rotation.
 *
 * Argument c is the "Carrington" cycle number.
 *
 * Result is a dynamical time (not UT).
 * @param {number} c - Carrington cycle number.
 * @returns {number} Julian ephemeris day at the start of the cycle.
 */
export declare function cycle(c: number): number;
declare const _default: {
    ephemeris: typeof ephemeris;
    cycle: typeof cycle;
};
export default _default;
