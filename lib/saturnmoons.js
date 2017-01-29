'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnmoons
 */
/**
 * Saturnmoons: Chapter 46, Positions of the Satellites of Saturn
 */

var base = require('./base');
var coord = require('./coord');
var planetposition = require('./planetposition');
var precess = require('./precess');
var solar = require('./solar');

var M = exports;

// array positions of Saturnmoons returned from positions().
M.mimas = 0;
M.enceladus = 1;
M.tethys = 2;
M.dione = 3;
M.rhea = 4;
M.titan = 5;
M.hyperion = 6;
M.iapetus = 7;

/**
 * XY holds coordinates returned from positions().
 */
function XY(x, y) {
  this.x = x;
  this.y = y;
}

var d = Math.PI / 180;

/**
 * Positions returns positions of the eight major moons of Saturn.
 *
 * Results returned in argument pos, which must not be undefined.
 *
 * Result units are Saturn radii.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 planet Earth
 * @param {planetposition.Planet} saturn - VSOP87 planet Saturn
 * @return {XY[]} Array of Moon Positions in `XY`
 *   Use `M.mimas ... M.iapetus` to resolve to Moon and its position at `jde`
 */
M.positions = function (jde, earth, saturn) {
  var sol = solar.trueVSOP87(earth, jde);
  var _ref = [sol.lon, sol.lat, sol.range],
      s = _ref[0],
      β = _ref[1],
      R = _ref[2];

  var _base$sincos = base.sincos(s),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      ss = _base$sincos2[0],
      cs = _base$sincos2[1];

  var sβ = Math.sin(β);
  var Δ = 9.0;
  var x, y, z, _jde;
  var f = function f() {
    var τ = base.lightTime(Δ);
    _jde = jde - τ;

    var _saturn$position = saturn.position(_jde),
        lon = _saturn$position.lon,
        lat = _saturn$position.lat,
        range = _saturn$position.range;

    var fk5 = planetposition.toFK5(lon, lat, _jde);
    var _ref2 = [fk5.lon, fk5.lat],
        l = _ref2[0],
        b = _ref2[1];

    var _base$sincos3 = base.sincos(l),
        _base$sincos4 = _slicedToArray(_base$sincos3, 2),
        sl = _base$sincos4[0],
        cl = _base$sincos4[1];

    var _base$sincos5 = base.sincos(b),
        _base$sincos6 = _slicedToArray(_base$sincos5, 2),
        sb = _base$sincos6[0],
        cb = _base$sincos6[1];

    x = range * cb * cl + R * cs;
    y = range * cb * sl + R * ss;
    z = range * sb + R * sβ;
    Δ = Math.sqrt(x * x + y * y + z * z);
  };
  f();
  f();
  var λ0 = Math.atan2(y, x);
  var β0 = Math.atan(z / Math.hypot(x, y));
  var ecl = new coord.Ecliptic(λ0, β0);
  ecl = precess.eclipticPosition(ecl, base.JDEToJulianYear(jde), base.JDEToJulianYear(base.B1950), 0, 0);
  λ0 = ecl.lon;
  β0 = ecl.lat;
  var q = new Qs(_jde);
  var s4 = [new R4(), // 0 unused
  q.mimas(), q.enceladus(), q.tethys(), q.dione(), q.rhea(), q.titan(), q.hyperion(), q.iapetus()];

  var j;
  var X = new Array(9).fill(0);
  var Y = new Array(9).fill(0);
  var Z = new Array(9).fill(0);
  for (j = 1; j <= 8; j++) {
    var u = s4[j].λ - s4[j].Ω;
    var w = s4[j].Ω - 168.8112 * d;

    var _base$sincos7 = base.sincos(u),
        _base$sincos8 = _slicedToArray(_base$sincos7, 2),
        su = _base$sincos8[0],
        cu = _base$sincos8[1];

    var _base$sincos9 = base.sincos(w),
        _base$sincos10 = _slicedToArray(_base$sincos9, 2),
        sw = _base$sincos10[0],
        cw = _base$sincos10[1];

    var _base$sincos11 = base.sincos(s4[j].γ),
        _base$sincos12 = _slicedToArray(_base$sincos11, 2),
        sγ = _base$sincos12[0],
        cγ = _base$sincos12[1];

    var r = s4[j].r;
    X[j] = r * (cu * cw - su * cγ * sw);
    Y[j] = r * (su * cw * cγ + cu * sw);
    Z[j] = r * su * sγ;
  }
  Z[0] = 1;

  var _base$sincos13 = base.sincos(λ0),
      _base$sincos14 = _slicedToArray(_base$sincos13, 2),
      sλ0 = _base$sincos14[0],
      cλ0 = _base$sincos14[1];

  var _base$sincos15 = base.sincos(β0),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sβ0 = _base$sincos16[0],
      cβ0 = _base$sincos16[1];

  var A = new Array(9).fill(0);
  var B = new Array(9).fill(0);
  var C = new Array(9).fill(0);
  for (j in X) {
    var a0 = void 0;
    var a = X[j];
    var b = q.c1 * Y[j] - q.s1 * Z[j];
    var c = q.s1 * Y[j] + q.c1 * Z[j];
    a0 = q.c2 * a - q.s2 * b;
    b = q.s2 * a + q.c2 * b;
    a = a0;

    A[j] = a * sλ0 - b * cλ0;
    b = a * cλ0 + b * sλ0;

    B[j] = b * cβ0 + c * sβ0;
    C[j] = c * cβ0 - b * sβ0;
  }

  var pos = new Array(9);
  var D = Math.atan2(A[0], C[0]);

  var _base$sincos17 = base.sincos(D),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sD = _base$sincos18[0],
      cD = _base$sincos18[1];

  for (j = 1; j <= 8; j++) {
    X[j] = A[j] * cD - C[j] * sD;
    Y[j] = A[j] * sD + C[j] * cD;
    Z[j] = B[j];
    var _d = X[j] / s4[j].r;
    X[j] += Math.abs(Z[j]) / k[j] * Math.sqrt(1 - _d * _d);
    var W = Δ / (Δ + Z[j] / 2475);
    pos[j - 1] = new XY(X[j] * W, Y[j] * W);
  }
  return pos;
};

var k = [0, 20947, 23715, 26382, 29876, 35313, 53800, 59222, 91820];

function R4(λ, r, γ, Ω) {
  this.λ = λ || 0;
  this.r = r || 0;
  this.γ = γ || 0;
  this.Ω = Ω || 0;
}

function Qs(jde) {
  this.t1 = jde - 2411093;
  this.t2 = this.t1 / 365.25;
  this.t3 = (jde - 2433282.423) / 365.25 + 1950;
  this.t4 = jde - 2411368;
  this.t5 = this.t4 / 365.25;
  this.t6 = jde - 2415020;
  this.t7 = this.t6 / 36525;
  this.t8 = this.t6 / 365.25;
  this.t9 = (jde - 2442000.5) / 365.25;
  this.t10 = jde - 2409786;
  this.t11 = this.t10 / 36525;
  this.W0 = 5.095 * d * (this.t3 - 1866.39);
  this.W1 = 74.4 * d + 32.39 * d * this.t2;
  this.W2 = 134.3 * d + 92.62 * d * this.t2;
  this.W3 = 42 * d - 0.5118 * d * this.t5;
  this.W4 = 276.59 * d + 0.5118 * d * this.t5;
  this.W5 = 267.2635 * d + 1222.1136 * d * this.t7;
  this.W6 = 175.4762 * d + 1221.5515 * d * this.t7;
  this.W7 = 2.4891 * d + 0.002435 * d * this.t7;
  this.W8 = 113.35 * d - 0.2597 * d * this.t7;
  this.s1 = Math.sin(28.0817 * d);
  this.c1 = Math.cos(28.0817 * d);
  this.s2 = Math.sin(168.8112 * d);
  this.c2 = Math.cos(168.8112 * d);
  this.e1 = 0.05589 - 0.000346 * this.t7;
  this.sW0 = Math.sin(this.W0);
  this.s3W0 = Math.sin(3 * this.W0);
  this.s5W0 = Math.sin(5 * this.W0);
  this.sW1 = Math.sin(this.W1);
  this.sW2 = Math.sin(this.W2);
  this.sW3 = Math.sin(this.W3);
  this.cW3 = Math.cos(this.W3);
  this.sW4 = Math.sin(this.W4);
  this.cW4 = Math.cos(this.W4);
  this.sW7 = Math.sin(this.W7);
  this.cW7 = Math.cos(this.W7);
  return this;
}
M.Qs = Qs;

Qs.prototype.mimas = function () {
  var r = new R4();
  var L = 127.64 * d + 381.994497 * d * this.t1 - 43.57 * d * this.sW0 - 0.72 * d * this.s3W0 - 0.02144 * d * this.s5W0;
  var p = 106.1 * d + 365.549 * d * this.t2;
  var M = L - p;
  var C = 2.18287 * d * Math.sin(M) + 0.025988 * d * Math.sin(2 * M) + 0.00043 * d * Math.sin(3 * M);
  r.λ = L + C;
  r.r = 3.06879 / (1 + 0.01905 * Math.cos(M + C));
  r.γ = 1.563 * d;
  r.Ω = 54.5 * d - 365.072 * d * this.t2;
  return r;
};

Qs.prototype.enceladus = function () {
  var r = new R4();
  var L = 200.317 * d + 262.7319002 * d * this.t1 + 0.25667 * d * this.sW1 + 0.20883 * d * this.sW2;
  var p = 309.107 * d + 123.44121 * d * this.t2;
  var M = L - p;
  var C = 0.55577 * d * Math.sin(M) + 0.00168 * d * Math.sin(2 * M);
  r.λ = L + C;
  r.r = 3.94118 / (1 + 0.00485 * Math.cos(M + C));
  r.γ = 0.0262 * d;
  r.Ω = 348 * d - 151.95 * d * this.t2;
  return r;
};

Qs.prototype.tethys = function () {
  var r = new R4();
  r.λ = 285.306 * d + 190.69791226 * d * this.t1 + 2.063 * d * this.sW0 + 0.03409 * d * this.s3W0 + 0.001015 * d * this.s5W0;
  r.r = 4.880998;
  r.γ = 1.0976 * d;
  r.Ω = 111.33 * d - 72.2441 * d * this.t2;
  return r;
};

Qs.prototype.dione = function () {
  var r = new R4();
  var L = 254.712 * d + 131.53493193 * d * this.t1 - 0.0215 * d * this.sW1 - 0.01733 * d * this.sW2;
  var p = 174.8 * d + 30.82 * d * this.t2;
  var M = L - p;
  var C = 0.24717 * d * Math.sin(M) + 0.00033 * d * Math.sin(2 * M);
  r.λ = L + C;
  r.r = 6.24871 / (1 + 0.002157 * Math.cos(M + C));
  r.γ = 0.0139 * d;
  r.Ω = 232 * d - 30.27 * d * this.t2;
  return r;
};

Qs.prototype.rhea = function () {
  var pʹ = 342.7 * d + 10.057 * d * this.t2;

  var _base$sincos19 = base.sincos(pʹ),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      spʹ = _base$sincos20[0],
      cpʹ = _base$sincos20[1];

  var a1 = 0.000265 * spʹ + 0.001 * this.sW4;
  var a2 = 0.000265 * cpʹ + 0.001 * this.cW4;
  var e = Math.hypot(a1, a2);
  var p = Math.atan2(a1, a2);
  var N = 345 * d - 10.057 * d * this.t2;

  var _base$sincos21 = base.sincos(N),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sN = _base$sincos22[0],
      cN = _base$sincos22[1];

  var λʹ = 359.244 * d + 79.6900472 * d * this.t1 + 0.086754 * d * sN;
  var i = 28.0362 * d + 0.346898 * d * cN + 0.0193 * d * this.cW3;
  var Ω = 168.8034 * d + 0.736936 * d * sN + 0.041 * d * this.sW3;
  var a = 8.725924;
  return this.subr(λʹ, p, e, a, Ω, i);
};

Qs.prototype.subr = function (λʹ, p, e, a, Ω, i) {
  var r = new R4();
  var M = λʹ - p;
  var e2 = e * e;
  var e3 = e2 * e;
  var e4 = e2 * e2;
  var e5 = e3 * e2;
  var C = (2 * e - 0.25 * e3 + 0.0520833333 * e5) * Math.sin(M) + (1.25 * e2 - 0.458333333 * e4) * Math.sin(2 * M) + (1.083333333 * e3 - 0.671875 * e5) * Math.sin(3 * M) + 1.072917 * e4 * Math.sin(4 * M) + 1.142708 * e5 * Math.sin(5 * M);
  r.r = a * (1 - e2) / (1 + e * Math.cos(M + C)); // return value
  var g = Ω - 168.8112 * d;

  var _base$sincos23 = base.sincos(i),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      si = _base$sincos24[0],
      ci = _base$sincos24[1];

  var _base$sincos25 = base.sincos(g),
      _base$sincos26 = _slicedToArray(_base$sincos25, 2),
      sg = _base$sincos26[0],
      cg = _base$sincos26[1];

  var a1 = si * sg;
  var a2 = this.c1 * si * cg - this.s1 * ci;
  r.γ = Math.asin(Math.hypot(a1, a2)); // return value
  var u = Math.atan2(a1, a2);
  r.Ω = 168.8112 * d + u; // return value (w)
  var h = this.c1 * si - this.s1 * ci * cg;
  var ψ = Math.atan2(this.s1 * sg, h);
  r.λ = λʹ + C + u - g - ψ; // return value
  return r;
};

Qs.prototype.titan = function () {
  var _this = this;

  var L = 261.1582 * d + 22.57697855 * d * this.t4 + 0.074025 * d * this.sW3;
  var iʹ = 27.45141 * d + 0.295999 * d * this.cW3;
  var Ωʹ = 168.66925 * d + 0.628808 * d * this.sW3;

  var _base$sincos27 = base.sincos(iʹ),
      _base$sincos28 = _slicedToArray(_base$sincos27, 2),
      siʹ = _base$sincos28[0],
      ciʹ = _base$sincos28[1];

  var _base$sincos29 = base.sincos(Ωʹ - this.W8),
      _base$sincos30 = _slicedToArray(_base$sincos29, 2),
      sΩʹW8 = _base$sincos30[0],
      cΩʹW8 = _base$sincos30[1];

  var a1 = this.sW7 * sΩʹW8;
  var a2 = this.cW7 * siʹ - this.sW7 * ciʹ * cΩʹW8;
  var g0 = 102.8623 * d;
  var ψ = Math.atan2(a1, a2);
  var s = Math.hypot(a1, a2);
  var g = this.W4 - Ωʹ - ψ;
  var ϖ = 0;

  var _base$sincos31 = base.sincos(2 * g0),
      _base$sincos32 = _slicedToArray(_base$sincos31, 2),
      s2g0 = _base$sincos32[0],
      c2g0 = _base$sincos32[1];

  var f = function f() {
    ϖ = _this.W4 + 0.37515 * d * (Math.sin(2 * g) - s2g0);
    g = ϖ - Ωʹ - ψ;
  };
  f();
  f();
  f();
  var eʹ = 0.029092 + 0.00019048 * (Math.cos(2 * g) - c2g0);
  var qq = 2 * (this.W5 - ϖ);
  var b1 = siʹ * sΩʹW8;
  var b2 = this.cW7 * siʹ * cΩʹW8 - this.sW7 * ciʹ;
  var θ = Math.atan2(b1, b2) + this.W8;

  var _base$sincos33 = base.sincos(qq),
      _base$sincos34 = _slicedToArray(_base$sincos33, 2),
      sq = _base$sincos34[0],
      cq = _base$sincos34[1];

  var e = eʹ + 0.002778797 * eʹ * cq;
  var p = ϖ + 0.159215 * d * sq;
  var u = 2 * this.W5 - 2 * θ + ψ;

  var _base$sincos35 = base.sincos(u),
      _base$sincos36 = _slicedToArray(_base$sincos35, 2),
      su = _base$sincos36[0],
      cu = _base$sincos36[1];

  var h = 0.9375 * eʹ * eʹ * sq + 0.1875 * s * s * Math.sin(2 * (this.W5 - θ));
  var λʹ = L - 0.254744 * d * (this.e1 * Math.sin(this.W6) + 0.75 * this.e1 * this.e1 * Math.sin(2 * this.W6) + h);
  var i = iʹ + 0.031843 * d * s * cu;
  var Ω = Ωʹ + 0.031843 * d * s * su / siʹ;
  var a = 20.216193;
  return this.subr(λʹ, p, e, a, Ω, i);
};

Qs.prototype.hyperion = function () {
  var η = 92.39 * d + 0.5621071 * d * this.t6;
  var ζ = 148.19 * d - 19.18 * d * this.t8;
  var θ = 184.8 * d - 35.41 * d * this.t9;
  var θʹ = θ - 7.5 * d;
  var as = 176 * d + 12.22 * d * this.t8;
  var bs = 8 * d + 24.44 * d * this.t8;
  var cs = bs + 5 * d;
  var ϖ = 69.898 * d - 18.67088 * d * this.t8;
  var φ = 2 * (ϖ - this.W5);
  var χ = 94.9 * d - 2.292 * d * this.t8;

  var _base$sincos37 = base.sincos(η),
      _base$sincos38 = _slicedToArray(_base$sincos37, 2),
      sη = _base$sincos38[0],
      cη = _base$sincos38[1];

  var _base$sincos39 = base.sincos(ζ),
      _base$sincos40 = _slicedToArray(_base$sincos39, 2),
      sζ = _base$sincos40[0],
      cζ = _base$sincos40[1];

  var _base$sincos41 = base.sincos(2 * ζ),
      _base$sincos42 = _slicedToArray(_base$sincos41, 2),
      s2ζ = _base$sincos42[0],
      c2ζ = _base$sincos42[1];

  var _base$sincos43 = base.sincos(3 * ζ),
      _base$sincos44 = _slicedToArray(_base$sincos43, 2),
      s3ζ = _base$sincos44[0],
      c3ζ = _base$sincos44[1];

  var _base$sincos45 = base.sincos(ζ + η),
      _base$sincos46 = _slicedToArray(_base$sincos45, 2),
      sζpη = _base$sincos46[0],
      cζpη = _base$sincos46[1];

  var _base$sincos47 = base.sincos(ζ - η),
      _base$sincos48 = _slicedToArray(_base$sincos47, 2),
      sζmη = _base$sincos48[0],
      cζmη = _base$sincos48[1];

  var _base$sincos49 = base.sincos(φ),
      _base$sincos50 = _slicedToArray(_base$sincos49, 2),
      sφ = _base$sincos50[0],
      cφ = _base$sincos50[1];

  var _base$sincos51 = base.sincos(χ),
      _base$sincos52 = _slicedToArray(_base$sincos51, 2),
      sχ = _base$sincos52[0],
      cχ = _base$sincos52[1];

  var _base$sincos53 = base.sincos(cs),
      _base$sincos54 = _slicedToArray(_base$sincos53, 2),
      scs = _base$sincos54[0],
      ccs = _base$sincos54[1];

  var a = 24.50601 - 0.08686 * cη - 0.00166 * cζpη + 0.00175 * cζmη;
  var e = 0.103458 - 0.004099 * cη - 0.000167 * cζpη + 0.000235 * cζmη + 0.02303 * cζ - 0.00212 * c2ζ + 0.000151 * c3ζ + 0.00013 * cφ;
  var p = ϖ + 0.15648 * d * sχ - 0.4457 * d * sη - 0.2657 * d * sζpη - 0.3573 * d * sζmη - 12.872 * d * sζ + 1.668 * d * s2ζ - 0.2419 * d * s3ζ - 0.07 * d * sφ;
  var λʹ = 177.047 * d + 16.91993829 * d * this.t6 + 0.15648 * d * sχ + 9.142 * d * sη + 0.007 * d * Math.sin(2 * η) - 0.014 * d * Math.sin(3 * η) + 0.2275 * d * sζpη + 0.2112 * d * sζmη - 0.26 * d * sζ - 0.0098 * d * s2ζ - 0.013 * d * Math.sin(as) + 0.017 * d * Math.sin(bs) - 0.0303 * d * sφ;
  var i = 27.3347 * d + 0.6434886 * d * cχ + 0.315 * d * this.cW3 + 0.018 * d * Math.cos(θ) - 0.018 * d * ccs;
  var Ω = 168.6812 * d + 1.40136 * d * cχ + 0.68599 * d * this.sW3 - 0.0392 * d * scs + 0.0366 * d * Math.sin(θʹ);
  return this.subr(λʹ, p, e, a, Ω, i);
};

Qs.prototype.iapetus = function () {
  var L = 261.1582 * d + 22.57697855 * d * this.t4;
  var ϖʹ = 91.796 * d + 0.562 * d * this.t7;
  var ψ = 4.367 * d - 0.195 * d * this.t7;
  var θ = 146.819 * d - 3.198 * d * this.t7;
  var φ = 60.47 * d + 1.521 * d * this.t7;
  var Φ = 205.055 * d - 2.091 * d * this.t7;
  var eʹ = 0.028298 + 0.001156 * this.t11;
  var ϖ0 = 352.91 * d + 11.71 * d * this.t11;
  var μ = 76.3852 * d + 4.53795125 * d * this.t10;
  var iʹ = base.horner(this.t11, 18.4602 * d, -0.9518 * d, -0.072 * d, 0.0054 * d);
  var Ωʹ = base.horner(this.t11, 143.198 * d, -3.919 * d, 0.116 * d, 0.008 * d);
  var l = μ - ϖ0;
  var g = ϖ0 - Ωʹ - ψ;
  var g1 = ϖ0 - Ωʹ - φ;
  var ls = this.W5 - ϖʹ;
  var gs = ϖʹ - θ;
  var lT = L - this.W4;
  var gT = this.W4 - Φ;
  var u1 = 2 * (l + g - ls - gs);
  var u2 = l + g1 - lT - gT;
  var u3 = l + 2 * (g - ls - gs);
  var u4 = lT + gT - g1;
  var u5 = 2 * (ls + gs);

  var _base$sincos55 = base.sincos(l),
      _base$sincos56 = _slicedToArray(_base$sincos55, 2),
      sl = _base$sincos56[0],
      cl = _base$sincos56[1];

  var _base$sincos57 = base.sincos(u1),
      _base$sincos58 = _slicedToArray(_base$sincos57, 2),
      su1 = _base$sincos58[0],
      cu1 = _base$sincos58[1];

  var _base$sincos59 = base.sincos(u2),
      _base$sincos60 = _slicedToArray(_base$sincos59, 2),
      su2 = _base$sincos60[0],
      cu2 = _base$sincos60[1];

  var _base$sincos61 = base.sincos(u3),
      _base$sincos62 = _slicedToArray(_base$sincos61, 2),
      su3 = _base$sincos62[0],
      cu3 = _base$sincos62[1];

  var _base$sincos63 = base.sincos(u4),
      _base$sincos64 = _slicedToArray(_base$sincos63, 2),
      su4 = _base$sincos64[0],
      cu4 = _base$sincos64[1];

  var _base$sincos65 = base.sincos(l + u2),
      _base$sincos66 = _slicedToArray(_base$sincos65, 2),
      slu2 = _base$sincos66[0],
      clu2 = _base$sincos66[1];

  var _base$sincos67 = base.sincos(g1 - gT),
      _base$sincos68 = _slicedToArray(_base$sincos67, 2),
      sg1gT = _base$sincos68[0],
      cg1gT = _base$sincos68[1];

  var _base$sincos69 = base.sincos(u5 - 2 * g),
      _base$sincos70 = _slicedToArray(_base$sincos69, 2),
      su52g = _base$sincos70[0],
      cu52g = _base$sincos70[1];

  var _base$sincos71 = base.sincos(u5 + ψ),
      _base$sincos72 = _slicedToArray(_base$sincos71, 2),
      su5ψ = _base$sincos72[0],
      cu5ψ = _base$sincos72[1];

  var _base$sincos73 = base.sincos(u2 + φ),
      _base$sincos74 = _slicedToArray(_base$sincos73, 2),
      su2φ = _base$sincos74[0],
      cu2φ = _base$sincos74[1];

  var _base$sincos75 = base.sincos(l + g1 + lT + gT + φ),
      _base$sincos76 = _slicedToArray(_base$sincos75, 2),
      s5 = _base$sincos76[0],
      c5 = _base$sincos76[1];

  var a = 58.935028 + 0.004638 * cu1 + 0.058222 * cu2;
  var e = eʹ - 0.0014097 * cg1gT + 0.0003733 * cu52g + 0.000118 * cu3 + 0.0002408 * cl + 0.0002849 * clu2 + 0.000619 * cu4;
  var w = 0.08077 * d * sg1gT + 0.02139 * d * su52g - 0.00676 * d * su3 + 0.0138 * d * sl + 0.01632 * d * slu2 + 0.03547 * d * su4;
  var p = ϖ0 + w / eʹ;
  var λʹ = μ - 0.04299 * d * su2 - 0.00789 * d * su1 - 0.06312 * d * Math.sin(ls) - 0.00295 * d * Math.sin(2 * ls) - 0.02231 * d * Math.sin(u5) + 0.0065 * d * su5ψ;
  var i = iʹ + 0.04204 * d * cu5ψ + 0.00235 * d * c5 + 0.0036 * d * cu2φ;
  var wʹ = 0.04204 * d * su5ψ + 0.00235 * d * s5 + 0.00358 * d * su2φ;
  var Ω = Ωʹ + wʹ / Math.sin(iʹ);
  return this.subr(λʹ, p, e, a, Ω, i);
};