/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solstice
 */
/**
 * Solstice: Chapter 27: Equinoxes and Solstices.
 */
/**
 * March returns the JDE of the March equinox for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export declare function march(y: number): number;
/**
 * June returns the JDE of the June solstice for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export declare function june(y: number): number;
/**
 * September returns the JDE of the September equinox for the given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export declare function september(y: number): number;
/**
 * December returns the JDE of the December solstice for a given year.
 *
 * Results are valid for the years -1000 to +3000.
 *
 * Accuracy is within one minute of time for the years 1951-2050.
 * @param {Number} y - (int) year
 * @returns {Number} JDE
 */
export declare function december(y: number): number;
/**
 * March2 returns a more accurate JDE of the March equinox.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {import('./planetposition.js').Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export declare function march2(year: number, planet: import('./planetposition.js').Planet): number;
/**
 * June2 returns a more accurate JDE of the June solstice.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {import('./planetposition.js').Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export declare function june2(year: number, planet: import('./planetposition.js').Planet): number;
/**
 * September2 returns a more accurate JDE of the September equinox.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {import('./planetposition.js').Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export declare function september2(year: number, planet: import('./planetposition.js').Planet): number;
/**
 * December2 returns a more accurate JDE of the December solstice.
 *
 * Result is accurate to one second of time.
 *
 * @param {Number} year - (int) year
 * @param {import('./planetposition.js').Planet} planet - must be a V87Planet object representing Earth, obtained with
 * the package planetposition
 * @returns {Number} JDE
 */
export declare function december2(year: number, planet: import('./planetposition.js').Planet): number;
/**
 * Longitude returns the JDE for a given `year`, VSOP87 Planet `planet` at a
 * given geocentric solar longitude `lon`
 * @param {Number} year - (int)
 * @param {import('./planetposition.js').Planet} planet
 * @param {Number} lon - geocentric solar longitude in radians
 * @returns {Number} JDE
 */
export declare function longitude(year: number, planet: import('./planetposition.js').Planet, lon: number): number;
declare const _default: {
    march: typeof march;
    june: typeof june;
    september: typeof september;
    december: typeof december;
    march2: typeof march2;
    june2: typeof june2;
    september2: typeof september2;
    december2: typeof december2;
    longitude: typeof longitude;
};
export default _default;
