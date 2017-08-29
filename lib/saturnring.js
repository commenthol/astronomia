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
 *  gDU  Difference between Saturnicentric longitudes of the Sun and the Earth.
 *  P  Geometric position angle of the northern semiminor axis of the ring.
 *  aEdge  Major axis of the out edge of the outer ring.
 *  bEdge  Minor axis of the out edge of the outer ring.
 *
 * All results in radians.
 */
M.ring = function (jde, earth, saturn) {
  // (jde float64, earth, saturn *pp.V87Planet)  (B, Bʹ, gDU, P, aEdge, bEdge float64)
  var _cl = cl(jde, earth, saturn),
      _cl2 = _slicedToArray(_cl, 2),
      f1 = _cl2[0],
      f2 = _cl2[1];

  var _f = f1(),
      _f2 = _slicedToArray(_f, 2),
      gDU = _f2[0],
      B = _f2[1];

  var _f3 = f2(),
      _f4 = _slicedToArray(_f3, 4),
      Bʹ = _f4[0],
      P = _f4[1],
      aEdge = _f4[2],
      bEdge = _f4[3];

  return [B, Bʹ, gDU, P, aEdge, bEdge];
};

/**
 * UB computes quantities required by illum.Saturn().
 *
 * Same as gDU and B returned by Ring().  Results in radians.
 */
M.ub = function (jde, earth, saturn) {
  // (jde float64, earth, saturn *pp.V87Planet)  (gDU, B float64)
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
  // (jde float64, earth, saturn *pp.V87Planet)  (f1 func() (gDU, B float64),
  // f2 func() (Bʹ, P, aEdge, bEdge float64))
  var p = Math.PI / 180;
  var i, gw;
  var l0, b0, R;
  var gD = 9.0;
  var gl, gb;
  var si, ci, sgb, cgb, sB;
  var sbʹ, cbʹ, slʹgw, clʹgw;
  var f1 = function f1() {
    // (gDU, B float64)
    // (45.1), p. 318
    var T = base.J2000Century(jde);
    i = base.horner(T, 28.075216 * p, -0.012998 * p, 0.000004 * p);
    gw = base.horner(T, 169.50847 * p, 1.394681 * p, 0.000412 * p);
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
      var gt = base.lightTime(gD);
      var saturnPos = saturn.position(jde - gt);
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
      gD = Math.sqrt(x * x + y * y + z * z);
    };
    f();
    f();
    // Step 5.0
    gl = Math.atan2(y, x);
    gb = Math.atan(z / Math.hypot(x, y));
    // First part of step 6.0
    si = Math.sin(i);
    ci = Math.cos(i);
    sgb = Math.sin(gb);
    cgb = Math.cos(gb);
    sB = si * cgb * Math.sin(gl - gw) - ci * sgb;
    var B = Math.asin(sB); // return value
    // Step 7.0
    var N = 113.6655 * p + 0.8771 * p * T;
    var lʹ = l - 0.01759 * p / r;
    var bʹ = b - 0.000764 * p * Math.cos(l - N) / r;
    // Setup for steps 8, 9.0
    sbʹ = Math.sin(bʹ);
    cbʹ = Math.cos(bʹ);
    slʹgw = Math.sin(lʹ - gw);
    clʹgw = Math.cos(lʹ - gw);
    // Step 9.0

    var _base$sincos7 = base.sincos(gl - gw),
        _base$sincos8 = _slicedToArray(_base$sincos7, 2),
        sglgw = _base$sincos8[0],
        cglgw = _base$sincos8[1];

    var U1 = Math.atan2(si * sbʹ + ci * cbʹ * slʹgw, cbʹ * clʹgw);
    var U2 = Math.atan2(si * sgb + ci * cgb * sglgw, cgb * cglgw);
    var gDU = Math.abs(U1 - U2); // return value
    return [gDU, B];
  };
  var f2 = function f2() {
    // (Bʹ, P, aEdge, bEdge) {
    // Remainder of step 6.0
    var aEdge = 375.35 / 3600 * p / gD; // return value
    var bEdge = aEdge * Math.abs(sB); // return value
    // Step 8.0
    var sBʹ = si * cbʹ * slʹgw - ci * sbʹ;
    var Bʹ = Math.asin(sBʹ); // return value
    // Step 10.0

    var _nutation$nutation = nutation.nutation(jde),
        _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
        gDgps = _nutation$nutation2[0],
        gDge = _nutation$nutation2[1];

    var ge = nutation.meanObliquity(jde) + gDge;
    // Step 11.0
    var gl0 = gw - Math.PI / 2;
    var gb0 = Math.PI / 2 - i;
    // Step 12.0

    var _base$sincos9 = base.sincos(l0 - gl),
        _base$sincos10 = _slicedToArray(_base$sincos9, 2),
        sl0gl = _base$sincos10[0],
        cl0gl = _base$sincos10[1];

    gl += 0.005693 * p * cl0gl / cgb;
    gb += 0.005693 * p * sl0gl * sgb;
    // Step 13.0
    gl0 += gDgps;
    gl += gDgps;
    // Step 14.0
    var eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge);
    var _ref = [eq.ra, eq.dec],
        ga0 = _ref[0],
        gd0 = _ref[1];

    eq = new coord.Ecliptic(gl, gb).toEquatorial(ge);
    var _ref2 = [eq.ra, eq.dec],
        ga = _ref2[0],
        gd = _ref2[1];
    // Step 15.0

    var _base$sincos11 = base.sincos(gd0),
        _base$sincos12 = _slicedToArray(_base$sincos11, 2),
        sgd0 = _base$sincos12[0],
        cgd0 = _base$sincos12[1];

    var _base$sincos13 = base.sincos(gd),
        _base$sincos14 = _slicedToArray(_base$sincos13, 2),
        sgd = _base$sincos14[0],
        cgd = _base$sincos14[1];

    var _base$sincos15 = base.sincos(ga0 - ga),
        _base$sincos16 = _slicedToArray(_base$sincos15, 2),
        sga0ga = _base$sincos16[0],
        cga0ga = _base$sincos16[1];

    var P = Math.atan2(cgd0 * sga0ga, sgd0 * cgd - cgd0 * sgd * cga0ga); // return value
    return [Bʹ, P, aEdge, bEdge];
  };
  return [f1, f2];
}