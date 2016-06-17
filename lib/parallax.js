'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Parallax: Chapter 40, Correction for Parallax.
 */

var base = require('./base');
var globe = require('./globe');
var sidereal = require('./sidereal');
var sexa = require('./sexagesimal');

var M = exports;

/**
 * Horizontal returns equatorial horizontal parallax of a body.
 *
 * Argument Δ is distance in AU.
 *
 * Result is parallax in radians.
 */
M.horizontal = function (Δ) {
  // (Δ float64)  (π float64)
  return 8.794 / 60 / 60 * Math.PI / 180 / Δ; // (40.1) p. 279
};

/**
 * Topocentric returns topocentric positions including parallax.
 *
 * Arguments α, δ are geocentric right ascension and declination in radians.
 * Δ is distance to the observed object in AU.  ρsφ_, ρcφ_ are parallax
 * constants (see package globe.) L is geographic longitude of the observer,
 * jde is time of observation.
 *
 * Results are observed topocentric ra and dec in radians.
 */
M.topocentric = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) {
  // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (α_, δ_ float64)
  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - L - α, 2 * Math.PI);
  var sπ = Math.sin(π);

  var _base$sincos = base.sincos(H);

  var _base$sincos2 = _slicedToArray(_base$sincos, 2);

  var sH = _base$sincos2[0];
  var cH = _base$sincos2[1];

  var _base$sincos3 = base.sincos(δ);

  var _base$sincos4 = _slicedToArray(_base$sincos3, 2);

  var sδ = _base$sincos4[0];
  var cδ = _base$sincos4[1];

  var Δα = Math.atan2(-ρcφ_ * sπ * sH, cδ - ρcφ_ * sπ * cH); // (40.2) p. 279
  var α_ = α + Δα;
  var δ_ = Math.atan2((sδ - ρsφ_ * sπ) * Math.cos(Δα), cδ - ρcφ_ * sπ * cH); // (40.3) p. 279
  return [α_, δ_];
};

/**
 * Topocentric2 returns topocentric corrections including parallax.
 *
 * This function implements the "non-rigorous" method descripted in the text.
 *
 * Note that results are corrections, not corrected coordinates.
 */
M.topocentric2 = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) {
  // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (Δα, Δδ float64)
  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - L - α, 2 * Math.PI);

  var _base$sincos5 = base.sincos(H);

  var _base$sincos6 = _slicedToArray(_base$sincos5, 2);

  var sH = _base$sincos6[0];
  var cH = _base$sincos6[1];

  var _base$sincos7 = base.sincos(δ);

  var _base$sincos8 = _slicedToArray(_base$sincos7, 2);

  var sδ = _base$sincos8[0];
  var cδ = _base$sincos8[1];

  var Δα = -π * ρcφ_ * sH / cδ; // (40.4) p. 280
  var Δδ = -π * (ρsφ_ * cδ - ρcφ_ * cH * sδ); // (40.5) p. 280
  return [Δα, Δδ];
};

/**
 * Topocentric3 returns topocentric hour angle and declination including parallax.
 *
 * This function implements the "alternative" method described in the text.
 * The method should be similarly rigorous to that of Topocentric() and results
 * should be virtually consistent.
 */
M.topocentric3 = function (α, δ, Δ, ρsφ_, ρcφ_, L, jde) {
  // (α, δ, Δ, ρsφ_, ρcφ_, L, jde float64)  (H_, δ_ float64)
  var π = M.horizontal(Δ);
  var θ0 = new sexa.Time(sidereal.apparent(jde)).rad();
  var H = base.pmod(θ0 - L - α, 2 * Math.PI);
  var sπ = Math.sin(π);

  var _base$sincos9 = base.sincos(H);

  var _base$sincos10 = _slicedToArray(_base$sincos9, 2);

  var sH = _base$sincos10[0];
  var cH = _base$sincos10[1];

  var _base$sincos11 = base.sincos(δ);

  var _base$sincos12 = _slicedToArray(_base$sincos11, 2);

  var sδ = _base$sincos12[0];
  var cδ = _base$sincos12[1];

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
 * Arguments λ, β are geocentric ecliptical longitude and latitude of a body,
 * s is its geocentric semidiameter. φ, h are the observer's latitude and
 * and height above the ellipsoid in meters.  ε is the obliquity of the
 * ecliptic, θ is local sidereal time, π is equatorial horizontal parallax
 * of the body (see Horizonal()).
 *
 * All angular parameters and results are in radians.
 *
 * Results are observed topocentric coordinates and semidiameter.
 */
M.topocentricEcliptical = function (λ, β, s, φ, h, ε, θ, π) {
  var _globe$Earth76$parall = globe.Earth76.parallaxConstants(φ, h);

  var _globe$Earth76$parall2 = _slicedToArray(_globe$Earth76$parall, 2);

  var S = _globe$Earth76$parall2[0];
  var C = _globe$Earth76$parall2[1];

  var _base$sincos13 = base.sincos(λ);

  var _base$sincos14 = _slicedToArray(_base$sincos13, 2);

  var sλ = _base$sincos14[0];
  var cλ = _base$sincos14[1];

  var _base$sincos15 = base.sincos(β);

  var _base$sincos16 = _slicedToArray(_base$sincos15, 2);

  var sβ = _base$sincos16[0];
  var cβ = _base$sincos16[1];

  var _base$sincos17 = base.sincos(ε);

  var _base$sincos18 = _slicedToArray(_base$sincos17, 2);

  var sε = _base$sincos18[0];
  var cε = _base$sincos18[1];

  var _base$sincos19 = base.sincos(θ);

  var _base$sincos20 = _slicedToArray(_base$sincos19, 2);

  var sθ = _base$sincos20[0];
  var cθ = _base$sincos20[1];

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