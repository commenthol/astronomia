/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module stellar
 */
/**
 * Stellar: Chapter 56, Stellar Magnitudes.
 */

const M = exports

/**
 * Sum returns the combined apparent magnitude of two stars.
 */
M.sum = function (m1, m2) { // (m1, m2 float64)  float64
  let x = 0.4 * (m2 - m1)
  return m2 - 2.5 * Math.log10(Math.pow(10, x) + 1)
}

/**
 * SumN returns the combined apparent magnitude of a number of stars.
 */
M.sumN = function (m) { // (m ...float64)  float64
  var s = 0
  for (var mi of m) {
    s += Math.pow(10, -0.4 * mi)
  }
  return -2.5 * Math.log10(s)
}

/**
 * Ratio returns the brightness ratio of two stars.
 *
 * Arguments m1, m2 are apparent magnitudes.
 */
M.ratio = function (m1, m2) { // (m1, m2 float64)  float64
  let x = 0.4 * (m2 - m1)
  return Math.pow(10, x)
}

/**
 * Difference returns the difference in apparent magnitude of two stars
 * given their brightness ratio.
 */
M.difference = function (ratio) { // (ratio float64)  float64
  return 2.5 * Math.log10(ratio)
}

/**
 * AbsoluteByParallax returns absolute magnitude given annual parallax.
 *
 * Argument m is apparent magnitude, π is annual parallax in arc seconds.
 */
M.absoluteByParallax = function (m, π) { // (m, π float64)  float64
  return m + 5 + 5 * Math.log10(π)
}

/**
 * AbsoluteByDistance returns absolute magnitude given distance.
 *
 * Argument m is apparent magnitude, d is distance in parsecs.
 */
M.absoluteByDistance = function (m, d) { // (m, d float64)  float64
  return m + 5 - 5 * Math.log10(d)
}
