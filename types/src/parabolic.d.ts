/**
 * Elements holds parabolic elements needed for computing true anomaly and distance.
 */
export declare class Elements {
    timeP: number;
    pDis: number;
    /**
     * @param {Number} timeP - time of perihelion, T
     * @param {Number} pDis - perihelion distance, q
     */
    constructor(timeP: number, pDis: number);
    /**
     * AnomalyDistance returns true anomaly and distance of a body in a parabolic orbit of the Sun.
     *
     * @param {Number} jde - Julian ephemeris day
     * @returns {{ano: number, dist: number}} True anomaly in radians and heliocentric distance in AU.
     */
    anomalyDistance(jde: number): {
        ano: number;
        dist: number;
    };
}
declare const _default: {
    Elements: typeof Elements;
};
export default _default;
