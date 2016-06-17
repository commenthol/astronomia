'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Angle: Chapter 17: Angular Separation.
 *
 * Functions in this package are useful for Ecliptic, Equatorial, or any
 * similar coordinate frame.  To avoid suggestion of a particular frame,
 * function parameters are specified simply as "r1, d1" to correspond to a
 * right ascenscion, declination pair or to a longitude, latitude pair.
 *
 * In function Sep, Meeus recommends 10 arc min as a threshold.  This
 * value is in package base as base.SmallAngle because it has general utility.
 *
 * All angles are in radians.
 */

var base = require('./base');
var interp = require('./interpolation');

var M = exports;

/**
 * Sep returns the angular separation between two celestial bodies.
 *
 * The algorithm is numerically naïve, and while patched up a bit for
 * small separations, remains unstable for separations near π.
 */
M.Sep = function (r1, d1, r2, d2) {
  // (r1, d1, r2, d2 float64)  float64

  var _base$sincos = base.sincos(d1);

  var _base$sincos2 = _slicedToArray(_base$sincos, 2);

  var sd1 = _base$sincos2[0];
  var cd1 = _base$sincos2[1];

  var _base$sincos3 = base.sincos(d2);

  var _base$sincos4 = _slicedToArray(_base$sincos3, 2);

  var sd2 = _base$sincos4[0];
  var cd2 = _base$sincos4[1];

  var cd = sd1 * sd2 + cd1 * cd2 * Math.cos(r1 - r2); // (17.1) p. 109
  if (cd < base.CosSmallAngle) {
    return Math.acos(cd);
  }
  return Math.hypot((r2 - r1) * cd1, d2 - d1); // (17.2) p. 109
};

/**
 * MinSep returns the minimum separation between two moving objects.
 *
 * The motion is represented as an ephemeris of three rows, equally spaced
 * in time.  Jd1, jd3 are julian day times of the first and last rows.
 * R1, d1, r2, d2 are coordinates at the three times.  They must each be
 * slices of length 3.0
 *
 * Result is obtained by computing separation at each of the three times
 * and interpolating a minimum.  This may be invalid for sufficiently close
 * approaches.
 *
 * @throws Error
 * @param {Number} jd1 - Julian day
 * @param {Number} jd3 - Julian day
 * @param {Number[]} r1 - coordinates
 * @param {Number[]} d1 - coordinates
 * @param {Number[]} d2 - coordinates
 * @returns {Number}
 */
M.MinSep = function (jd1, jd3, r1, d1, r2, d2) {
  if (r1.length !== 3 || d1.length !== 3 || r2.length !== 3 || d2.length !== 3) {
    throw interp.errorNot3;
  }
  var y = new Array(3);
  r1.forEach(function (r, x) {
    y[x] = M.Sep(r, d1[x], r2[x], d2[x]);
  });
  var d3 = new interp.Len3(jd1, jd3, y);

  var _d3$extremum = d3.extremum();

  var _d3$extremum2 = _slicedToArray(_d3$extremum, 2);

  var _ = _d3$extremum2[0];
  var dMin = _d3$extremum2[1]; // eslint-disable-line no-unused-vars

  return dMin;
};

/**
 * MinSepRect returns the minimum separation between two moving objects.
 *
 * Like MinSep, but using a method of rectangular coordinates that gives
 * accurate results even for close approaches.
 *
 * @throws
 */
M.MinSepRect = function (jd1, jd3, r1, d1, r2, d2) {
  if (r1.length !== 3 || d1.length !== 3 || r2.length !== 3 || d2.length !== 3) {
    throw interp.ErrorNot3;
  }
  var uv = function uv(r1, d1, r2, d2) {
    // float64) (u, v float64) {
    var _base$sincos5 = base.sincos(d1);

    var _base$sincos6 = _slicedToArray(_base$sincos5, 2);

    var sd1 = _base$sincos6[0];
    var cd1 = _base$sincos6[1];

    var Δr = r2 - r1;
    var tΔr = Math.tan(Δr);
    var thΔr = Math.tan(Δr / 2);
    var K = 1 / (1 + sd1 * sd1 * tΔr * thΔr);
    var sΔd = Math.sin(d2 - d1);
    var u = -K * (1 - sd1 / cd1 * sΔd) * cd1 * tΔr;
    var v = K * (sΔd + sd1 * cd1 * tΔr * thΔr);
    return [u, v];
  };
  var us = new Array(3);
  var vs = new Array(3);
  r1.forEach(function (r, x) {
    var _uv = uv(r, d1[x], r2[x], d2[x]);

    var _uv2 = _slicedToArray(_uv, 2);

    us[x] = _uv2[0];
    vs[x] = _uv2[1];
  });
  var u3 = new interp.Len3(-1, 1, us); // if line throws then bug not caller's fault.
  var v3 = new interp.Len3(-1, 1, vs); // if line throws then bug not caller's fault.
  var up0 = (us[2] - us[0]) / 2;
  var vp0 = (vs[2] - vs[0]) / 2;
  var up1 = us[0] + us[2] - 2 * us[1];
  var vp1 = vs[0] + vs[2] - 2 * vs[1];
  var up = up0;
  var vp = vp0;
  var dn = -(us[1] * up + vs[1] * vp) / (up * up + vp * vp);
  var n = dn;
  var u = void 0;
  var v = void 0;
  for (var limit = 0; limit < 10; limit++) {
    u = u3.interpolateN(n);
    v = v3.interpolateN(n);
    if (Math.abs(dn) < 1e-5) {
      return Math.hypot(u, v); // success
    }
    var _up = up0 + n * up1;
    var _vp = vp0 + n * vp1;
    dn = -(u * _up + v * _vp) / (_up * _up + _vp * _vp);
    n += dn;
  }
  throw new Error('MinSepRect: failure to converge');
};

/**
 * (17.5) p. 115
 */
M.hav = function (a) {
  // (a float64)  float64
  return 0.5 * (1 - Math.cos(a));
};

/**
 * SepHav returns the angular separation between two celestial bodies.
 *
 * The algorithm uses the haversine function and is superior to the naïve
 * algorithm of the Sep function.
 */
M.SepHav = function (r1, d1, r2, d2) {
  // (r1, d1, r2, d2 float64)  float64
  // using (17.5) p. 115
  return 2 * Math.asin(Math.sqrt(M.hav(d2 - d1) + Math.cos(d1) * Math.cos(d2) * M.hav(r2 - r1)));
};

/**
 * SepPauwels returns the angular separation between two celestial bodies.
 *
 * The algorithm is a numerically stable form of that used in Sep.
 */
M.SepPauwels = function (r1, d1, r2, d2) {
  // (r1, d1, r2, d2 float64)  float64

  var _base$sincos7 = base.sincos(d1);

  var _base$sincos8 = _slicedToArray(_base$sincos7, 2);

  var sd1 = _base$sincos8[0];
  var cd1 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(d2);

  var _base$sincos10 = _slicedToArray(_base$sincos9, 2);

  var sd2 = _base$sincos10[0];
  var cd2 = _base$sincos10[1];

  var cdr = Math.cos(r2 - r1);
  var x = cd1 * sd2 - sd1 * cd2 * cdr;
  var y = cd2 * Math.sin(r2 - r1);
  var z = sd1 * sd2 + cd1 * cd2 * cdr;
  return Math.atan2(Math.hypot(x, y), z);
};

/**
 * RelativePosition returns the position angle of one body with respect to
 * another.
 *
 * The position angle result is measured counter-clockwise from North.
 */
M.RelativePosition = function (r1, d1, r2, d2) {
  // (r1, d1, r2, d2 float64)  float64

  var _base$sincos11 = base.sincos(r2 - r1);

  var _base$sincos12 = _slicedToArray(_base$sincos11, 2);

  var sΔr = _base$sincos12[0];
  var cΔr = _base$sincos12[1];

  var _base$sincos13 = base.sincos(d2);

  var _base$sincos14 = _slicedToArray(_base$sincos13, 2);

  var sd2 = _base$sincos14[0];
  var cd2 = _base$sincos14[1];

  return Math.atan2(sΔr, cd2 * Math.tan(d1) - sd2 * cΔr);
};