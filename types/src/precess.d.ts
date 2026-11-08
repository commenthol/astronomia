/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module precess
 */
/**
 * Precession: Chapter 21, Precession.
 *
 * Functions in this package take Julian epoch argurments rather than Julian
 * days.  Use base.JDEToJulianYear() to convert.
 *
 * Also in package base are some definitions related to the Besselian and
 * Julian Year.
 *
 * Partial:  Precession from FK4 not implemented.  Meeus gives no test cases.
 * It's a fair amount of code and data, representing significant chances for
 * errors.  And precession from FK4 would seem to be of little interest today.
 *
 * Proper motion units
 *
 * Meeus gives some example annual proper motions in units of seconds of
 * right ascension and seconds of declination.  To make units clear,
 * functions in this package take proper motions with argument types of
 * sexa.HourAngle and sexa.Angle respectively.  Error-prone conversions
 * can be avoided by using the constructors for these base types.
 *
 * For example, given an annual proper motion in right ascension of -0ˢ.03847,
 * rather than
 *
 * mra = -0.03847 / 13751 // as Meeus suggests
 *
 * or
 *
 * mra = -0.03847 * (15/3600) * (pi/180) // less magic
 *
 * use
 *
 * mra = new sexa.HourAngle(false, 0, 0, -0.03847)
 *
 * Unless otherwise indicated, functions in this library expect proper motions
 * to be annual proper motions, so the unit denominator is years.
 * (The code, following Meeus's example, technically treats it as Julian years.)
 */
import { Equatorial, Ecliptic } from './coord.js';
import { Elements } from './elementequinox.js';
import { HourAngle, Angle } from './sexagesimal.js';
/**
 * approxAnnualPrecession returns approximate annual precision in right
 * ascension and declination.
 *
 * The two epochs should be within a few hundred years.
 * The declinations should not be too close to the poles.
 *
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {{ra: number, dec: number}} Annual right-ascension and declination precession, in radians.
 */
export declare function approxAnnualPrecession(eqFrom: Equatorial, epochFrom: number, epochTo: number): {
    ra: number;
    dec: number;
};
/**
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {Number[]}
 */
export declare function mn(epochFrom: number, epochTo: number): number[];
/**
 * ApproxPosition uses ApproxAnnualPrecession to compute a simple and quick
 * precession while still considering proper motion.
 *
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mα - in radians
 * @param {Number} mδ - in radians
 * @returns {Equatorial} eqTo
 */
export declare function approxPosition(eqFrom: Equatorial, epochFrom: number, epochTo: number, mα: number, mδ: number): Equatorial;
/**
 * Precessor represents precession from one epoch to another.
 *
 * Construct with NewPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
export declare class Precessor {
    ζ: number;
    z: number;
    sθ: number;
    cθ: number;
    /**
     * constructs a Precessor object and initializes it to precess
     * coordinates from epochFrom to epochTo.
     * @param {Number} epochFrom
     * @param {Number} epochTo
     */
    constructor(epochFrom: number, epochTo: number);
    /**
     * Precess precesses coordinates eqFrom, leaving result in eqTo.
     *
     * @param {Equatorial} eqFrom
     * @returns {Equatorial} eqTo
     */
    precess(eqFrom: Equatorial): Equatorial;
}
/**
 * Position precesses equatorial coordinates from one epoch to another,
 * including proper motions.
 *
 * If proper motions are not to be considered or are not applicable, pass 0, 0
 * for mα, mδ
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mα - in radians
 * @param {Number} mδ - in radians
 * @returns {Equatorial} [eqTo]
 */
export declare function position(eqFrom: Equatorial, epochFrom: number, epochTo: number, mα: number, mδ: number): Equatorial;
/**
 * EclipticPrecessor represents precession from one epoch to another.
 *
 * Construct with NewEclipticPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
export declare class EclipticPrecessor {
    π: number;
    p: number;
    sη: number;
    cη: number;
    /**
     * constructs an EclipticPrecessor object and initializes
     * it to precess coordinates from epochFrom to epochTo.
     * @param {Number} epochFrom
     * @param {Number} epochTo
     */
    constructor(epochFrom: number, epochTo: number);
    /**
     * EclipticPrecess precesses coordinates eclFrom, leaving result in eclTo.
     *
     * The same struct may be used for eclFrom and eclTo.
     * EclTo is returned for convenience.
     * @param {Ecliptic} eclFrom
     * @returns {Ecliptic} [eclTo]
     */
    precess(eclFrom: Ecliptic): Ecliptic;
    /**
     * ReduceElements reduces orbital elements of a solar system body from one
     * equinox to another.
     *
     * This function is described in chapter 24, but is located in this
     * package so it can be a method of EclipticPrecessor.
     *
     * @param {Elements} eFrom
     * @returns {Elements} eTo
     */
    reduceElements(eFrom: Elements): Elements;
}
/**
 * eclipticPosition precesses ecliptic coordinates from one epoch to another,
 * including proper motions.
 * While eclFrom is given as ecliptic coordinates, proper motions mα, mδ are
 * still expected to be equatorial.  If proper motions are not to be considered
 * or are not applicable, pass 0, 0.
 * Both eclFrom and eclTo must be non-nil, although they may point to the same
 * struct.  EclTo is returned for convenience.
 *
 * @param {Ecliptic} eclFrom - Ecliptic position at the source epoch.
 * @param {number} epochFrom - Source epoch as a Julian year.
 * @param {number} epochTo - Target epoch as a Julian year.
 * @param {HourAngle} [mα] - Proper motion in right ascension.
 * @param {Angle} [mδ] - Proper motion in declination.
 * @returns {Ecliptic} Position at the target epoch.
 */
export declare function eclipticPosition(eclFrom: Ecliptic, epochFrom: number, epochTo: number, mα?: HourAngle, mδ?: Angle): Ecliptic;
/**
 * @param {Number} mα - anual proper motion (ra)
 * @param {Number} mδ - anual proper motion (dec)
 * @param {Number} epoch
 * @param {Ecliptic} ecl
 * @returns {Ecliptic} {lon, lat}
 */
export declare function properMotion(mα: number, mδ: number, epoch: number, ecl: Ecliptic): Ecliptic;
/**
 * ProperMotion3D takes the 3D equatorial coordinates of an object
 * at one epoch and computes its coordinates at a new epoch, considering
 * proper motion and radial velocity.
 *
 * Radial distance (r) must be in parsecs, radial velocitiy (mr) in
 * parsecs per year.
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 *
 * @param {Equatorial} eqFrom - Equatorial position at the source epoch.
 * @param {number} epochFrom - Source epoch as a Julian year.
 * @param {number} epochTo - Target epoch as a Julian year.
 * @param {number} r - Radial distance in parsecs.
 * @param {number} mr - Radial velocity in parsecs per year.
 * @param {HourAngle} mα - Proper motion in right ascension.
 * @param {Angle} mδ - Proper motion in declination.
 * @returns {Equatorial} Equatorial position at the target epoch.
 */
export declare function properMotion3D(eqFrom: Equatorial, epochFrom: number, epochTo: number, r: number, mr: number, mα: HourAngle, mδ: Angle): Equatorial;
declare const _default: {
    approxAnnualPrecession: typeof approxAnnualPrecession;
    mn: typeof mn;
    approxPosition: typeof approxPosition;
    Precessor: typeof Precessor;
    position: typeof position;
    EclipticPrecessor: typeof EclipticPrecessor;
    eclipticPosition: typeof eclipticPosition;
    properMotion: typeof properMotion;
    properMotion3D: typeof properMotion3D;
};
export default _default;
