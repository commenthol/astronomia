'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solardisk
 */
/**
 * Solardisk: Chapter 29, Ephemeris for Physical Observations of the Sun.
 */

var base = require('./base');
var nutation = require('./nutation');
var solar = require('./solar');

var M = exports;

/**
 * Ephemeris returns the apparent orientation of the sun at the given jd.
 *
 * Results:
 *  P:  Position angle of the solar north pole.
 *  B0: Heliographic latitude of the center of the solar disk.
 *  L0: Heliographic longitude of the center of the solar disk.
 *
 * All results in radians.
 */
M.ephemeris = function (jd, earth) {
  // (jd float64, e *pp.V87Planet)  (P, B0, L0 float64)
  var θ = (jd - 2398220) * 2 * Math.PI / 25.38;
  var I = 7.25 * Math.PI / 180;
  var K = 73.6667 * Math.PI / 180 + 1.3958333 * Math.PI / 180 * (jd - 2396758) / base.JulianCentury;

  var solarPos = solar.trueVSOP87(earth, jd);
  var L = solarPos.lon;
  var R = solarPos.range;

  var _nutation$nutation = nutation.nutation(jd),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];

  var ε0 = nutation.meanObliquity(jd);
  var ε = ε0 + Δε;
  var λ = L - 20.4898 / 3600 * Math.PI / 180 / R;
  var λp = λ + Δψ;

  var _base$sincos = base.sincos(λ - K),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sλK = _base$sincos2[0],
      cλK = _base$sincos2[1];

  var _base$sincos3 = base.sincos(I),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sI = _base$sincos4[0],
      cI = _base$sincos4[1];

  var tx = -Math.cos(λp) * Math.tan(ε);
  var ty = -cλK * Math.tan(I);
  var P = Math.atan(tx) + Math.atan(ty);
  var B0 = Math.asin(sλK * sI);
  var η = Math.atan2(-sλK * cI, -cλK);
  var L0 = base.pmod(η - θ, 2 * Math.PI);
  return [P, B0, L0];
};

/**
 * Cycle returns the jd of the start of the given synodic rotation.
 *
 * Argument c is the "Carrington" cycle number.
 *
 * Result is a dynamical time (not UT).
 */
M.cycle = function (c) {
  // (c int)  (jde float64)
  var jde = 2398140.227 + 27.2752316 * c;
  var m = 281.96 * Math.PI / 180 + 26.882476 * Math.PI / 180 * c;

  var _base$sincos5 = base.sincos(2 * m),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      s2m = _base$sincos6[0],
      c2m = _base$sincos6[1];

  return jde + 0.1454 * Math.sin(m) - 0.0085 * s2m - 0.0141 * c2m;
};