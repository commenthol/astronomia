'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module eclipse
 */
/**
 * Eclipse: Chapter 54, Eclipses.
 */
var base = require('./base');
var moonphase = require('./moonphase');

var M = exports;

/**
 * @private
 */
var g = function g(k, jm, c1, c2) {
  // (k, jm, c1, c2 float64)  (eclipse bool, jdeMax, γ, u, Mʹ float64)
  var ck = 1 / 1236.85;
  var p = Math.PI / 180;
  var T = k * ck;
  var F = base.horner(T, 160.7108 * p, 390.67050284 * p / ck, -0.0016118 * p, -0.00000227 * p, 0.000000011 * p);
  if (Math.abs(Math.sin(F)) > 0.36) {
    return; // no eclipse
  }
  var eclipse = true;
  var E = base.horner(T, 1, -0.002516, -0.0000074);
  var M = base.horner(T, 2.5534 * p, 29.1053567 * p / ck, -0.0000014 * p, -0.00000011 * p);
  var Mʹ = base.horner(T, 201.5643 * p, 385.81693528 * p / ck, 0.0107582 * p, 0.00001238 * p, -0.000000058 * p);
  var Ω = base.horner(T, 124.7746 * p, -1.56375588 * p / ck, 0.0020672 * p, 0.00000215 * p);
  var sΩ = Math.sin(Ω);
  var F1 = F - 0.02665 * p * sΩ;
  var A1 = base.horner(T, 299.77 * p, 0.107408 * p / ck, -0.009173 * p);
  // (54.1) p. 380
  var jdeMax = jm + c1 * Math.sin(Mʹ) + c2 * Math.sin(M) * E + 0.0161 * Math.sin(2 * Mʹ) + -0.0097 * Math.sin(2 * F1) + 0.0073 * Math.sin(Mʹ - M) * E + -0.005 * Math.sin(Mʹ + M) * E + -0.0023 * Math.sin(Mʹ - 2 * F1) + 0.0021 * Math.sin(2 * M) * E + 0.0012 * Math.sin(Mʹ + 2 * F1) + 0.0006 * Math.sin(2 * Mʹ + M) * E + -0.0004 * Math.sin(3 * Mʹ) + -0.0003 * Math.sin(M + 2 * F1) * E + 0.0003 * Math.sin(A1) + -0.0002 * Math.sin(M - 2 * F1) * E + -0.0002 * Math.sin(2 * Mʹ - M) * E + -0.0002 * sΩ;
  var P = 0.207 * Math.sin(M) * E + 0.0024 * Math.sin(2 * M) * E + -0.0392 * Math.sin(Mʹ) + 0.0116 * Math.sin(2 * Mʹ) + -0.0073 * Math.sin(Mʹ + M) * E + 0.0067 * Math.sin(Mʹ - M) * E + 0.0118 * Math.sin(2 * F1);
  var Q = 5.2207 + -0.0048 * Math.cos(M) * E + 0.002 * Math.cos(2 * M) * E + -0.3299 * Math.cos(Mʹ) + -0.006 * Math.cos(Mʹ + M) * E + 0.0041 * Math.cos(Mʹ - M) * E;

  var _base$sincos = base.sincos(F1),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sF1 = _base$sincos2[0],
      cF1 = _base$sincos2[1];

  var W = Math.abs(cF1);
  var γ = (P * cF1 + Q * sF1) * (1 - 0.0048 * W);
  var u = 0.0059 + 0.0046 * Math.cos(M) * E + -0.0182 * Math.cos(Mʹ) + 0.0004 * Math.cos(2 * Mʹ) + -0.0005 * Math.cos(M + Mʹ);
  return [eclipse, jdeMax, γ, u, Mʹ]; // (eclipse bool, jdeMax, γ, u, Mʹ float64)
};

/**
 * Eclipse type identifiers returned from Solar and Lunar.
 */
var TYPE = M.TYPE = {
  None: 0,
  Partial: 1, // for solar eclipses
  Annular: 2, // solar
  AnnularTotal: 3, // solar
  Penumbral: 4, // for lunar eclipses
  Umbral: 5, // lunar
  Total: 6 // solar or lunar


  /**
   * Snap returns k at specified quarter q nearest year y.
   * Cut and paste from moonphase.  Time corresponding to k needed in these
   * algorithms but otherwise not meaningful enough to export from moonphase.
   */
};var snap = function snap(y, q) {
  // (y, q float64)  float64
  var k = (y - 2000) * 12.3685; // (49.2) p. 350
  return Math.floor(k - q + 0.5) + q;
};

/**
 * Solar computes quantities related to solar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Partial, Annular, AnnularTotal, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * central is true if the center of the eclipse shadow touches the Earth.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Earth center, in a plane through the center of the Earth.
 *
 * γ is the distance from the eclipse shadow center to the Earth center
 * at time jdeMax.
 *
 * u is the radius of the Moon's umbral cone in the plane of the Earth.
 *
 * p is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude for partial eclipses.  It is not valid for other
 * eclipse types.
 *
 * γ, u, and p are in units of equatorial Earth radii.
 */
M.solar = function (year) {
  // (year float64)  (eclipseType int, central bool, jdeMax, γ, u, p, mag float64)
  var eclipseType = TYPE.None;
  var mag = void 0;

  var _g = g(snap(year, 0), moonphase.meanNew(year), -0.4075, 0.1721),
      _g2 = _slicedToArray(_g, 5),
      e = _g2[0],
      jdeMax = _g2[1],
      γ = _g2[2],
      u = _g2[3],
      _ = _g2[4]; // eslint-disable-line no-unused-vars

  var p = u + 0.5461;
  if (!e) {
    return { type: eclipseType // no eclipse
    };
  }
  var aγ = Math.abs(γ);
  if (aγ > 1.5433 + u) {
    return { type: eclipseType // no eclipse
    };
  }
  var central = aγ < 0.9972; // eclipse center touches Earth

  if (!central) {
    eclipseType = TYPE.Partial; // most common case
    if (aγ < 1.026) {
      // umbral cone may touch earth
      if (aγ < 0.9972 + Math.abs(u)) {
        // total or annular
        eclipseType = TYPE.Total; // report total in both cases
      }
    }
  } else if (u < 0) {
    eclipseType = TYPE.Total;
  } else if (u > 0.0047) {
    eclipseType = TYPE.Annular;
  } else {
    var ω = 0.00464 * Math.sqrt(1 - γ * γ);
    if (u < ω) {
      eclipseType = TYPE.AnnularTotal;
    } else {
      eclipseType = TYPE.Annular;
    }
  }

  if (eclipseType === TYPE.Partial) {
    // (54.2) p. 382
    mag = (1.5433 + u - aγ) / (0.5461 + 2 * u);
  }

  return {
    type: eclipseType,
    central: central,
    jdeMax: jdeMax,
    magnitude: mag,
    distance: γ,
    umbral: u,
    penumbral: p
  };
};

/**
 * Lunar computes quantities related to lunar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Penumbral, Umbral, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Moon center, in a plane through the center of the Moon.
 *
 * γ is the distance from the eclipse shadow center to the moon center
 * at time jdeMax.
 *
 * σ is the radius of the umbral cone in the plane of the Moon.
 *
 * ρ is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude.
 *
 * sd- return values are semidurations of the phases of the eclipse, in days.
 *
 * γ, σ, and ρ are in units of equatorial Earth radii.
 */
M.lunar = function (year) {
  // (year float64)  (eclipseType int, jdeMax, γ, ρ, σ, mag, sdTotal, sdPartial, sdPenumbral float64)
  var eclipseType = TYPE.None;
  var mag = void 0;
  var sdTotal = void 0;
  var sdPartial = void 0;
  var sdPenumbral = void 0;

  var _g3 = g(snap(year, 0.5), moonphase.meanFull(year), -0.4065, 0.1727),
      _g4 = _slicedToArray(_g3, 5),
      e = _g4[0],
      jdeMax = _g4[1],
      γ = _g4[2],
      u = _g4[3],
      Mʹ = _g4[4];

  if (!e) {
    return { type: eclipseType // no eclipse
    };
  }
  var ρ = 1.2848 + u;
  var σ = 0.7403 - u;
  var aγ = Math.abs(γ);
  mag = (1.0128 - u - aγ) / 0.545; // (54.3) p. 382

  if (mag > 1) {
    eclipseType = TYPE.Total;
  } else if (mag > 0) {
    eclipseType = TYPE.Umbral;
  } else {
    mag = (1.5573 + u - aγ) / 0.545; // (54.4) p. 382
    if (mag < 0) {
      return; // no eclipse
    }
    eclipseType = TYPE.Penumbral;
  }

  var p = 1.0128 - u;
  var t = 0.4678 - u;
  var n = 0.5458 + 0.04 * Math.cos(Mʹ);
  var γ2 = γ * γ;

  /* eslint-disable no-fallthrough */
  switch (eclipseType) {
    case TYPE.Total:
      {
        sdTotal = Math.sqrt(t * t - γ2) / n / 24;
      }
    case TYPE.Umbral:
      {
        sdPartial = Math.sqrt(p * p - γ2) / n / 24;
      }
    default:
      {
        var h = 1.5573 + u;
        sdPenumbral = Math.sqrt(h * h - γ2) / n / 24;
      }
  }
  /* eslint-enable */

  return {
    type: eclipseType,
    jdeMax: jdeMax,
    magnitude: mag,
    distance: γ,
    umbral: σ,
    penumbral: ρ,
    sdTotal: sdTotal,
    sdPartial: sdPartial,
    sdPenumbral: sdPenumbral
  };
};