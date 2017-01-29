'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solarxyz
 */
/**
 * Solarxyz: Chapter 26, Rectangular Coordinates of the Sun.
 */
var base = require('./base');
var nutation = require('./nutation');
var solar = require('./solar');
var M = exports;

/**
 * Position returns rectangular coordinates referenced to the mean equinox of date.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.position = function (earth, jde) {
  // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  // (26.1) p. 171
  var _solar$trueVSOP = solar.trueVSOP87(earth, jde),
      lon = _solar$trueVSOP.lon,
      lat = _solar$trueVSOP.lat,
      range = _solar$trueVSOP.range;

  var _base$sincos = base.sincos(nutation.meanObliquity(jde)),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sε = _base$sincos2[0],
      cε = _base$sincos2[1];

  var _base$sincos3 = base.sincos(lon),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      ss = _base$sincos4[0],
      cs = _base$sincos4[1];

  var sβ = Math.sin(lat);
  var x = range * cs;
  var y = range * (ss * cε - sβ * sε);
  var z = range * (ss * sε + sβ * cε);
  return { x: x, y: y, z: z };
};

/**
 * LongitudeJ2000 returns geometric longitude referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {Number} geometric longitude referenced to equinox J2000.
 */
M.longitudeJ2000 = function (earth, jde) {
  var lon = earth.position2000(jde).lon;
  return base.pmod(lon + Math.PI - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI);
};

/**
 * PositionJ2000 returns rectangular coordinates referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionJ2000 = function (earth, jde) {
  var _M$xyz = M.xyz(earth, jde),
      x = _M$xyz.x,
      y = _M$xyz.y,
      z = _M$xyz.z;
  // (26.3) p. 174


  return {
    x: x + 0.00000044036 * y - 0.000000190919 * z,
    y: -0.000000479966 * x + 0.917482137087 * y - 0.397776982902 * z,
    z: 0.397776982902 * y + 0.917482137087 * z
  };
};

M.xyz = function (earth, jde) {
  var _earth$position = earth.position2000(jde),
      lon = _earth$position.lon,
      lat = _earth$position.lat,
      range = _earth$position.range;

  var s = lon + Math.PI;
  var β = -lat;

  var _base$sincos5 = base.sincos(s),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      ss = _base$sincos6[0],
      cs = _base$sincos6[1];

  var _base$sincos7 = base.sincos(β),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sβ = _base$sincos8[0],
      cβ = _base$sincos8[1];
  // (26.2) p. 172


  var x = range * cβ * cs;
  var y = range * cβ * ss;
  var z = range * sβ;
  return { x: x, y: y, z: z };
};

/**
 * PositionB1950 returns rectangular coordinates referenced to B1950.
 *
 * Results are referenced to the mean equator and equinox of the epoch B1950
 * in the FK5 system, not FK4.
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionB1950 = function (earth, jde) {
  // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  var _M$xyz2 = M.xyz(earth, jde),
      x = _M$xyz2.x,
      y = _M$xyz2.y,
      z = _M$xyz2.z;

  return {
    x: 0.999925702634 * x + 0.012189716217 * y + 0.000011134016 * z,
    y: -0.011179418036 * x + 0.917413998946 * y - 0.397777041885 * z,
    z: -0.004859003787 * x + 0.397747363646 * y + 0.917482111428 * z
  };
};

var ζt = [2306.2181, 0.30188, 0.017998];
var zt = [2306.2181, 1.09468, 0.018203];
var θt = [2004.3109, -0.42665, -0.041833];

/**
 * PositionEquinox returns rectangular coordinates referenced to an arbitrary epoch.
 *
 * Position will be computed for given Julian day "jde" but referenced to mean
 * equinox "epoch" (year).
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @param {Number} epoch
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
M.positionEquinox = function (earth, jde, epoch) {
  var xyz = M.positionJ2000(earth, jde);
  var x0 = xyz.x;
  var y0 = xyz.y;
  var z0 = xyz.z;
  var t = (epoch - 2000) * 0.01;
  var ζ = base.horner(t, ζt) * t * Math.PI / 180 / 3600;
  var z = base.horner(t, zt) * t * Math.PI / 180 / 3600;
  var θ = base.horner(t, θt) * t * Math.PI / 180 / 3600;

  var _base$sincos9 = base.sincos(ζ),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sζ = _base$sincos10[0],
      cζ = _base$sincos10[1];

  var _base$sincos11 = base.sincos(z),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sz = _base$sincos12[0],
      cz = _base$sincos12[1];

  var _base$sincos13 = base.sincos(θ),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sθ = _base$sincos14[0],
      cθ = _base$sincos14[1];

  var xx = cζ * cz * cθ - sζ * sz;
  var xy = sζ * cz + cζ * sz * cθ;
  var xz = cζ * sθ;
  var yx = -cζ * sz - sζ * cz * cθ;
  var yy = cζ * cz - sζ * sz * cθ;
  var yz = -sζ * sθ;
  var zx = -cz * sθ;
  var zy = -sz * sθ;
  var zz = cθ;
  return {
    x: xx * x0 + yx * y0 + zx * z0,
    y: xy * x0 + yy * y0 + zy * z0,
    z: xz * x0 + yz * y0 + zz * z0
  };
};