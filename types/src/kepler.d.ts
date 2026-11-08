/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module kepler
 */
/**
 * Kepler: Chapter 30, Equation of Kepler.
 */
/**
 * True returns true anomaly ν for given eccentric anomaly E.
 *
 * @param {number} e - eccentricity
 * @param {number} E - eccentric anomaly in radians.
 * @return true anomaly ν in radians.
 */
export declare function trueAnomaly(E: number, e: number): number;
/**
 * Radius returns radius distance r for given eccentric anomaly E.
 *
 * Result unit is the unit of semimajor axis a (typically AU.)
 *
 * @param {number} e - eccentricity
 * @param {number} E - eccentric anomaly in radians
 * @param {number} a - semimajor axis
 * @return {number} radius distance in unit of `a`
 */
export declare function radius(E: number, e: number, a: number): number;
/**
 * Kepler1 solves Kepler's equation by iteration.
 *
 * The iterated formula is
 *
 *  E1 = m + e * sin(E0)
 *
 * For some vaues of e and M it will fail to converge and the
 * function will return an error.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler1(e: number, m: number, places: number): number;
/**
 * Kepler2 solves Kepler's equation by iteration.
 *
 * The iterated formula is
 *
 *  E1 = E0 + (m + e * sin(E0) - E0) / (1 - e * cos(E0))
 *
 * The function converges over a wider range of inputs than does Kepler1
 * but it also fails to converge for some values of e and M.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler2(e: number, m: number, places: number): number;
/**
 * Kepler2a solves Kepler's equation by iteration.
 *
 * The iterated formula is the same as in Kepler2 but a limiting function
 * avoids divergence.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler2a(e: number, m: number, places: number): number;
/**
 * Kepler2b solves Kepler's equation by iteration.
 *
 * The iterated formula is the same as in Kepler2 but a (different) limiting
 * function avoids divergence.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @param {number} places - (int) desired number of decimal places in the result
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler2b(e: number, m: number, places: number): number;
/**
 * Kepler3 solves Kepler's equation by binary search.
 *
 * @throws Error
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler3(e: number, m: number): number;
/**
 * Kepler4 returns an approximate solution to Kepler's equation.
 *
 * It is valid only for small values of e.
 *
 * @param {number} e - eccentricity
 * @param {number} m - mean anomaly in radians
 * @return {number} eccentric anomaly `E` in radians.
 */
export declare function kepler4(e: number, m: number): number;
declare const _default: {
    trueAnomaly: typeof trueAnomaly;
    true: typeof trueAnomaly;
    radius: typeof radius;
    kepler1: typeof kepler1;
    kepler2: typeof kepler2;
    kepler2a: typeof kepler2a;
    kepler2b: typeof kepler2b;
    kepler3: typeof kepler3;
    kepler4: typeof kepler4;
};
export default _default;
