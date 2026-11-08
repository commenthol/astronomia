/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module rise
 */
/**
 * Rise: Chapter 15, Rising, Transit, and Setting.
 */
import { Coord as GlobeCoord } from './globe.js';
import { Planet } from './planetposition.js';
export type RiseObj = {
    /**
     * - in seconds
     */
    rise: number;
    /**
     * - in seconds
     */
    transit: number;
    /**
     * - in seconds
     */
    set: number;
};
export type RiseTimes = {
    /**
     * - Rise time as Julian day or Date.
     */
    rise: number | Date;
    /**
     * - Transit time as Julian day or Date.
     */
    transit: number | Date;
    /**
     * - Set time as Julian day or Date.
     */
    set: number | Date;
};
export type PlanetRiseOptions = {
    /**
     * - Return times as Date objects.
     */
    date?: boolean;
    /**
     * - Refraction correction in radians.
     */
    refraction?: number;
};
export declare const errorAboveHorizon: Error & {
    code: number;
};
export declare const errorBelowHorizon: Error & {
    code: number;
};
/**
 * mean refraction of the atmosphere
 */
export declare const meanRefraction: number;
/**
 * "Standard altitudes" for various bodies already including `meanRefraction` of 0°34'
 *
 * The standard altitude is the geometric altitude of the center of body
 * at the time of apparent rising or seting.
 */
export declare const stdh0: {
    stellar: number;
    solar: number;
    lunar: number;
    lunarMean: number;
};
/**
 * Helper function to obtain corrected refraction
 * @param {number} h0 - altitude of the body in radians containing `meanRefraction` of 0°34'
 * @param {number} [corr] - the calcluated refraction e.g. from package `refraction` in radians
 * @return {number} refraction value in radians
 */
export declare function refraction(h0: number, corr?: number): number;
/**
 * standard altitude for stars, planets at apparent rising, seting
 * @param {number} [_refraction] - Optional refraction correction in radians.
 * @returns {number} Standard altitude in radians.
 */
export declare const stdh0Stellar: (_refraction?: number) => number;
export declare const Stdh0Stellar: number;
/**
 * standard altitude for sun for upper limb of the disk
 * @param {number} [_refraction] - Optional refraction correction in radians.
 * @returns {number} Standard altitude in radians.
 */
export declare const stdh0Solar: (_refraction?: number) => number;
export declare const Stdh0Solar: number;
/**
 * standard altitude for moon (low accuracy)
 * @param {number} [_refraction] - Optional refraction correction in radians.
 * @returns {number} Standard altitude in radians.
 */
export declare const stdh0LunarMean: (_refraction?: number) => number;
export declare const Stdh0LunarMean: number;
/**
 * Stdh0Lunar is the standard altitude of the Moon considering π, the
 * Moon's horizontal parallax.
 * @param {number} π - the Moon's horizontal parallax
 * @param {number} [refraction] - optional value for refraction in radians if
 *        omitted than meanRefraction is used
 * @return {number} altitude of Moon in radians
 */
export declare const stdh0Lunar: (π: number, refraction?: number) => number;
export declare const Stdh0Lunar: typeof stdh0Lunar;
/**
 * @param {number} lat - Geographic latitude in radians.
 * @param {number} h0 - Standard altitude in radians.
 * @param {number} δ - Declination in radians.
 * @return {number} Local hour angle in radians.
 */
export declare function hourAngle(lat: number, h0: number, δ: number): number;
/**
 * ApproxTimes computes approximate UT rise, transit and set times for
 * a celestial object on a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * values computed from the day.
 *
 * @param {GlobeCoord} p - is geographic coordinates of observer.
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {number} α - right ascension (radians)
 * @param {number} δ - declination (radians)
 * @return {RiseObj} Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
export declare function approxTimes(p: GlobeCoord, h0: number, Th0: number, α: number, δ: number): RiseObj;
/**
 * Times computes UT rise, transit and set times for a celestial object on
 * a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * a number of values computed from the day.
 *
 * @param {GlobeCoord} p - is geographic coordinates of observer.
 * @param {number} ΔT - is delta T in seconds
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {Array<number>} α3 - slices of three right ascensions
 * @param {Array<number>} δ3 - slices of three declinations.
 *        α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 *        and the day after the day of interest.  Units are radians.
 *
 * @return {RiseObj} Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
export declare function times(p: GlobeCoord, ΔT: number, h0: number, Th0: number, α3: Array<number>, δ3: Array<number>): RiseObj;
/**
 * RisePlanet computes rise, transit and set times for a planet on a day of interest.
 */
export declare class PlanetRise {
    opts: PlanetRiseOptions;
    refraction: number;
    jd: number;
    lat: number;
    lon: number;
    jde: number;
    ΔT: number;
    earth: Planet;
    planet: Planet;
    /**
     * @param {number|Date} jd - Julian Day starting at midnight or Date object
     * @param {number} lat - geographic latitude of the observerin degrees
     * @param {number} lon - geographic longitude of the observer in degrees (measured positively westward)
     * @param {Planet} earth - VSOP87 Planet object for Earth
     * @param {Planet} planet - VSOP87 Planet object of observed body
     * @param {PlanetRiseOptions} [opts] - Optional result and refraction settings.
     */
    constructor(jd: number | Date, lat: number, lon: number, earth: Planet, planet: Planet, opts?: PlanetRiseOptions);
    /** @returns {RiseTimes} Approximate rise, transit, and set times. */
    approxTimes(): RiseTimes;
    /** @returns {RiseTimes} Refined rise, transit, and set times. */
    times(): RiseTimes;
    /**
     * @private
     * @param {import('./coord.js').Equatorial[]} body - Equatorial positions.
     * @param {'ra'|'dec'} p - Coordinate property to extract.
     * @returns {number[]} Coordinate values.
     */
    private _toArr;
    /**
     * @private
     * @param {RiseObj} rs - Rise, transit, and set times in seconds.
     * @returns {RiseTimes} Times converted to Julian days or Date objects.
     */
    private _rsToJD;
    /**
     * @private
     * @param {number} secs - Seconds from the start of the day.
     * @returns {number|Date} Julian day or Date, depending on the options.
     */
    private _toJD;
}
declare const _default: {
    errorAboveHorizon: Error & {
        code: number;
    };
    errorBelowHorizon: Error & {
        code: number;
    };
    meanRefraction: number;
    stdh0: {
        stellar: number;
        solar: number;
        lunar: number;
        lunarMean: number;
    };
    refraction: typeof refraction;
    stdh0Stellar: typeof stdh0Stellar;
    Stdh0Stellar: number;
    stdh0Solar: typeof stdh0Solar;
    Stdh0Solar: number;
    stdh0LunarMean: typeof stdh0LunarMean;
    Stdh0LunarMean: number;
    stdh0Lunar: typeof stdh0Lunar;
    Stdh0Lunar: typeof stdh0Lunar;
    hourAngle: typeof hourAngle;
    approxTimes: typeof approxTimes;
    times: typeof times;
    PlanetRise: typeof PlanetRise;
};
export default _default;
