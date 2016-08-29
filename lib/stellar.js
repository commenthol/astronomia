"use strict";

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module stellar
 */
/**
 * Stellar: Chapter 56, Stellar Magnitudes.
 */

var M = exports;

/**
 * Sum returns the combined apparent magnitude of two stars.
 */
M.sum = function (m1, m2) {
  // (m1, m2 float64)  float64
  var x = 0.4 * (m2 - m1);
  return m2 - 2.5 * Math.log10(Math.pow(10, x) + 1);
};

/**
 * SumN returns the combined apparent magnitude of a number of stars.
 */
M.sumN = function (m) {
  // (m ...float64)  float64
  var s = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = m[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mi = _step.value;

      s += Math.pow(10, -0.4 * mi);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return -2.5 * Math.log10(s);
};

/**
 * Ratio returns the brightness ratio of two stars.
 *
 * Arguments m1, m2 are apparent magnitudes.
 */
M.ratio = function (m1, m2) {
  // (m1, m2 float64)  float64
  var x = 0.4 * (m2 - m1);
  return Math.pow(10, x);
};

/**
 * Difference returns the difference in apparent magnitude of two stars
 * given their brightness ratio.
 */
M.difference = function (ratio) {
  // (ratio float64)  float64
  return 2.5 * Math.log10(ratio);
};

/**
 * AbsoluteByParallax returns absolute magnitude given annual parallax.
 *
 * Argument m is apparent magnitude, π is annual parallax in arc seconds.
 */
M.absoluteByParallax = function (m, π) {
  // (m, π float64)  float64
  return m + 5 + 5 * Math.log10(π);
};

/**
 * AbsoluteByDistance returns absolute magnitude given distance.
 *
 * Argument m is apparent magnitude, d is distance in parsecs.
 */
M.absoluteByDistance = function (m, d) {
  // (m, d float64)  float64
  return m + 5 - 5 * Math.log10(d);
};