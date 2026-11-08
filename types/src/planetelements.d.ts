/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetelements
 */
/**
 * Planetelements: Chapter 31, Elements of Planetary Orbits.
 *
 * Partial:  Only implemented for mean equinox of date.
 */
export type PlanetName = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
export type ElementsInput = {
    lon?: number;
    axis?: number;
    ecc?: number;
    inc?: number;
    node?: number;
    peri?: number;
};
export type ElementsData = {
    /**
     * - Mean longitude in radians.
     */
    lon: number;
    /**
     * - Semimajor axis in AU.
     */
    axis: number;
    /**
     * - Eccentricity.
     */
    ecc: number;
    /**
     * - Inclination in radians.
     */
    inc: number;
    /**
     * - Longitude of ascending node in radians.
     */
    node: number;
    /**
     * - Longitude of perihelion in radians.
     */
    peri: number;
};
/** @typedef {'mercury'|'venus'|'earth'|'mars'|'jupiter'|'saturn'|'uranus'|'neptune'} PlanetName */
/** @typedef {{lon?: number, axis?: number, ecc?: number, inc?: number, node?: number, peri?: number}} ElementsInput */
/**
 * @typedef {object} ElementsData
 * @property {number} lon - Mean longitude in radians.
 * @property {number} axis - Semimajor axis in AU.
 * @property {number} ecc - Eccentricity.
 * @property {number} inc - Inclination in radians.
 * @property {number} node - Longitude of ascending node in radians.
 * @property {number} peri - Longitude of perihelion in radians.
 */
export declare const mercury = "mercury";
export declare const venus = "venus";
export declare const earth = "earth";
export declare const mars = "mars";
export declare const jupiter = "jupiter";
export declare const saturn = "saturn";
export declare const uranus = "uranus";
export declare const neptune = "neptune";
/**
 * Elements contains orbital elements as returned by functions in this package.
 *
 * Some other elements easily derived from these are
 *
 *  Mean Anomolay, M = Lon - Peri
 *  Argument of Perihelion, ω = Peri - Node
 *
 * @param {number|ElementsInput} [lon] - Mean longitude in radians, or an object containing orbital elements.
 * @param {number} [axis] - Semimajor axis in AU.
 * @param {number} [ecc] - Eccentricity.
 * @param {number} [inc] - Inclination in radians.
 * @param {number} [node] - Longitude of ascending node in radians.
 * @param {number} [peri] - Longitude of perihelion in radians.
 * @property {number} lon - Mean longitude in radians.
 * @property {number} axis - Semimajor axis in AU.
 * @property {number} ecc - Eccentricity.
 * @property {number} inc - Inclination in radians.
 * @property {number} node - Longitude of ascending node in radians.
 * @property {number} peri - Longitude of perihelion in radians.
 * @constructor
 */
export declare function Elements(lon?: number | ElementsInput, axis?: number, ecc?: number, inc?: number, node?: number, peri?: number): void;
/**
 * Mean returns mean orbital elements for a planet
 *
 * Argument p must be a planet const as defined above, argument e is
 * a result parameter.  A valid non-undefined pointer to an Elements struct
 * must be passed in.
 *
 * Results are referenced to mean dynamical ecliptic and equinox of date.
 *
 * Semimajor axis is in AU, angular elements are in radians.
 * @param {PlanetName} p - Planet name.
 * @param {number} jde - Julian ephemeris day.
 * @param {ElementsData} [e] - Optional result object to populate.
 * @returns {ElementsData} Orbital elements for the planet.
 */
export declare function mean(p: PlanetName, jde: number, e?: ElementsData): ElementsData;
/**
 * Inc returns mean inclination for a planet at a date.
 *
 * Result is the same as the Inc field returned by function Mean.  That is,
 * radians, referenced to mean dynamical ecliptic and equinox of date.
 * @param {PlanetName} p - Planet name.
 * @param {number} jde - Julian ephemeris day.
 * @returns {number} Mean inclination in radians.
 */
export declare function inc(p: PlanetName, jde: number): number;
/**
 * Node returns mean longitude of ascending node for a planet at a date.
 *
 * Result is the same as the Node field returned by function Mean.  That is,
 * radians, referenced to mean dynamical ecliptic and equinox of date.
 * @param {PlanetName} p - Planet name.
 * @param {number} jde - Julian ephemeris day.
 * @returns {number} Longitude of the ascending node in radians.
 */
export declare function node(p: PlanetName, jde: number): number;
declare const _default: {
    mercury: string;
    venus: string;
    earth: string;
    mars: string;
    jupiter: string;
    saturn: string;
    uranus: string;
    neptune: string;
    Elements: typeof Elements;
    mean: typeof mean;
    inc: typeof inc;
    node: typeof node;
};
export default _default;
