/**
 * computes mean anomaly for the given date.
 *
 * @param {Number} year - is a decimal year specifying the date
 * @param {Number} T - is time of periastron, as a decimal year
 * @param {Number} P - is period of revolution in mean solar years
 * @returns {Number} mean anomaly in radians.
 */
export declare function meanAnomaly(year: number, T: number, P: number): number;
/**
 * Position computes apparent position angle and angular distance of
 * components of a binary star.
 *
 * @param {Number} a - is apparent semimajor axis in arc seconds
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} Ω - is position angle of the ascending node
 * @param {Number} ω - is longitude of periastron
 * @param {Number} E - is eccentric anomaly, computed for example with package kepler
 *  and the mean anomaly as returned by function M in this package.
 * @returns {Number[]} [θ, ρ]
 *  {Number} θ -is the apparent position angle in radians,
 *  {Number} ρ is the angular distance in arc seconds.
 */
export declare function position(a: number, e: number, i: number, Ω: number, ω: number, E: number): number[];
/**
 * ApparentEccentricity returns apparent eccenticity of a binary star
 * given true orbital elements.
 *
 * @param {Number} e - is eccentricity of the true orbit
 * @param {Number} i - is inclination relative to the line of sight
 * @param {Number} ω - is longitude of periastron
 * @returns {Number} apparent eccenticity of a binary star
 */
export declare function apparentEccentricity(e: number, i: number, ω: number): number;
declare const _default: {
    meanAnomaly: typeof meanAnomaly;
    position: typeof position;
    apparentEccentricity: typeof apparentEccentricity;
};
export default _default;
