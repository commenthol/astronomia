'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallax
 */
/**
 * Parallax: Chapter 40, Correction for Parallax.
 */

var base = require('./base');
var globe = require('./globe');
var sidereal = require('./sidereal');
var sexa = require('./sexagesimal');

var M = exports;

var horPar = 8.794 / 3600 * Math.PI / 180; // 8".794 arcseconds in radians

/**
 * Horizontal returns equatorial horizontal parallax of a body.
 *
 * @param {number} Δ - distance in AU.
 * @return {number} parallax in radians.
 */
M.horizontal = function (Δ) {
  // (40.1) p. 279
  return Math.asin(Math.sin(horPar) / Δ);
  // return horPar / Δ // with sufficient accuracy
};

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments α, δ are geocentric right ascension and declination in radians.
 * Δ is distance to the observed object in AU. ρsφ_, ρcφ_ are parallax
 * constants (see package globe.) lon is geographic longitude of the observer,
 * jde is time of observation.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric = function (c, ρsφ, ρcφ, lon, jde) {
  var _ref = [c.ra, c.dec, c.range],
      α = _ref[0],
      δ = _ref[1],
      Δ = _ref[2];

  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - lon - α, 2 * Math.PI);
  var sπ = Math.sin(π);

  var _base$sincos = base.sincos(H),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sH = _base$sincos2[0],
      cH = _base$sincos2[1];

  var _base$sincos3 = base.sincos(δ),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sδ = _base$sincos4[0],
      cδ = _base$sincos4[1];

  var Δα = Math.atan2(-ρcφ * sπ * sH, cδ - ρcφ * sπ * cH); // (40.2) p. 279
  var α_ = α + Δα;
  var δ_ = Math.atan2((sδ - ρsφ * sπ) * Math.cos(Δα), cδ - ρcφ * sπ * cH); // (40.3) p. 279
  return new base.Coord(α_, δ_);
};

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric2 = function (c, ρsφ, ρcφ, lon, jde) {
  var _ref2 = [c.ra, c.dec, c.range],
      α = _ref2[0],
      δ = _ref2[1],
      Δ = _ref2[2];

  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - lon - α, 2 * Math.PI);

  var _base$sincos5 = base.sincos(H),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sH = _base$sincos6[0],
      cH = _base$sincos6[1];

  var _base$sincos7 = base.sincos(δ),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sδ = _base$sincos8[0],
      cδ = _base$sincos8[1];

  var Δα = -π * ρcφ * sH / cδ; // (40.4) p. 280
  var Δδ = -π * (ρsφ * cδ - ρcφ * cH * sδ); // (40.5) p. 280
  return new base.Coord(Δα, Δδ);
};

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} ρsφ - parallax constants (see package globe.)
 * @param {number} ρcφ - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Array}
 *    {number} H_ - topocentric hour angle
 *    {number} δ_ - topocentric declination
 */
M.topocentric3 = function (c, ρsφ_, ρcφ_, lon, jde) {
  var _ref3 = [c.ra, c.dec, c.range],
      α = _ref3[0],
      δ = _ref3[1],
      Δ = _ref3[2];

  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - lon - α, 2 * Math.PI);
  var sπ = Math.sin(π);

  var _base$sincos9 = base.sincos(H),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sH = _base$sincos10[0],
      cH = _base$sincos10[1];

  var _base$sincos11 = base.sincos(δ),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sδ = _base$sincos12[0],
      cδ = _base$sincos12[1];

  var A = cδ * sH;
  var B = cδ * cH - ρcφ_ * sπ;
  var C = sδ - ρsφ_ * sπ;
  var q = Math.sqrt(A * A + B * B + C * C);
  var H_ = Math.atan2(A, B);
  var δ_ = Math.asin(C / q);
  return [H_, δ_];
};

/**
 * TopocentricEcliptical returns topocentric ecliptical coordinates including parallax.
 *
 * Arguments `c` are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. φ, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ε is the obliquity of the
 * ecliptic, θ is local sidereal time, π is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} s - geocentric semidiameter of `c`
 * @param {number} φ - observer's latitude
 * @param {number} h - observer's height above the ellipsoid in meters
 * @param {number} ε - is the obliquity of the ecliptic
 * @param {number} θ - local sidereal time
 * @param {number} π - equatorial horizontal parallax of the body
 * @return {Array}
 *    {number} λ_ - observed topocentric longitude
 *    {number} β_ - observed topocentric latitude
 *    {number} s_ - observed topocentric semidiameter
 */
M.topocentricEcliptical = function (c, s, φ, h, ε, θ, π) {
  var _ref4 = [c.lon, c.lat],
      λ = _ref4[0],
      β = _ref4[1];

  var _globe$Earth76$parall = globe.Earth76.parallaxConstants(φ, h),
      _globe$Earth76$parall2 = _slicedToArray(_globe$Earth76$parall, 2),
      S = _globe$Earth76$parall2[0],
      C = _globe$Earth76$parall2[1];

  var _base$sincos13 = base.sincos(λ),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sλ = _base$sincos14[0],
      cλ = _base$sincos14[1];

  var _base$sincos15 = base.sincos(β),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sβ = _base$sincos16[0],
      cβ = _base$sincos16[1];

  var _base$sincos17 = base.sincos(ε),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sε = _base$sincos18[0],
      cε = _base$sincos18[1];

  var _base$sincos19 = base.sincos(θ),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sθ = _base$sincos20[0],
      cθ = _base$sincos20[1];

  var sπ = Math.sin(π);
  var N = cλ * cβ - C * sπ * cθ;
  var λ_ = Math.atan2(sλ * cβ - sπ * (S * sε + C * cε * sθ), N);
  if (λ_ < 0) {
    λ_ += 2 * Math.PI;
  }
  var cλ_ = Math.cos(λ_);
  var β_ = Math.atan(cλ_ * (sβ - sπ * (S * cε - C * sε * sθ)) / N);
  var s_ = Math.asin(cλ_ * Math.cos(β_) * Math.sin(s) / N);
  return [λ_, β_, s_];
};