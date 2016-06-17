'use strict';

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Conjunction: Chapter 18: Planetary Conjunctions.
 */

var interp = require('./interpolation');

var M = exports;

/**
 * Planetary computes a conjunction between two moving objects, such as planets.
 *
 * Conjunction is found with interpolation against length 5 ephemerides.
 *
 * T1, t5 are times of first and last rows of ephemerides.  The scale is
 * arbitrary.
 *
 * R1, d1 is the ephemeris of the first object.  The columns may be celestial
 * coordinates in right ascension and declination or ecliptic coordinates in
 * longitude and latitude.
 *
 * R2, d2 is the ephemeris of the second object, in the same frame as the first.
 *
 * Return value t is time of conjunction in the scale of t1, t5.
 * Δd is the amount that object 2 was "above" object 1 at the time of
 * conjunction.
 */
M.planetary = function (t1, t5, r1, d1, r2, d2) {
  // (t1, t5 float64, r1, d1, r2, d2 []float64)  (t, Δd float64, err error)
  if (r1.length !== 5 || d1.length !== 5 || r2.length !== 5 || d2.length !== 5) {
    throw new Error('Five rows required in ephemerides');
  }
  var dr = new Array(5);
  var dd = new Array(5);
  r1.forEach(function (r, i) {
    dr[i] = r2[i] - r;
    dd[i] = d2[i] - d1[i];
  });
  return conj(t1, t5, dr, dd);
};

/**
 * Stellar computes a conjunction between a moving and non-moving object.
 *
 * Arguments and return values same as with Planetary, except the non-moving
 * object is r1, d1.  The ephemeris of the moving object is r2, d2.
 */
M.stellar = function (t1, t5, r1, d1, r2, d2) {
  // (t1, t5, r1, d1 float64, r2, d2 []float64)  (t, Δd float64, err error)
  if (r2.length !== 5 || d2.length !== 5) {
    throw new Error('Five rows required in ephemeris');
  }
  var dr = new Array(5);
  var dd = new Array(5);
  r2.forEach(function (r, i) {
    dr[i] = r - r1;
    dd[i] = d2[i] - d1;
  });
  return conj(t1, t5, dr, dd);
};

var conj = function conj(t1, t5, dr, dd) {
  // (t1, t5 float64, dr, dd []float64)  (t, Δd float64, err error)
  var l5 = new interp.Len5(t1, t5, dr);
  var t = l5.zero(true);
  l5 = new interp.Len5(t1, t5, dd);
  var Δd = l5.interpolateXStrict(t);
  return [t, Δd];
};