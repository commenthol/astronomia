/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apsis
 */
/**
 * Apsis: Chapter 50, Perigee and apogee of the Moon
 */
export declare const EARTH_RADIUS = 6378.137;
export declare const MOON_RADIUS = 1738.1;
/**
 * meanPerigee returns the jde of the mean perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export declare function meanPerigee(year: number): number;
/**
 * perigee returns the jde of perigee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export declare function perigee(year: number): number;
/**
 * meanApogee returns the jde of the mean apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export declare function meanApogee(year: number): number;
/**
 * apogee returns the jde of apogee of the Moon nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} jde - Julian ephemeris day
 */
export declare function apogee(year: number): number;
/**
 * apogeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
export declare function apogeeParallax(year: number): number;
/**
 * perigeeParallax returns equatorial horizontal parallax of the Moon at the Apogee nearest the given date.
 *
 * @param {Number} year - is a decimal year specifying a date.
 * @return {Number} equatorial horizontal parallax in radians
 */
export declare function perigeeParallax(year: number): number;
/**
 * Calculate the distance earth - moon (center to center) using the parallax angle in radians
 *
 * @param {Number} parallax - parallax angle in radians
 * @return {Number} distance in `km`
 */
export declare function distance(parallax: number): number;
declare const _default: {
    EARTH_RADIUS: number;
    MOON_RADIUS: number;
    meanPerigee: typeof meanPerigee;
    perigee: typeof perigee;
    meanApogee: typeof meanApogee;
    apogee: typeof apogee;
    apogeeParallax: typeof apogeeParallax;
    perigeeParallax: typeof perigeeParallax;
    distance: typeof distance;
};
export default _default;
