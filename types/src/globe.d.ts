/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module globe
 */
/**
 * Globe: Chapter 11, The Earth's Globe.
 *
 * Globe contains functions concerning the surface of the Earth idealized as
 * an ellipsoid of revolution.
 */
/**
 * Ellipsoid represents an ellipsoid of revolution. */
export declare class Ellipsoid {
    radius: number;
    flat: number;
    /**
     * @param {number} radius - equatorial radius
     * @param {number} flat - ellipsiod flattening
     */
    constructor(radius: number, flat: number);
    /** A is a common identifier for equatorial radius. */
    A(): number;
    /** B is a common identifier for polar radius. */
    B(): number;
    /** eccentricity of a meridian. */
    eccentricity(): number;
    /**
     * parallaxConstants computes parallax constants ρ sin φ′ and ρ cos φ′.
     *
     * Arguments are geographic latitude φ in radians and height h
     * in meters above the ellipsoid.
     *
     * @param {number} φ - geographic latitude in radians
     * @param {number} h - height in meters above the ellipsoid
     * @return {number[]} [ρ sin φ′, ρ cos φ] parallax constants [ρsφ, ρcφ]
     */
    parallaxConstants(φ: number, h: number): number[];
    /**
     * rho is distance from Earth center to a point on the ellipsoid.
     *
     * Result unit is fraction of the equatorial radius.
     * @param {number} φ - geographic latitude in radians
     * @returns {number} // TODO
     */
    rho(φ: number): number;
    /**
     * radiusAtLatitude returns the radius of the circle that is the parallel of
     * latitude at φ.
     *
     * Result unit is Km.
     *
     * @param {number} φ
     * @return {number} radius in km
     */
    radiusAtLatitude(φ: number): number;
    /**
     * radiusOfCurvature of meridian at latitude φ.
     *
     * Result unit is Km.
     *
     * @param {number} φ
     * @return {number} radius in km
     */
    radiusOfCurvature(φ: number): number;
    /**
     * distance is distance between two points measured along the surface
     * of an ellipsoid.
     *
     * Accuracy is much better than that of approxAngularDistance or
     * approxLinearDistance.
     *
     * Result unit is Km.
     *
     * @param {Coord} c1
     * @param {Coord} c2
     * @return {number} radius in km
     */
    distance(c1: Coord, c2: Coord): number;
}
/** IAU 1976 values.  Radius in Km. */
export declare const Earth76: Ellipsoid;
/**
 * RotationRate1996_5 is the rotational angular velocity of the Earth
 * with respect to the stars at the epoch 1996.5.
 *
 * Unit is radian/second.
 */
export declare const RotationRate1996_5 = 0.00007292114992;
/**
 * oneDegreeOfLongitude returns the length of one degree of longitude.
 *
 * Argument `rp` is the radius in Km of a circle that is a parallel of latitude
 * (as returned by Ellipsoid.radiusAtLatitude.)
 * Result is distance in Km along one degree of the circle.
 *
 * @param {number} rp
 * @return {number} distance in Km
 */
export declare function oneDegreeOfLongitude(rp: number): number;
/**
 * oneDegreeOfLatitude returns the length of one degree of latitude.
 *
 * Argument `rm` is the radius in Km of curvature along a meridian.
 * (as returned by Ellipsoid.radiusOfCurvature.)
 * Result is distance in Km along one degree of the meridian.
 *
 * @param {number} rm
 * @return {number} distance in Km
 */
export declare function oneDegreeOfLatitude(rm: number): number;
/**
 * geocentricLatitudeDifference returns geographic latitude - geocentric
 * latitude (φ - φ′) with given geographic latitude (φ).
 *
 * Units are radians.
 * @param {number} φ
 * @returns {number} difference in Deg
 */
export declare function geocentricLatitudeDifference(φ: number): number;
/**
 * Coord represents geographic coordinates on the Earth.
 *
 * Longitude is measured positively westward from the Greenwich meridian.
 */
export declare class Coord {
    lat: number;
    lon: number;
    /**
     * @param {number} lat - latitude (φ) in radians
     * @param {number} lon - longitude (ψ, or L) in radians (measured positively westward)
     */
    constructor(lat?: number, lon?: number);
}
/**
 * approxAngularDistance returns the cosine of the angle between two points.
 *
 * The accuracy deteriorates at small angles.
 *
 * @param {Coord} p1 - Point 1
 * @param {Coord} p2 - Point 2
 * @returns {number} cosine `cos` of the angle between two points.
 * Use `d = Math.acos(cos)` to obtain geocentric angular distance in radians
 */
export declare function approxAngularDistance(p1: Coord, p2: Coord): number;
/**
 * approxLinearDistance computes a distance across the surface of the Earth.
 *
 * Approximating the Earth as a sphere, the function takes a geocentric angular
 * distance in radians and returns the corresponding linear distance in Km.
 *
 * @param {number} d - geocentric angular distance in radians
 * @returns linear distance in Km
 */
export declare function approxLinearDistance(d: number): number;
declare const _default: {
    Ellipsoid: typeof Ellipsoid;
    Earth76: Ellipsoid;
    RotationRate1996_5: number;
    oneDegreeOfLongitude: typeof oneDegreeOfLongitude;
    oneDegreeOfLatitude: typeof oneDegreeOfLatitude;
    geocentricLatitudeDifference: typeof geocentricLatitudeDifference;
    Coord: typeof Coord;
    approxAngularDistance: typeof approxAngularDistance;
    approxLinearDistance: typeof approxLinearDistance;
};
export default _default;
