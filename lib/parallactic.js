'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallactic
 */
/**
 * Parallactic: Chapter 14, The Parallactic Angle, and three other Topics.
 */

var base = require('./base');

var M = exports;

/**
 * ParallacticAngle returns parallactic angle of a celestial object.
 *
 *  φ is geographic latitude of observer.
 *  δ is declination of observed object.
 *  H is hour angle of observed object.
 *
 * All angles including result are in radians.
 */
M.parallacticAngle = function (φ, δ, H) {
  // (φ, δ, H float64)  float64
  var _base$sincos = base.sincos(δ),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sδ = _base$sincos2[0],
      cδ = _base$sincos2[1];

  var _base$sincos3 = base.sincos(H),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sH = _base$sincos4[0],
      cH = _base$sincos4[1];

  return Math.atan2(sH, Math.tan(φ) * cδ - sδ * cH); // (14.1) p. 98
};

/**
 * ParallacticAngleOnHorizon is a special case of ParallacticAngle.
 *
 * The hour angle is not needed as an input and the math inside simplifies.
 */
M.parallacticAngleOnHorizon = function (φ, δ) {
  // (φ, δ float64)  float64
  return Math.acos(Math.sin(φ) / Math.cos(δ));
};

/**
 * EclipticAtHorizon computes how the plane of the ecliptic intersects
 * the horizon at a given local sidereal time as observed from a given
 * geographic latitude.
 *
 *  ε is obliquity of the ecliptic.
 *  φ is geographic latitude of observer.
 *  θ is local sidereal time expressed as an hour angle.
 *
 *  λ1 and λ2 are ecliptic longitudes where the ecliptic intersects the horizon.
 *  I is the angle at which the ecliptic intersects the horizon.
 *
 * All angles, arguments and results, are in radians.
 */
M.eclipticAtHorizon = function (ε, φ, θ) {
  // (ε, φ, θ float64)  (λ1, λ2, I float64)
  var _base$sincos5 = base.sincos(ε),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sε = _base$sincos6[0],
      cε = _base$sincos6[1];

  var _base$sincos7 = base.sincos(φ),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sφ = _base$sincos8[0],
      cφ = _base$sincos8[1];

  var _base$sincos9 = base.sincos(θ),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sθ = _base$sincos10[0],
      cθ = _base$sincos10[1];

  var λ = Math.atan2(-cθ, sε * (sφ / cφ) + cε * sθ); // (14.2) p. 99
  if (λ < 0) {
    λ += Math.PI;
  }
  return [λ, λ + Math.PI, Math.acos(cε * sφ - sε * cφ * sθ)]; // (14.3) p. 99
};

/**
 * EclipticAtEquator computes the angle between the ecliptic and the parallels
 * of ecliptic latitude at a given ecliptic longitude.
 *
 * (The function name EclipticAtEquator is for consistency with the Meeus text,
 * and works if you consider the equator a nominal parallel of latitude.)
 *
 *  λ is ecliptic longitude.
 *  ε is obliquity of the ecliptic.
 *
 * All angles in radians.
 */
M.eclipticAtEquator = function (λ, ε) {
  // (λ, ε float64)  float64
  return Math.atan(-Math.cos(λ) * Math.tan(ε));
};

/**
 * DiurnalPathAtHorizon computes the angle of the path a celestial object
 * relative to the horizon at the time of its rising or setting.
 *
 *  δ is declination of the object.
 *  φ is geographic latitude of observer.
 *
 * All angles in radians.
 */
M.diurnalPathAtHorizon = function (δ, φ) {
  // (δ, φ float64)  (J float64)
  var tφ = Math.tan(φ);
  var b = Math.tan(δ) * tφ;
  var c = Math.sqrt(1 - b * b);
  return Math.atan(c * Math.cos(δ) / tφ);
};