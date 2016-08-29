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
  var l0 = fk5.lon;
  var b0 = fk5.lat;
  // Steps 3, 4.0

  var _base$sincos = base.sincos(l0);

  var _base$sincos2 = _slicedToArray(_base$sincos, 2);

  var sl0 = _base$sincos2[0];
  var cl0 = _base$sincos2[1];

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

    var _base$sincos3 = base.sincos(b);

    var _base$sincos4 = _slicedToArray(_base$sincos3, 2);

    var sb = _base$sincos4[0];
    var cb = _base$sincos4[1];

    var _base$sincos5 = base.sincos(l);

    var _base$sincos6 = _slicedToArray(_base$sincos5, 2);

    var sl = _base$sincos6[0];
    var cl = _base$sincos6[1];
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

  var _base$sincos7 = base.sincos(β0);

  var _base$sincos8 = _slicedToArray(_base$sincos7, 2);

  var sβ0 = _base$sincos8[0];
  var cβ0 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(β);

  var _base$sincos10 = _slicedToArray(_base$sincos9, 2);

  var sβ = _base$sincos10[0];
  var cβ = _base$sincos10[1];

  var DE = Math.asin(-sβ0 * sβ - cβ0 * cβ * Math.cos(λ0 - λ));
  // Step 7.0
  var N = 49.5581 * p + 0.7721 * p * T;
  var lʹ = l - 0.00697 * p / r;
  var bʹ = b - 0.000225 * p * Math.cos(l - N) / r;
  // Step 8.0

  var _base$sincos11 = base.sincos(bʹ);

  var _base$sincos12 = _slicedToArray(_base$sincos11, 2);

  var sbʹ = _base$sincos12[0];
  var cbʹ = _base$sincos12[1];

  var DS = Math.asin(-sβ0 * sbʹ - cβ0 * cbʹ * Math.cos(λ0 - lʹ));
  // Step 9.0
  var W = 11.504 * p + 350.89200025 * p * (jde - τ - 2433282.5);
  // Step 10.0
  var ε0 = nutation.meanObliquity(jde);

  var _base$sincos13 = base.sincos(ε0);

  var _base$sincos14 = _slicedToArray(_base$sincos13, 2);

  var sε0 = _base$sincos14[0];
  var cε0 = _base$sincos14[1];

  var eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε0);
  var α0 = eq.ra;
  var δ0 = eq.dec;
  // Step 11.0

  var u = y * cε0 - z * sε0;
  var v = y * sε0 + z * cε0;
  var α = Math.atan2(u, x);
  var δ = Math.atan(v / Math.hypot(x, u));

  var _base$sincos15 = base.sincos(δ);

  var _base$sincos16 = _slicedToArray(_base$sincos15, 2);

  var sδ = _base$sincos16[0];
  var cδ = _base$sincos16[1];

  var _base$sincos17 = base.sincos(δ0);

  var _base$sincos18 = _slicedToArray(_base$sincos17, 2);

  var sδ0 = _base$sincos18[0];
  var cδ0 = _base$sincos18[1];

  var _base$sincos19 = base.sincos(α0 - α);

  var _base$sincos20 = _slicedToArray(_base$sincos19, 2);

  var sα0α = _base$sincos20[0];
  var cα0α = _base$sincos20[1];

  var ζ = Math.atan2(sδ0 * cδ * cα0α - sδ * cδ0, cδ * sα0α);
  // Step 12.0
  var ω = base.pmod(W - ζ, 2 * Math.PI);
  // Step 13.0

  var _nutation$nutation = nutation.nutation(jde);

  var _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2);

  var Δψ = _nutation$nutation2[0];
  var Δε = _nutation$nutation2[1];
  // Step 14.0

  var _base$sincos21 = base.sincos(l0 - λ);

  var _base$sincos22 = _slicedToArray(_base$sincos21, 2);

  var sl0λ = _base$sincos22[0];
  var cl0λ = _base$sincos22[1];

  λ += 0.005693 * p * cl0λ / cβ;
  β += 0.005693 * p * sl0λ * sβ;
  // Step 15.0
  λ0 += Δψ;
  λ += Δψ;
  var ε = ε0 + Δε;
  // Step 16.0

  var _base$sincos23 = base.sincos(ε);

  var _base$sincos24 = _slicedToArray(_base$sincos23, 2);

  var sε = _base$sincos24[0];
  var cε = _base$sincos24[1];

  eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε);
  var α0ʹ = eq.ra;
  var δ0ʹ = eq.dec;

  eq = new coord.Ecliptic(λ, β).toEquatorial(ε);
  var αʹ = eq.ra;
  var δʹ = eq.dec;
  // Step 17.0

  var _base$sincos25 = base.sincos(δ0ʹ);

  var _base$sincos26 = _slicedToArray(_base$sincos25, 2);

  var sδ0ʹ = _base$sincos26[0];
  var cδ0ʹ = _base$sincos26[1];

  var _base$sincos27 = base.sincos(δʹ);

  var _base$sincos28 = _slicedToArray(_base$sincos27, 2);

  var sδʹ = _base$sincos28[0];
  var cδʹ = _base$sincos28[1];

  var _base$sincos29 = base.sincos(α0ʹ - αʹ);

  var _base$sincos30 = _slicedToArray(_base$sincos29, 2);

  var sα0ʹαʹ = _base$sincos30[0];
  var cα0ʹαʹ = _base$sincos30[1];
  // (42.4) p. 290

  var P = Math.atan2(cδ0ʹ * sα0ʹαʹ, sδ0ʹ * cδʹ - cδ0ʹ * sδʹ * cα0ʹαʹ);
  if (P < 0) {
    P += 2 * Math.PI;
  }
  // Step 18.0
  var s = l0 + Math.PI;

  var _base$sincos31 = base.sincos(s);

  var _base$sincos32 = _slicedToArray(_base$sincos31, 2);

  var ss = _base$sincos32[0];
  var cs = _base$sincos32[1];

  var αs = Math.atan2(cε * ss, cs);
  var δs = Math.asin(sε * ss);

  var _base$sincos33 = base.sincos(δs);

  var _base$sincos34 = _slicedToArray(_base$sincos33, 2);

  var sδs = _base$sincos34[0];
  var cδs = _base$sincos34[1];

  var _base$sincos35 = base.sincos(αs - α);

  var _base$sincos36 = _slicedToArray(_base$sincos35, 2);

  var sαsα = _base$sincos36[0];
  var cαsα = _base$sincos36[1];

  var χ = Math.atan2(cδs * sαsα, sδs * cδ - cδs * sδ * cαsα);
  var Q = χ + Math.PI;
  // Step 19.0
  var d = 9.36 / 60 / 60 * Math.PI / 180 / Δ;
  var k = illum.fraction(r, Δ, R);
  var q = (1 - k) * d;
  return [DE, DS, ω, P, Q, d, k, q];
};