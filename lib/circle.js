"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Circle: Chapter 20, Smallest Circle containing three Celestial Bodies.
 */
var M = exports;

/**
 * Smallest finds the smallest circle containing three points.
 *
 * Arguments should represent coordinates in right ascension and declination
 * or longitude and latitude.  Result Δ is the diameter of the circle, typeI
 * is true if solution is of type I.
 *
 * @param {Number} r1, d1 - ra, dec point 1
 * @param {Number} r2, d2 - ra, dec point 2
 * @param {Number} r3, d3 - ra, dec point 3
 * @returns {Array} [Δ, typeI]
 *  {Number} Δ - diameter of the circle
 *  {Number} typeI - true - Two points on circle, one interior.
 *                   false - All three points on circle.
 */
M.smallest = function (r1, d1, r2, d2, r3, d3) {
  // (r1, d1, r2, d2, r3, d3 float64)  (Δ float64, typeI bool)
  // Using haversine formula
  var cd1 = Math.cos(d1);
  var cd2 = Math.cos(d2);
  var cd3 = Math.cos(d3);
  var a = 2 * Math.asin(Math.sqrt(hav(d2 - d1) + cd1 * cd2 * hav(r2 - r1)));
  var b = 2 * Math.asin(Math.sqrt(hav(d3 - d2) + cd2 * cd3 * hav(r3 - r2)));
  var c = 2 * Math.asin(Math.sqrt(hav(d1 - d3) + cd3 * cd1 * hav(r1 - r3)));
  if (b > a) {
    var _noswap = noswap(b, a);

    var _noswap2 = _slicedToArray(_noswap, 2);

    a = _noswap2[0];
    b = _noswap2[1];
  }
  if (c > a) {
    var _noswap3 = noswap(c, a);

    var _noswap4 = _slicedToArray(_noswap3, 2);

    a = _noswap4[0];
    c = _noswap4[1];
  }
  if (a * a >= b * b + c * c) {
    return [a, true];
  }
  // (20.1) p. 128
  return [2 * a * b * c / Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (a + c - b)), false];
};

var noswap = function noswap(a, b) {
  return [a, b];
};

var hav = function hav(a) {
  // (a float64)  float64
  return 0.5 * (1 - Math.cos(a));
};