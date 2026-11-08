/**
 * @copyright 2020 mdmunir
 * @copyright 2020 commenthol
 * @license MIT
 * @module elp
 */
/**
 * Elp Mpp02
 * source ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02/elpmpp02.pdf
 */
import { Coord } from './base.js';
export type ElpData = {
    W1: number[];
    L: number[][];
    B: number[][];
    R: number[][];
};
/**
 *
 */
export declare class Moon {
    series: ElpData;
    /**
     * ELP representation of a Moon
     * @constructs Moon
     * @param {ElpData} data - ELP data series.
     * @example
     * ```js
     * // for use in browser
     * import {data} from 'astronomia.js'
     * const moon = new elp.Moon(data.elpMppDe)
     * ```
     */
    constructor(data: ElpData);
    /**
     * @private
     * @param {number} T - Julian centuries from J2000.
     * @returns {{L: number, B: number, R: number}} Lunar longitude, latitude, and distance.
     */
    private _calcLBR;
    /**
     * Position returns rectangular coordinates referred to the inertial mean ecliptic and equinox of J2000.
     * @param {Number} jde - Julian ephemeris day
     * @return {{x: number, y: number, z: number}} Rectangular coordinates in kilometres.
     */
    positionXYZ(jde: number): {
        x: number;
        y: number;
        z: number;
    };
    /**
     * Delay effect of light time
     *
     * @param {Number} jde - Julian ephemeris day
     * @returns {Number} Delay time in days
     */
    lightTime(jde: number): number;
    /**
     * Position returns ecliptic position of moon at equinox and ecliptic of date.
     *
     * @param {Number} jde - the date for which positions are desired.
     * @returns {Coord} Results are positions consistent with those elp data,
     * that is, at equinox and ecliptic of date.
     *  {Number} lon - geocentric longitude in radians.
     *  {Number} lat - geocentric latitude in radians.
     *  {Number} range - geocentric range in KM.
     */
    position(jde: number): Coord;
}
/**
 * Position returns the true geometric position of the moon as ecliptic coordinates.
 *
 * Result computed by Elp theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {ElpData} elpData
 * @param {Number} jde - Julian ephemeris day
 * @returns {import('./base.js').Coord} Ecliptic longitude and latitude in radians, and geocentric range in kilometres.
 */
export declare function position(elpData: ElpData, jde: number): import('./base.js').Coord;
declare const _default: {
    Moon: typeof Moon;
    position: typeof position;
};
export default _default;
