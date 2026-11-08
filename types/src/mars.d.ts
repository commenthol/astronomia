/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module mars
 */
/**
 * Mars: Chapter 42, Ephemeris for Physical Observations of Mars.
 */
import { Planet } from './planetposition.js';
/**
 * Physical computes quantities for physical observations of Mars.
 *
 * Results:
 *  DE  planetocentric declination of the Earth.
 *  DS  planetocentric declination of the Sun.
 *  ω   Areographic longitude of the central meridian, as seen from Earth.
 *  P   Geocentric position angle of Mars' northern rotation pole.
 *  Q   Position angle of greatest defect of illumination.
 *  d   Apparent diameter of Mars.
 *  k   Illuminated fraction of the disk.
 *  q   Greatest defect of illumination.
 *
 * All angular results (all results except k) are in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 ephemeris for Earth.
 * @param {Planet} mars - VSOP87 ephemeris for Mars.
 * @returns {[number, number, number, number, number, number, number, number]} Areographic declinations, central meridian, position angles, apparent diameter, illuminated fraction, and defect of illumination.
 */
export declare function physical(jde: number, earth: Planet, mars: Planet): [number, number, number, number, number, number, number, number];
declare const _default: {
    physical: typeof physical;
};
export default _default;
