export type RectangularCoordinates = {
    x: number;
    y: number;
    z: number;
};
/** @typedef {{x: number, y: number, z: number}} RectangularCoordinates */
/**
 * Position returns rectangular coordinates referenced to the mean equinox of date.
 * @param {import('./planetposition.js').Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @returns {RectangularCoordinates} Rectangular coordinates.
 */
export declare function position(earth: import('./planetposition.js').Planet, jde: number): RectangularCoordinates;
/**
 * LongitudeJ2000 returns geometric longitude referenced to equinox J2000.
 * @param {import('./planetposition.js').Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {Number} geometric longitude referenced to equinox J2000.
 */
export declare function longitudeJ2000(earth: import('./planetposition.js').Planet, jde: number): number;
/**
 * PositionJ2000 returns rectangular coordinates referenced to equinox J2000.
 * @param {import('./planetposition.js').Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @returns {RectangularCoordinates} Rectangular coordinates.
 */
export declare function positionJ2000(earth: import('./planetposition.js').Planet, jde: number): RectangularCoordinates;
/**
 * Return rectangular Earth coordinates referred to J2000.
 * @param {import('./planetposition.js').Planet} earth - VSOP87 Earth ephemeris.
 * @param {number} jde - Julian ephemeris day.
 * @returns {{x: number, y: number, z: number}} Rectangular coordinates in AU.
 */
export declare function xyz(earth: import('./planetposition.js').Planet, jde: number): {
    x: number;
    y: number;
    z: number;
};
/**
 * PositionB1950 returns rectangular coordinates referenced to B1950.
 *
 * Results are referenced to the mean equator and equinox of the epoch B1950
 * in the FK5 system, not FK4.
 *
 * @param {import('./planetposition.js').Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @returns {RectangularCoordinates} Rectangular coordinates.
 */
export declare function positionB1950(earth: import('./planetposition.js').Planet, jde: number): RectangularCoordinates;
/**
 * PositionEquinox returns rectangular coordinates referenced to an arbitrary epoch.
 *
 * Position will be computed for given Julian day "jde" but referenced to mean
 * equinox "epoch" (year).
 *
 * @param {import('./planetposition.js').Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @param {Number} epoch
 * @returns {RectangularCoordinates} Rectangular coordinates.
 */
export declare function positionEquinox(earth: import('./planetposition.js').Planet, jde: number, epoch: number): RectangularCoordinates;
declare const _default: {
    position: typeof position;
    longitudeJ2000: typeof longitudeJ2000;
    positionJ2000: typeof positionJ2000;
    xyz: typeof xyz;
    positionB1950: typeof positionB1950;
    positionEquinox: typeof positionEquinox;
};
export default _default;
