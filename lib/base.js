"use strict";

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

var M = exports;

// ---- constants ----

/** K is the Gaussian gravitational constant. */
M.K = 0.01720209895;
// K from ch 33, p. 228, for example

/** AU is one astronomical unit in km. */
M.AU = 149597870;
// from Appendix I, p, 407.

/** SOblJ2000 sine obliquity at J2000. */
M.SOblJ2000 = 0.397777156;
/** COblJ2000 cosine obliquity at J2000. */
M.COblJ2000 = 0.917482062;
// SOblJ2000, COblJ2000 from ch 33, p. 228, for example

/**
 * lightTime returns time for light to travel a given distance.
 * `dist` is distance in to earth in AU. √(x² + y² + z²)
 * Result in seconds of time.
 * @param {Number} dist - distance in to earth in AU
 * @returns {Number} time for light to travel a given distance in seconds
 */
M.lightTime = function (dist) {
  // Formula given as (33.3) p. 224.
  return 0.0057755183 * dist;
};

// ---- julian ----

/**
 * Julian and Besselian years described in chapter 21, Precession.
 * T, Julian centuries since J2000 described in chapter 22, Nutation.
 */

/** JMod is the Julian date of the modified Julian date epoch. */
M.JMod = 2400000.5;

/** J2000 is the Julian date corresponding to January 1.5, year 2000. */
M.J2000 = 2451545.0;

// Julian days of common epochs.
// B1900, B1950 from p. 133
/** Julian days of Julian epoch 1900 */
M.J1900 = 2415020.0;
/** Julian days of Besselian epoch 1900 */
M.B1900 = 2415020.3135;
/** Julian days of Besselian epoch 1950 */
M.B1950 = 2433282.4235;

// JulianYear and other common periods
/** JulianYear in days */
M.JulianYear = 365.25; // days
/** JulianCentury in days */
M.JulianCentury = 36525; // days
/** BesselianYear in days; equals mean tropical year */
M.BesselianYear = 365.2421988; // days
/** Mean sidereal year */
M.meanSiderealYear = 365.25636; // days

/**
 * JulianYearToJDE returns the Julian ephemeris day for a Julian year.
 * @param {Number} jy - Julian year
 * @returns {Number} jde - Julian ephemeris day
 */
M.JulianYearToJDE = function (jy) {
  return M.J2000 + M.JulianYear * (jy - 2000);
};

/**
 * JDEToJulianYear returns a Julian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} jy - Julian year
 */
M.JDEToJulianYear = function (jde) {
  return 2000 + (jde - M.J2000) / M.JulianYear;
};

/**
 * BesselianYearToJDE returns the Julian ephemeris day for a Besselian year.
 * @param {Number} by - Besselian year
 * @returns {Number} jde - Julian ephemeris day
 */
M.BesselianYearToJDE = function (by) {
  return M.B1900 + M.BesselianYear * (by - 1900);
};

/**
 * JDEToBesselianYear returns the Besselian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} by - Besselian year
 */
M.JDEToBesselianYear = function (jde) {
  return 1900 + (jde - M.B1900) / M.BesselianYear;
};

/**
 * J2000Century returns the number of Julian centuries since J2000.
 *
 * The quantity appears as T in a number of time series.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} number of Julian centuries since J2000
 */
M.J2000Century = function (jde) {
  // The formula is given in a number of places in the book, for example
  // (12.1) p. 87.
  // (22.1) p. 143.
  // (25.1) p. 163.
  return (jde - M.J2000) / M.JulianCentury;
};

// ---- phase ----

/**
 * illuminated returns the illuminated fraction of a body's disk.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {Number} i - phase angle in radians.
 * @returns {Number} illuminated fraction of a body's disk.
 */
M.illuminated = function (i) {
  // (41.1) p. 283, also (48.1) p. 345.
  return (1 + Math.cos(i)) * 0.5;
};

/**
 * celestial coordinates in right ascension and declination
 * or ecliptic coordinates in longitude and latitude
 *
 * @param {number} ra - right ascension (or longitude)
 * @param {number} dec - declination (or latitude)
 * @param {number} [range] - distance
 * @param {number} [elongation] - elongation
 */
function Coord(ra /* lon */, dec /* lat */, range, elongation) {
  this._ra = ra || 0;
  this._dec = dec || 0;
  this.range = range;
  this.elongation = elongation;

  Object.defineProperties(this, {
    ra: {
      get: function get() {
        return this._ra;
      },
      set: function set(ra) {
        this._ra = ra;
      }
    },
    dec: {
      get: function get() {
        return this._dec;
      },
      set: function set(dec) {
        this._dec = dec;
      }
    },
    lon: {
      get: function get() {
        return this._ra;
      },
      set: function set(ra) {
        this._ra = ra;
      }
    },
    lat: {
      get: function get() {
        return this._dec;
      },
      set: function set(dec) {
        this._dec = dec;
      }
    }
  });
}
M.Coord = Coord;

/**
 * Limb returns the position angle of the midpoint of an illuminated limb.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {base.Coord} equ - equatorial coordinates of the body `{ra, dec}` (in radians)
 * @param {base.Coord} appSun - apparent coordinates of the Sun `{ra, dec}` (In radians).
 * @returns {Number} position angle of the midpoint (in radians).
 */
M.limb = function (equ, appSun) {
  var ga = equ.ra;
  var gd = equ.dec;
  var ga0 = appSun.ra;
  var gd0 = appSun.dec;
  // Mentioned in ch 41, p. 283.  Formula (48.5) p. 346
  var sgd = Math.sin(gd);
  var cgd = Math.cos(gd);
  var sgd0 = Math.sin(gd0);
  var cgd0 = Math.cos(gd0);
  var sga0ga = Math.sin(ga0 - ga);
  var cga0ga = Math.cos(ga0 - ga);
  var gx = Math.atan2(cgd0 * sga0ga, sgd0 * cgd - cgd0 * sgd * cga0ga);
  if (gx < 0) {
    gx += 2 * Math.PI;
  }
  return gx;
};

// ---- math ----

// In chapter 17, p. 109, Meeus recommends 10′.
/**
 * SmallAngle is threshold used by various routines for switching between
 * trigonometric functions and Pythagorean approximations.
 */
M.SmallAngle = 10 * Math.PI / 180 / 60; // about .003 radians
/** cosine of SmallAngle */
M.CosSmallAngle = Math.cos(M.SmallAngle); // about .999996

/**
 * pmod returns a positive floating-point x mod y.
 *
 * For a positive argument y, it returns a value in the range [0,y).
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} x % y - The result may not be useful if y is negative.
 */
M.pmod = function (x, y) {
  var r = x % y;
  if (r < 0) {
    r += y;
  }
  return r;
};

/**
 * horner evaluates a polynomal with coefficients c at x.  The constant
 * term is c[0].
 * @param {Number} x
 * @param {Number|Number[]} c - coefficients
 * @returns {Number}
 */
M.horner = function (x) {
  for (var _len = arguments.length, c = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    c[_key - 1] = arguments[_key];
  }

  if (Array.isArray(c[0])) {
    c = c[0];
  }
  var i = c.length - 1;
  var y = c[i];
  while (i > 0) {
    i--;
    y = y * x + c[i];
  }
  return y;
};

/**
 * FloorDiv returns the integer floor of the fractional value (x / y).
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} (int)
 */
M.floorDiv = function (x, y) {
  var q = x / y;
  return Math.floor(q);
};

/**
 * Cmp compares two float64s and returns -1, 0, or 1 if a is <, ==, or > b,
 * respectively.
 * .
 * @param {Number} a
 * @param {Number} b
 * @returns {Number} comparison result
 */
M.cmp = function (a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

/**
 * shorthand function for Math.sin, Math.cos
 * @param {Number} ge
 * @returns {Number[]} [sin(ge), cos(ge)]
 */
M.sincos = function (ge) {
  return [Math.sin(ge), Math.cos(ge)];
};

/**
 * Convert degrees to radians
 * @param  {Number} deg - Angle in degrees
 * @return {Number} Angle in radians
 */
M.toRad = function (deg) {
  return Math.PI / 180.0 * deg;
};

/**
 * Convert radians to degrees
 * @param  {Number} rad - Angle in radians
 * @return {Number} Angle in degrees
 */
M.toDeg = function (rad) {
  return 180.0 / Math.PI * rad;
};

/**
 * separate fix `i` from fraction `f`
 * @param {Number} float
 * @returns {Array} [i, f]
 *  {Number} i - (int) fix value
 *  {Number} f - (float) fractional portion; always > 1
 */
M.modf = function (float) {
  var i = Math.trunc(float);
  var f = Math.abs(float - i);
  return [i, f];
};

/**
 * Rounds `float` value by precision
 * @param {Number} float - value to round
 * @param {Number} precision - (int) number of post decimal positions
 * @return {Number} rounded `float`
 */
M.round = function (float, precision) {
  precision = precision == undefined ? 14 : precision; // eslint-disable-line eqeqeq
  return parseFloat(float.toFixed(precision), 10);
};

M.errorCode = function (msg, code) {
  var err = new Error(msg);
  err.code = code;
  return err;
};