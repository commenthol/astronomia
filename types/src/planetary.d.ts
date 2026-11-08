/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetary
 */
/**
 * Planetary: Chapter 36, The Calculation of some Planetary Phenomena.
 *
 * Incomplete: Some functions unimplemented for lack of test data.
 */
export type MeanCoefficients = {
    A: number;
    B: number;
    M0: number;
    M1: number;
};
export type AdditionalAngle = {
    c: number;
    f: number;
};
/**
 * @typedef {{A: number, B: number, M0: number, M1: number}} MeanCoefficients
 * @typedef {{c: number, f: number}} AdditionalAngle
 */
/**
 * Mean computes some intermediate values for a mean planetary configuration
 * given a year and a row of coefficients from Table 36.A, p. 250.0
 * @param {number} y - Decimal year.
 * @param {MeanCoefficients} a - Coefficients from Table 36.A.
 * @returns {[number, number, number]} Julian day, mean anomaly in radians, and Julian centuries.
 */
export declare function mean(y: number, a: MeanCoefficients): [number, number, number];
/**
 * Sum computes a sum of periodic terms.
 * @param {number} T - Julian centuries from J2000.
 * @param {number} M - Mean anomaly in radians.
 * @param {number[][]} c - Periodic-term coefficients.
 * @returns {number} Sum of the periodic terms.
 */
export declare function sum(T: number, M: number, c: number[][]): number;
/**
 * ms returns a mean time corrected by a sum.
 * @param {number} y - Decimal year.
 * @param {MeanCoefficients} a - Mean configuration coefficients.
 * @param {number[][]} c - Periodic-term coefficients.
 * @returns {number} Corrected Julian ephemeris day.
 */
export declare function ms(y: number, a: MeanCoefficients, c: number[][]): number;
/**
 * MercuryInfConj returns the time of an inferior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Mercury's inferior conjunction.
 */
export declare function mercuryInfConj(y: number): number;
/**
 * MercurySupConj returns the time of a superior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Mercury's superior conjunction.
 */
export declare function mercurySupConj(y: number): number;
/**
 * VenusInfConj returns the time of an inferior conjunction of Venus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Venus's inferior conjunction.
 */
export declare function venusInfConj(y: number): number;
/**
 * MarsOpp returns the time of an opposition of Mars.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Mars's opposition.
 */
export declare function marsOpp(y: number): number;
/**
 * SumA computes the sum of periodic terms with "additional angles".
 * @param {number} T - Julian centuries from J2000.
 * @param {number} M - Mean anomaly in radians.
 * @param {number[][]} c - Periodic-term coefficients.
 * @param {AdditionalAngle[]} aa - Additional-angle coefficients.
 * @returns {number} Sum of the periodic terms.
 */
export declare function sumA(T: number, M: number, c: number[][], aa: AdditionalAngle[]): number;
/**
 * Msa returns a mean time corrected by a sum.
 * @param {number} y - Decimal year.
 * @param {MeanCoefficients} a - Mean configuration coefficients.
 * @param {number[][]} c - Periodic-term coefficients.
 * @param {AdditionalAngle[]} aa - Additional-angle coefficients.
 * @returns {number} Corrected Julian ephemeris day.
 */
export declare function msa(y: number, a: MeanCoefficients, c: number[][], aa: AdditionalAngle[]): number;
/**
 * JupiterOpp returns the time of an opposition of Jupiter.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Jupiter's opposition.
 */
export declare function jupiterOpp(y: number): number;
/**
 * SaturnOpp returns the time of an opposition of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Saturn's opposition.
 */
export declare function saturnOpp(y: number): number;
/**
 * SaturnConj returns the time of a conjunction of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Saturn's conjunction.
 */
export declare function saturnConj(y: number): number;
/**
 * UranusOpp returns the time of an opposition of Uranus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Uranus's opposition.
 */
export declare function uranusOpp(y: number): number;
/**
 * NeptuneOpp returns the time of an opposition of Neptune.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Neptune's opposition.
 */
export declare function neptuneOpp(y: number): number;
/**
 * El computes time and elongation of a greatest elongation event.
 * @param {number} y - Decimal year near the event.
 * @param {MeanCoefficients} _a - Mean configuration coefficients (retained for signature compatibility).
 * @param {number[][]} t - Periodic-term coefficients for event time.
 * @param {number[][]} e - Periodic-term coefficients for elongation.
 * @returns {[number, number]} Julian ephemeris day and elongation in radians.
 */
export declare function el(y: number, _a: MeanCoefficients, t: number[][], e: number[][]): [number, number];
/**
 * MercuryEastElongation returns the time and elongation of a greatest eastern elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {[number, number]} Julian ephemeris day and elongation in radians.
 */
export declare function mercuryEastElongation(y: number): [number, number];
/**
 * MercuryWestElongation returns the time and elongation of a greatest western elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 * @param {number} y - Decimal year near the event.
 * @returns {[number, number]} Julian ephemeris day and elongation in radians.
 */
export declare function mercuryWestElongation(y: number): [number, number];
/**
 * Return the time of Mars's second station near the given year.
 * @param {number} y - Decimal year near the event.
 * @returns {number} Julian ephemeris day of Mars's second station.
 */
export declare function marsStation2(y: number): number;
declare const _default: {
    mean: typeof mean;
    sum: typeof sum;
    ms: typeof ms;
    mercuryInfConj: typeof mercuryInfConj;
    mercurySupConj: typeof mercurySupConj;
    venusInfConj: typeof venusInfConj;
    marsOpp: typeof marsOpp;
    sumA: typeof sumA;
    msa: typeof msa;
    jupiterOpp: typeof jupiterOpp;
    saturnOpp: typeof saturnOpp;
    saturnConj: typeof saturnConj;
    uranusOpp: typeof uranusOpp;
    neptuneOpp: typeof neptuneOpp;
    el: typeof el;
    mercuryEastElongation: typeof mercuryEastElongation;
    mercuryWestElongation: typeof mercuryWestElongation;
    marsStation2: typeof marsStation2;
};
export default _default;
