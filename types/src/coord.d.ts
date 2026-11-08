/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module coord
 */
/**
 * Coord: Chapter 13, Transformation of Coordinates.
 *
 * Transforms in this package are provided in two forms, function and method.
 * The results of the two forms should be identical.
 *
 * The function forms pass all arguments and results as single values.  These
 * forms are best used when you are transforming a single pair of coordinates
 * and wish to avoid memory allocation.
 *
 * The method forms take and return pointers to structs.  These forms are best
 * used when you are transforming multiple coordinates and can reuse one or
 * more of the structs.  In this case reuse of structs will minimize
 * allocations, and the struct pointers will pass more efficiently on the
 * stack.  These methods transform their arguments, placing the result in
 * the receiver.  The receiver is then returned for convenience.
 *
 * A number of the functions take sine and cosine of the obliquity of the
 * ecliptic.  This becomes an advantage when you doing multiple transformations
 * with the same obliquity.  The efficiency of computing sine and cosine once
 * and reuse these values far outweighs the overhead of passing one number as
 * opposed to two.
 */
import { Coord as GlobeCoord } from './globe.js';
export type LonLat = {
    /**
     * - Longitude (λ) in radians
     */
    lon: number;
    /**
     * - Latitude (β) in radians
     */
    lat: number;
};
/**
 * @typedef {object} LonLat
 * @property {Number} lon - Longitude (λ) in radians
 * @property {Number} lat - Latitude (β) in radians
 */
/**
 * Ecliptic coordinates are referenced to the plane of the ecliptic.
 */
export declare class Ecliptic {
    lon: number;
    lat: number;
    /**
     * IMPORTANT: Longitudes are measured *positively* westwards
     * e.g. Washington D.C. +77°04; Vienna -16°23'
     * @param {Number|LonLat} [lon] - Longitude (λ) in radians
     * @param {Number} [lat] - Latitude (β) in radians
     */
    constructor(lon?: number | LonLat, lat?: number);
    /**
     * converts ecliptic coordinates to equatorial coordinates.
     * @param {Number} ε - Obliquity
     * @returns {Equatorial}
     */
    toEquatorial(ε: number): Equatorial;
}
/**
 * Equatorial coordinates are referenced to the Earth's rotational axis.
 */
export declare class Equatorial {
    ra: number;
    dec: number;
    /**
     * @param {Number} ra - (float) Right ascension (α) in radians
     * @param {Number} dec - (float) Declination (δ) in radians
     */
    constructor(ra?: number, dec?: number);
    /**
     * EqToEcl converts equatorial coordinates to ecliptic coordinates.
     * @param {Number} ε - Obliquity
     * @returns {Ecliptic}
     */
    toEcliptic(ε: number): Ecliptic;
    /**
     * EqToHz computes Horizontal coordinates from equatorial coordinates.
     *
     * Argument g is the location of the observer on the Earth.  Argument st
     * is the sidereal time at Greenwich.
     *
     * Sidereal time must be consistent with the equatorial coordinates.
     * If coordinates are apparent, sidereal time must be apparent as well.
     *
     * @param {GlobeCoord} g - coordinates of observer on Earth
     * @param {Number} st - sidereal time at Greenwich at time of observation
     * @returns {Horizontal}
     */
    toHorizontal(g: GlobeCoord, st: number): Horizontal;
    /**
     * EqToGal converts equatorial coordinates to galactic coordinates.
     *
     * Equatorial coordinates must be referred to the standard equinox of B1950.0.
     * For conversion to B1950, see package precess and utility functions in
     * package "common".
     *
     * @returns {Galactic}
     */
    toGalactic(): Galactic;
}
/**
 * Horizontal coordinates are referenced to the local horizon of an observer
 * on the surface of the Earth.
 * @param {Number} az - Azimuth (A) in radians
 * @param {Number} alt - Altitude (h) in radians
 */
export declare class Horizontal {
    az: number;
    alt: number;
    /**
     * @param {number} [az=0] - Azimuth in radians.
     * @param {number} [alt=0] - Altitude in radians.
     */
    constructor(az?: number, alt?: number);
    /**
     * transforms horizontal coordinates to equatorial coordinates.
     *
     * Sidereal time must be consistent with the equatorial coordinates.
     * If coordinates are apparent, sidereal time must be apparent as well.
     * @param {GlobeCoord} g - coordinates of observer on Earth (lat, lon)
     * @param {Number} st - sidereal time at Greenwich at time of observation.
     * @returns {Equatorial} (right ascension, declination)
     */
    toEquatorial(g: GlobeCoord, st: number): Equatorial;
}
/**
 * Galactic coordinates are referenced to the plane of the Milky Way.
 * @param {Number} lon - Longitude (l) in radians
 * @param {Number} lat - Latitude (b) in radians
 */
export declare class Galactic {
    lon: number;
    lat: number;
    /**
     * @param {number} [lon=0] - Galactic longitude in radians.
     * @param {number} [lat=0] - Galactic latitude in radians.
     */
    constructor(lon?: number, lat?: number);
    /**
     * GalToEq converts galactic coordinates to equatorial coordinates.
     *
     * Resulting equatorial coordinates will be referred to the standard equinox of
     * B1950.0.  For subsequent conversion to other epochs, see package precess and
     * utility functions in package meeus.
     *
     * @returns {Equatorial} (right ascension, declination)
     */
    toEquatorial(): Equatorial;
}
/**
 * equatorial coords for galactic north
 * IAU B1950.0 coordinates of galactic North Pole
 */
export declare const galacticNorth: Equatorial;
export declare const galacticNorth1950: Equatorial;
/**
 * Galactic Longitude 0°
 * Meeus gives 33 as the origin of galactic longitudes relative to the
 * ascending node of of the galactic equator.  33 + 90 = 123, the IAU
 * value for origin relative to the equatorial pole.
 */
export declare const galacticLon0: number;
export declare const galactic0Lon1950: number;
declare const _default: {
    Ecliptic: typeof Ecliptic;
    Equatorial: typeof Equatorial;
    Horizontal: typeof Horizontal;
    Galactic: typeof Galactic;
    galacticNorth: Equatorial;
    galacticNorth1950: Equatorial;
    galacticLon0: number;
    galactic0Lon1950: number;
};
export default _default;
