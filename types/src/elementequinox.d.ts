/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module elementequinox
 */
/**
 * Elementequinox: Chapter 24, Reduction of Ecliptical Elements
 * from one Equinox to another one.
 *
 * See package precess for the method EclipticPrecessor.ReduceElements and
 * associated example.  The method is described in this chapter but located
 * in package precess so that it can be a method of EclipticPrecessor.
 */
/**
 * Elements are the orbital elements of a solar system object which change
 * from one equinox to another.
 *
 * @param {number|Elements} [inc=0] - Inclination, or an object containing orbital elements.
 * @param {number} [node=0] - Longitude of ascending node (Ω).
 * @param {number} [peri=0] - Argument of perihelion (ω).
 */
export declare class Elements {
    inc: any;
    node: number;
    peri: number;
    /**
     * @param {number|Elements} [inc=0] - Orbital inclination, or orbital elements.
     * @param {number} [node=0] - Longitude of the ascending node in radians.
     * @param {number} [peri=0] - Argument of perihelion in radians.
     */
    constructor(inc?: number | Elements, node?: number, peri?: number);
}
/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 to J2000.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
export declare function reduceB1950ToJ2000(eFrom: Elements): Elements;
/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 in the FK4 system to equinox J2000 in the FK5 system.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
export declare function reduceB1950FK4ToJ2000FK5(eFrom: Elements): Elements;
declare const _default: {
    Elements: typeof Elements;
    reduceB1950ToJ2000: typeof reduceB1950ToJ2000;
    reduceB1950FK4ToJ2000FK5: typeof reduceB1950FK4ToJ2000FK5;
};
export default _default;
