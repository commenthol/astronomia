/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jupitermoons
 */
/**
 * Jupitermoons: Chapter 44, Positions of the Satellites of Jupiter.
 */
import { Planet } from './planetposition.js';
export type XYZPosition = {
    x: number;
    y: number;
    z: number;
};
/** @typedef {{x: number, y: number, z: number}} XYZPosition */
export declare const io = 0;
export declare const europa = 1;
export declare const ganymede = 2;
export declare const callisto = 3;
/**
 * Positions computes positions of moons of Jupiter.
 *
 * Returned coordinates are in units of Jupiter radii.
 *
 * @param {number} jde - Julian ephemeris day.
 * @return {XYZPosition[]} Rectangular positions of the four Galilean moons in Jupiter radii.
 */
export declare function positions(jde: number): XYZPosition[];
/**
 * Positions computes positions of moons of Jupiter.
 *
 * High accuracy method based on theory "E5"  Results returned in
 * argument pos, which must not be undefined.  Returned coordinates in units
 * of Jupiter radii.
 *
 * @param {Number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 Planet earth
 * @param {Planet} jupiter - VSOP87 Planet jupiter
 * @param {XYZPosition[]} [pos] - Optional array to populate with the four moon positions.
 * @return {XYZPosition[]} Rectangular positions of the four Galilean moons in Jupiter radii.
 */
export declare function e5(jde: number, earth: Planet, jupiter: Planet, pos?: XYZPosition[]): XYZPosition[];
declare const _default: {
    io: number;
    europa: number;
    ganymede: number;
    callisto: number;
    positions: typeof positions;
    e5: typeof e5;
};
export default _default;
