/**
 * Position returns observed equatorial coordinates of a planet at a given time.
 *
 * Argument p must be a valid V87Planet object for the observed planet.
 * Argument earth must be a valid V87Planet object for Earth.
 *
 * Results are right ascension and declination, α and δ in radians.
 * @param {import('./planetposition.js').Planet} planet - Ephemeris for the observed planet.
 * @param {import('./planetposition.js').Planet} earth - Ephemeris for Earth.
 * @param {number} jde - Julian ephemeris day.
 * @returns {import('./coord.js').Equatorial} Apparent equatorial coordinates.
 */
export declare function position(planet: import('./planetposition.js').Planet, earth: import('./planetposition.js').Planet, jde: number): import('./coord.js').Equatorial;
/**
 * Elements holds keplerian elements.
 * @property {number} axis - Semimajor axis in AU.
 * @property {number} ecc - Eccentricity.
 * @property {number} inc - Inclination in radians.
 * @property {number} argP - Argument of perihelion in radians.
 * @property {number} node - Longitude of ascending node in radians.
 * @property {number} timeP - Time of perihelion as a Julian ephemeris day.
 */
export declare class Elements {
    axis: number;
    ecc: number;
    inc: number;
    argP: number;
    node: number;
    timeP: number;
    /**
     * @param {number|Elements} axis - Semimajor axis in AU, or an object containing orbital elements.
     * @param {number} [ecc] - Eccentricity.
     * @param {number} [inc] - Inclination in radians.
     * @param {number} [argP] - Argument of perihelion in radians.
     * @param {number} [node] - Longitude of ascending node in radians.
     * @param {number} [timeP] - Time of perihelion as Julian ephemeris day.
     */
    constructor(axis: number | Elements, ecc?: number, inc?: number, argP?: number, node?: number, timeP?: number);
    /**
     * Position returns observed equatorial coordinates of a body with Keplerian elements.
     *
     * Argument e must be a valid V87Planet object for Earth.
     *
     * Results are right ascension and declination α and δ, and elongation ψ,
     * all in radians.
     * @param {number} jde - Julian ephemeris day.
     * @param {import('./planetposition.js').Planet} earth - Ephemeris for Earth.
     * @returns {import('./base.js').Coord} J2000 astrometric coordinates and elongation.
     */
    position(jde: number, earth: import('./planetposition.js').Planet): import('./base.js').Coord;
}
/**
 * AstrometricJ2000 is a utility function for computing astrometric coordinates.
 *
 * It is used internally and only exported so that it can be used from
 * multiple packages.  It is not otherwise expected to be used.
 *
 * Argument f is a function that returns J2000 equatorial rectangular
 * coodinates of a body.
 *
 * Results are J2000 right ascention, declination, and elongation.
 * @param {(jde: number) => {x: number, y: number, z: number}} f - Rectangular-coordinate function.
 * @param {number} jde - Julian ephemeris day.
 * @param {import('./planetposition.js').Planet} earth - Ephemeris for Earth.
 * @returns {import('./base.js').Coord} J2000 astrometric coordinates and elongation.
 */
export declare function astrometricJ2000(f: (jde: number) => {
    x: number;
    y: number;
    z: number;
}, jde: number, earth: import('./planetposition.js').Planet): import('./base.js').Coord;
/**
 * Velocity returns instantaneous velocity of a body in elliptical orbit around the Sun.
 *
 * Argument a is the semimajor axis of the body, r is the instaneous distance
 * to the Sun, both in AU.
 *
 * Result is in Km/sec.
 * @param {number} a - Semimajor axis in AU.
 * @param {number} r - Heliocentric distance in AU.
 * @returns {number} Instantaneous orbital velocity in km/s.
 */
export declare function velocity(a: number, r: number): number;
/**
 * Velocity returns the velocity of a body at aphelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 * @param {number} a - Semimajor axis in AU.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Velocity at aphelion in km/s.
 */
export declare function vAphelion(a: number, e: number): number;
/**
 * Velocity returns the velocity of a body at perihelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 * @param {number} a - Semimajor axis in AU.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Velocity at perihelion in km/s.
 */
export declare function vPerihelion(a: number, e: number): number;
/**
 * Length1 returns Ramanujan's approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 * @param {number} a - Semimajor axis.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Approximate orbital circumference.
 */
export declare function length1(a: number, e: number): number;
/**
 * Length2 returns an alternate approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 * @param {number} a - Semimajor axis.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Approximate orbital circumference.
 */
export declare function length2(a: number, e: number): number;
/**
 * Length3 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 */
/**
 * Length4 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 * @param {number} a - Semimajor axis.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Orbital circumference.
 */
export declare function length4(a: number, e: number): number;
declare const _default: {
    position: typeof position;
    Elements: typeof Elements;
    astrometricJ2000: typeof astrometricJ2000;
    velocity: typeof velocity;
    vAphelion: typeof vAphelion;
    vPerihelion: typeof vPerihelion;
    length1: typeof length1;
    length2: typeof length2;
    length4: typeof length4;
};
export default _default;
