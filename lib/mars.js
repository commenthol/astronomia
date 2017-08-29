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
 *  gw   Areographic longitude of the central meridian, as seen from Earth.
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
  // (jde float64, earth, mars *pp.V87Planet)  (DE, DS, gw, P, Q, d, k, q float64)
  // Step 1.0
  var T = base.J2000Century(jde);
  var p = Math.PI / 180;
  // (42.1) p. 288
  var gl0 = 352.9065 * p + 1.1733 * p * T;
  var gb0 = 63.2818 * p - 0.00394 * p * T;
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
  var gD = 0.5; // surely better than 0.0
  var gt = base.lightTime(gD);
  var l, b, r, x, y, z;
  var f = function f() {
    var marsPos = mars.position(jde - gt);
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
    gD = Math.sqrt(x * x + y * y + z * z);
    gt = base.lightTime(gD);
  };
  f();
  f();
  // Step 5.0
  var gl = Math.atan2(y, x);
  var gb = Math.atan(z / Math.hypot(x, y));
  // Step 6.0

  var _base$sincos7 = base.sincos(gb0),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sgb0 = _base$sincos8[0],
      cgb0 = _base$sincos8[1];

  var _base$sincos9 = base.sincos(gb),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sgb = _base$sincos10[0],
      cgb = _base$sincos10[1];

  var DE = Math.asin(-sgb0 * sgb - cgb0 * cgb * Math.cos(gl0 - gl));
  // Step 7.0
  var N = 49.5581 * p + 0.7721 * p * T;
  var lʹ = l - 0.00697 * p / r;
  var bʹ = b - 0.000225 * p * Math.cos(l - N) / r;
  // Step 8.0

  var _base$sincos11 = base.sincos(bʹ),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sbʹ = _base$sincos12[0],
      cbʹ = _base$sincos12[1];

  var DS = Math.asin(-sgb0 * sbʹ - cgb0 * cbʹ * Math.cos(gl0 - lʹ));
  // Step 9.0
  var W = 11.504 * p + 350.89200025 * p * (jde - gt - 2433282.5);
  // Step 10.0
  var ge0 = nutation.meanObliquity(jde);

  var _base$sincos13 = base.sincos(ge0),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sge0 = _base$sincos14[0],
      cge0 = _base$sincos14[1];

  var eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge0);
  var _ref2 = [eq.ra, eq.dec],
      ga0 = _ref2[0],
      gd0 = _ref2[1];
  // Step 11.0

  var u = y * cge0 - z * sge0;
  var v = y * sge0 + z * cge0;
  var ga = Math.atan2(u, x);
  var gd = Math.atan(v / Math.hypot(x, u));

  var _base$sincos15 = base.sincos(gd),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sgd = _base$sincos16[0],
      cgd = _base$sincos16[1];

  var _base$sincos17 = base.sincos(gd0),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sgd0 = _base$sincos18[0],
      cgd0 = _base$sincos18[1];

  var _base$sincos19 = base.sincos(ga0 - ga),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sga0ga = _base$sincos20[0],
      cga0ga = _base$sincos20[1];

  var gz = Math.atan2(sgd0 * cgd * cga0ga - sgd * cgd0, cgd * sga0ga);
  // Step 12.0
  var gw = base.pmod(W - gz, 2 * Math.PI);
  // Step 13.0

  var _nutation$nutation = nutation.nutation(jde),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      gDgps = _nutation$nutation2[0],
      gDge = _nutation$nutation2[1];
  // Step 14.0


  var _base$sincos21 = base.sincos(l0 - gl),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sl0gl = _base$sincos22[0],
      cl0gl = _base$sincos22[1];

  gl += 0.005693 * p * cl0gl / cgb;
  gb += 0.005693 * p * sl0gl * sgb;
  // Step 15.0
  gl0 += gDgps;
  gl += gDgps;
  var ge = ge0 + gDge;
  // Step 16.0

  var _base$sincos23 = base.sincos(ge),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sge = _base$sincos24[0],
      cge = _base$sincos24[1];

  eq = new coord.Ecliptic(gl0, gb0).toEquatorial(ge);
  var _ref3 = [eq.ra, eq.dec],
      ga0ʹ = _ref3[0],
      gd0ʹ = _ref3[1];

  eq = new coord.Ecliptic(gl, gb).toEquatorial(ge);
  var _ref4 = [eq.ra, eq.dec],
      gaʹ = _ref4[0],
      gdʹ = _ref4[1];
  // Step 17.0

  var _base$sincos25 = base.sincos(gd0ʹ),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      sgd0ʹ = _base$sincos26[0],
      cgd0ʹ = _base$sincos26[1];

  var _base$sincos27 = base.sincos(gdʹ),
      _base$sincos28 = _slicedToArray(_base$sincos27, 2),
      sgdʹ = _base$sincos28[0],
      cgdʹ = _base$sincos28[1];

  var _base$sincos29 = base.sincos(ga0ʹ - gaʹ),
      _base$sincos30 = _slicedToArray(_base$sincos29, 2),
      sga0ʹgaʹ = _base$sincos30[0],
      cga0ʹgaʹ = _base$sincos30[1];
  // (42.4) p. 290


  var P = Math.atan2(cgd0ʹ * sga0ʹgaʹ, sgd0ʹ * cgdʹ - cgd0ʹ * sgdʹ * cga0ʹgaʹ);
  if (P < 0) {
    P += 2 * Math.PI;
  }
  // Step 18.0
  var s = l0 + Math.PI;

  var _base$sincos31 = base.sincos(s),
      _base$sincos32 = _slicedToArray(_base$sincos31, 2),
      ss = _base$sincos32[0],
      cs = _base$sincos32[1];

  var gas = Math.atan2(cge * ss, cs);
  var gds = Math.asin(sge * ss);

  var _base$sincos33 = base.sincos(gds),
      _base$sincos34 = _slicedToArray(_base$sincos33, 2),
      sgds = _base$sincos34[0],
      cgds = _base$sincos34[1];

  var _base$sincos35 = base.sincos(gas - ga),
      _base$sincos36 = _slicedToArray(_base$sincos35, 2),
      sgasga = _base$sincos36[0],
      cgasga = _base$sincos36[1];

  var gx = Math.atan2(cgds * sgasga, sgds * cgd - cgds * sgd * cgasga);
  var Q = gx + Math.PI;
  // Step 19.0
  var d = 9.36 / 60 / 60 * Math.PI / 180 / gD;
  var k = illum.fraction(r, gD, R);
  var q = (1 - k) * d;
  return [DE, DS, gw, P, Q, d, k, q];
};