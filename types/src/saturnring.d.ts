/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnring
 */
/**
 * Saturnrings: Chapter 45, The Ring of Saturn
 */
/**
 * Ring computes quantities of the ring of Saturn.
 *
 *  B  Saturnicentric latitude of the Earth referred to the plane of the ring.
 *  Bʹ  Saturnicentric latitude of the Sun referred to the plane of the ring.
 *  ΔU  Difference between Saturnicentric longitudes of the Sun and the Earth.
 *  P  Geometric position angle of the northern semiminor axis of the ring.
 *  aEdge  Major axis of the out edge of the outer ring.
 *  bEdge  Minor axis of the out edge of the outer ring.
 *
 * All results in radians.
 * @param {number} jde - Julian ephemeris day.
 * @param {import('./planetposition.js').Planet} earth - Earth ephemeris.
 * @param {import('./planetposition.js').Planet} saturn - Saturn ephemeris.
 * @returns {[number, number, number, number, number, number]} Ring latitudes, longitude difference, position angle, and apparent axes.
 */
export declare function ring(jde: number, earth: import('./planetposition.js').Planet, saturn: import('./planetposition.js').Planet): [number, number, number, number, number, number];
/**
 * UB computes quantities required by illum.Saturn().
 *
 * Same as ΔU and B returned by Ring().  Results in radians.
 * @param {number} jde - Julian ephemeris day.
 * @param {import('./planetposition.js').Planet} earth - Earth ephemeris.
 * @param {import('./planetposition.js').Planet} saturn - Saturn ephemeris.
 * @returns {[number, number]} Saturnicentric longitude difference and latitude.
 */
export declare function ub(jde: number, earth: import('./planetposition.js').Planet, saturn: import('./planetposition.js').Planet): [number, number];
declare const _default: {
    ring: typeof ring;
    ub: typeof ub;
};
export default _default;
