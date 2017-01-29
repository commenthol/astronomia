'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jupiter
 */
/**
 * Jupiter: Chapter 42, Ephemeris for Physical Observations of Jupiter.
 */

var base = require('./base');
var nutation = require('./nutation');
var planetposition = require('./planetposition');

var M = exports;

/**
 * Physical computes quantities for physical observations of Jupiter.
 *
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth
 * @param {planetposition.Planet} jupiter
 * @return {Array}
 *    {number} DS - Planetocentric declination of the Sun.
 *    {number} DE - Planetocentric declination of the Earth.
 *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} P -  Geocentric position angle of Jupiter's northern rotation pole.
 */
M.physical = function (jde, earth, jupiter) {
  // (jde float64, earth, jupiter *pp.V87Planet)  (DS, DE, ω1, ω2, P float64)
  // Step 1.0
  var d = jde - 2433282.5;
  var T1 = d / base.JulianCentury;
  var p = Math.PI / 180;
  var α0 = 268 * p + 0.1061 * p * T1;
  var δ0 = 64.5 * p - 0.0164 * p * T1;
  // Step 2.0
  var W1 = 17.71 * p + 877.90003539 * p * d;
  var W2 = 16.838 * p + 870.27003539 * p * d;
  // Step 3.0
  var pos = earth.position(jde);
  var _ref = [pos.lon, pos.lat, pos.range],
      l0 = _ref[0],
      b0 = _ref[1],
      R = _ref[2];

  var fk5 = planetposition.toFK5(l0, b0, jde);
  l0 = fk5.lon;
  b0 = fk5.lat;
  // Steps 4-7.

  var _base$sincos = base.sincos(l0),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sl0 = _base$sincos2[0],
      cl0 = _base$sincos2[1];

  var sb0 = Math.sin(b0);
  var Δ = 4.0; // surely better than 0.0

  var l = void 0,
      b = void 0,
      r = void 0,
      x = void 0,
      y = void 0,
      z = void 0;
  var f = function f() {
    var τ = base.lightTime(Δ);
    var pos = jupiter.position(jde - τ);
    l = pos.lon;
    b = pos.lat;
    r = pos.range;
    var fk5 = planetposition.toFK5(l, b, jde);
    l = fk5.lon;
    b = fk5.lat;

    var _base$sincos3 = base.sincos(b),
        _base$sincos4 = _slicedToArray(_base$sincos3, 2),
        sb = _base$sincos4[0],
        cb = _base$sincos4[1];

    var _base$sincos5 = base.sincos(l),
        _base$sincos6 = _slicedToArray(_base$sincos5, 2),
        sl = _base$sincos6[0],
        cl = _base$sincos6[1];
    // (42.2) p. 289


    x = r * cb * cl - R * cl0;
    y = r * cb * sl - R * sl0;
    z = r * sb - R * sb0;
    // (42.3) p. 289
    Δ = Math.sqrt(x * x + y * y + z * z);
  };
  f();
  f();

  // Step 8.0
  var ε0 = nutation.meanObliquity(jde);
  // Step 9.0

  var _base$sincos7 = base.sincos(ε0),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sε0 = _base$sincos8[0],
      cε0 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(l),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sl = _base$sincos10[0],
      cl = _base$sincos10[1];

  var _base$sincos11 = base.sincos(b),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sb = _base$sincos12[0],
      cb = _base$sincos12[1];

  var αs = Math.atan2(cε0 * sl - sε0 * sb / cb, cl);
  var δs = Math.asin(cε0 * sb + sε0 * cb * sl);
  // Step 10.0

  var _base$sincos13 = base.sincos(δs),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sδs = _base$sincos14[0],
      cδs = _base$sincos14[1];

  var _base$sincos15 = base.sincos(δ0),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sδ0 = _base$sincos16[0],
      cδ0 = _base$sincos16[1];

  var DS = Math.asin(-sδ0 * sδs - cδ0 * cδs * Math.cos(α0 - αs));
  // Step 11.0
  var u = y * cε0 - z * sε0;
  var v = y * sε0 + z * cε0;
  var α = Math.atan2(u, x);
  var δ = Math.atan(v / Math.hypot(x, u));

  var _base$sincos17 = base.sincos(δ),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sδ = _base$sincos18[0],
      cδ = _base$sincos18[1];

  var _base$sincos19 = base.sincos(α0 - α),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sα0α = _base$sincos20[0],
      cα0α = _base$sincos20[1];

  var ζ = Math.atan2(sδ0 * cδ * cα0α - sδ * cδ0, cδ * sα0α);
  // Step 12.0
  var DE = Math.asin(-sδ0 * sδ - cδ0 * cδ * Math.cos(α0 - α));
  // Step 13.0
  var ω1 = W1 - ζ - 5.07033 * p * Δ;
  var ω2 = W2 - ζ - 5.02626 * p * Δ;
  // Step 14.0
  var C = (2 * r * Δ + R * R - r * r - Δ * Δ) / (4 * r * Δ);
  if (Math.sin(l - l0) < 0) {
    C = -C;
  }
  ω1 = base.pmod(ω1 + C, 2 * Math.PI);
  ω2 = base.pmod(ω2 + C, 2 * Math.PI);
  // Step 15.0

  var _nutation$nutation = nutation.nutation(jde),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];

  var ε = ε0 + Δε;
  // Step 16.0

  var _base$sincos21 = base.sincos(ε),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sε = _base$sincos22[0],
      cε = _base$sincos22[1];

  var _base$sincos23 = base.sincos(α),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sα = _base$sincos24[0],
      cα = _base$sincos24[1];

  α += 0.005693 * p * (cα * cl0 * cε + sα * sl0) / cδ;
  δ += 0.005693 * p * (cl0 * cε * (sε / cε * cδ - sα * sδ) + cα * sδ * sl0);
  // Step 17.0
  var tδ = sδ / cδ;
  var Δα = (cε + sε * sα * tδ) * Δψ - cα * tδ * Δε;
  var Δδ = sε * cα * Δψ + sα * Δε;
  var αʹ = α + Δα;
  var δʹ = δ + Δδ;

  var _base$sincos25 = base.sincos(α0),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      sα0 = _base$sincos26[0],
      cα0 = _base$sincos26[1];

  var tδ0 = sδ0 / cδ0;
  var Δα0 = (cε + sε * sα0 * tδ0) * Δψ - cα0 * tδ0 * Δε;
  var Δδ0 = sε * cα0 * Δψ + sα0 * Δε;
  var α0ʹ = α0 + Δα0;
  var δ0ʹ = δ0 + Δδ0;
  // Step 18.0

  var _base$sincos27 = base.sincos(δʹ),
      _base$sincos28 = _slicedToArray(_base$sincos27, 2),
      sδʹ = _base$sincos28[0],
      cδʹ = _base$sincos28[1];

  var _base$sincos29 = base.sincos(δ0ʹ),
      _base$sincos30 = _slicedToArray(_base$sincos29, 2),
      sδ0ʹ = _base$sincos30[0],
      cδ0ʹ = _base$sincos30[1];

  var _base$sincos31 = base.sincos(α0ʹ - αʹ),
      _base$sincos32 = _slicedToArray(_base$sincos31, 2),
      sα0ʹαʹ = _base$sincos32[0],
      cα0ʹαʹ = _base$sincos32[1];
  // (42.4) p. 290


  var P = Math.atan2(cδ0ʹ * sα0ʹαʹ, sδ0ʹ * cδʹ - cδ0ʹ * sδʹ * cα0ʹαʹ);
  if (P < 0) {
    P += 2 * Math.PI;
  }
  return [DS, DE, ω1, ω2, P];
};

/**
 * Physical2 computes quantities for physical observations of Jupiter.
 *
 * Results are less accurate than with Physical().
 * All angular results in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @return {Array}
 *    {number} DS - Planetocentric declination of the Sun.
 *    {number} DE - Planetocentric declination of the Earth.
 *    {number} ω1 - Longitude of the System I central meridian of the illuminated disk,
 *                  as seen from Earth.
 *    {number} ω2 - Longitude of the System II central meridian of the illuminated disk,
 *                  as seen from Earth.
 */
M.physical2 = function (jde) {
  // (jde float64)  (DS, DE, ω1, ω2 float64)
  var d = jde - base.J2000;
  var p = Math.PI / 180;
  var V = 172.74 * p + 0.00111588 * p * d;
  var M = 357.529 * p + 0.9856003 * p * d;
  var sV = Math.sin(V);
  var N = 20.02 * p + 0.0830853 * p * d + 0.329 * p * sV;
  var J = 66.115 * p + 0.9025179 * p * d - 0.329 * p * sV;

  var _base$sincos33 = base.sincos(M),
      _base$sincos34 = _slicedToArray(_base$sincos33, 2),
      sM = _base$sincos34[0],
      cM = _base$sincos34[1];

  var _base$sincos35 = base.sincos(N),
      _base$sincos36 = _slicedToArray(_base$sincos35, 2),
      sN = _base$sincos36[0],
      cN = _base$sincos36[1];

  var _base$sincos37 = base.sincos(2 * M),
      _base$sincos38 = _slicedToArray(_base$sincos37, 2),
      s2M = _base$sincos38[0],
      c2M = _base$sincos38[1];

  var _base$sincos39 = base.sincos(2 * N),
      _base$sincos40 = _slicedToArray(_base$sincos39, 2),
      s2N = _base$sincos40[0],
      c2N = _base$sincos40[1];

  var A = 1.915 * p * sM + 0.02 * p * s2M;
  var B = 5.555 * p * sN + 0.168 * p * s2N;
  var K = J + A - B;
  var R = 1.00014 - 0.01671 * cM - 0.00014 * c2M;
  var r = 5.20872 - 0.25208 * cN - 0.00611 * c2N;

  var _base$sincos41 = base.sincos(K),
      _base$sincos42 = _slicedToArray(_base$sincos41, 2),
      sK = _base$sincos42[0],
      cK = _base$sincos42[1];

  var Δ = Math.sqrt(r * r + R * R - 2 * r * R * cK);
  var ψ = Math.asin(R / Δ * sK);
  var dd = d - Δ / 173;
  var ω1 = 210.98 * p + 877.8169088 * p * dd + ψ - B;
  var ω2 = 187.23 * p + 870.1869088 * p * dd + ψ - B;
  var C = Math.sin(ψ / 2);
  C *= C;
  if (sK > 0) {
    C = -C;
  }
  ω1 = base.pmod(ω1 + C, 2 * Math.PI);
  ω2 = base.pmod(ω2 + C, 2 * Math.PI);
  var λ = 34.35 * p + 0.083091 * p * d + 0.329 * p * sV + B;
  var DS = 3.12 * p * Math.sin(λ + 42.8 * p);
  var DE = DS - 2.22 * p * Math.sin(ψ) * Math.cos(λ + 22 * p) - 1.3 * p * (r - Δ) / Δ * Math.sin(λ - 100.5 * p);
  return [DS, DE, ω1, ω2];
};