/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallactic
 */
/**
 * Parallactic: Chapter 14, The Parallactic Angle, and three other Topics.
 */
/**
 * ParallacticAngle returns parallactic angle of a celestial object.
 *
 *  φ is geographic latitude of observer.
 *  δ is declination of observed object.
 *  H is hour angle of observed object.
 *
 * All angles including result are in radians.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} δ - Declination in radians.
 * @param {number} H - Hour angle in radians.
 * @returns {number} Parallactic angle in radians.
 */
export declare function parallacticAngle(φ: number, δ: number, H: number): number;
/**
 * ParallacticAngleOnHorizon is a special case of ParallacticAngle.
 *
 * The hour angle is not needed as an input and the math inside simplifies.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} δ - Declination in radians.
 * @returns {number} Parallactic angle at the horizon, in radians.
 */
export declare function parallacticAngleOnHorizon(φ: number, δ: number): number;
/**
 * EclipticAtHorizon computes how the plane of the ecliptic intersects
 * the horizon at a given local sidereal time as observed from a given
 * geographic latitude.
 *
 *  ε is obliquity of the ecliptic.
 *  φ is geographic latitude of observer.
 *  θ is local sidereal time expressed as an hour angle.
 *
 *  λ1 and λ2 are ecliptic longitudes where the ecliptic intersects the horizon.
 *  I is the angle at which the ecliptic intersects the horizon.
 *
 * All angles, arguments and results, are in radians.
 * @param {number} ε - Obliquity of the ecliptic in radians.
 * @param {number} φ - Geographic latitude in radians.
 * @param {number} θ - Local sidereal time as an hour angle in radians.
 * @returns {[number, number, number]} Two horizon-intersection longitudes and their angle, in radians.
 */
export declare function eclipticAtHorizon(ε: number, φ: number, θ: number): [number, number, number];
/**
 * EclipticAtEquator computes the angle between the ecliptic and the parallels
 * of ecliptic latitude at a given ecliptic longitude.
 *
 * (The function name EclipticAtEquator is for consistency with the Meeus text,
 * and works if you consider the equator a nominal parallel of latitude.)
 *
 *  λ is ecliptic longitude.
 *  ε is obliquity of the ecliptic.
 *
 * All angles in radians.
 * @param {number} λ - Ecliptic longitude in radians.
 * @param {number} ε - Obliquity of the ecliptic in radians.
 * @returns {number} Angle between the ecliptic and the parallel, in radians.
 */
export declare function eclipticAtEquator(λ: number, ε: number): number;
/**
 * DiurnalPathAtHorizon computes the angle of the path a celestial object
 * relative to the horizon at the time of its rising or setting.
 *
 *  δ is declination of the object.
 *  φ is geographic latitude of observer.
 *
 * All angles in radians.
 * @param {number} δ - Declination in radians.
 * @param {number} φ - Geographic latitude in radians.
 * @returns {number} Angle of the diurnal path relative to the horizon.
 */
export declare function diurnalPathAtHorizon(δ: number, φ: number): number;
declare const _default: {
    parallacticAngle: typeof parallacticAngle;
    parallacticAngleOnHorizon: typeof parallacticAngleOnHorizon;
    eclipticAtHorizon: typeof eclipticAtHorizon;
    eclipticAtEquator: typeof eclipticAtEquator;
    diurnalPathAtHorizon: typeof diurnalPathAtHorizon;
};
export default _default;
