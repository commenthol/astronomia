/**
 * gt15True returns refraction for obtaining true altitude when altitude
 * is greater than 15 degrees (about 0.26 radians.)
 *
 * h0 must be a measured apparent altitude of a celestial body in radians.
 *
 * Result is refraction to be subtracted from h0 to obtain the true altitude
 * of the body.  Unit is radians.
 * @param {number} h0 - Measured apparent altitude in radians.
 * @returns {number} Refraction to subtract to obtain true altitude, in radians.
 */
export declare function gt15True(h0: number): number;
/**
 * gt15Apparent returns refraction for obtaining apparent altitude when
 * altitude is greater than 15 degrees (about 0.26 radians.)
 *
 * h must be a computed true "airless" altitude of a celestial body in radians.
 *
 * Result is refraction to be added to h to obtain the apparent altitude
 * of the body.  Unit is radians.
 * @param {number} h - True airless altitude in radians.
 * @returns {number} Refraction to add to obtain apparent altitude, in radians.
 */
export declare function gt15Apparent(h: number): number;
/**
 * Bennett returns refraction for obtaining true altitude.
 *
 * h0 must be a measured apparent altitude of a celestial body in radians.
 *
 * Results are accurate to 0.07 arc min from horizon to zenith.
 *
 * Result is refraction to be subtracted from h0 to obtain the true altitude
 * of the body.  Unit is radians.
 * @param {number} h0 - Measured apparent altitude in radians.
 * @returns {number} Refraction to subtract to obtain true altitude, in radians.
 */
export declare function bennett(h0: number): number;
/**
 * Bennett2 returns refraction for obtaining true altitude.
 *
 * Similar to Bennett, but a correction is applied to give a more accurate
 * result.
 *
 * Results are accurate to 0.015 arc min.  Result unit is radians.
 * @param {number} h0 - Measured apparent altitude in radians.
 * @returns {number} Refraction to subtract to obtain true altitude, in radians.
 */
export declare function bennett2(h0: number): number;
/**
 * Saemundsson returns refraction for obtaining apparent altitude.
 *
 * h must be a computed true "airless" altitude of a celestial body in radians.
 *
 * Result is refraction to be added to h to obtain the apparent altitude
 * of the body.
 *
 * Results are consistent with Bennett to within 4 arc sec.
 * Result unit is radians.
 * @param {number} h - True airless altitude in radians.
 * @returns {number} Refraction to add to obtain apparent altitude, in radians.
 */
export declare function saemundsson(h: number): number;
declare const _default: {
    gt15True: typeof gt15True;
    gt15Apparent: typeof gt15Apparent;
    bennett: typeof bennett;
    bennett2: typeof bennett2;
    saemundsson: typeof saemundsson;
};
export default _default;
