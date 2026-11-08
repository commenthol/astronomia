/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module pluto
 */
/**
 * Pluto: Chapter 37, Pluto.
 */
/**
 * Heliocentric returns J2000 heliocentric coordinates of Pluto.
 *
 * Results l, b are solar longitude and latitude in radians.
 * Result r is distance in AU.
 * @param {number} jde - Julian ephemeris day.
 * @returns {{lon: number, lat: number, range: number}} Heliocentric longitude and latitude in radians, and distance in AU.
 */
export declare function heliocentric(jde: number): {
    lon: number;
    lat: number;
    range: number;
};
/**
 * Astrometric returns J2000 astrometric coordinates of Pluto.
 * @param {number} jde - Julian ephemeris day.
 * @param {import('./planetposition.js').Planet} earth - Earth ephemeris.
 * @returns {import('./base.js').Coord} J2000 astrometric coordinates.
 */
export declare function astrometric(jde: number, earth: import('./planetposition.js').Planet): import('./base.js').Coord;
declare const _default: {
    heliocentric: typeof heliocentric;
    astrometric: typeof astrometric;
};
export default _default;
