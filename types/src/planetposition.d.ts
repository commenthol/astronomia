/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetposition
 */
/**
 * Planetposition: Chapter 32, Positions of the Planets.
 *
 * Incomplete:
 *
 * 1. The package does not implement algorithms that use appendix III,
 * but instead implements a full VSOP87 solution.  I do not have a copy
 * of the supplimentary disk with appendix III in machine readable form
 * and as the appendix is rather large, retyping it by hand is problematic.
 * The full VSOP87 data set on the other hand is freely downloadable from
 * the internet, so I implement here code that can use that data directly.
 *
 * 2. The formula for accuracy of results is not implemented.  It is
 * not needed for full VSOP87 solutions.
 *
 * 3. Polynomial expressions are not implemented.  Again, implementation
 * would involve typing rather large tables of numbers with associated
 * risk of typographical errors.
 */
import { Coord } from './base.js';
export type PlanetSeries = {
    name?: string;
    type?: 'B' | 'D';
    L: Record<string, number[][]>;
    B: Record<string, number[][]>;
    R: Record<string, number[][]>;
};
/**
 * @typedef {{name?: string, type?: 'B'|'D', L: Record<string, number[][]>, B: Record<string, number[][]>, R: Record<string, number[][]>}} PlanetSeries
 * @property {string} name - Planet name.
 * @property {'B'|'D'} type - VSOP87 coordinate type.
 * @property {PlanetSeries} series - VSOP87 coefficient series.
 */
export declare class Planet {
    name: string;
    type: "B" | "D";
    series: PlanetSeries;
    /**
     * VSOP87 representation of a Planet
     * @constructs Planet
     * @param {PlanetSeries} planet - VSOP87 planet data series.
     * @example
     * ```js
     * // for use in browser
     * import {data} from 'astronomia'
     * const earth = new planetposition.Planet(data.vsop87Bearth)
     * ```
     */
    constructor(planet: PlanetSeries);
    /**
     * Position2000 returns ecliptic position of planets by full VSOP87 theory.
     *
     * @param {Number} jde - the date for which positions are desired.
     * @returns {Coord} Results are for the dynamical equinox and ecliptic J2000.
     *  {Number} lon - heliocentric longitude in radians.
     *  {Number} lat - heliocentric latitude in radians.
     *  {Number} range - heliocentric range in AU.
     */
    position2000(jde: number): Coord;
    /**
     * Position returns ecliptic position of planets at equinox and ecliptic of date.
     *
     * @param {Number} jde - the date for which positions are desired.
     * @returns {Coord} Results are positions consistent with those from Meeus's
     * Apendix III, that is, at equinox and ecliptic of date.
     *  {Number} lon - heliocentric longitude in radians.
     *  {Number} lat - heliocentric latitude in radians.
     *  {Number} range - heliocentric range in AU.
     */
    position(jde: number): Coord;
}
/**
 * ToFK5 converts ecliptic longitude and latitude from dynamical frame to FK5.
 *
 * @param {Number} lon - ecliptic longitude in radians
 * @param {Number} lat - ecliptic latitude in radians
 * @param {Number} jde - Julian ephemeris day
 * @return {Coord}
 *    {Number} lon - FK5 longitude
 *    {Number} lat - FK5 latitude
 */
export declare function toFK5(lon: number, lat: number, jde: number): Coord;
declare const _default: {
    Planet: typeof Planet;
    toFK5: typeof toFK5;
};
export default _default;
