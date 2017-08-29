'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module pluto
 */
/**
 * Pluto: Chapter 37, Pluto.
 */

var base = require('./base');
var elliptic = require('./elliptic');

var M = exports;

/**
 * Heliocentric returns J2000 heliocentric coordinates of Pluto.
 *
 * Results l, b are solar longitude and latitude in radians.
 * Result r is distance in AU.
 */
M.heliocentric = function (jde) {
  var l = 0;
  var b = 0;
  var r = 0;
  var T = base.J2000Century(jde);
  var J = 34.35 + 3034.9057 * T;
  var S = 50.08 + 1222.1138 * T;
  var P = 238.96 + 144.96 * T;
  for (var i in t37) {
    var t = t37[i];

    var _base$sincos = base.sincos((t.i * J + t.j * S + t.k * P) * Math.PI / 180),
        _base$sincos2 = _slicedToArray(_base$sincos, 2),
        sga = _base$sincos2[0],
        cga = _base$sincos2[1];

    l += t.lA * sga + t.lB * cga;
    b += t.bA * sga + t.bB * cga;
    r += t.rA * sga + t.rB * cga;
  }
  l = (l + 238.958116 + 144.96 * T) * Math.PI / 180;
  b = (b - 3.908239) * Math.PI / 180;
  r += 40.7241346;
  return { lon: l, lat: b, range: r };
};

/**
 * Astrometric returns J2000 astrometric coordinates of Pluto.
 */
M.astrometric = function (jde, earth) {
  var sge = base.SOblJ2000;
  var cge = base.COblJ2000;
  var f = function f(jde) {
    var x, y, z;

    var _M$heliocentric = M.heliocentric(jde),
        lon = _M$heliocentric.lon,
        lat = _M$heliocentric.lat,
        range = _M$heliocentric.range;

    var _base$sincos3 = base.sincos(lon),
        _base$sincos4 = _slicedToArray(_base$sincos3, 2),
        sl = _base$sincos4[0],
        cl = _base$sincos4[1];

    var _base$sincos5 = base.sincos(lat),
        _base$sincos6 = _slicedToArray(_base$sincos5, 2),
        sb = _base$sincos6[0],
        cb = _base$sincos6[1];
    // (37.1) p. 264


    x = range * cl * cb;
    y = range * (sl * cb * cge - sb * sge);
    z = range * (sl * cb * sge + sb * cge);
    return { x: x, y: y, z: z };
  };
  var c = elliptic.astrometricJ2000(f, jde, earth); // eslint-disable-line no-unused-vars
  return new base.Coord(c.ra, c.dec);
};

function Pt(i, j, k, lA, lB, bA, bB, rA, rB) {
  this.i = i;
  this.j = j;
  this.k = k;
  this.lA = lA;
  this.lB = lB;
  this.bA = bA;
  this.bB = bB;
  this.rA = rA;
  this.rB = rB;
}

var t37 = [new Pt(0, 0, 1, -19.799805, 19.850055, -5.452852, -14.974862, 6.6865439, 6.8951812), new Pt(0, 0, 2, 0.897144, -4.954829, 3.527812, 1.67279, -1.1827535, -0.0332538), new Pt(0, 0, 3, 0.611149, 1.211027, -1.050748, 0.327647, 0.1593179, -0.143889), new Pt(0, 0, 4, -0.341243, -0.189585, 0.17869, -0.292153, -0.0018444, 0.048322), new Pt(0, 0, 5, 0.129287, -0.034992, 0.01865, 0.10034, -0.0065977, -0.0085431), new Pt(0, 0, 6, -0.038164, 0.030893, -0.030697, -0.025823, 0.0031174, -0.0006032), new Pt(0, 1, -1, 0.020442, -0.009987, 0.004878, 0.011248, -0.0005794, 0.0022161), new Pt(0, 1, 0, -0.004063, -0.005071, 0.000226, -0.000064, 0.0004601, 0.0004032), new Pt(0, 1, 1, -0.006016, -0.003336, 0.00203, -0.000836, -0.0001729, 0.0000234), new Pt(0, 1, 2, -0.003956, 0.003039, 0.000069, -0.000604, -0.0000415, 0.0000702), new Pt(0, 1, 3, -0.000667, 0.003572, -0.000247, -0.000567, 0.0000239, 0.0000723), new Pt(0, 2, -2, 0.001276, 0.000501, -0.000057, 0.000001, 0.0000067, -0.0000067), new Pt(0, 2, -1, 0.001152, -0.000917, -0.000122, 0.000175, 0.0001034, -0.0000451), new Pt(0, 2, 0, 0.00063, -0.001277, -0.000049, -0.000164, -0.0000129, 0.0000504), new Pt(1, -1, 0, 0.002571, -0.000459, -0.000197, 0.000199, 0.000048, -0.0000231), new Pt(1, -1, 1, 0.000899, -0.001449, -0.000025, 0.000217, 0.0000002, -0.0000441), new Pt(1, 0, -3, -0.001016, 0.001043, 0.000589, -0.000248, -0.0003359, 0.0000265), new Pt(1, 0, -2, -0.002343, -0.001012, -0.000269, 0.000711, 0.0007856, -0.0007832), new Pt(1, 0, -1, 0.007042, 0.000788, 0.000185, 0.000193, 0.0000036, 0.0045763), new Pt(1, 0, 0, 0.001199, -0.000338, 0.000315, 0.000807, 0.0008663, 0.0008547), new Pt(1, 0, 1, 0.000418, -0.000067, -0.00013, -0.000043, -0.0000809, -0.0000769), new Pt(1, 0, 2, 0.00012, -0.000274, 0.000005, 0.000003, 0.0000263, -0.0000144), new Pt(1, 0, 3, -0.00006, -0.000159, 0.000002, 0.000017, -0.0000126, 0.0000032), new Pt(1, 0, 4, -0.000082, -0.000029, 0.000002, 0.000005, -0.0000035, -0.0000016), new Pt(1, 1, -3, -0.000036, -0.000029, 0.000002, 0.000003, -0.0000019, -0.0000004), new Pt(1, 1, -2, -0.00004, 0.000007, 0.000003, 0.000001, -0.0000015, 0.0000008), new Pt(1, 1, -1, -0.000014, 0.000022, 0.000002, -0.000001, -0.0000004, 0.0000012), new Pt(1, 1, 0, 0.000004, 0.000013, 0.000001, -0.000001, 0.0000005, 0.0000006), new Pt(1, 1, 1, 0.000005, 0.000002, 0, -0.000001, 0.0000003, 0.0000001), new Pt(1, 1, 3, -0.000001, 0, 0, 0, 0.0000006, -0.0000002), new Pt(2, 0, -6, 0.000002, 0, 0, -0.000002, 0.0000002, 0.0000002), new Pt(2, 0, -5, -0.000004, 0.000005, 0.000002, 0.000002, -0.0000002, -0.0000002), new Pt(2, 0, -4, 0.000004, -0.000007, -0.000007, 0, 0.0000014, 0.0000013), new Pt(2, 0, -3, 0.000014, 0.000024, 0.00001, -0.000008, -0.0000063, 0.0000013), new Pt(2, 0, -2, -0.000049, -0.000034, -0.000003, 0.00002, 0.0000136, -0.0000236), new Pt(2, 0, -1, 0.000163, -0.000048, 0.000006, 0.000005, 0.0000273, 0.0001065), new Pt(2, 0, 0, 0.000009, -0.000024, 0.000014, 0.000017, 0.0000251, 0.0000149), new Pt(2, 0, 1, -0.000004, 0.000001, -0.000002, 0, -0.0000025, -0.0000009), new Pt(2, 0, 2, -0.000003, 0.000001, 0, 0, 0.0000009, -0.0000002), new Pt(2, 0, 3, 0.000001, 0.000003, 0, 0, -0.0000008, 0.0000007), new Pt(3, 0, -2, -0.000003, -0.000001, 0, 0.000001, 0.0000002, -0.000001), new Pt(3, 0, -1, 0.000005, -0.000003, 0, 0, 0.0000019, 0.0000035), new Pt(3, 0, 0, 0, 0, 0.000001, 0, 0.000001, 0.0000003)];