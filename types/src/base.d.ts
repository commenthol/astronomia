/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module base
 */
/**
 * Base: Functions and other definitions useful with multiple packages.
 *
 * Base contains various definitions and support functions useful in multiple
 * chapters.
 *
 * Bessellian and Julian Year
 *
 * Chapter 21, Precession actually contains these definitions.  They are moved
 * here because of their general utility.
 *
 * Chapter 22, Nutation contains the function for Julian centuries since J2000.
 *
 * Phase angle functions
 *
 * Two functions, Illuminated and Limb, concern the illumnated phase of a body
 * and are given in two chapters, 41 an 48.  They are collected here because
 * the identical functions apply in both chapters.
 *
 * General purpose math functions
 *
 * SmallAngle is recommended in chapter 17, p. 109.
 *
 * PMod addresses the issue on p. 7, chapter 1, in the section "Trigonometric
 * functions of large angles", but the function is not written to be specific
 * to angles and so has more general utility.
 *
 * Horner is described on p. 10, chapter 1.
 *
 * FloorDiv and FloorDiv64 are optimizations for the INT function described
 * on p. 60, chapter 7.
 */
/** K is the Gaussian gravitational constant. */
export declare const K = 0.01720209895;
/** AU is one astronomical unit in km. */
export declare const AU = 149597870;
/** SOblJ2000 sine obliquity at J2000. */
export declare const SOblJ2000 = 0.397777156;
/** COblJ2000 cosine obliquity at J2000. */
export declare const COblJ2000 = 0.917482062;
/**
 * lightTime returns time for light to travel a given distance.
 * `dist` is distance in to earth in AU. √(x² + y² + z²)
 * Result in seconds of time.
 * @param {Number} dist - distance in to earth in AU
 * @returns {Number} time for light to travel a given distance in days
 */
export declare function lightTime(dist: number): number;
/**
 * Julian and Besselian years described in chapter 21, Precession.
 * T, Julian centuries since J2000 described in chapter 22, Nutation.
 */
/** JMod is the Julian date of the modified Julian date epoch. */
export declare const JMod = 2400000.5;
/** J2000 is the Julian date corresponding to January 1.5, year 2000. */
export declare const J2000 = 2451545;
/** Julian days of Julian epoch 1900 */
export declare const J1900 = 2415020;
/** Julian days of Besselian epoch 1900 */
export declare const B1900 = 2415020.3135;
/** Julian days of Besselian epoch 1950 */
export declare const B1950 = 2433282.4235;
/** JulianYear in days */
export declare const JulianYear = 365.25;
/** JulianCentury in days */
export declare const JulianCentury = 36525;
/** BesselianYear in days; equals mean tropical year */
export declare const BesselianYear = 365.2421988;
/** Mean sidereal year */
export declare const meanSiderealYear = 365.25636;
/**
 * JulianYearToJDE returns the Julian ephemeris day for a Julian year.
 * @param {Number} jy - Julian year
 * @returns {Number} jde - Julian ephemeris day
 */
export declare function JulianYearToJDE(jy: number): number;
/**
 * JDEToJulianYear returns a Julian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} jy - Julian year
 */
export declare function JDEToJulianYear(jde: number): number;
/**
 * BesselianYearToJDE returns the Julian ephemeris day for a Besselian year.
 * @param {Number} by - Besselian year
 * @returns {Number} jde - Julian ephemeris day
 */
export declare function BesselianYearToJDE(by: number): number;
/**
 * JDEToBesselianYear returns the Besselian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} by - Besselian year
 */
export declare function JDEToBesselianYear(jde: number): number;
/**
 * J2000Century returns the number of Julian centuries since J2000.
 *
 * The quantity appears as T in a number of time series.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} number of Julian centuries since J2000
 */
export declare function J2000Century(jde: number): number;
/**
 * illuminated returns the illuminated fraction of a body's disk.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {Number} i - phase angle in radians.
 * @returns {Number} illuminated fraction of a body's disk.
 */
export declare function illuminated(i: number): number;
/**
 * celestial coordinates in right ascension and declination
 * or ecliptic coordinates in longitude and latitude
 */
export declare class Coord {
    _ra: number;
    _dec: number;
    range: number;
    elongation: number;
    /**
     * celestial coordinates in right ascension and declination
     * or ecliptic coordinates in longitude and latitude
     *
     * @param {number} ra - right ascension (or longitude)
     * @param {number} dec - declination (or latitude)
     * @param {number} [range] - distance
     * @param {number} [elongation] - elongation
     */
    constructor(ra: number, dec: number, range?: number, elongation?: number);
    /**
     * right ascension
     * @return {number}
     */
    get ra(): number;
    /** @param {number} ra - Right ascension in radians. */
    set ra(ra: number);
    /**
     * declination
     * @return {number}
     */
    get dec(): number;
    /** @param {number} dec - Declination in radians. */
    set dec(dec: number);
    /**
     * right ascension (or longitude)
     * @return {number}
     */
    get lon(): number;
    /** @param {number} ra - Longitude in radians. */
    set lon(ra: number);
    /**
     * declination (or latitude)
     * @return {number}
     */
    get lat(): number;
    /** @param {number} dec - Latitude in radians. */
    set lat(dec: number);
}
/**
 * Limb returns the position angle of the midpoint of an illuminated limb.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {Coord} equ - equatorial coordinates of the body `{ra, dec}` (in radians)
 * @param {Coord} appSun - apparent coordinates of the Sun `{ra, dec}` (In radians).
 * @returns {Number} position angle of the midpoint (in radians).
 */
export declare function limb(equ: Coord, appSun: Coord): number;
/**
 * SmallAngle is threshold used by various routines for switching between
 * trigonometric functions and Pythagorean approximations.
 */
export declare const SmallAngle: number;
/** cosine of SmallAngle */
export declare const CosSmallAngle: number;
/**
 * pmod returns a positive floating-point x mod y.
 *
 * For a positive argument y, it returns a value in the range [0,y).
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} x % y - The result may not be useful if y is negative.
 */
export declare function pmod(x: number, y: number): number;
/**
 * horner evaluates a polynomial with coefficients c at x.  The constant
 * term is c[0].
 * @param {number} x - Value at which to evaluate the polynomial.
 * @param {...(number|number[])} c - Coefficients, passed individually or as one array.
 * @returns {number} Polynomial value.
 */
export declare function horner(x: number, ...c: (number | number[])[]): number;
/**
 * FloorDiv returns the integer floor of the fractional value (x / y).
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} (int)
 */
export declare function floorDiv(x: number, y: number): number;
/**
 * Cmp compares two float64s and returns -1, 0, or 1 if a is <, ==, or > b,
 * respectively.
 * .
 * @param {Number} a
 * @param {Number} b
 * @returns {Number} comparison result
 */
export declare function cmp(a: number, b: number): number;
/**
 * shorthand function for Math.sin, Math.cos
 * @param {Number} ε
 * @returns {Number[]} [sin(ε), cos(ε)]
 */
export declare function sincos(ε: number): number[];
/**
 * Convert degrees to radians
 * @param  {Number} deg - Angle in degrees
 * @return {Number} Angle in radians
 */
export declare function toRad(deg: number): number;
/**
 * Convert radians to degrees
 * @param  {Number} rad - Angle in radians
 * @return {Number} Angle in degrees
 */
export declare function toDeg(rad: number): number;
/**
 * separate fix `i` from fraction `f`
 * @param {Number} float
 * @returns {[number, number]} Integer part and absolute fractional part.
 */
export declare function modf(float: number): [number, number];
/**
 * Rounds `float` value by precision
 * @param {Number} float - value to round
 * @param {Number} [precision] - (int) number of post decimal positions
 * @return {Number} rounded `float`
 */
export declare function round(float: number, precision?: number): number;
/**
 * Create an Error carrying a numeric code.
 * @param {string} msg - Error message.
 * @param {number} code - Numeric error code.
 * @returns {Error & {code: number}} Coded error.
 */
export declare function errorCode(msg: string, code: number): Error & {
    code: number;
};
declare const _default: {
    K: number;
    AU: number;
    SOblJ2000: number;
    COblJ2000: number;
    lightTime: typeof lightTime;
    JMod: number;
    J2000: number;
    J1900: number;
    B1900: number;
    B1950: number;
    JulianYear: number;
    JulianCentury: number;
    BesselianYear: number;
    meanSiderealYear: number;
    JulianYearToJDE: typeof JulianYearToJDE;
    JDEToJulianYear: typeof JDEToJulianYear;
    BesselianYearToJDE: typeof BesselianYearToJDE;
    JDEToBesselianYear: typeof JDEToBesselianYear;
    J2000Century: typeof J2000Century;
    illuminated: typeof illuminated;
    Coord: typeof Coord;
    limb: typeof limb;
    SmallAngle: number;
    CosSmallAngle: number;
    pmod: typeof pmod;
    horner: typeof horner;
    floorDiv: typeof floorDiv;
    cmp: typeof cmp;
    sincos: typeof sincos;
    toRad: typeof toRad;
    toDeg: typeof toDeg;
    modf: typeof modf;
    round: typeof round;
    errorCode: typeof errorCode;
};
export default _default;
