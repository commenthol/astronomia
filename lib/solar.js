'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solar
 */
/**
 * Solar: Chapter 25, Solar Coordinates.
 *
 * Partial implementation:
 *
 * 1. Higher accuracy positions are not computed with Appendix III but with
 * full VSOP87 as implemented in package planetposition.
 *
 * 2. Higher accuracy correction for aberration (using the formula for
 * variation Δλ on p. 168) is not implemented.  Results for example 25.b
 * already match the full VSOP87 values on p. 165 even with the low accuracy
 * correction for aberration, thus there are no more significant digits that
 * would check a more accurate result.  Also the size of the formula presents
 * significant chance of typographical error.
 */

var base = require('./base');
var coord = require('./coord');
var nutation = require('./nutation');

var M = exports;

/**
 * True returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon = true geometric longitude, ☉, in radians
 *   {Number} ano = true anomaly in radians
 */
M.true = function (T) {
  // (25.2) p. 163
  var L0 = base.horner(T, 280.46646, 36000.76983, 0.0003032) * Math.PI / 180;
  var m = M.meanAnomaly(T);
  var C = (base.horner(T, 1.914602, -0.004817, -0.000014) * Math.sin(m) + (0.019993 - 0.000101 * T) * Math.sin(2 * m) + 0.000289 * Math.sin(3 * m)) * Math.PI / 180;
  var lon = base.pmod(L0 + C, 2 * Math.PI);
  var ano = base.pmod(m + C, 2 * Math.PI);
  return { lon: lon, ano: ano };
};

/**
 * meanAnomaly returns the mean anomaly of Earth at the given T.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Result is in radians and is not normalized to the range 0..2π.
 */
M.meanAnomaly = function (T) {
  // (25.3) p. 163
  return base.horner(T, 357.52911, 35999.05029, -0.0001537) * Math.PI / 180;
};

/**
 * eccentricity returns eccentricity of the Earth's orbit around the sun.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} eccentricity of the Earth's orbit around the sun.
 */
M.eccentricity = function (T) {
  // (25.4) p. 163
  return base.horner(T, 0.016708634, -0.000042037, -0.0000001267);
};

/**
 * Radius returns the Sun-Earth distance in AU.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Sun-Earth distance in AU
 */
M.radius = function (T) {
  var _M$true = M.true(T),
      lon = _M$true.lon,
      ano = _M$true.ano; // eslint-disable-line


  var e = M.eccentricity(T);
  // (25.5) p. 164
  return 1.000001018 * (1 - e * e) / (1 + e * Math.cos(ano));
};

/**
 * ApparentLongitude returns apparent longitude of the Sun referenced to the true equinox of date.
 * Result includes correction for nutation and aberration.  Unit is radians.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} apparent longitude of the Sun referenced to the true equinox of date.
 */
M.apparentLongitude = function (T) {
  var Ω = node(T);

  var _M$true2 = M.true(T),
      lon = _M$true2.lon,
      ano = _M$true2.ano; // eslint-disable-line


  return lon - 0.00569 * Math.PI / 180 - 0.00478 * Math.PI / 180 * Math.sin(Ω);
};

/**
 * @private
 */
function node(T) {
  return 125.04 * Math.PI / 180 - 1934.136 * Math.PI / 180 * T;
}

/**
 * true2000 returns true geometric longitude and anomaly of the sun referenced to equinox J2000.
 * Results are accurate to .01 degree for years 1900 to 2100.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon - true geometric longitude, ☉, in radians
 *   {Number} ano - true anomaly in radians
 */
M.true2000 = function (T) {
  var _M$true3 = M.true(T),
      lon = _M$true3.lon,
      ano = _M$true3.ano;

  lon -= 0.01397 * Math.PI / 180 * T * 100;
  return { lon: lon, ano: ano };
};

/**
 * trueEquatorial returns the true geometric position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
M.trueEquatorial = function (jde) {
  var _M$true4 = M.true(base.J2000Century(jde)),
      lon = _M$true4.lon,
      ano = _M$true4.ano; // eslint-disable-line


  var ε = nutation.meanObliquity(jde);

  var _base$sincos = base.sincos(lon),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      ss = _base$sincos2[0],
      cs = _base$sincos2[1];

  var _base$sincos3 = base.sincos(ε),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sε = _base$sincos4[0],
      cε = _base$sincos4[1];
  // (25.6, 25.7) p. 165


  var ra = Math.atan2(cε * ss, cs);
  var dec = sε * ss;
  return new base.Coord(ra, dec);
};

/**
 * apparentEquatorial returns the apparent position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
M.apparentEquatorial = function (jde) {
  var T = base.J2000Century(jde);
  var λ = M.apparentLongitude(T);
  var ε = nutation.meanObliquity(jde);

  var _base$sincos5 = base.sincos(λ),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sλ = _base$sincos6[0],
      cλ = _base$sincos6[1];
  // (25.8) p. 165


  var _base$sincos7 = base.sincos(ε + 0.00256 * Math.PI / 180 * Math.cos(node(T))),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sε = _base$sincos8[0],
      cε = _base$sincos8[1];

  var ra = Math.atan2(cε * sλ, cλ);
  var dec = Math.asin(sε * sλ);
  return new base.Coord(ra, dec);
};

/**
 * trueVSOP87 returns the true geometric position of the sun as ecliptic coordinates.
 *
 * Result computed by full VSOP87 theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Object}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
M.trueVSOP87 = function (planet, jde) {
  var _planet$position = planet.position(jde),
      lon = _planet$position.lon,
      lat = _planet$position.lat,
      range = _planet$position.range;

  var s = lon + Math.PI;
  // FK5 correction.
  var λp = base.horner(base.J2000Century(jde), s, -1.397 * Math.PI / 180, -0.00031 * Math.PI / 180);

  var _base$sincos9 = base.sincos(λp),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sλp = _base$sincos10[0],
      cλp = _base$sincos10[1];

  var Δβ = 0.03916 / 3600 * Math.PI / 180 * (cλp - sλp);
  // (25.9) p. 166
  lon = base.pmod(s - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI);
  lat = Δβ - lat;
  return new base.Coord(lon, lat, range);
};

/**
 * apparentVSOP87 returns the apparent position of the sun as ecliptic coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
M.apparentVSOP87 = function (planet, jde) {
  // note: see duplicated code in ApparentEquatorialVSOP87.
  var _M$trueVSOP = M.trueVSOP87(planet, jde),
      lon = _M$trueVSOP.lon,
      lat = _M$trueVSOP.lat,
      range = _M$trueVSOP.range;

  var Δψ = nutation.nutation(jde)[0];
  var a = M.aberration(range);
  lon = lon + Δψ + a;
  return new base.Coord(lon, lat, range);
};

/**
 * apparentEquatorialVSOP87 returns the apparent position of the sun as equatorial coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {planetposition.Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 *   {Number} range - range in AU
 */
M.apparentEquatorialVSOP87 = function (planet, jde) {
  // note: duplicate code from ApparentVSOP87 so we can keep Δε.
  // see also duplicate code in time.E().
  var _M$trueVSOP2 = M.trueVSOP87(planet, jde),
      lon = _M$trueVSOP2.lon,
      lat = _M$trueVSOP2.lat,
      range = _M$trueVSOP2.range;

  var _nutation$nutation = nutation.nutation(jde),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];

  var a = M.aberration(range);
  var λ = lon + Δψ + a;
  var ε = nutation.meanObliquity(jde) + Δε;

  var _toEquatorial = new coord.Ecliptic(λ, lat).toEquatorial(ε),
      ra = _toEquatorial.ra,
      dec = _toEquatorial.dec;

  return new base.Coord(ra, dec, range);
};

/**
 * Low precision formula.  The high precision formula is not implemented
 * because the low precision formula already gives position results to the
 * accuracy given on p. 165.  The high precision formula represents lots
 * of typing with associated chance of typos, and no way to test the result.
 * @param {Number} range
 * @returns {Number} aberation
 */
M.aberration = function (range) {
  // (25.10) p. 167
  return -20.4898 / 3600 * Math.PI / 180 / range;
};