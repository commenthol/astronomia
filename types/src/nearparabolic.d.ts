export type AnomalyDistance = {
    ano?: number;
    dist?: number;
    err: Error | null;
};
/** @typedef {{ano?: number, dist?: number, err: Error|null}} AnomalyDistance */
/**
 * Elements holds orbital elements for near-parabolic orbits.
 */
export declare class Elements {
    timeP: number;
    pDis: number;
    ecc: number;
    /**
     * @param {Number} timeP - time of Perihelion, T
     * @param {Number} pDis - Perihelion distance, q
     * @param {Number} ecc - eccentricity, e
     */
    constructor(timeP: number, pDis: number, ecc: number);
    /**
     * AnomalyDistance returns true anomaly and distance for near-parabolic orbits.
     *
     * True anomaly ν returned in radians. Distance r returned in AU.
     * An error is returned if the algorithm fails to converge.
     * @param {number} jde - Julian ephemeris day.
     * @returns {AnomalyDistance} True anomaly, distance, and convergence status.
     */
    anomalyDistance(jde: number): AnomalyDistance;
}
declare const _default: {
    Elements: typeof Elements;
};
export default _default;
