'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Apparent: Chapter 23, Apparent Place of a Star
 */

var base = require('./base');
var coord = require('./coord');
var nutation = require('./nutation');
var precess = require('./precess');
var solar = require('./solar');
// const sexa = require('./sexagesimal')

var M = exports;

/**
 * Nutation returns corrections due to nutation for equatorial coordinates
 * of an object.
 *
 * Results are invalid for objects very near the celestial poles.
 * @param {Number} α - right ascension
 * @param {Number} δ - declination
 * @param {Number} jd - Julian Day
 * @return {Number[]} [Δα1, Δδ1] -
*/
M.nutation = function (α, δ, jd) {
  // (α, δ, jd float64)  (Δα1, Δδ1 float64)
  var ε = nutation.meanObliquity(jd);

  var _base$sincos = base.sincos(ε);

  var _base$sincos2 = _slicedToArray(_base$sincos, 2);

  var sε = _base$sincos2[0];
  var cε = _base$sincos2[1];

  var _nutation$nutation = nutation.nutation(jd);

  var _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2);

  var Δψ = _nutation$nutation2[0];
  var Δε = _nutation$nutation2[1];

  var _base$sincos3 = base.sincos(α);

  var _base$sincos4 = _slicedToArray(_base$sincos3, 2);

  var sα = _base$sincos4[0];
  var cα = _base$sincos4[1];

  var tδ = Math.tan(δ);
  // (23.1) p. 151
  var Δα1 = (cε + sε * sα * tδ) * Δψ - cα * tδ * Δε;
  var Δδ1 = sε * cα * Δψ + sα * Δε;
  return [Δα1, Δδ1];
};

/**
 * κ is the constnt of aberration in radians.
 */
var κ = 20.49552 * Math.PI / 180 / 3600;

/**
 * longitude of perihelian of Earth's orbit.
 */
M.perihelion = function (T) {
  // (T float64)  float64
  return base.horner(T, 102.93735, 1.71946, 0.00046) * Math.PI / 180;
};

/**
 * EclipticAberration returns corrections due to aberration for ecliptic
 * coordinates of an object.
 */
M.eclipticAberration = function (λ, β, jd) {
  // (λ, β, jd float64)  (Δλ, Δβ float64)
  var T = base.J2000Century(jd);

  var _solar$true = solar.true(T);

  var lon = _solar$true.lon;
  var ano = _solar$true.ano; // eslint-disable-line no-unused-vars

  var e = solar.eccentricity(T);
  var π = M.perihelion(T);

  var _base$sincos5 = base.sincos(β);

  var _base$sincos6 = _slicedToArray(_base$sincos5, 2);

  var sβ = _base$sincos6[0];
  var cβ = _base$sincos6[1];

  var _base$sincos7 = base.sincos(lon - λ);

  var _base$sincos8 = _slicedToArray(_base$sincos7, 2);

  var ssλ = _base$sincos8[0];
  var csλ = _base$sincos8[1];

  var _base$sincos9 = base.sincos(π - λ);

  var _base$sincos10 = _slicedToArray(_base$sincos9, 2);

  var sπλ = _base$sincos10[0];
  var cπλ = _base$sincos10[1];
  // (23.2) p. 151

  var Δλ = κ * (e * cπλ - csλ) / cβ;
  var Δβ = -κ * sβ * (ssλ - e * sπλ);
  return [Δλ, Δβ];
};

/**
 * Aberration returns corrections due to aberration for equatorial
 * coordinates of an object.
 */
M.aberration = function (α, δ, jd) {
  // (α, δ, jd float64)  (Δα2, Δδ2 float64)
  var ε = nutation.meanObliquity(jd);
  var T = base.J2000Century(jd);

  var _solar$true2 = solar.true(T);

  var lon = _solar$true2.lon;
  var ano = _solar$true2.ano; // eslint-disable-line no-unused-vars

  var e = solar.eccentricity(T);
  var π = M.perihelion(T);

  var _base$sincos11 = base.sincos(α);

  var _base$sincos12 = _slicedToArray(_base$sincos11, 2);

  var sα = _base$sincos12[0];
  var cα = _base$sincos12[1];

  var _base$sincos13 = base.sincos(δ);

  var _base$sincos14 = _slicedToArray(_base$sincos13, 2);

  var sδ = _base$sincos14[0];
  var cδ = _base$sincos14[1];

  var _base$sincos15 = base.sincos(lon);

  var _base$sincos16 = _slicedToArray(_base$sincos15, 2);

  var ss = _base$sincos16[0];
  var cs = _base$sincos16[1];

  var _base$sincos17 = base.sincos(π);

  var _base$sincos18 = _slicedToArray(_base$sincos17, 2);

  var sπ = _base$sincos18[0];
  var cπ = _base$sincos18[1];

  var cε = Math.cos(ε);
  var tε = Math.tan(ε);
  var q1 = cα * cε;
  // (23.3) p. 152
  var Δα2 = κ * (e * (q1 * cπ + sα * sπ) - (q1 * cs + sα * ss)) / cδ;
  var q2 = cε * (tε * cδ - sα * sδ);
  var q3 = cα * sδ;
  var Δδ2 = κ * (e * (cπ * q2 + sπ * q3) - (cs * q2 + ss * q3));
  return [Δα2, Δδ2];
};

/**
 * Position computes the apparent position of an object.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, precession, nutation, and aberration.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 */
M.position = function (eqFrom, epochFrom, epochTo, mα, mδ) {
  // (eqFrom, eqTo *coord.Equatorial, epochFrom, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  var eqTo = precess.position(eqFrom, epochFrom, epochTo, mα, mδ);
  var jd = base.JulianYearToJDE(epochTo);

  var _M$nutation = M.nutation(eqTo.ra, eqTo.dec, jd);

  var _M$nutation2 = _slicedToArray(_M$nutation, 2);

  var Δα1 = _M$nutation2[0];
  var Δδ1 = _M$nutation2[1];

  var _M$aberration = M.aberration(eqTo.ra, eqTo.dec, jd);

  var _M$aberration2 = _slicedToArray(_M$aberration, 2);

  var Δα2 = _M$aberration2[0];
  var Δδ2 = _M$aberration2[1];

  eqTo.ra += Δα1 + Δα2;
  eqTo.dec += Δδ1 + Δδ2;
  return eqTo;
};

/**
 * AberrationRonVondrak uses the Ron-Vondrák expression to compute corrections
 * due to aberration for equatorial coordinates of an object.
 */
M.aberrationRonVondrak = function (α, δ, jd) {
  // (α, δ, jd float64)  (Δα, Δδ float64)
  var T = base.J2000Century(jd);
  var r = {
    T: T,
    L2: 3.1761467 + 1021.3285546 * T,
    L3: 1.7534703 + 628.3075849 * T,
    L4: 6.2034809 + 334.0612431 * T,
    L5: 0.5995465 + 52.9690965 * T,
    L6: 0.8740168 + 21.3299095 * T,
    L7: 5.4812939 + 7.4781599 * T,
    L8: 5.3118863 + 3.8133036 * T,
    Lp: 3.8103444 + 8399.6847337 * T,
    D: 5.1984667 + 7771.3771486 * T,
    Mp: 2.3555559 + 8328.6914289 * T,
    F: 1.6279052 + 8433.4661601 * T
  };
  var Xp = 0;
  var Yp = 0;
  var Zp = 0;
  // sum smaller terms first
  for (var i = 35; i >= 0; i--) {
    var _rvTerm$i = rvTerm[i](r);

    var _rvTerm$i2 = _slicedToArray(_rvTerm$i, 3);

    var x = _rvTerm$i2[0];
    var y = _rvTerm$i2[1];
    var z = _rvTerm$i2[2];

    Xp += x;
    Yp += y;
    Zp += z;
  }

  var _base$sincos19 = base.sincos(α);

  var _base$sincos20 = _slicedToArray(_base$sincos19, 2);

  var sα = _base$sincos20[0];
  var cα = _base$sincos20[1];

  var _base$sincos21 = base.sincos(δ);

  var _base$sincos22 = _slicedToArray(_base$sincos21, 2);

  var sδ = _base$sincos22[0];
  var cδ = _base$sincos22[1];
  // (23.4) p. 156

  return [(Yp * cα - Xp * sα) / (c * cδ), -((Xp * cα + Yp * sα) * sδ - Zp * cδ) / c];
};

var c = 17314463350; // unit is 1e-8 AU / day

// r = {T, L2, L3, L4, L5, L6, L7, L8, Lp, D, Mp, F}
var rvTerm = [function (r) {
  // 1

  var _base$sincos23 = base.sincos(r.L3);

  var _base$sincos24 = _slicedToArray(_base$sincos23, 2);

  var sA = _base$sincos24[0];
  var cA = _base$sincos24[1];

  return [(-1719914 - 2 * r.T) * sA - 25 * cA, (25 - 13 * r.T) * sA + (1578089 + 156 * r.T) * cA, (10 + 32 * r.T) * sA + (684185 - 358 * r.T) * cA];
}, function (r) {
  // 2

  var _base$sincos25 = base.sincos(2 * r.L3);

  var _base$sincos26 = _slicedToArray(_base$sincos25, 2);

  var sA = _base$sincos26[0];
  var cA = _base$sincos26[1];

  return [(6434 + 141 * r.T) * sA + (28007 - 107 * r.T) * cA, (25697 - 95 * r.T) * sA + (-5904 - 130 * r.T) * cA, (11141 - 48 * r.T) * sA + (-2559 - 55 * r.T) * cA];
}, function (r) {
  // 3

  var _base$sincos27 = base.sincos(r.L5);

  var _base$sincos28 = _slicedToArray(_base$sincos27, 2);

  var sA = _base$sincos28[0];
  var cA = _base$sincos28[1];

  return [715 * sA, 6 * sA - 657 * cA, -15 * sA - 282 * cA];
}, function (r) {
  // 4

  var _base$sincos29 = base.sincos(r.Lp);

  var _base$sincos30 = _slicedToArray(_base$sincos29, 2);

  var sA = _base$sincos30[0];
  var cA = _base$sincos30[1];

  return [715 * sA, -656 * cA, -285 * cA];
}, function (r) {
  // 5

  var _base$sincos31 = base.sincos(3 * r.L3);

  var _base$sincos32 = _slicedToArray(_base$sincos31, 2);

  var sA = _base$sincos32[0];
  var cA = _base$sincos32[1];

  return [(486 - 5 * r.T) * sA + (-236 - 4 * r.T) * cA, (-216 - 4 * r.T) * sA + (-446 + 5 * r.T) * cA, -94 * sA - 193 * cA];
}, function (r) {
  // 6

  var _base$sincos33 = base.sincos(r.L6);

  var _base$sincos34 = _slicedToArray(_base$sincos33, 2);

  var sA = _base$sincos34[0];
  var cA = _base$sincos34[1];

  return [159 * sA, 2 * sA - 147 * cA, -6 * sA - 61 * cA];
}, function (r) {
  // 7
  var cA = Math.cos(r.F);
  return [0, 26 * cA, -59 * cA];
}, function (r) {
  // 8

  var _base$sincos35 = base.sincos(r.Lp + r.Mp);

  var _base$sincos36 = _slicedToArray(_base$sincos35, 2);

  var sA = _base$sincos36[0];
  var cA = _base$sincos36[1];

  return [39 * sA, -36 * cA, -16 * cA];
}, function (r) {
  // 9

  var _base$sincos37 = base.sincos(2 * r.L5);

  var _base$sincos38 = _slicedToArray(_base$sincos37, 2);

  var sA = _base$sincos38[0];
  var cA = _base$sincos38[1];

  return [33 * sA - 10 * cA, -9 * sA - 30 * cA, -5 * sA - 13 * cA];
}, function (r) {
  // 10

  var _base$sincos39 = base.sincos(2 * r.L3 - r.L5);

  var _base$sincos40 = _slicedToArray(_base$sincos39, 2);

  var sA = _base$sincos40[0];
  var cA = _base$sincos40[1];

  return [31 * sA + cA, sA - 28 * cA, -12 * cA];
}, function (r) {
  // 11

  var _base$sincos41 = base.sincos(3 * r.L3 - 8 * r.L4 + 3 * r.L5);

  var _base$sincos42 = _slicedToArray(_base$sincos41, 2);

  var sA = _base$sincos42[0];
  var cA = _base$sincos42[1];

  return [8 * sA - 28 * cA, 25 * sA + 8 * cA, 11 * sA + 3 * cA];
}, function (r) {
  // 12

  var _base$sincos43 = base.sincos(5 * r.L3 - 8 * r.L4 + 3 * r.L5);

  var _base$sincos44 = _slicedToArray(_base$sincos43, 2);

  var sA = _base$sincos44[0];
  var cA = _base$sincos44[1];

  return [8 * sA - 28 * cA, -25 * sA - 8 * cA, -11 * sA + -3 * cA];
}, function (r) {
  // 13

  var _base$sincos45 = base.sincos(2 * r.L2 - r.L3);

  var _base$sincos46 = _slicedToArray(_base$sincos45, 2);

  var sA = _base$sincos46[0];
  var cA = _base$sincos46[1];

  return [21 * sA, -19 * cA, -8 * cA];
}, function (r) {
  // 14

  var _base$sincos47 = base.sincos(r.L2);

  var _base$sincos48 = _slicedToArray(_base$sincos47, 2);

  var sA = _base$sincos48[0];
  var cA = _base$sincos48[1];

  return [-19 * sA, 17 * cA, 8 * cA];
}, function (r) {
  // 15

  var _base$sincos49 = base.sincos(r.L7);

  var _base$sincos50 = _slicedToArray(_base$sincos49, 2);

  var sA = _base$sincos50[0];
  var cA = _base$sincos50[1];

  return [17 * sA, -16 * cA, -7 * cA];
}, function (r) {
  // 16

  var _base$sincos51 = base.sincos(r.L3 - 2 * r.L5);

  var _base$sincos52 = _slicedToArray(_base$sincos51, 2);

  var sA = _base$sincos52[0];
  var cA = _base$sincos52[1];

  return [16 * sA, 15 * cA, sA + 7 * cA];
}, function (r) {
  // 17

  var _base$sincos53 = base.sincos(r.L8);

  var _base$sincos54 = _slicedToArray(_base$sincos53, 2);

  var sA = _base$sincos54[0];
  var cA = _base$sincos54[1];

  return [16 * sA, sA - 15 * cA, -3 * sA - 6 * cA];
}, function (r) {
  // 18

  var _base$sincos55 = base.sincos(r.L3 + r.L5);

  var _base$sincos56 = _slicedToArray(_base$sincos55, 2);

  var sA = _base$sincos56[0];
  var cA = _base$sincos56[1];

  return [11 * sA - cA, -sA - 10 * cA, -sA - 5 * cA];
}, function (r) {
  // 19

  var _base$sincos57 = base.sincos(2 * r.L2 - 2 * r.L3);

  var _base$sincos58 = _slicedToArray(_base$sincos57, 2);

  var sA = _base$sincos58[0];
  var cA = _base$sincos58[1];

  return [-11 * cA, -10 * sA, -4 * sA];
}, function (r) {
  // 20

  var _base$sincos59 = base.sincos(r.L3 - r.L5);

  var _base$sincos60 = _slicedToArray(_base$sincos59, 2);

  var sA = _base$sincos60[0];
  var cA = _base$sincos60[1];

  return [-11 * sA - 2 * cA, -2 * sA + 9 * cA, -sA + 4 * cA];
}, function (r) {
  // 21

  var _base$sincos61 = base.sincos(4 * r.L3);

  var _base$sincos62 = _slicedToArray(_base$sincos61, 2);

  var sA = _base$sincos62[0];
  var cA = _base$sincos62[1];

  return [-7 * sA - 8 * cA, -8 * sA + 6 * cA, -3 * sA + 3 * cA];
}, function (r) {
  // 22

  var _base$sincos63 = base.sincos(3 * r.L3 - 2 * r.L5);

  var _base$sincos64 = _slicedToArray(_base$sincos63, 2);

  var sA = _base$sincos64[0];
  var cA = _base$sincos64[1];

  return [-10 * sA, 9 * cA, 4 * cA];
}, function (r) {
  // 23

  var _base$sincos65 = base.sincos(r.L2 - 2 * r.L3);

  var _base$sincos66 = _slicedToArray(_base$sincos65, 2);

  var sA = _base$sincos66[0];
  var cA = _base$sincos66[1];

  return [-9 * sA, -9 * cA, -4 * cA];
}, function (r) {
  // 24

  var _base$sincos67 = base.sincos(2 * r.L2 - 3 * r.L3);

  var _base$sincos68 = _slicedToArray(_base$sincos67, 2);

  var sA = _base$sincos68[0];
  var cA = _base$sincos68[1];

  return [-9 * sA, -8 * cA, -4 * cA];
}, function (r) {
  // 25

  var _base$sincos69 = base.sincos(2 * r.L6);

  var _base$sincos70 = _slicedToArray(_base$sincos69, 2);

  var sA = _base$sincos70[0];
  var cA = _base$sincos70[1];

  return [-9 * cA, -8 * sA, -3 * sA];
}, function (r) {
  // 26

  var _base$sincos71 = base.sincos(2 * r.L2 - 4 * r.L3);

  var _base$sincos72 = _slicedToArray(_base$sincos71, 2);

  var sA = _base$sincos72[0];
  var cA = _base$sincos72[1];

  return [-9 * cA, 8 * sA, 3 * sA];
}, function (r) {
  // 27

  var _base$sincos73 = base.sincos(3 * r.L3 - 2 * r.L4);

  var _base$sincos74 = _slicedToArray(_base$sincos73, 2);

  var sA = _base$sincos74[0];
  var cA = _base$sincos74[1];

  return [8 * sA, -8 * cA, -3 * cA];
}, function (r) {
  // 28

  var _base$sincos75 = base.sincos(r.Lp + 2 * r.D - r.Mp);

  var _base$sincos76 = _slicedToArray(_base$sincos75, 2);

  var sA = _base$sincos76[0];
  var cA = _base$sincos76[1];

  return [8 * sA, -7 * cA, -3 * cA];
}, function (r) {
  // 29

  var _base$sincos77 = base.sincos(8 * r.L2 - 12 * r.L3);

  var _base$sincos78 = _slicedToArray(_base$sincos77, 2);

  var sA = _base$sincos78[0];
  var cA = _base$sincos78[1];

  return [-4 * sA - 7 * cA, -6 * sA + 4 * cA, -3 * sA + 2 * cA];
}, function (r) {
  // 30

  var _base$sincos79 = base.sincos(8 * r.L2 - 14 * r.L3);

  var _base$sincos80 = _slicedToArray(_base$sincos79, 2);

  var sA = _base$sincos80[0];
  var cA = _base$sincos80[1];

  return [-4 * sA - 7 * cA, 6 * sA - 4 * cA, 3 * sA - 2 * cA];
}, function (r) {
  // 31

  var _base$sincos81 = base.sincos(2 * r.L4);

  var _base$sincos82 = _slicedToArray(_base$sincos81, 2);

  var sA = _base$sincos82[0];
  var cA = _base$sincos82[1];

  return [-6 * sA - 5 * cA, -4 * sA + 5 * cA, -2 * sA + 2 * cA];
}, function (r) {
  // 32

  var _base$sincos83 = base.sincos(3 * r.L2 - 4 * r.L3);

  var _base$sincos84 = _slicedToArray(_base$sincos83, 2);

  var sA = _base$sincos84[0];
  var cA = _base$sincos84[1];

  return [-sA - cA, -2 * sA - 7 * cA, sA - 4 * cA];
}, function (r) {
  // 33

  var _base$sincos85 = base.sincos(2 * r.L3 - 2 * r.L5);

  var _base$sincos86 = _slicedToArray(_base$sincos85, 2);

  var sA = _base$sincos86[0];
  var cA = _base$sincos86[1];

  return [4 * sA - 6 * cA, -5 * sA - 4 * cA, -2 * sA - 2 * cA];
}, function (r) {
  // 34

  var _base$sincos87 = base.sincos(3 * r.L2 - 3 * r.L3);

  var _base$sincos88 = _slicedToArray(_base$sincos87, 2);

  var sA = _base$sincos88[0];
  var cA = _base$sincos88[1];

  return [-7 * cA, -6 * sA, -3 * sA];
}, function (r) {
  // 35

  var _base$sincos89 = base.sincos(2 * r.L3 - 2 * r.L4);

  var _base$sincos90 = _slicedToArray(_base$sincos89, 2);

  var sA = _base$sincos90[0];
  var cA = _base$sincos90[1];

  return [5 * sA - 5 * cA, -4 * sA - 5 * cA, -2 * sA - 2 * cA];
}, function (r) {
  // 36

  var _base$sincos91 = base.sincos(r.Lp - 2 * r.D);

  var _base$sincos92 = _slicedToArray(_base$sincos91, 2);

  var sA = _base$sincos92[0];
  var cA = _base$sincos92[1];

  return [5 * sA, -5 * cA, -2 * cA];
}];

/**
 * PositionRonVondrak computes the apparent position of an object using
 * the Ron-Vondrák expression for aberration.
 *
 * Position is computed for equatorial coordinates in eqFrom, considering
 * proper motion, aberration, precession, and nutation.  Result is in
 * eqTo.  EqFrom and eqTo must be non-nil, but may point to the same struct.
 *
 * Note the Ron-Vondrák expression is only valid for the epoch J2000.
 * EqFrom must be coordinates at epoch J2000.
 */
M.positionRonVondrak = function (eqFrom, epochTo, mα, mδ) {
  // (eqFrom, eqTo *coord.Equatorial, epochTo float64, mα sexa.HourAngle, mδ sexa.Angle)  *coord.Equatorial
  var t = epochTo - 2000;
  var eqTo = new coord.Equatorial();
  eqTo.ra = eqFrom.ra + mα.rad() * t;
  eqTo.dec = eqFrom.dec + mδ.rad() * t;
  var jd = base.JulianYearToJDE(epochTo);

  var _M$aberrationRonVondr = M.aberrationRonVondrak(eqTo.ra, eqTo.dec, jd);

  var _M$aberrationRonVondr2 = _slicedToArray(_M$aberrationRonVondr, 2);

  var Δα = _M$aberrationRonVondr2[0];
  var Δδ = _M$aberrationRonVondr2[1];

  eqTo.ra += Δα;
  eqTo.dec += Δδ;
  eqTo = precess.position(eqTo, 2000, epochTo, 0, 0);

  var _M$nutation3 = M.nutation(eqTo.ra, eqTo.dec, jd);

  var _M$nutation4 = _slicedToArray(_M$nutation3, 2);

  var Δα1 = _M$nutation4[0];
  var Δδ1 = _M$nutation4[1];

  eqTo.ra += Δα1;
  eqTo.dec += Δδ1;
  return eqTo;
};