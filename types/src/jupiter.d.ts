/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jupiter
 */
/**
 * Jupiter: Chapter 42, Ephemeris for Physical Observations of Jupiter.
 */
import { Planet } from './planetposition.js';
/**
 * Physical computes quantities for physical observations of Jupiter.
 *
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth
 * @param {Planet} jupiter
 * @return {[number, number, number, number, number]} Solar and terrestrial planetocentric declinations, System I and II central meridians, and pole position angle (radians).
 */
export declare function physical(jde: number, earth: Planet, jupiter: Planet): [number, number, number, number, number];
/**
 * Physical2 computes quantities for physical observations of Jupiter.
 *
 * Results are less accurate than with Physical().
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day.
 * @return {[number, number, number, number]} Solar and terrestrial planetocentric declinations and System I and II central meridians (radians).
 */
export declare function physical2(jde: number): [number, number, number, number];
declare const _default: {
    physical: typeof physical;
    physical2: typeof physical2;
};
export default _default;
