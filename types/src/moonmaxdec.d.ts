/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonmaxdec
 */
/**
 * Moonmaxdec: Chapter 52, Maximum Declinations of the Moon
 */
/**
 * North computes the maximum northern declination of the Moon near a given date.
 *
 * Argument year is a decimal year specifying a date near the event.
 *
 * Returned is the jde of the event nearest the given date and the declination
 * of the Moon at that time.
 * @param {number} y - Decimal year near the event.
 * @returns {{jde: number, dec: number}} Julian ephemeris day and maximum northern declination in radians.
 */
export declare function north(y: number): {
    jde: number;
    dec: number;
};
/**
 * South computes the maximum southern declination of the Moon near a given date.
 *
 * Argument year is a decimal year specifying a date near the event.
 *
 * Returned is the jde of the event nearest the given date and the declination
 * of the Moon at that time.
 * @param {number} y - Decimal year near the event.
 * @returns {{jde: number, dec: number}} Julian ephemeris day and maximum southern declination in radians.
 */
export declare function south(y: number): {
    jde: number;
    dec: number;
};
declare const _default: {
    north: typeof north;
    south: typeof south;
};
export default _default;
