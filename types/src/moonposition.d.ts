/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonposition
 */
/**
 * Moonposition: Chapter 47, Position of the Moon.
 */
import { Coord } from './base.js';
/**
 * parallax returns equatorial horizontal parallax of the Moon.
 *
 * @param {Number} distance - distance between centers of the Earth and Moon, in km.
 * @returns {Number} Result in radians.
 */
export declare function parallax(distance: number): number;
/**
 * position returns geocentric location of the Moon.
 *
 * Results are referenced to mean equinox of date and do not include
 * the effect of nutation.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns {Coord}
 *  {number} lon - Geocentric longitude λ, in radians.
 *  {number} lat - Geocentric latitude β, in radians.
 *  {number} range - Distance Δ between centers of the Earth and Moon, in km.
 */
export declare function position(jde: number): Coord;
/**
 * Node returns longitude of the mean ascending node of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export declare function node(jde: number): number;
/**
 * perigee returns longitude of perigee of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export declare function perigee(jde: number): number;
/**
 * trueNode returns longitude of the true ascending node.
 *
 * That is, the node of the instantaneous lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export declare function trueNode(jde: number): number;
declare const _default: {
    parallax: typeof parallax;
    position: typeof position;
    node: typeof node;
    perigee: typeof perigee;
    trueNode: typeof trueNode;
};
export default _default;
