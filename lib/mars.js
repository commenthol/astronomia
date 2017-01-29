'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module mars
 */
/**
 * Mars: Chapter 42, Ephemeris for Physical Observations of Mars.
 */

var base = require('./base');
var coord = require('./coord');
var illum = require('./illum');
var nutation = require('./nutation');
var planetposition = require('./planetposition');

var M = exports;

/**
 * Physical computes quantities for physical observations of Mars.
 *
 * Results:
 *  DE  planetocentric declination of the Earth.
 *  DS  planetocentric declination of the Sun.
 *  ω   Areographic longitude of the central meridian, as seen from Earth.
 *  P   Geocentric position angle of Mars' northern rotation pole.
 *  Q   Position angle of greatest defect of illumination.
 *  d   Apparent diameter of Mars.
 *  k   Illuminated fraction of the disk.
 *  q   Greatest defect of illumination.
 *
 * All angular results (all results except k) are in radians.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth
 * @param {planetposition.Planet} mars
 */
M.physical = function (jde, earth, mars) {
  // (jde float64, earth, mars *pp.V87Planet)  (DE, DS, ω, P, Q, d, k, q float64)
  // Step 1.0
  var T = base.J2000Century(jde);
  var p = Math.PI / 180;
  // (42.1) p. 288
  var λ0 = 352.9065 * p + 1.1733 * p * T;
  var β0 = 63.2818 * p - 0.00394 * p * T;
  // Step 2.0
  var earthPos = earth.position(jde);
  var R = earthPos.range;
  var fk5 = planetposition.toFK5(earthPos.lon, earthPos.lat, jde);
  var _ref = [fk5.lon, fk5.lat],
      l0 = _ref[0],
      b0 = _ref[1];
  // Steps 3, 4.0

  var _base$sincos = base.sincos(l0),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sl0 = _base$sincos2[0],
      cl0 = _base$sincos2[1];

  var sb0 = Math.sin(b0);
  var Δ = 0.5; // surely better than 0.0
  var τ = base.lightTime(Δ);
  var l, b, r, x, y, z;
  var f = function f() {
    var marsPos = mars.position(jde - τ);
    r = marsPos.range;
    var fk5 = planetposition.toFK5(marsPos.lon, marsPos.lat, jde);
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
    τ = base.lightTime(Δ);
  };
  f();
  f();
  // Step 5.0
  var λ = Math.atan2(y, x);
  var β = Math.atan(z / Math.hypot(x, y));
  // Step 6.0

  var _base$sincos7 = base.sincos(β0),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sβ0 = _base$sincos8[0],
      cβ0 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(β),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sβ = _base$sincos10[0],
      cβ = _base$sincos10[1];

  var DE = Math.asin(-sβ0 * sβ - cβ0 * cβ * Math.cos(λ0 - λ));
  // Step 7.0
  var N = 49.5581 * p + 0.7721 * p * T;
  var lʹ = l - 0.00697 * p / r;
  var bʹ = b - 0.000225 * p * Math.cos(l - N) / r;
  // Step 8.0

  var _base$sincos11 = base.sincos(bʹ),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sbʹ = _base$sincos12[0],
      cbʹ = _base$sincos12[1];

  var DS = Math.asin(-sβ0 * sbʹ - cβ0 * cbʹ * Math.cos(λ0 - lʹ));
  // Step 9.0
  var W = 11.504 * p + 350.89200025 * p * (jde - τ - 2433282.5);
  // Step 10.0
  var ε0 = nutation.meanObliquity(jde);

  var _base$sincos13 = base.sincos(ε0),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sε0 = _base$sincos14[0],
      cε0 = _base$sincos14[1];

  var eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε0);
  var _ref2 = [eq.ra, eq.dec],
      α0 = _ref2[0],
      δ0 = _ref2[1];
  // Step 11.0

  var u = y * cε0 - z * sε0;
  var v = y * sε0 + z * cε0;
  var α = Math.atan2(u, x);
  var δ = Math.atan(v / Math.hypot(x, u));

  var _base$sincos15 = base.sincos(δ),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sδ = _base$sincos16[0],
      cδ = _base$sincos16[1];

  var _base$sincos17 = base.sincos(δ0),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sδ0 = _base$sincos18[0],
      cδ0 = _base$sincos18[1];

  var _base$sincos19 = base.sincos(α0 - α),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sα0α = _base$sincos20[0],
      cα0α = _base$sincos20[1];

  var ζ = Math.atan2(sδ0 * cδ * cα0α - sδ * cδ0, cδ * sα0α);
  // Step 12.0
  var ω = base.pmod(W - ζ, 2 * Math.PI);
  // Step 13.0

  var _nutation$nutation = nutation.nutation(jde),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];
  // Step 14.0


  var _base$sincos21 = base.sincos(l0 - λ),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sl0λ = _base$sincos22[0],
      cl0λ = _base$sincos22[1];

  λ += 0.005693 * p * cl0λ / cβ;
  β += 0.005693 * p * sl0λ * sβ;
  // Step 15.0
  λ0 += Δψ;
  λ += Δψ;
  var ε = ε0 + Δε;
  // Step 16.0

  var _base$sincos23 = base.sincos(ε),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sε = _base$sincos24[0],
      cε = _base$sincos24[1];

  eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε);
  var _ref3 = [eq.ra, eq.dec],
      α0ʹ = _ref3[0],
      δ0ʹ = _ref3[1];

  eq = new coord.Ecliptic(λ, β).toEquatorial(ε);
  var _ref4 = [eq.ra, eq.dec],
      αʹ = _ref4[0],
      δʹ = _ref4[1];
  // Step 17.0

  var _base$sincos25 = base.sincos(δ0ʹ),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      sδ0ʹ = _base$sincos26[0],
      cδ0ʹ = _base$sincos26[1];

  var _base$sincos27 = base.sincos(δʹ),
      _base$sincos28 = _slicedToArray(_base$sincos27, 2),
      sδʹ = _base$sincos28[0],
      cδʹ = _base$sincos28[1];

  var _base$sincos29 = base.sincos(α0ʹ - αʹ),
      _base$sincos30 = _slicedToArray(_base$sincos29, 2),
      sα0ʹαʹ = _base$sincos30[0],
      cα0ʹαʹ = _base$sincos30[1];
  // (42.4) p. 290


  var P = Math.atan2(cδ0ʹ * sα0ʹαʹ, sδ0ʹ * cδʹ - cδ0ʹ * sδʹ * cα0ʹαʹ);
  if (P < 0) {
    P += 2 * Math.PI;
  }
  // Step 18.0
  var s = l0 + Math.PI;

  var _base$sincos31 = base.sincos(s),
      _base$sincos32 = _slicedToArray(_base$sincos31, 2),
      ss = _base$sincos32[0],
      cs = _base$sincos32[1];

  var αs = Math.atan2(cε * ss, cs);
  var δs = Math.asin(sε * ss);

  var _base$sincos33 = base.sincos(δs),
      _base$sincos34 = _slicedToArray(_base$sincos33, 2),
      sδs = _base$sincos34[0],
      cδs = _base$sincos34[1];

  var _base$sincos35 = base.sincos(αs - α),
      _base$sincos36 = _slicedToArray(_base$sincos35, 2),
      sαsα = _base$sincos36[0],
      cαsα = _base$sincos36[1];

  var χ = Math.atan2(cδs * sαsα, sδs * cδ - cδs * sδ * cαsα);
  var Q = χ + Math.PI;
  // Step 19.0
  var d = 9.36 / 60 / 60 * Math.PI / 180 / Δ;
  var k = illum.fraction(r, Δ, R);
  var q = (1 - k) * d;
  return [DE, DS, ω, P, Q, d, k, q];
};