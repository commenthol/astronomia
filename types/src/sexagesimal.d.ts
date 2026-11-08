/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sexagesimal
 */
/**
 * Sexagesimal functions
 */
/**
 * Angle represents a general purpose angle.
 * Unit is radians.
 */
export declare class Angle {
    angle: number;
    /**
     * constructs a new Angle value from sign, degree, minute, and second
     * components.
     * @param {Number|Boolean} angleOrNeg - angle in radians or sign, true if negative (required to attribute -0°30')
     * __Four arguments__
     * @param {Number} [d] - (int) degree
     * @param {Number} [m] - (int) minute
     * @param {Number} [s] - (float) second
     * @param {...unknown} _args - Additional arguments are ignored.
     */
    constructor(angleOrNeg: number | boolean, d?: number, m?: number, s?: number, ..._args: unknown[]);
    /**
     * SetDMS sets the value of an FAngle from sign, degree, minute, and second
     * components.
     * The receiver is returned as a convenience.
     * @param {Boolean} neg - sign, true if negative
     * @param {Number} d - (int) degree
     * @param {Number} m - (int) minute
     * @param {Number} s - (float) second
     * @returns {Angle}
     */
    setDMS(neg?: boolean, d?: number, m?: number, s?: number): Angle;
    /**
     * sets angle
     * @param {Number} angle - (float) angle in radians
     * @returns {Angle}
     */
    setAngle(angle: number): Angle;
    /**
     * Rad returns the angle in radians.
     * @returns {Number} angle in radians
     */
    rad(): number;
    /**
     * Deg returns the angle in degrees.
     * @returns {Number} angle in degree
     */
    deg(): number;
    /**
     * toDMS converts to parsed sexagesimal angle component.
     * @returns {[boolean, number, number, number]} Sign, degrees, minutes, and seconds.
     */
    toDMS(): [boolean, number, number, number];
    /**
     * Print angle in degree using `d°m´s.ss″`
     * @param {Number} [precision] - precision of `s.ss`
     * @returns {String}
     */
    toString(precision?: number): string;
    /**
     * Print angle in degree using `d°.ff`
     * @param {Number} [precision] - precision of `.ff`
     * @returns {String}
     */
    toDegString(precision?: number): string;
}
/**
 * HourAngle represents an angle corresponding to angular rotation of
 * the Earth in a specified time.
 *
 * Unit is radians.
 */
export declare class HourAngle extends Angle {
    /**
     * NewHourAngle constructs a new HourAngle value from sign, hour, minute,
     * and second components.
     * @param {Boolean} neg
     * @param {Number} h - (int)
     * @param {Number} m - (int)
     * @param {Number} s - (float)
     * @constructor
     */
    /**
     * SetDMS sets the value of an FAngle from sign, degree, minute, and second
     * components.
     * The receiver is returned as a convenience.
     * @param {Boolean} neg - sign, true if negative
     * @param {Number} h - (int) hour
     * @param {Number} m - (int) minute
     * @param {Number} s - (float) second
     * @returns {Angle}
     */
    setDMS(neg?: boolean, h?: number, m?: number, s?: number): Angle;
    /**
     * Hour returns the hour angle as hours of time.
     * @returns hour angle
     */
    hour(): number;
    /** @returns {number} Hour angle in hours. */
    deg(): number;
    /**
     * Print angle in `HʰMᵐs.ssˢ`
     * @param {Number} precision - precision of `s.ss`
     * @returns {String}
     */
    toString(precision: number): string;
}
/**
 * DMSToDeg converts from parsed sexagesimal angle components to decimal
 * degrees.
 * @param {Boolean} neg - sign, true if negative
 * @param {Number} d - (int) degree
 * @param {Number} m - (int) minute
 * @param {Number} s - (float) second
 * @returns {Number} angle in degree
 */
export declare function DMSToDeg(neg: boolean, d: number, m: number, s: number): number;
/**
 * DegToDMS converts from decimal degrees to parsed sexagesimal angle component.
 * @param {Number} deg - angle in degree
 * @returns {[boolean, number, number, number]} Sign, degrees, minutes, and seconds.
 */
export declare function degToDMS(deg: number): [boolean, number, number, number];
export declare class RA extends HourAngle {
    /**
     * constructs a new RA value from hour, minute, and second components.
     * Negative values are not supported, RA wraps values larger than 24
     * to the range [0,24) hours.
     * @param {Number} h - (int) hour
     * @param {Number} m - (int) minute
     * @param {Number} s - (float) second
     * @param {...unknown} _args - Additional arguments are ignored.
     */
    constructor(h?: number, m?: number, s?: number, ..._args: unknown[]);
    /** @returns {number} Right ascension in the range [0, 24) hours. */
    hour(): number;
}
/**
 * Time Angle
 * Unit is time in seconds.
 */
export declare class Time {
    time: number;
    /**
     * @param {boolean|number} negOrTimeInSecs - set `true` if negative; if type is number than time in seconds
     * @param {number} [h] - (int) hour
     * @param {number} [m] - (int) minute
     * @param {number} [s] - (float) second
     * @example
     * new sexa.Time(SECS_OF_DAY)
     * new sexa.Time(false, 15, 22, 7)
     */
    constructor(negOrTimeInSecs: boolean | number, h?: number, m?: number, s?: number);
    /**
     * Set time from sign, hour, minute, and second components.
     * @param {boolean} [neg=false] - Whether the time is negative.
     * @param {number} [h=0] - Hours.
     * @param {number} [m=0] - Minutes.
     * @param {number} [s=0] - Seconds.
     * @returns {void}
     */
    setHMS(neg?: boolean, h?: number, m?: number, s?: number): void;
    /**
     * @returns {Number} time in seconds.
     */
    sec(): number;
    /**
     * @returns {Number} time in minutes.
     */
    min(): number;
    /**
     * @returns {Number} time in hours.
     */
    hour(): number;
    /**
     * @returns {Number} time in days.
     */
    day(): number;
    /**
     * @returns {Number} time in radians, where 1 day = 2 Pi radians.
     */
    rad(): number;
    /**
     * convert time to HMS
     * @returns {[boolean, number, number, number]} Sign, hours, minutes, and seconds.
     */
    toHMS(): [boolean, number, number, number];
    /**
     * Print time using `HʰMᵐsˢ.ss`
     * @param {Number} precision - precision of `.ss`
     * @returns {String}
     */
    toString(precision: number): string;
}
/** @param {number} deg - Angle in degrees. @returns {number} Angle in radians. */
export declare const angleFromDeg: (deg: number) => number;
/** @param {number} min - Angle in arcminutes. @returns {number} Angle in radians. */
export declare const angleFromMin: (min: number) => number;
/** @param {number} sec - Angle in arcseconds. @returns {number} Angle in radians. */
export declare const angleFromSec: (sec: number) => number;
/** @param {number} angle - Angle in radians. @returns {number} Angle in degrees. */
export declare const degFromAngle: (angle: number) => number;
/** @param {number} angle - Angle in radians. @returns {number} Angle in arcseconds. */
export declare const secFromAngle: (angle: number) => number;
/** @param {number} ha - Hour angle in radians. @returns {number} Hour angle in seconds of time. */
export declare const secFromHourAngle: (ha: number) => number;
declare const _default: {
    Angle: typeof Angle;
    HourAngle: typeof HourAngle;
    DMSToDeg: typeof DMSToDeg;
    degToDMS: typeof degToDMS;
    RA: typeof RA;
    Time: typeof Time;
    angleFromDeg: typeof angleFromDeg;
    angleFromMin: typeof angleFromMin;
    angleFromSec: typeof angleFromSec;
    degFromAngle: typeof degFromAngle;
    secFromAngle: typeof secFromAngle;
    secFromHourAngle: typeof secFromHourAngle;
};
export default _default;
