/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solar
 */
/**
 * Solar: Chapter 25, Solar Coordinates.
 *
 * Partial implementation:
 *
 * 1. Higher accuracy positions are not computed with Appendix III but with
 * full VSOP87 as implemented in package planetposition.
 *
 * 2. Higher accuracy correction for aberration (using the formula for
 * variation Δλ on p. 168) is not implemented.  Results for example 25.b
 * already match the full VSOP87 values on p. 165 even with the low accuracy
 * correction for aberration, thus there are no more significant digits that
 * would check a more accurate result.  Also the size of the formula presents
 * significant chance of typographical error.
 */
import { Coord } from './base.js';
import { Planet } from './planetposition.js';
/**
 * True returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {{lon: number, ano: number}} True geometric longitude and anomaly, in radians.
 */
export declare function trueLongitude(T: number): {
    lon: number;
    ano: number;
};
/**
 * meanAnomaly returns the mean anomaly of Earth at the given T.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Result is in radians and is not normalized to the range 0..2π.
 */
export declare function meanAnomaly(T: number): number;
/**
 * eccentricity returns eccentricity of the Earth's orbit around the sun.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} eccentricity of the Earth's orbit around the sun.
 */
export declare function eccentricity(T: number): number;
/**
 * Radius returns the Sun-Earth distance in AU.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Sun-Earth distance in AU
 */
export declare function radius(T: number): number;
/**
 * ApparentLongitude returns apparent longitude of the Sun referenced to the true equinox of date.
 * Result includes correction for nutation and aberration.  Unit is radians.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} apparent longitude of the Sun referenced to the true equinox of date.
 */
export declare function apparentLongitude(T: number): number;
/**
 * true2000 returns true geometric longitude and anomaly of the sun referenced to equinox J2000.
 * Results are accurate to .01 degree for years 1900 to 2100.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {{lon: number, ano: number}} True geometric longitude and anomaly, in radians.
 */
export declare function true2000(T: number): {
    lon: number;
    ano: number;
};
/**
 * trueEquatorial returns the true geometric position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
export declare function trueEquatorial(jde: number): Coord;
/**
 * apparentEquatorial returns the apparent position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
export declare function apparentEquatorial(jde: number): Coord;
/**
 * trueVSOP87 returns the true geometric position of the sun as ecliptic coordinates.
 *
 * Result computed by full VSOP87 theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord} Geocentric ecliptic longitude and latitude in radians and distance in AU.
 */
export declare function trueVSOP87(planet: Planet, jde: number): Coord;
/**
 * apparentVSOP87 returns the apparent position of the sun as ecliptic coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
export declare function apparentVSOP87(planet: Planet, jde: number): Coord;
/**
 * apparentEquatorialVSOP87 returns the apparent position of the sun as equatorial coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 *   {Number} range - range in AU
 */
export declare function apparentEquatorialVSOP87(planet: Planet, jde: number): Coord;
/**
 * Low precision formula.  The high precision formula is not implemented
 * because the low precision formula already gives position results to the
 * accuracy given on p. 165.  The high precision formula represents lots
 * of typing with associated chance of typos, and no way to test the result.
 * @param {Number} range
 * @returns {Number} aberation
 */
export declare function aberration(range: number): number;
declare const _default: {
    trueLongitude: typeof trueLongitude;
    true: typeof trueLongitude;
    meanAnomaly: typeof meanAnomaly;
    eccentricity: typeof eccentricity;
    radius: typeof radius;
    apparentLongitude: typeof apparentLongitude;
    true2000: typeof true2000;
    trueEquatorial: typeof trueEquatorial;
    apparentEquatorial: typeof apparentEquatorial;
    trueVSOP87: typeof trueVSOP87;
    apparentVSOP87: typeof apparentVSOP87;
    apparentEquatorialVSOP87: typeof apparentEquatorialVSOP87;
    aberration: typeof aberration;
};
export default _default;
