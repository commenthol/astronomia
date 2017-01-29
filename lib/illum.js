'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module illum
 */
/**
 * Illum: Chapter 41, Illuminated Fraction of the Disk and Magnitude of a Planet.
 *
 * Also see functions `illuminated` and `limb` in package base.  While this
 * chapter title includes "illumnated fraction," the function for computing
 * illuminated fraction given a phase angle is `base.illuminated`.
 * `base.limb` is the function mentioned at the bottom of p. 283.0
 */

var base = require('./base');

var M = exports;

/**
 * PhaseAngle computes the phase angle of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 *
 * Result in radians.
 */
M.phaseAngle = function (r, Δ, R) {
  // (r, Δ, R float64)  float64
  return Math.acos((r * r + Δ * Δ - R * R) / (2 * r * Δ));
};

/**
 * Fraction computes the illuminated fraction of the disk of a planet.
 *
 * Argument r is planet's distance to Sun, Δ its distance to Earth, and R
 * the distance from Sun to Earth.  All distances in AU.
 */
M.fraction = function (r, Δ, R) {
  // (r, Δ, R float64)  float64
  // (41.2) p. 283
  var s = r + Δ;
  return (s * s - R * R) / (4 * r * Δ);
};

/**
 * PhaseAngle2 computes the phase angle of a planet.
 *
 * Arguments L, B, R are heliocentric ecliptical coordinates of the planet.
 * L0, R0 are longitude and radius for Earth, Δ is distance from Earth to
 * the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
M.phaseAngle2 = function (L, B, R, L0, R0, Δ) {
  // (L, B, R, L0, R0, Δ float64)  float64
  // (41.3) p. 283
  return Math.acos((R - R0 * Math.cos(B) * Math.cos(L - L0)) / Δ);
};

/**
 * PhaseAngle3 computes the phase angle of a planet.
 *
 * Arguments L, B are heliocentric ecliptical longitude and latitude of the
 * planet.  x, y, z are cartesian coordinates of the planet, Δ is distance
 * from Earth to the planet.  All distances in AU, angles in radians.
 *
 * The phase angle result is in radians.
 */
M.phaseAngle3 = function (L, B, x, y, z, Δ) {
  // (L, B, x, y, z, Δ float64)  float64
  // (41.4) p. 283
  var _base$sincos = base.sincos(L),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sL = _base$sincos2[0],
      cL = _base$sincos2[1];

  var _base$sincos3 = base.sincos(B),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sB = _base$sincos4[0],
      cB = _base$sincos4[1];

  return Math.acos((x * cB * cL + y * cB * sL + z * sB) / Δ);
};

var p = Math.PI / 180;

/**
 * FractionVenus computes an approximation of the illumanted fraction of Venus.
 */
M.fractionVenus = function (jde) {
  // (jde float64)  float64
  var T = base.J2000Century(jde);
  var V = 261.51 * p + 22518.443 * p * T;
  var M = 177.53 * p + 35999.05 * p * T;
  var N = 50.42 * p + 58517.811 * p * T;
  var W = V + 1.91 * p * Math.sin(M) + 0.78 * p * Math.sin(N);
  var Δ = Math.sqrt(1.52321 + 1.44666 * Math.cos(W));
  var s = 0.72333 + Δ;
  return (s * s - 1) / 2.89332 / Δ;
};

/**
 * Mercury computes the visual magnitude of Mercury.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.mercury = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  var s = i - 50 * p;
  return 1.16 + 5 * Math.log10(r * Δ) + 0.02838 / p * s + 0.0001023 / p / p * s * s;
};

/**
 * Venus computes the visual magnitude of Venus.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.venus = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return -4 + 5 * Math.log10(r * Δ) + (0.01322 / p + 0.0000004247 / p / p / p * i * i) * i;
};

/**
 * Mars computes the visual magnitude of Mars.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.mars = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return -1.3 + 5 * Math.log10(r * Δ) + 0.01486 / p * i;
};

/**
 * Jupiter computes the visual magnitude of Jupiter.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.jupiter = function (r, Δ) {
  // (r, Δ float64)  float64
  return -8.93 + 5 * Math.log10(r * Δ);
};

/**
 * Saturn computes the visual magnitude of Saturn.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring. ΔU is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 * You can use saturndisk.Disk() to obtain B and ΔU.
 */
M.saturn = function (r, Δ, B, ΔU) {
  // (r, Δ, B, ΔU float64)  float64
  var s = Math.sin(Math.abs(B));
  return -8.68 + 5 * Math.log10(r * Δ) + 0.044 / p * Math.abs(ΔU) - 2.6 * s + 1.25 * s * s;
};

/**
 * Uranus computes the visual magnitude of Uranus.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.uranus = function (r, Δ) {
  // (r, Δ float64)  float64
  return -6.85 + 5 * Math.log10(r * Δ);
};

/**
 * Neptune computes the visual magnitude of Neptune.
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.neptune = function (r, Δ) {
  // (r, Δ float64)  float64
  return -7.05 + 5 * Math.log10(r * Δ);
};

/**
 * Mercury84 computes the visual magnitude of Mercury.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.mercury84 = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return base.horner(i, -0.42 + 5 * Math.log10(r * Δ), 0.038 / p, -0.000273 / p / p, 0.000002 / p / p / p);
};

/**
 * Venus84 computes the visual magnitude of Venus.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.venus84 = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return base.horner(i, -4.4 + 5 * Math.log10(r * Δ), 0.0009 / p, -0.000239 / p / p, 0.00000065 / p / p / p);
};

/**
 * Mars84 computes the visual magnitude of Mars.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.mars84 = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return -1.52 + 5 * Math.log10(r * Δ) + 0.016 / p * i;
};

/**
 * Jupiter84 computes the visual magnitude of Jupiter.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth,
 * and i the phase angle in radians.
 */
M.jupiter84 = function (r, Δ, i) {
  // (r, Δ, i float64)  float64
  return -9.4 + 5 * Math.log10(r * Δ) + 0.005 / p * i;
};

/**
 * Saturn84 computes the visual magnitude of Saturn.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 * B is the Saturnicentric latitude of the Earth referred to the plane of
 * Saturn's ring. ΔU is the difference between the Saturnicentric longitudes
 * of the Sun and the Earth, measured in the plane of the ring.
 */
M.saturn84 = function (r, Δ, B, ΔU) {
  // (r, Δ, B, ΔU float64)  float64
  var s = Math.sin(Math.abs(B));
  return -8.88 + 5 * Math.log10(r * Δ) + 0.044 / p * Math.abs(ΔU) - 2.6 * s + 1.25 * s * s;
};

/**
 * Uranus84 computes the visual magnitude of Uranus.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.uranus84 = function (r, Δ) {
  // (r, Δ float64)  float64
  return -7.19 + 5 * Math.log10(r * Δ);
};

/**
 * Neptune84 computes the visual magnitude of Neptune.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.neptune84 = function (r, Δ) {
  // (r, Δ float64)  float64
  return -6.87 + 5 * Math.log10(r * Δ);
};

/**
 * Pluto84 computes the visual magnitude of Pluto.
 *
 * The formula is that adopted in "Astronomical Almanac" in 1984.0
 *
 * Argument r is the planet's distance from the Sun, Δ the distance from Earth.
 */
M.pluto84 = function (r, Δ) {
  // (r, Δ float64)  float64
  return -1 + 5 * Math.log10(r * Δ);
};