'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module semidiameter
 */
/**
 * Semidiameter: Chapter 55, Semidiameters of the Sun, Moon, and Planets.
 */
var base = require('./base');
var parallax = require('./parallax');

var M = exports;

/* eslint-disable no-multi-spaces */
/**
 * Standard semidiameters at unit distance of 1 AU.
 * Values are scaled here to radians.
 */
M.Sun = 959.63 / 3600 * Math.PI / 180;
M.Mercury = 3.36 / 3600 * Math.PI / 180;
M.VenusSurface = 8.34 / 3600 * Math.PI / 180;
M.VenusCloud = 8.41 / 3600 * Math.PI / 180;
M.Mars = 4.68 / 3600 * Math.PI / 180;
M.JupiterEquatorial = 98.44 / 3600 * Math.PI / 180;
M.JupiterPolar = 92.06 / 3600 * Math.PI / 180;
M.SaturnEquatorial = 82.73 / 3600 * Math.PI / 180;
M.SaturnPolar = 73.82 / 3600 * Math.PI / 180;
M.Uranus = 35.02 / 3600 * Math.PI / 180;
M.Neptune = 33.50 / 3600 * Math.PI / 180;
M.Pluto = 2.07 / 3600 * Math.PI / 180;
M.Moon = 358473400 / base.AU / 3600 * Math.PI / 180;
/* eslint-enable */

/**
 * Semidiameter returns semidiameter at specified distance.
 *
 * When used with S0 values provided, Δ must be observer-body distance in AU.
 * Result will then be in radians.
 */
M.semidiameter = function (s0, Δ) {
  // (s0, Δ float64)  float64
  return s0 / Δ;
};

/**
 * SaturnApparentPolar returns apparent polar semidiameter of Saturn
 * at specified distance.
 *
 * Argument Δ must be observer-Saturn distance in AU.  Argument B is
 * Saturnicentric latitude of the observer as given by function saturnring.UB()
 * for example.
 *
 * Result is semidiameter in units of package variables SaturnPolar and
 * SaturnEquatorial, nominally radians.
 */
M.aaturnApparentPolar = function (Δ, B) {
  // (Δ, B float64)  float64
  var k = M.SaturnPolar / M.SaturnEquatorial;
  k = 1 - k * k;
  var cB = Math.cos(B);
  return M.SaturnEquatorial / Δ * Math.sqrt(1 - k * cB * cB);
};

/**
 * MoonTopocentric returns observed topocentric semidiameter of the Moon.
 *
 *  Δ is distance to Moon in AU.
 *  δ is declination of Moon in radians.
 *  H is hour angle of Moon in radians.
 *  ρsφʹ, ρcφʹ are parallax constants as returned by
 *      globe.Ellipsoid.ParallaxConstants, for example.
 *
 * Result is semidiameter in radians.
 */
M.moonTopocentric = function (Δ, δ, H, ρsφʹ, ρcφʹ) {
  // (Δ, δ, H, ρsφʹ, ρcφʹ float64)  float64
  var k = 0.272481;
  var sπ = Math.sin(parallax.Horizontal(Δ));
  // q computed by (40.6, 40.7) p. 280, ch 40.0

  var _base$sincos = base.sincos(δ),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sδ = _base$sincos2[0],
      cδ = _base$sincos2[1];

  var _base$sincos3 = base.sincos(H),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sH = _base$sincos4[0],
      cH = _base$sincos4[1];

  var A = cδ * sH;
  var B = cδ * cH - ρcφʹ * sπ;
  var C = sδ - ρsφʹ * sπ;
  var q = Math.sqrt(A * A + B * B + C * C);
  return k / q * sπ;
};

/**
 * MoonTopocentric2 returns observed topocentric semidiameter of the Moon
 * by a less rigorous method.
 *
 * Δ is distance to Moon in AU, h is altitude of the Moon above the observer's
 * horizon in radians.
 *
 * Result is semidiameter in radians.
 */
M.moonTopocentric2 = function (Δ, h) {
  // (Δ, h float64)  float64
  return M.Moon / Δ * (1 + Math.sin(h) * Math.sin(parallax.Horizontal(Δ)));
};

/**
 * AsteroidDiameter returns approximate diameter given absolute magnitude H
 * and albedo A.
 *
 * Result is in km.
 */
M.asteroidDiameter = function (H, A) {
  // (H, A float64)  float64
  return Math.pow(10, 3.12 - 0.2 * H - 0.5 * Math.log10(A));
};

/**
 * Asteroid returns semidiameter of an asteroid with a given diameter
 * at given distance.
 *
 * Argument d is diameter in km, Δ is distance in AU.
 *
 * Result is semidiameter in radians.
 */
M.asteroid = function (d, Δ) {
  // (d, Δ float64)  float64
  return 0.0013788 * d / Δ / 3600 * Math.PI / 180;
};