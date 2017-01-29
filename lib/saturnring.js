'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnring
 */
/**
 * Saturnrings: Chapter 45, The Ring of Saturn
 */

var base = require('./base');
var coord = require('./coord');
var nutation = require('./nutation');
var planetposition = require('./planetposition');

var M = exports;

/**
 * Ring computes quantities of the ring of Saturn.
 *
 *  B  Saturnicentric latitude of the Earth referred to the plane of the ring.
 *  Bʹ  Saturnicentric latitude of the Sun referred to the plane of the ring.
 *  ΔU  Difference between Saturnicentric longitudes of the Sun and the Earth.
 *  P  Geometric position angle of the northern semiminor axis of the ring.
 *  aEdge  Major axis of the out edge of the outer ring.
 *  bEdge  Minor axis of the out edge of the outer ring.
 *
 * All results in radians.
 */
M.ring = function (jde, earth, saturn) {
  // (jde float64, earth, saturn *pp.V87Planet)  (B, Bʹ, ΔU, P, aEdge, bEdge float64)
  var _cl = cl(jde, earth, saturn),
      _cl2 = _slicedToArray(_cl, 2),
      f1 = _cl2[0],
      f2 = _cl2[1];

  var _f = f1(),
      _f2 = _slicedToArray(_f, 2),
      ΔU = _f2[0],
      B = _f2[1];

  var _f3 = f2(),
      _f4 = _slicedToArray(_f3, 4),
      Bʹ = _f4[0],
      P = _f4[1],
      aEdge = _f4[2],
      bEdge = _f4[3];

  return [B, Bʹ, ΔU, P, aEdge, bEdge];
};

/**
 * UB computes quantities required by illum.Saturn().
 *
 * Same as ΔU and B returned by Ring().  Results in radians.
 */
M.ub = function (jde, earth, saturn) {
  // (jde float64, earth, saturn *pp.V87Planet)  (ΔU, B float64)
  var _cl3 = cl(jde, earth, saturn),
      _cl4 = _slicedToArray(_cl3, 2),
      f1 = _cl4[0],
      f2 = _cl4[1]; // eslint-disable-line no-unused-vars


  return f1();
};

/**
 * cl splits the work into two closures.
 */
function cl(jde, earth, saturn) {
  // (jde float64, earth, saturn *pp.V87Planet)  (f1 func() (ΔU, B float64),
  // f2 func() (Bʹ, P, aEdge, bEdge float64))
  var p = Math.PI / 180;
  var i, Ω;
  var l0, b0, R;
  var Δ = 9.0;
  var λ, β;
  var si, ci, sβ, cβ, sB;
  var sbʹ, cbʹ, slʹΩ, clʹΩ;
  var f1 = function f1() {
    // (ΔU, B float64)
    // (45.1), p. 318
    var T = base.J2000Century(jde);
    i = base.horner(T, 28.075216 * p, -0.012998 * p, 0.000004 * p);
    Ω = base.horner(T, 169.50847 * p, 1.394681 * p, 0.000412 * p);
    // Step 2.0
    var earthPos = earth.position(jde);
    R = earthPos.range;
    var fk5 = planetposition.toFK5(earthPos.lon, earthPos.lat, jde);
    l0 = fk5.lon;
    b0 = fk5.lat;

    var _base$sincos = base.sincos(l0),
        _base$sincos2 = _slicedToArray(_base$sincos, 2),
        sl0 = _base$sincos2[0],
        cl0 = _base$sincos2[1];

    var sb0 = Math.sin(b0);
    // Steps 3, 4.0
    var l, b, r, x, y, z;
    var f = function f() {
      var τ = base.lightTime(Δ);
      var saturnPos = saturn.position(jde - τ);
      r = saturnPos.range;
      var fk5 = planetposition.toFK5(saturnPos.lon, saturnPos.lat, jde);
      l = fk5.lon;
      b = fk5.lat;

      var _base$sincos3 = base.sincos(l),
          _base$sincos4 = _slicedToArray(_base$sincos3, 2),
          sl = _base$sincos4[0],
          cl = _base$sincos4[1];

      var _base$sincos5 = base.sincos(b),
          _base$sincos6 = _slicedToArray(_base$sincos5, 2),
          sb = _base$sincos6[0],
          cb = _base$sincos6[1];

      x = r * cb * cl - R * cl0;
      y = r * cb * sl - R * sl0;
      z = r * sb - R * sb0;
      Δ = Math.sqrt(x * x + y * y + z * z);
    };
    f();
    f();
    // Step 5.0
    λ = Math.atan2(y, x);
    β = Math.atan(z / Math.hypot(x, y));
    // First part of step 6.0
    si = Math.sin(i);
    ci = Math.cos(i);
    sβ = Math.sin(β);
    cβ = Math.cos(β);
    sB = si * cβ * Math.sin(λ - Ω) - ci * sβ;
    var B = Math.asin(sB); // return value
    // Step 7.0
    var N = 113.6655 * p + 0.8771 * p * T;
    var lʹ = l - 0.01759 * p / r;
    var bʹ = b - 0.000764 * p * Math.cos(l - N) / r;
    // Setup for steps 8, 9.0
    sbʹ = Math.sin(bʹ);
    cbʹ = Math.cos(bʹ);
    slʹΩ = Math.sin(lʹ - Ω);
    clʹΩ = Math.cos(lʹ - Ω);
    // Step 9.0

    var _base$sincos7 = base.sincos(λ - Ω),
        _base$sincos8 = _slicedToArray(_base$sincos7, 2),
        sλΩ = _base$sincos8[0],
        cλΩ = _base$sincos8[1];

    var U1 = Math.atan2(si * sbʹ + ci * cbʹ * slʹΩ, cbʹ * clʹΩ);
    var U2 = Math.atan2(si * sβ + ci * cβ * sλΩ, cβ * cλΩ);
    var ΔU = Math.abs(U1 - U2); // return value
    return [ΔU, B];
  };
  var f2 = function f2() {
    // (Bʹ, P, aEdge, bEdge) {
    // Remainder of step 6.0
    var aEdge = 375.35 / 3600 * p / Δ; // return value
    var bEdge = aEdge * Math.abs(sB); // return value
    // Step 8.0
    var sBʹ = si * cbʹ * slʹΩ - ci * sbʹ;
    var Bʹ = Math.asin(sBʹ); // return value
    // Step 10.0

    var _nutation$nutation = nutation.nutation(jde),
        _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
        Δψ = _nutation$nutation2[0],
        Δε = _nutation$nutation2[1];

    var ε = nutation.meanObliquity(jde) + Δε;
    // Step 11.0
    var λ0 = Ω - Math.PI / 2;
    var β0 = Math.PI / 2 - i;
    // Step 12.0

    var _base$sincos9 = base.sincos(l0 - λ),
        _base$sincos10 = _slicedToArray(_base$sincos9, 2),
        sl0λ = _base$sincos10[0],
        cl0λ = _base$sincos10[1];

    λ += 0.005693 * p * cl0λ / cβ;
    β += 0.005693 * p * sl0λ * sβ;
    // Step 13.0
    λ0 += Δψ;
    λ += Δψ;
    // Step 14.0
    var eq = new coord.Ecliptic(λ0, β0).toEquatorial(ε);
    var _ref = [eq.ra, eq.dec],
        α0 = _ref[0],
        δ0 = _ref[1];

    eq = new coord.Ecliptic(λ, β).toEquatorial(ε);
    var _ref2 = [eq.ra, eq.dec],
        α = _ref2[0],
        δ = _ref2[1];
    // Step 15.0

    var _base$sincos11 = base.sincos(δ0),
        _base$sincos12 = _slicedToArray(_base$sincos11, 2),
        sδ0 = _base$sincos12[0],
        cδ0 = _base$sincos12[1];

    var _base$sincos13 = base.sincos(δ),
        _base$sincos14 = _slicedToArray(_base$sincos13, 2),
        sδ = _base$sincos14[0],
        cδ = _base$sincos14[1];

    var _base$sincos15 = base.sincos(α0 - α),
        _base$sincos16 = _slicedToArray(_base$sincos15, 2),
        sα0α = _base$sincos16[0],
        cα0α = _base$sincos16[1];

    var P = Math.atan2(cδ0 * sα0α, sδ0 * cδ - cδ0 * sδ * cα0α); // return value
    return [Bʹ, P, aEdge, bEdge];
  };
  return [f1, f2];
}