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

// ---- constants ----

/** K is the Gaussian gravitational constant. */
export const K = 0.01720209895
// K from ch 33, p. 228, for example

/** AU is one astronomical unit in km. */
export const AU = 149597870
// from Appendix I, p, 407.

/** SOblJ2000 sine obliquity at J2000. */
export const SOblJ2000 = 0.397777156
/** COblJ2000 cosine obliquity at J2000. */
export const COblJ2000 = 0.917482062
// SOblJ2000, COblJ2000 from ch 33, p. 228, for example

/**
 * lightTime returns time for light to travel a given distance.
 * `dist` is distance in to earth in AU. √(x² + y² + z²)
 * Result in seconds of time.
 * @param {Number} dist - distance in to earth in AU
 * @returns {Number} time for light to travel a given distance in seconds
 */
export function lightTime (dist) {
  // Formula given as (33.3) p. 224.
  return 0.0057755183 * dist
}

// ---- julian ----

/**
 * Julian and Besselian years described in chapter 21, Precession.
 * T, Julian centuries since J2000 described in chapter 22, Nutation.
 */

/** JMod is the Julian date of the modified Julian date epoch. */
export const JMod = 2400000.5

/** J2000 is the Julian date corresponding to January 1.5, year 2000. */
export const J2000 = 2451545.0

// Julian days of common epochs.
// B1900, B1950 from p. 133
/** Julian days of Julian epoch 1900 */
export const J1900 = 2415020.0
/** Julian days of Besselian epoch 1900 */
export const B1900 = 2415020.3135
/** Julian days of Besselian epoch 1950 */
export const B1950 = 2433282.4235

// JulianYear and other common periods
/** JulianYear in days */
export const JulianYear = 365.25 // days
/** JulianCentury in days */
export const JulianCentury = 36525 // days
/** BesselianYear in days; equals mean tropical year */
export const BesselianYear = 365.2421988 // days
/** Mean sidereal year */
export const meanSiderealYear = 365.25636 // days

/**
 * JulianYearToJDE returns the Julian ephemeris day for a Julian year.
 * @param {Number} jy - Julian year
 * @returns {Number} jde - Julian ephemeris day
 */
export function JulianYearToJDE (jy) {
  return J2000 + JulianYear * (jy - 2000)
}

/**
 * JDEToJulianYear returns a Julian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} jy - Julian year
 */
export function JDEToJulianYear (jde) {
  return 2000 + (jde - J2000) / JulianYear
}

/**
 * BesselianYearToJDE returns the Julian ephemeris day for a Besselian year.
 * @param {Number} by - Besselian year
 * @returns {Number} jde - Julian ephemeris day
 */
export function BesselianYearToJDE (by) {
  return B1900 + BesselianYear * (by - 1900)
}

/**
 * JDEToBesselianYear returns the Besselian year for a Julian ephemeris day.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} by - Besselian year
 */
export function JDEToBesselianYear (jde) {
  return 1900 + (jde - B1900) / BesselianYear
}

/**
 * J2000Century returns the number of Julian centuries since J2000.
 *
 * The quantity appears as T in a number of time series.
 * @param {Number} jde - Julian ephemeris day
 * @returns {Number} number of Julian centuries since J2000
 */
export function J2000Century (jde) {
  // The formula is given in a number of places in the book, for example
  // (12.1) p. 87.
  // (22.1) p. 143.
  // (25.1) p. 163.
  return (jde - J2000) / JulianCentury
}

// ---- phase ----

/**
 * illuminated returns the illuminated fraction of a body's disk.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {Number} i - phase angle in radians.
 * @returns {Number} illuminated fraction of a body's disk.
 */
export function illuminated (i) {
  // (41.1) p. 283, also (48.1) p. 345.
  return (1 + Math.cos(i)) * 0.5
}

/**
 * celestial coordinates in right ascension and declination
 * or ecliptic coordinates in longitude and latitude
 *
 * @param {number} ra - right ascension (or longitude)
 * @param {number} dec - declination (or latitude)
 * @param {number} [range] - distance
 * @param {number} [elongation] - elongation
 */
export function Coord (ra /* lon */, dec /* lat */, range, elongation) {
  this._ra = ra || 0
  this._dec = dec || 0
  this.range = range
  this.elongation = elongation

  Object.defineProperties(this, {
    ra: {
      get: function () { return this._ra },
      set: function (ra) { this._ra = ra }
    },
    dec: {
      get: function () { return this._dec },
      set: function (dec) { this._dec = dec }
    },
    lon: {
      get: function () { return this._ra },
      set: function (ra) { this._ra = ra }
    },
    lat: {
      get: function () { return this._dec },
      set: function (dec) { this._dec = dec }
    }
  })
}

/**
 * Limb returns the position angle of the midpoint of an illuminated limb.
 *
 * The illuminated body can be the Moon or a planet.
 *
 * @param {base.Coord} equ - equatorial coordinates of the body `{ra, dec}` (in radians)
 * @param {base.Coord} appSun - apparent coordinates of the Sun `{ra, dec}` (In radians).
 * @returns {Number} position angle of the midpoint (in radians).
 */
export function limb (equ, appSun) {
  const α = equ.ra
  const δ = equ.dec
  const α0 = appSun.ra
  const δ0 = appSun.dec
  // Mentioned in ch 41, p. 283.  Formula (48.5) p. 346
  const sδ = Math.sin(δ)
  const cδ = Math.cos(δ)
  const sδ0 = Math.sin(δ0)
  const cδ0 = Math.cos(δ0)
  const sα0α = Math.sin(α0 - α)
  const cα0α = Math.cos(α0 - α)
  let χ = Math.atan2(cδ0 * sα0α, (sδ0 * cδ - cδ0 * sδ * cα0α))
  if (χ < 0) {
    χ += 2 * Math.PI
  }
  return χ
}

// ---- math ----

// In chapter 17, p. 109, Meeus recommends 10′.
/**
 * SmallAngle is threshold used by various routines for switching between
 * trigonometric functions and Pythagorean approximations.
 */
export const SmallAngle = 10 * Math.PI / 180 / 60 // about .003 radians
/** cosine of SmallAngle */
export const CosSmallAngle = Math.cos(SmallAngle) // about .999996

/**
 * pmod returns a positive floating-point x mod y.
 *
 * For a positive argument y, it returns a value in the range [0,y).
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} x % y - The result may not be useful if y is negative.
 */
export function pmod (x, y) {
  let r = x % y
  if (r < 0) {
    r += y
  }
  return r
}

/**
 * horner evaluates a polynomal with coefficients c at x.  The constant
 * term is c[0].
 * @param {Number} x
 * @param {Number|Number[]} c - coefficients
 * @returns {Number}
 */
export function horner (x, ...c) {
  if (Array.isArray(c[0])) {
    c = c[0]
  }
  let i = c.length - 1
  let y = c[i]
  while (i > 0) {
    i--
    y = y * x + c[i]
  }
  return y
}

/**
 * FloorDiv returns the integer floor of the fractional value (x / y).
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} (int)
 */
export function floorDiv (x, y) {
  const q = x / y
  return Math.floor(q)
}

/**
 * Cmp compares two float64s and returns -1, 0, or 1 if a is <, ==, or > b,
 * respectively.
 * .
 * @param {Number} a
 * @param {Number} b
 * @returns {Number} comparison result
 */
export function cmp (a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/**
 * shorthand function for Math.sin, Math.cos
 * @param {Number} ε
 * @returns {Number[]} [sin(ε), cos(ε)]
 */
export function sincos (ε) {
  return [Math.sin(ε), Math.cos(ε)]
}

/**
 * Convert degrees to radians
 * @param  {Number} deg - Angle in degrees
 * @return {Number} Angle in radians
 */
export function toRad (deg) {
  return (Math.PI / 180.0) * deg
}

/**
 * Convert radians to degrees
 * @param  {Number} rad - Angle in radians
 * @return {Number} Angle in degrees
 */
export function toDeg (rad) {
  return (180.0 / Math.PI) * rad
}

/**
 * separate fix `i` from fraction `f`
 * @param {Number} float
 * @returns {Array} [i, f]
 *  {Number} i - (int) fix value
 *  {Number} f - (float) fractional portion; always > 1
 */
export function modf (float) {
  const i = Math.trunc(float)
  const f = Math.abs(float - i)
  return [i, f]
}

/**
 * Rounds `float` value by precision
 * @param {Number} float - value to round
 * @param {Number} precision - (int) number of post decimal positions
 * @return {Number} rounded `float`
 */
export function round (float, precision) {
  precision = precision == undefined ? 14 : precision // eslint-disable-line eqeqeq
  return parseFloat(float.toFixed(precision), 10)
}

export function errorCode (msg, code) {
  const err = new Error(msg)
  err.code = code
  return err
}

export default {
  K,
  AU,
  SOblJ2000,
  COblJ2000,
  lightTime,
  JMod,
  J2000,
  J1900,
  B1900,
  B1950,
  JulianYear,
  JulianCentury,
  BesselianYear,
  meanSiderealYear,
  JulianYearToJDE,
  JDEToJulianYear,
  BesselianYearToJDE,
  JDEToBesselianYear,
  J2000Century,
  illuminated,
  Coord,
  limb,
  SmallAngle,
  CosSmallAngle,
  pmod,
  horner,
  floorDiv,
  cmp,
  sincos,
  toRad,
  toDeg,
  modf,
  round,
  errorCode
}
