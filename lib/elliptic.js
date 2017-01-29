'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module elliptic
 */
/**
 * Elliptic: Chapter 33, Elliptic Motion.
 *
 * Partial: Various formulas and algorithms are unimplemented for lack of
 * examples or test cases.
 */
var apparent = require('./apparent');
var base = require('./base');
var coord = require('./coord');
var kepler = require('./kepler');
var nutation = require('./nutation');
var planetposition = require('./planetposition');
var solarxyz = require('./solarxyz');

var M = exports;

/**
 * Position returns observed equatorial coordinates of a planet at a given time.
 *
 * Argument p must be a valid V87Planet object for the observed planet.
 * Argument earth must be a valid V87Planet object for Earth.
 *
 * Results are right ascension and declination, α and δ in radians.
 */
M.position = function (planet, earth, jde) {
  // (p, earth *pp.V87Planet, jde float64)  (α, δ float64)
  var x = void 0;
  var y = void 0;
  var z = void 0;
  var posEarth = earth.position(jde);
  var _ref = [posEarth.lon, posEarth.lat, posEarth.range],
      L0 = _ref[0],
      B0 = _ref[1],
      R0 = _ref[2];

  var _base$sincos = base.sincos(B0),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sB0 = _base$sincos2[0],
      cB0 = _base$sincos2[1];

  var _base$sincos3 = base.sincos(L0),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sL0 = _base$sincos4[0],
      cL0 = _base$sincos4[1];

  function pos() {
    var τ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var pos = planet.position(jde - τ);
    var _ref2 = [pos.lon, pos.lat, pos.range],
        L = _ref2[0],
        B = _ref2[1],
        R = _ref2[2];

    var _base$sincos5 = base.sincos(B),
        _base$sincos6 = _slicedToArray(_base$sincos5, 2),
        sB = _base$sincos6[0],
        cB = _base$sincos6[1];

    var _base$sincos7 = base.sincos(L),
        _base$sincos8 = _slicedToArray(_base$sincos7, 2),
        sL = _base$sincos8[0],
        cL = _base$sincos8[1];

    x = R * cB * cL - R0 * cB0 * cL0;
    y = R * cB * sL - R0 * cB0 * sL0;
    z = R * sB - R0 * sB0;
  }

  pos();
  var Δ = Math.sqrt(x * x + y * y + z * z); // (33.4) p. 224
  var τ = base.lightTime(Δ);
  // repeating with jde-τ
  pos(τ);

  var λ = Math.atan2(y, x); // (33.1) p. 223
  var β = Math.atan2(z, Math.hypot(x, y)); // (33.2) p. 223

  var _apparent$eclipticAbe = apparent.eclipticAberration(λ, β, jde),
      _apparent$eclipticAbe2 = _slicedToArray(_apparent$eclipticAbe, 2),
      Δλ = _apparent$eclipticAbe2[0],
      Δβ = _apparent$eclipticAbe2[1];

  var fk5 = planetposition.toFK5(λ + Δλ, β + Δβ, jde);
  λ = fk5.lon;
  β = fk5.lat;

  var _nutation$nutation = nutation.nutation(jde),
      _nutation$nutation2 = _slicedToArray(_nutation$nutation, 2),
      Δψ = _nutation$nutation2[0],
      Δε = _nutation$nutation2[1];

  λ += Δψ;
  var ε = nutation.meanObliquity(jde) + Δε;
  return new coord.Ecliptic(λ, β).toEquatorial(ε);
  // Meeus gives a formula for elongation but doesn't spell out how to
  // obtaion term λ0 and doesn't give an example solution.
};

/**
 * Elements holds keplerian elements.
 */

var Elements = function () {
  /*
  Axis  float64 // Semimajor axis, a, in AU
  Ecc   float64 // Eccentricity, e
  Inc   float64 // Inclination, i, in radians
  ArgP  float64 // Argument of perihelion, ω, in radians
  Node  float64 // Longitude of ascending node, Ω, in radians
  TimeP float64 // Time of perihelion, T, as jde
  */
  function Elements(axis, ecc, inc, argP, node, timeP) {
    _classCallCheck(this, Elements);

    var o = {};
    if ((typeof axis === 'undefined' ? 'undefined' : _typeof(axis)) === 'object') {
      o = axis;
    }
    this.axis = o.axis || axis;
    this.ecc = o.ecc || ecc;
    this.inc = o.inc || inc;
    this.argP = o.argP || argP;
    this.node = o.node || node;
    this.timeP = o.timeP || timeP;
  }

  /**
   * Position returns observed equatorial coordinates of a body with Keplerian elements.
   *
   * Argument e must be a valid V87Planet object for Earth.
   *
   * Results are right ascension and declination α and δ, and elongation ψ,
   * all in radians.
   */


  _createClass(Elements, [{
    key: 'position',
    value: function position(jde, earth) {
      var _this = this;

      // (α, δ, ψ float64) {
      // (33.6) p. 227
      var n = base.K / this.axis / Math.sqrt(this.axis);
      var sε = base.SOblJ2000;
      var cε = base.COblJ2000;

      var _base$sincos9 = base.sincos(this.node),
          _base$sincos10 = _slicedToArray(_base$sincos9, 2),
          sΩ = _base$sincos10[0],
          cΩ = _base$sincos10[1];

      var _base$sincos11 = base.sincos(this.inc),
          _base$sincos12 = _slicedToArray(_base$sincos11, 2),
          si = _base$sincos12[0],
          ci = _base$sincos12[1];
      // (33.7) p. 228


      var F = cΩ;
      var G = sΩ * cε;
      var H = sΩ * sε;
      var P = -sΩ * ci;
      var Q = cΩ * ci * cε - si * sε;
      var R = cΩ * ci * sε + si * cε;
      // (33.8) p. 229
      var A = Math.atan2(F, P);
      var B = Math.atan2(G, Q);
      var C = Math.atan2(H, R);
      var a = Math.hypot(F, P);
      var b = Math.hypot(G, Q);
      var c = Math.hypot(H, R);

      var f = function f(jde) {
        // (x, y, z float64) {
        var M = n * (jde - _this.timeP);
        var E = void 0;
        try {
          E = kepler.kepler2b(_this.ecc, M, 15);
        } catch (e) {
          E = kepler.kepler3(_this.ecc, M);
        }
        var ν = kepler.true(E, _this.ecc);
        var r = kepler.radius(E, _this.ecc, _this.axis);
        // (33.9) p. 229
        var x = r * a * Math.sin(A + _this.argP + ν);
        var y = r * b * Math.sin(B + _this.argP + ν);
        var z = r * c * Math.sin(C + _this.argP + ν);
        return { x: x, y: y, z: z };
      };
      return M.astrometricJ2000(f, jde, earth);
    }
  }]);

  return Elements;
}();

M.Elements = Elements;

/**
 * AstrometricJ2000 is a utility function for computing astrometric coordinates.
 *
 * It is used internally and only exported so that it can be used from
 * multiple packages.  It is not otherwise expected to be used.
 *
 * Argument f is a function that returns J2000 equatorial rectangular
 * coodinates of a body.
 *
 * Results are J2000 right ascention, declination, and elongation.
 */
M.astrometricJ2000 = function (f, jde, earth) {
  // (f func(float64)  (x, y, z float64), jde float64, e *pp.V87Planet) (α, δ, ψ float64)
  var sol = solarxyz.positionJ2000(earth, jde);
  var _ref3 = [sol.x, sol.y, sol.z],
      X = _ref3[0],
      Y = _ref3[1],
      Z = _ref3[2];

  var ξ = void 0;
  var η = void 0;
  var ζ = void 0;
  var Δ = void 0;

  function fn() {
    var τ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    // (33.10) p. 229
    var _f = f(jde - τ),
        x = _f.x,
        y = _f.y,
        z = _f.z;

    ξ = X + x;
    η = Y + y;
    ζ = Z + z;
    Δ = Math.sqrt(ξ * ξ + η * η + ζ * ζ);
  }

  fn();
  var τ = base.lightTime(Δ);
  fn(τ);

  var α = Math.atan2(η, ξ);
  if (α < 0) {
    α += 2 * Math.PI;
  }
  var δ = Math.asin(ζ / Δ);
  var R0 = Math.sqrt(X * X + Y * Y + Z * Z);
  var ψ = Math.acos((ξ * X + η * Y + ζ * Z) / R0 / Δ);
  return new base.Coord(α, δ, undefined, ψ);
};

/**
 * Velocity returns instantaneous velocity of a body in elliptical orbit around the Sun.
 *
 * Argument a is the semimajor axis of the body, r is the instaneous distance
 * to the Sun, both in AU.
 *
 * Result is in Km/sec.
 */
M.velocity = function (a, r) {
  // (a, r float64)  float64
  return 42.1219 * Math.sqrt(1 / r - 0.5 / a);
};

/**
 * Velocity returns the velocity of a body at aphelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
M.vAphelion = function (a, e) {
  // (a, e float64)  float64
  return 29.7847 * Math.sqrt((1 - e) / (1 + e) / a);
};

/**
 * Velocity returns the velocity of a body at perihelion.
 *
 * Argument a is the semimajor axis of the body in AU, e is eccentricity.
 *
 * Result is in Km/sec.
 */
M.vPerihelion = function (a, e) {
  // (a, e float64)  float64
  return 29.7847 * Math.sqrt((1 + e) / (1 - e) / a);
};

/**
 * Length1 returns Ramanujan's approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 */
M.length1 = function (a, e) {
  // (a, e float64)  float64
  var b = a * Math.sqrt(1 - e * e);
  return Math.PI * (3 * (a + b) - Math.sqrt((a + 3 * b) * (3 * a + b)));
};

/**
 * Length2 returns an alternate approximation for the length of an elliptical
 * orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is in units used for semimajor axis, typically AU.
 */
M.length2 = function (a, e) {
  // (a, e float64)  float64
  var b = a * Math.sqrt(1 - e * e);
  var s = a + b;
  var p = a * b;
  var A = s * 0.5;
  var G = Math.sqrt(p);
  var H = 2 * p / s;
  return Math.PI * (21 * A - 2 * G - 3 * H) * 0.125;
};

/**
 * Length3 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 */
/* As Meeus notes, Length4 converges faster.  There is no reason to use
this function
M.length3 = function (a, e) { // (a, e float64)  float64
  let sum0 = 1.0
  let e2 = e * e
  let term = e2 * 0.25
  let sum1 = 1.0 - term
  let nf = 1.0
  let df = 2.0
  while (sum1 !== sum0) {
    term *= nf
    nf += 2
    df += 2
    term *= nf * e2 / (df * df)
    sum0 = sum1
    sum1 -= term
  }
  return 2 * Math.PI * a * sum0
} */

/**
 * Length4 returns the length of an elliptical orbit.
 *
 * Argument a is semimajor axis, e is eccentricity.
 *
 * Result is exact, and in units used for semimajor axis, typically AU.
 */
M.length4 = function (a, e) {
  // (a, e float64)  float64
  var b = a * Math.sqrt(1 - e * e);
  var m = (a - b) / (a + b);
  var m2 = m * m;
  var sum0 = 1.0;
  var term = m2 * 0.25;
  var sum1 = 1.0 + term;
  var nf = -1.0;
  var df = 2.0;
  while (sum1 !== sum0) {
    nf += 2;
    df += 2;
    term *= nf * nf * m2 / (df * df);
    sum0 = sum1;
    sum1 += term;
  }
  return 2 * Math.PI * a * sum0 / (1 + m);
};