/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonphase
 */
/**
 * Moonphase: Chapter 49, Phases of the Moon
 */
/**
 * mean synodial lunar month
 */
export declare const meanLunarMonth = 29.530588861;
/**
 * MeanNew returns the jde of the mean New Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of New Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function meanNew(year: number): number;
/**
 * MeanFirst returns the jde of the mean First Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of First Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function meanFirst(year: number): number;
/**
 * MeanFull returns the jde of the mean Full Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Full Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function meanFull(year: number): number;
/**
 * MeanLast returns the jde of the mean Last Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Last Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function meanLast(year: number): number;
/**
 * New returns the jde of New Moon nearest the given date.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function newMoon(year: number): number;
/**
 * First returns the jde of First Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function first(year: number): number;
/**
 * Full returns the jde of Full Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function full(year: number): number;
/**
 * Last returns the jde of Last Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
export declare function last(year: number): number;
declare const _default: {
    meanLunarMonth: number;
    meanNew: typeof meanNew;
    meanFirst: typeof meanFirst;
    meanFull: typeof meanFull;
    meanLast: typeof meanLast;
    newMoon: typeof newMoon;
    new: typeof newMoon;
    first: typeof first;
    full: typeof full;
    last: typeof last;
};
export default _default;
