'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonillum
 */
/**
 * Moonillum: Chapter 48, Illuminated Fraction of the Moon's Disk
 *
 * Also see functions `illuminated` and `limb` in package base.  The function
 * for computing illuminated fraction given a phase angle (48.1) is
 * base.illuminated.  Formula (48.3) is implemented as base.limb.
 */

var base = require('./base');
var M = exports;

var p = Math.PI / 180;

/**
 * phaseAngleEquatorial computes the phase angle of the Moon given equatorial coordinates.
 *
 * @param {base.Coord} cMoon - geocentric right ascension,  declination and distance to the Moon
 * @param {base.Coord} cSun - coordinates and distance of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
M.phaseAngleEquatorial = function (cMoon, cSun) {
  return pa(cMoon.range, cSun.range, cosEq(cMoon.ra, cMoon.dec, cSun.ra, cSun.dec));
};

/**
 * cos elongation from equatorial coordinates
 * @private
 */
function cosEq(α, δ, α0, δ0) {
  var _base$sincos = base.sincos(δ),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sδ = _base$sincos2[0],
      cδ = _base$sincos2[1];

  var _base$sincos3 = base.sincos(δ0),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sδ0 = _base$sincos4[0],
      cδ0 = _base$sincos4[1];

  return sδ0 * sδ + cδ0 * cδ * Math.cos(α0 - α);
}

/**
 * phase angle from cos elongation and distances
 * @private
 * @param {number} Δ
 * @param {number} R
 * @param {number} cψ
 * @returns {number}
 */
function pa(Δ, R, cψ) {
  var sψ = Math.sin(Math.acos(cψ));
  var i = Math.atan(R * sψ / (Δ - R * cψ));
  if (i < 0) {
    i += Math.PI;
  }
  return i;
}

/**
 * phaseAngleEquatorial2 computes the phase angle of the Moon given equatorial coordinates.
 *
 * Less accurate than phaseAngleEquatorial.
 *
 * Arguments α, δ are geocentric right ascension and declination of the Moon;
 * α0, δ0  are coordinates of the Sun.  Angles must be in radians.
 *
 * @param {base.Coord} cMoon - eocentric right ascension and declination of the Moon
 * @param {base.Coord} cSun - coordinates of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
M.phaseAngleEquatorial2 = function (cMoon, cSun) {
  return Math.acos(-cosEq(cMoon.ra, cMoon.dec, cSun.ra, cSun.dec));
};

/**
 * phaseAngleEcliptic computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Distances must be in the same units as each other.
 *
 * @param {base.Coord} cMoon - geocentric longitude, latitude and distance to the Moon
 * @param {base.Coord} cSun -  longitude and distance to the Sun
 * @returns {number} phase angle of the Moon in radians
 */
M.phaseAngleEcliptic = function (cMoon, cSun) {
  return pa(cMoon.range, cSun.range, cosEcl(cMoon.lon, cMoon.lat, cSun.lon));
};

/**
 * cos elongation from ecliptic coordinates
 * @private
 */
function cosEcl(λ, β, λ0) {
  // (λ, β, λ0 float64)  float64
  return Math.cos(β) * Math.cos(λ - λ0);
}

/**
 * phaseAngleEcliptic2 computes the phase angle of the Moon given ecliptic coordinates.
 *
 * Less accurate than phaseAngleEcliptic.
 *
 * Angles must be in radians.
 *
 * @param {base.Coord} cMoon - geocentric longitude, latitude of the Moon
 * @param {base.Coord} cSun -  longitude of the Sun
 * @returns {number} phase angle of the Moon in radians
 */
M.phaseAngleEcliptic2 = function (cMoon, cSun) {
  return Math.acos(-cosEcl(cMoon.lon, cMoon.lat, cSun.lon));
};

/**
 * phaseAngle3 computes the phase angle of the Moon given a julian day.
 *
 * Less accurate than phaseAngle functions taking coordinates.
 *
 * Result in radians.
 */
M.phaseAngle3 = function (jde) {
  // (jde float64)  float64
  var T = base.J2000Century(jde);
  var D = base.horner(T, 297.8501921 * p, 445267.1114034 * p, -0.0018819 * p, p / 545868, -p / 113065000);
  var m = base.horner(T, 357.5291092 * p, 35999.0502909 * p, -0.0001535 * p, p / 24490000);
  var m_ = base.horner(T, 134.9633964 * p, 477198.8675055 * p, 0.0087414 * p, p / 69699, -p / 14712000);
  return Math.PI - base.pmod(D, 2 * Math.PI) + -6.289 * p * Math.sin(m_) + 2.1 * p * Math.sin(m) + -1.274 * p * Math.sin(2 * D - m_) + -0.658 * p * Math.sin(2 * D) + -0.214 * p * Math.sin(2 * m_) + -0.11 * p * Math.sin(D);
};