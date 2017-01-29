'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module apparent
 */
/**
 * Apparent: Chapter 23, Apparent Place of a Star
 */

var base = require('./base');
var coord = require('./coord');
var nutation = require('./nutation');
var precess = require('./precess');
var solar = require('./solar');
var cos = Math.cos,
    tan = Math.tan;


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

  var _base$sincos = base.sincos(ε),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sinε = _base$sincos2[0],
      cosε = _base$sincos2[1];

  var _nutation$nutation = nutation.nutation(jd),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];

  var _base$sincos3 = base.sincos(α),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sinα = _base$sincos4[0],
      cosα = _base$sincos4[1];

  var tanδ = tan(δ);
  // (23.1) p. 151
  var Δα1 = (cosε + sinε * sinα * tanδ) * Δψ - cosα * tanδ * Δε;
  var Δδ1 = sinε * cosα * Δψ + sinα * Δε;
  return [Δα1, Δδ1];
};

/**
 * κ is the constant of aberration in radians.
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

  var _solar$true = solar.true(T),
      lon = _solar$true.lon,
      ano = _solar$true.ano; // eslint-disable-line no-unused-vars


  var e = solar.eccentricity(T);
  var π = M.perihelion(T);

  var _base$sincos5 = base.sincos(β),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sβ = _base$sincos6[0],
      cβ = _base$sincos6[1];

  var _base$sincos7 = base.sincos(lon - λ),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      ssλ = _base$sincos8[0],
      csλ = _base$sincos8[1];

  var _base$sincos9 = base.sincos(π - λ),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sinπλ = _base$sincos10[0],
      cosπλ = _base$sincos10[1];
  // (23.2) p. 151


  var Δλ = κ * (e * cosπλ - csλ) / cβ;
  var Δβ = -κ * sβ * (ssλ - e * sinπλ);
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

  var _solar$true2 = solar.true(T),
      lon = _solar$true2.lon,
      ano = _solar$true2.ano; // eslint-disable-line no-unused-vars


  var e = solar.eccentricity(T);
  var π = M.perihelion(T);

  var _base$sincos11 = base.sincos(α),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sinα = _base$sincos12[0],
      cosα = _base$sincos12[1];

  var _base$sincos13 = base.sincos(δ),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sinδ = _base$sincos14[0],
      cosδ = _base$sincos14[1];

  var _base$sincos15 = base.sincos(lon),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sins = _base$sincos16[0],
      coss = _base$sincos16[1];

  var _base$sincos17 = base.sincos(π),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sinπ = _base$sincos18[0],
      cosπ = _base$sincos18[1];

  var cosε = cos(ε);
  var q1 = cosα * cosε;
  // (23.3) p. 152
  var Δα2 = κ * (e * (q1 * cosπ + sinα * sinπ) - (q1 * coss + sinα * sins)) / cosδ;
  var q2 = cosε * (tan(ε) * cosδ - sinα * sinδ);
  var q3 = cosα * sinδ;
  var Δδ2 = κ * (e * (cosπ * q2 + sinπ * q3) - (coss * q2 + sins * q3));
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

  var _M$nutation = M.nutation(eqTo.ra, eqTo.dec, jd),
      _M$nutation2 = _slicedToArray(_M$nutation, 2),
      Δα1 = _M$nutation2[0],
      Δδ1 = _M$nutation2[1];

  var _M$aberration = M.aberration(eqTo.ra, eqTo.dec, jd),
      _M$aberration2 = _slicedToArray(_M$aberration, 2),
      Δα2 = _M$aberration2[0],
      Δδ2 = _M$aberration2[1];

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
    var _rvTerm$i = rvTerm[i](r),
        _rvTerm$i2 = _slicedToArray(_rvTerm$i, 3),
        x = _rvTerm$i2[0],
        y = _rvTerm$i2[1],
        z = _rvTerm$i2[2];

    Xp += x;
    Yp += y;
    Zp += z;
  }

  var _base$sincos19 = base.sincos(α),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sinα = _base$sincos20[0],
      cosα = _base$sincos20[1];

  var _base$sincos21 = base.sincos(δ),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sinδ = _base$sincos22[0],
      cosδ = _base$sincos22[1];
  // (23.4) p. 156


  return [(Yp * cosα - Xp * sinα) / (c * cosδ), -((Xp * cosα + Yp * sinα) * sinδ - Zp * cosδ) / c];
};

var c = 17314463350; // unit is 1e-8 AU / day

// r = {T, L2, L3, L4, L5, L6, L7, L8, Lp, D, Mp, F}
var rvTerm = [function (r) {
  // 1
  var _base$sincos23 = base.sincos(r.L3),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sinA = _base$sincos24[0],
      cosA = _base$sincos24[1];

  return [(-1719914 - 2 * r.T) * sinA - 25 * cosA, (25 - 13 * r.T) * sinA + (1578089 + 156 * r.T) * cosA, (10 + 32 * r.T) * sinA + (684185 - 358 * r.T) * cosA];
}, function (r) {
  // 2
  var _base$sincos25 = base.sincos(2 * r.L3),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      sinA = _base$sincos26[0],
      cosA = _base$sincos26[1];

  return [(6434 + 141 * r.T) * sinA + (28007 - 107 * r.T) * cosA, (25697 - 95 * r.T) * sinA + (-5904 - 130 * r.T) * cosA, (11141 - 48 * r.T) * sinA + (-2559 - 55 * r.T) * cosA];
}, function (r) {
  // 3
  var _base$sincos27 = base.sincos(r.L5),
      _base$sincos28 = _slicedToArray(_base$sincos27, 2),
      sinA = _base$sincos28[0],
      cosA = _base$sincos28[1];

  return [715 * sinA, 6 * sinA - 657 * cosA, -15 * sinA - 282 * cosA];
}, function (r) {
  // 4
  var _base$sincos29 = base.sincos(r.Lp),
      _base$sincos30 = _slicedToArray(_base$sincos29, 2),
      sinA = _base$sincos30[0],
      cosA = _base$sincos30[1];

  return [715 * sinA, -656 * cosA, -285 * cosA];
}, function (r) {
  // 5
  var _base$sincos31 = base.sincos(3 * r.L3),
      _base$sincos32 = _slicedToArray(_base$sincos31, 2),
      sinA = _base$sincos32[0],
      cosA = _base$sincos32[1];

  return [(486 - 5 * r.T) * sinA + (-236 - 4 * r.T) * cosA, (-216 - 4 * r.T) * sinA + (-446 + 5 * r.T) * cosA, -94 * sinA - 193 * cosA];
}, function (r) {
  // 6
  var _base$sincos33 = base.sincos(r.L6),
      _base$sincos34 = _slicedToArray(_base$sincos33, 2),
      sinA = _base$sincos34[0],
      cosA = _base$sincos34[1];

  return [159 * sinA, 2 * sinA - 147 * cosA, -6 * sinA - 61 * cosA];
}, function (r) {
  // 7
  var cosA = Math.cos(r.F);
  return [0, 26 * cosA, -59 * cosA];
}, function (r) {
  // 8
  var _base$sincos35 = base.sincos(r.Lp + r.Mp),
      _base$sincos36 = _slicedToArray(_base$sincos35, 2),
      sinA = _base$sincos36[0],
      cosA = _base$sincos36[1];

  return [39 * sinA, -36 * cosA, -16 * cosA];
}, function (r) {
  // 9
  var _base$sincos37 = base.sincos(2 * r.L5),
      _base$sincos38 = _slicedToArray(_base$sincos37, 2),
      sinA = _base$sincos38[0],
      cosA = _base$sincos38[1];

  return [33 * sinA - 10 * cosA, -9 * sinA - 30 * cosA, -5 * sinA - 13 * cosA];
}, function (r) {
  // 10
  var _base$sincos39 = base.sincos(2 * r.L3 - r.L5),
      _base$sincos40 = _slicedToArray(_base$sincos39, 2),
      sinA = _base$sincos40[0],
      cosA = _base$sincos40[1];

  return [31 * sinA + cosA, sinA - 28 * cosA, -12 * cosA];
}, function (r) {
  // 11
  var _base$sincos41 = base.sincos(3 * r.L3 - 8 * r.L4 + 3 * r.L5),
      _base$sincos42 = _slicedToArray(_base$sincos41, 2),
      sinA = _base$sincos42[0],
      cosA = _base$sincos42[1];

  return [8 * sinA - 28 * cosA, 25 * sinA + 8 * cosA, 11 * sinA + 3 * cosA];
}, function (r) {
  // 12
  var _base$sincos43 = base.sincos(5 * r.L3 - 8 * r.L4 + 3 * r.L5),
      _base$sincos44 = _slicedToArray(_base$sincos43, 2),
      sinA = _base$sincos44[0],
      cosA = _base$sincos44[1];

  return [8 * sinA - 28 * cosA, -25 * sinA - 8 * cosA, -11 * sinA + -3 * cosA];
}, function (r) {
  // 13
  var _base$sincos45 = base.sincos(2 * r.L2 - r.L3),
      _base$sincos46 = _slicedToArray(_base$sincos45, 2),
      sinA = _base$sincos46[0],
      cosA = _base$sincos46[1];

  return [21 * sinA, -19 * cosA, -8 * cosA];
}, function (r) {
  // 14
  var _base$sincos47 = base.sincos(r.L2),
      _base$sincos48 = _slicedToArray(_base$sincos47, 2),
      sinA = _base$sincos48[0],
      cosA = _base$sincos48[1];

  return [-19 * sinA, 17 * cosA, 8 * cosA];
}, function (r) {
  // 15
  var _base$sincos49 = base.sincos(r.L7),
      _base$sincos50 = _slicedToArray(_base$sincos49, 2),
      sinA = _base$sincos50[0],
      cosA = _base$sincos50[1];

  return [17 * sinA, -16 * cosA, -7 * cosA];
}, function (r) {
  // 16
  var _base$sincos51 = base.sincos(r.L3 - 2 * r.L5),
      _base$sincos52 = _slicedToArray(_base$sincos51, 2),
      sinA = _base$sincos52[0],
      cosA = _base$sincos52[1];

  return [16 * sinA, 15 * cosA, sinA + 7 * cosA];
}, function (r) {
  // 17
  var _base$sincos53 = base.sincos(r.L8),
      _base$sincos54 = _slicedToArray(_base$sincos53, 2),
      sinA = _base$sincos54[0],
      cosA = _base$sincos54[1];

  return [16 * sinA, sinA - 15 * cosA, -3 * sinA - 6 * cosA];
}, function (r) {
  // 18
  var _base$sincos55 = base.sincos(r.L3 + r.L5),
      _base$sincos56 = _slicedToArray(_base$sincos55, 2),
      sinA = _base$sincos56[0],
      cosA = _base$sincos56[1];

  return [11 * sinA - cosA, -sinA - 10 * cosA, -sinA - 5 * cosA];
}, function (r) {
  // 19
  var _base$sincos57 = base.sincos(2 * r.L2 - 2 * r.L3),
      _base$sincos58 = _slicedToArray(_base$sincos57, 2),
      sinA = _base$sincos58[0],
      cosA = _base$sincos58[1];

  return [-11 * cosA, -10 * sinA, -4 * sinA];
}, function (r) {
  // 20
  var _base$sincos59 = base.sincos(r.L3 - r.L5),
      _base$sincos60 = _slicedToArray(_base$sincos59, 2),
      sinA = _base$sincos60[0],
      cosA = _base$sincos60[1];

  return [-11 * sinA - 2 * cosA, -2 * sinA + 9 * cosA, -sinA + 4 * cosA];
}, function (r) {
  // 21
  var _base$sincos61 = base.sincos(4 * r.L3),
      _base$sincos62 = _slicedToArray(_base$sincos61, 2),
      sinA = _base$sincos62[0],
      cosA = _base$sincos62[1];

  return [-7 * sinA - 8 * cosA, -8 * sinA + 6 * cosA, -3 * sinA + 3 * cosA];
}, function (r) {
  // 22
  var _base$sincos63 = base.sincos(3 * r.L3 - 2 * r.L5),
      _base$sincos64 = _slicedToArray(_base$sincos63, 2),
      sinA = _base$sincos64[0],
      cosA = _base$sincos64[1];

  return [-10 * sinA, 9 * cosA, 4 * cosA];
}, function (r) {
  // 23
  var _base$sincos65 = base.sincos(r.L2 - 2 * r.L3),
      _base$sincos66 = _slicedToArray(_base$sincos65, 2),
      sinA = _base$sincos66[0],
      cosA = _base$sincos66[1];

  return [-9 * sinA, -9 * cosA, -4 * cosA];
}, function (r) {
  // 24
  var _base$sincos67 = base.sincos(2 * r.L2 - 3 * r.L3),
      _base$sincos68 = _slicedToArray(_base$sincos67, 2),
      sinA = _base$sincos68[0],
      cosA = _base$sincos68[1];

  return [-9 * sinA, -8 * cosA, -4 * cosA];
}, function (r) {
  // 25
  var _base$sincos69 = base.sincos(2 * r.L6),
      _base$sincos70 = _slicedToArray(_base$sincos69, 2),
      sinA = _base$sincos70[0],
      cosA = _base$sincos70[1];

  return [-9 * cosA, -8 * sinA, -3 * sinA];
}, function (r) {
  // 26
  var _base$sincos71 = base.sincos(2 * r.L2 - 4 * r.L3),
      _base$sincos72 = _slicedToArray(_base$sincos71, 2),
      sinA = _base$sincos72[0],
      cosA = _base$sincos72[1];

  return [-9 * cosA, 8 * sinA, 3 * sinA];
}, function (r) {
  // 27
  var _base$sincos73 = base.sincos(3 * r.L3 - 2 * r.L4),
      _base$sincos74 = _slicedToArray(_base$sincos73, 2),
      sinA = _base$sincos74[0],
      cosA = _base$sincos74[1];

  return [8 * sinA, -8 * cosA, -3 * cosA];
}, function (r) {
  // 28
  var _base$sincos75 = base.sincos(r.Lp + 2 * r.D - r.Mp),
      _base$sincos76 = _slicedToArray(_base$sincos75, 2),
      sinA = _base$sincos76[0],
      cosA = _base$sincos76[1];

  return [8 * sinA, -7 * cosA, -3 * cosA];
}, function (r) {
  // 29
  var _base$sincos77 = base.sincos(8 * r.L2 - 12 * r.L3),
      _base$sincos78 = _slicedToArray(_base$sincos77, 2),
      sinA = _base$sincos78[0],
      cosA = _base$sincos78[1];

  return [-4 * sinA - 7 * cosA, -6 * sinA + 4 * cosA, -3 * sinA + 2 * cosA];
}, function (r) {
  // 30
  var _base$sincos79 = base.sincos(8 * r.L2 - 14 * r.L3),
      _base$sincos80 = _slicedToArray(_base$sincos79, 2),
      sinA = _base$sincos80[0],
      cosA = _base$sincos80[1];

  return [-4 * sinA - 7 * cosA, 6 * sinA - 4 * cosA, 3 * sinA - 2 * cosA];
}, function (r) {
  // 31
  var _base$sincos81 = base.sincos(2 * r.L4),
      _base$sincos82 = _slicedToArray(_base$sincos81, 2),
      sinA = _base$sincos82[0],
      cosA = _base$sincos82[1];

  return [-6 * sinA - 5 * cosA, -4 * sinA + 5 * cosA, -2 * sinA + 2 * cosA];
}, function (r) {
  // 32
  var _base$sincos83 = base.sincos(3 * r.L2 - 4 * r.L3),
      _base$sincos84 = _slicedToArray(_base$sincos83, 2),
      sinA = _base$sincos84[0],
      cosA = _base$sincos84[1];

  return [-sinA - cosA, -2 * sinA - 7 * cosA, sinA - 4 * cosA];
}, function (r) {
  // 33
  var _base$sincos85 = base.sincos(2 * r.L3 - 2 * r.L5),
      _base$sincos86 = _slicedToArray(_base$sincos85, 2),
      sinA = _base$sincos86[0],
      cosA = _base$sincos86[1];

  return [4 * sinA - 6 * cosA, -5 * sinA - 4 * cosA, -2 * sinA - 2 * cosA];
}, function (r) {
  // 34
  var _base$sincos87 = base.sincos(3 * r.L2 - 3 * r.L3),
      _base$sincos88 = _slicedToArray(_base$sincos87, 2),
      sinA = _base$sincos88[0],
      cosA = _base$sincos88[1];

  return [-7 * cosA, -6 * sinA, -3 * sinA];
}, function (r) {
  // 35
  var _base$sincos89 = base.sincos(2 * r.L3 - 2 * r.L4),
      _base$sincos90 = _slicedToArray(_base$sincos89, 2),
      sinA = _base$sincos90[0],
      cosA = _base$sincos90[1];

  return [5 * sinA - 5 * cosA, -4 * sinA - 5 * cosA, -2 * sinA - 2 * cosA];
}, function (r) {
  // 36
  var _base$sincos91 = base.sincos(r.Lp - 2 * r.D),
      _base$sincos92 = _slicedToArray(_base$sincos91, 2),
      sinA = _base$sincos92[0],
      cosA = _base$sincos92[1];

  return [5 * sinA, -5 * cosA, -2 * cosA];
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

  var _M$aberrationRonVondr = M.aberrationRonVondrak(eqTo.ra, eqTo.dec, jd),
      _M$aberrationRonVondr2 = _slicedToArray(_M$aberrationRonVondr, 2),
      Δα = _M$aberrationRonVondr2[0],
      Δδ = _M$aberrationRonVondr2[1];

  eqTo.ra += Δα;
  eqTo.dec += Δδ;
  eqTo = precess.position(eqTo, 2000, epochTo, 0, 0);

  var _M$nutation3 = M.nutation(eqTo.ra, eqTo.dec, jd),
      _M$nutation4 = _slicedToArray(_M$nutation3, 2),
      Δα1 = _M$nutation4[0],
      Δδ1 = _M$nutation4[1];

  eqTo.ra += Δα1;
  eqTo.dec += Δδ1;
  return eqTo;
};