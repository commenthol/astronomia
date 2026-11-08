/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apparent
 */
/**
 * Apparent: Chapter 23, Apparent Place of a Star
 */
/**
 * Nutation returns corrections due to nutation for equatorial coordinates
 * of an object.
 *
 * Results are invalid for objects very near the celestial poles.
 * @param {Number} α - right ascension
 * @param {Number} δ - declination
 * @param {Number} jd - Julian Day
 * @return {Number[]} [Δα1, Δδ1] -
 */
export declare function nutation(α: number, δ: number, jd: number): number[];
/**
 * longitude of perihelian of Earth's orbit.
 * @param {number} T - Julian centuries from J2000.
 * @returns {number} Longitude of Earth's perihelion in radians.
 */
export declare function perihelion(T: number): number;
/**
 * EclipticAberration returns corrections due to aberration for ecliptic
 * coordinates of an object.
 * @param {number} λ - Ecliptic longitude in radians.
 * @param {number} β - Ecliptic latitude in radians.
 * @param {number} jd - Julian day.
 * @returns {[number, number]} Longitude and latitude corrections in radians.
 */
export declare function eclipticAberration(λ: number, β: number, jd: number): [number, number];
/**
 * Aberration returns corrections due to aberration for equatorial
 * coordinates of an object.
 * @param {number} α - Right ascension in radians.
 * @param {number} δ - Declination in radians.
 * @param {number} jd - Julian day.
 * @returns {[number, number]} Right-ascension and declination corrections in radians.
 */
export declare function aberration(α: number, δ: number, jd: number): [number, number];
/**
 * Position computes the apparent position of an object.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, precession, nutation, and aberration.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 * @param {import('./coord.js').Equatorial} eqFrom - Equatorial position at the source epoch.
 * @param {number} epochFrom - Source epoch as a Julian year.
 * @param {number} epochTo - Target epoch as a Julian year.
 * @param {number} mα - Proper motion in right ascension, in radians per year.
 * @param {number} mδ - Proper motion in declination, in radians per year.
 * @returns {import('./coord.js').Equatorial} Apparent equatorial position at the target epoch.
 */
export declare function position(eqFrom: import('./coord.js').Equatorial, epochFrom: number, epochTo: number, mα: number, mδ: number): import('./coord.js').Equatorial;
/**
 * AberrationRonVondrak uses the Ron-Vondrák expression to compute corrections
 * due to aberration for equatorial coordinates of an object.
 * @param {number} α - Right ascension in radians.
 * @param {number} δ - Declination in radians.
 * @param {number} jd - Julian day.
 * @returns {[number, number]} Right-ascension and declination corrections in radians.
 */
export declare function aberrationRonVondrak(α: number, δ: number, jd: number): [number, number];
/**
 * PositionRonVondrak computes the apparent position of an object using
 * the Ron-Vondrák expression for aberration.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, aberration, precession, and _nutation.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 *
 * Note the Ron-Vondrák expression is only valid for the epoch J2000.
 * EqFrom must be coordinates at epoch J2000.
 * @param {import('./coord.js').Equatorial} eqFrom - Equatorial position at J2000.
 * @param {number} epochTo - Target epoch as a Julian year.
 * @param {import('./sexagesimal.js').HourAngle} mα - Proper motion in right ascension.
 * @param {import('./sexagesimal.js').Angle} mδ - Proper motion in declination.
 * @returns {import('./coord.js').Equatorial} Apparent equatorial position at the target epoch.
 */
export declare function positionRonVondrak(eqFrom: import('./coord.js').Equatorial, epochTo: number, mα: import('./sexagesimal.js').HourAngle, mδ: import('./sexagesimal.js').Angle): import('./coord.js').Equatorial;
declare const _default: {
    nutation: typeof nutation;
    perihelion: typeof perihelion;
    eclipticAberration: typeof eclipticAberration;
    aberration: typeof aberration;
    position: typeof position;
    aberrationRonVondrak: typeof aberrationRonVondrak;
    positionRonVondrak: typeof positionRonVondrak;
};
export default _default;
