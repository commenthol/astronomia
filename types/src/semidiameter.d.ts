/**
 * Standard semidiameters at unit distance of 1 AU.
 * Values are scaled here to radians.
 */
export declare const Sun: number;
export declare const Mercury: number;
export declare const VenusSurface: number;
export declare const VenusCloud: number;
export declare const Mars: number;
export declare const JupiterEquatorial: number;
export declare const JupiterPolar: number;
export declare const SaturnEquatorial: number;
export declare const SaturnPolar: number;
export declare const Uranus: number;
export declare const Neptune: number;
export declare const Pluto: number;
export declare const Moon: number;
/**
 * Semidiameter returns semidiameter at specified distance.
 *
 * When used with S0 values provided, Δ must be observer-body distance in AU.
 * Result will then be in radians.
 * @param {number} s0 - Semidiameter at 1 AU in radians.
 * @param {number} Δ - Observer-body distance in AU.
 * @returns {number} Semidiameter in radians.
 */
export declare function semidiameter(s0: number, Δ: number): number;
/**
 * SaturnApparentPolar returns apparent polar semidiameter of Saturn
 * at specified distance.
 *
 * Argument Δ must be observer-Saturn distance in AU.  Argument B is
 * Saturnicentric latitude of the observer as given by function saturnring.UB()
 * for example.
 *
 * Result is semidiameter in units of package variables SaturnPolar and
 * SaturnEquatorial, nominally radians.
 * @param {number} Δ - Observer-Saturn distance in AU.
 * @param {number} B - Saturnicentric latitude of the observer in radians.
 * @returns {number} Apparent polar semidiameter in radians.
 */
export declare function saturnApparentPolar(Δ: number, B: number): number;
/**
 * MoonTopocentric returns observed topocentric semidiameter of the Moon.
 *
 *  Δ is distance to Moon in AU.
 *  δ is declination of Moon in radians.
 *  H is hour angle of Moon in radians.
 *  ρsφʹ, ρcφʹ are parallax constants as returned by
 *      globe.Ellipsoid.ParallaxConstants, for example.
 *
 * Result is semidiameter in radians.
 * @param {number} Δ - Distance to the Moon in AU.
 * @param {number} δ - Declination of the Moon in radians.
 * @param {number} H - Hour angle of the Moon in radians.
 * @param {number} ρsφʹ - Sine parallax constant for the observer.
 * @param {number} ρcφʹ - Cosine parallax constant for the observer.
 * @returns {number} Topocentric semidiameter in radians.
 */
export declare function moonTopocentric(Δ: number, δ: number, H: number, ρsφʹ: number, ρcφʹ: number): number;
/**
 * MoonTopocentric2 returns observed topocentric semidiameter of the Moon
 * by a less rigorous method.
 *
 * Δ is distance to Moon in AU, h is altitude of the Moon above the observer's
 * horizon in radians.
 *
 * Result is semidiameter in radians.
 * @param {number} Δ - Distance to the Moon in AU.
 * @param {number} h - Altitude of the Moon in radians.
 * @returns {number} Topocentric semidiameter in radians.
 */
export declare function moonTopocentric2(Δ: number, h: number): number;
/**
 * AsteroidDiameter returns approximate diameter given absolute magnitude H
 * and albedo A.
 *
 * Result is in km.
 * @param {number} H - Absolute magnitude.
 * @param {number} A - Albedo.
 * @returns {number} Approximate asteroid diameter in kilometres.
 */
export declare function asteroidDiameter(H: number, A: number): number;
/**
 * Asteroid returns semidiameter of an asteroid with a given diameter
 * at given distance.
 *
 * Argument d is diameter in km, Δ is distance in AU.
 *
 * Result is semidiameter in radians.
 * @param {number} d - Asteroid diameter in kilometres.
 * @param {number} Δ - Distance in AU.
 * @returns {number} Semidiameter in radians.
 */
export declare function asteroid(d: number, Δ: number): number;
declare const _default: {
    Sun: number;
    Mercury: number;
    VenusSurface: number;
    VenusCloud: number;
    Mars: number;
    JupiterEquatorial: number;
    JupiterPolar: number;
    SaturnEquatorial: number;
    SaturnPolar: number;
    Uranus: number;
    Neptune: number;
    Pluto: number;
    Moon: number;
    semidiameter: typeof semidiameter;
    saturnApparentPolar: typeof saturnApparentPolar;
    moonTopocentric: typeof moonTopocentric;
    moonTopocentric2: typeof moonTopocentric2;
    asteroidDiameter: typeof asteroidDiameter;
    asteroid: typeof asteroid;
};
export default _default;
