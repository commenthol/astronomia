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
 * @param {number} gD - distance in AU.
 * @return {number} parallax in radians.
 */
M.horizontal = function (gD) {
  // (40.1) p. 279
  return Math.asin(Math.sin(horPar) / gD);
  // return horPar / gD // with sufficient accuracy
};

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments ga, gd are geocentric right ascension and declination in radians.
 * gD is distance to the observed object in AU. grsgf_, grcgf_ are parallax
 * constants (see package globe.) lon is geographic longitude of the observer,
 * jde is time of observation.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric = function (c, grsgf, grcgf, lon, jde) {
  var _ref = [c.ra, c.dec, c.range],
      ga = _ref[0],
      gd = _ref[1],
      gD = _ref[2];

  var gp = M.horizontal(gD);
  var gth0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(gth0 - lon - ga, 2 * Math.PI);
  var sgp = Math.sin(gp);

  var _base$sincos = base.sincos(H),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sH = _base$sincos2[0],
      cH = _base$sincos2[1];

  var _base$sincos3 = base.sincos(gd),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sgd = _base$sincos4[0],
      cgd = _base$sincos4[1];

  var gDga = Math.atan2(-grcgf * sgp * sH, cgd - grcgf * sgp * cH); // (40.2) p. 279
  var ga_ = ga + gDga;
  var gd_ = Math.atan2((sgd - grsgf * sgp) * Math.cos(gDga), cgd - grcgf * sgp * cH); // (40.3) p. 279
  return new base.Coord(ga_, gd_);
};

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {base.Coord} observed topocentric ra and dec in radians.
 */
M.topocentric2 = function (c, grsgf, grcgf, lon, jde) {
  var _ref2 = [c.ra, c.dec, c.range],
      ga = _ref2[0],
      gd = _ref2[1],
      gD = _ref2[2];

  var gp = M.horizontal(gD);
  var gth0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(gth0 - lon - ga, 2 * Math.PI);

  var _base$sincos5 = base.sincos(H),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sH = _base$sincos6[0],
      cH = _base$sincos6[1];

  var _base$sincos7 = base.sincos(gd),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sgd = _base$sincos8[0],
      cgd = _base$sincos8[1];

  var gDga = -gp * grcgf * sH / cgd; // (40.4) p. 280
  var gDgd = -gp * (grsgf * cgd - grcgf * cH * sgd); // (40.5) p. 280
  return new base.Coord(gDga, gDgd);
};

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} grsgf - parallax constants (see package globe.)
 * @param {number} grcgf - parallax constants (see package globe.)
 * @param {number} lon - geographic longitude of the observer (measured positively westwards!)
 * @param {number} jde - time of observation
 * @return {Array}
 *    {number} H_ - topocentric hour angle
 *    {number} gd_ - topocentric declination
 */
M.topocentric3 = function (c, grsgf_, grcgf_, lon, jde) {
  var _ref3 = [c.ra, c.dec, c.range],
      ga = _ref3[0],
      gd = _ref3[1],
      gD = _ref3[2];

  var gp = M.horizontal(gD);
  var gth0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(gth0 - lon - ga, 2 * Math.PI);
  var sgp = Math.sin(gp);

  var _base$sincos9 = base.sincos(H),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sH = _base$sincos10[0],
      cH = _base$sincos10[1];

  var _base$sincos11 = base.sincos(gd),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sgd = _base$sincos12[0],
      cgd = _base$sincos12[1];

  var A = cgd * sH;
  var B = cgd * cH - grcgf_ * sgp;
  var C = sgd - grsgf_ * sgp;
  var q = Math.sqrt(A * A + B * B + C * C);
  var H_ = Math.atan2(A, B);
  var gd_ = Math.asin(C / q);
  return [H_, gd_];
};

/**
 * TopocentricEcliptical returns topocentric ecliptical coordinates including parallax.
 *
 * Arguments `c` are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. gf, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ge is the obliquity of the
 * ecliptic, gth is local sidereal time, gp is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * @param {base.Coord} c - geocentric right ascension and declination in radians
 * @param {number} s - geocentric semidiameter of `c`
 * @param {number} gf - observer's latitude
 * @param {number} h - observer's height above the ellipsoid in meters
 * @param {number} ge - is the obliquity of the ecliptic
 * @param {number} gth - local sidereal time
 * @param {number} gp - equatorial horizontal parallax of the body
 * @return {Array}
 *    {number} gl_ - observed topocentric longitude
 *    {number} gb_ - observed topocentric latitude
 *    {number} s_ - observed topocentric semidiameter
 */
M.topocentricEcliptical = function (c, s, gf, h, ge, gth, gp) {
  var _ref4 = [c.lon, c.lat],
      gl = _ref4[0],
      gb = _ref4[1];

  var _globe$Earth76$parall = globe.Earth76.parallaxConstants(gf, h),
      _globe$Earth76$parall2 = _slicedToArray(_globe$Earth76$parall, 2),
      S = _globe$Earth76$parall2[0],
      C = _globe$Earth76$parall2[1];

  var _base$sincos13 = base.sincos(gl),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sgl = _base$sincos14[0],
      cgl = _base$sincos14[1];

  var _base$sincos15 = base.sincos(gb),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sgb = _base$sincos16[0],
      cgb = _base$sincos16[1];

  var _base$sincos17 = base.sincos(ge),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sge = _base$sincos18[0],
      cge = _base$sincos18[1];

  var _base$sincos19 = base.sincos(gth),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sgth = _base$sincos20[0],
      cgth = _base$sincos20[1];

  var sgp = Math.sin(gp);
  var N = cgl * cgb - C * sgp * cgth;
  var gl_ = Math.atan2(sgl * cgb - sgp * (S * sge + C * cge * sgth), N);
  if (gl_ < 0) {
    gl_ += 2 * Math.PI;
  }
  var cgl_ = Math.cos(gl_);
  var gb_ = Math.atan(cgl_ * (sgb - sgp * (S * cge - C * sge * sgth)) / N);
  var s_ = Math.asin(cgl_ * Math.cos(gb_) * Math.sin(s) / N);
  return [gl_, gb_, s_];
};