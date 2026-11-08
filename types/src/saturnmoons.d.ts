/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnmoons
 */
/**
 * Saturnmoons: Chapter 46, Positions of the Satellites of Saturn
 */
import { Planet } from './planetposition.js';
export declare const mimas = 0;
export declare const enceladus = 1;
export declare const tethys = 2;
export declare const dione = 3;
export declare const rhea = 4;
export declare const titan = 5;
export declare const hyperion = 6;
export declare const iapetus = 7;
export type XYZPosition = {
    /**
     * - Rectangular x-coordinate in Saturn radii.
     */
    x: number;
    /**
     * - Rectangular y-coordinate in Saturn radii.
     */
    y: number;
    /**
     * - Rectangular z-coordinate in Saturn radii.
     */
    z: number;
};
export type SatelliteElements = {
    /**
     * - Longitude in radians.
     */
    λ: number;
    /**
     * - Orbital radius in Saturn radii.
     */
    r: number;
    /**
     * - Latitude in radians.
     */
    γ: number;
    /**
     * - Longitude of the ascending node in radians.
     */
    Ω: number;
};
/**
 * Positions returns positions of the eight major moons of Saturn.
 *
 * Results returned in argument pos, which must not be undefined.
 *
 * Result units are Saturn radii.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 planet Earth // eslint-disable-line no-unused-vars
 * @param {Planet} saturn - VSOP87 planet Saturn // eslint-disable-line no-unused-vars
 * @return {XYZPosition[]} Array of Moon positions in Saturn radii.
 *   Use `M.mimas ... M.iapetus` to resolve to Moon and its position at `jde`
 */
export declare function positions(jde: number, earth: Planet, saturn: Planet): XYZPosition[];
/**
 * Prepare periodic quantities for the positions of Saturn's moons.
 * @param {number} jde - Julian ephemeris day.
 * @constructor
 */
export declare function Qs(jde: number): void;
declare const _default: {
    mimas: number;
    enceladus: number;
    tethys: number;
    dione: number;
    rhea: number;
    titan: number;
    hyperion: number;
    iapetus: number;
    positions: typeof positions;
    Qs: typeof Qs;
};
export default _default;
