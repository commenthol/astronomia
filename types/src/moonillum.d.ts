/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonillum
 */
/**
 * Moonillum: Chapter 48, Illuminated Fraction of the Moon's Disk
 *
 * Also see functions `illuminated` and `limb` in package base.  The function
 * for computing illuminated fraction given a phase angle (48.1) is
 * base.illuminated.  Formula (48.3) is implemented as base.limb.
 */
import { Coord } from './base.js';
/**
 * phaseAngleEquatorial computes the phase angle of the Moon given equatorial coordinates.
 *
 * @param {Coord} cMoon - geocentric right ascension,  declination and distance to the Moon
 * @param {Coord} cSun - coordinates and distance of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
export declare function phaseAngleEquatorial(cMoon: Coord, cSun: Coord): number;
/**
 * phaseAngleEquatorial2 computes the phase angle of the Moon given equatorial coordinates.
 *
 * Less accurate than phaseAngleEquatorial.
 *
 * Arguments α, δ are geocentric right ascension and declination of the Moon;
 * α0, δ0  are coordinates of the Sun.  Angles must be in radians.
 *
 * @param {Coord} cMoon - eocentric right ascension and declination of the Moon
 * @param {Coord} cSun - coordinates of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
export declare function phaseAngleEquatorial2(cMoon: Coord, cSun: Coord): number;
/**
 * phaseAngleEcliptic computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Distances must be in the same units as each other.
 *
 * @param {Coord} cMoon - geocentric longitude, latitude and distance to the Moon
 * @param {Coord} cSun -  longitude and distance to the Sun
 * @returns {number} phase angle of the Moon in radians
 */
export declare function phaseAngleEcliptic(cMoon: Coord, cSun: Coord): number;
/**
 * phaseAngleEcliptic2 computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Less accurate than phaseAngleEcliptic.
 *
 * Angles must be in radians.
 *
 * @param {Coord} cMoon - geocentric longitude, latitude of the Moon
 * @param {Coord} cSun -  longitude of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
export declare function phaseAngleEcliptic2(cMoon: Coord, cSun: Coord): number;
/**
 * phaseAngle3 computes the phase angle of the Moon given a julian day.
 *
 * Less accurate than phaseAngle functions taking coordinates.
 *
 * Result in radians.
 * @param {number} jde - Julian ephemeris day.
 * @returns {number} Approximate lunar phase angle in radians.
 */
export declare function phaseAngle3(jde: number): number;
declare const _default: {
    phaseAngleEquatorial: typeof phaseAngleEquatorial;
    phaseAngleEquatorial2: typeof phaseAngleEquatorial2;
    phaseAngleEcliptic: typeof phaseAngleEcliptic;
    phaseAngleEcliptic2: typeof phaseAngleEcliptic2;
    phaseAngle3: typeof phaseAngle3;
};
export default _default;
