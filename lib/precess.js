'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module precess
 */
/**
 * Precession: Chapter 21, Precession.
 *
 * Functions in this package take Julian epoch argurments rather than Julian
 * days.  Use base.JDEToJulianYear() to convert.
 *
 * Also in package base are some definitions related to the Besselian and
 * Julian Year.
 *
 * Partial:  Precession from FK4 not implemented.  Meeus gives no test cases.
 * It's a fair amount of code and data, representing significant chances for
 * errors.  And precession from FK4 would seem to be of little interest today.
 *
 * Proper motion units
 *
 * Meeus gives some example annual proper motions in units of seconds of
 * right ascension and seconds of declination.  To make units clear,
 * functions in this package take proper motions with argument types of
 * sexa.HourAngle and sexa.Angle respectively.  Error-prone conversions
 * can be avoided by using the constructors for these base types.
 *
 * For example, given an annual proper motion in right ascension of -0ˢ.03847,
 * rather than
 *
 * mra = -0.03847 / 13751 // as Meeus suggests
 *
 * or
 *
 * mra = -0.03847 * (15/3600) * (pi/180) // less magic
 *
 * use
 *
 * mra = new sexa.HourAngle(false, 0, 0, -0.03847)
 *
 * Unless otherwise indicated, functions in this library expect proper motions
 * to be annual proper motions, so the unit denominator is years.
 * (The code, following Meeus's example, technically treats it as Julian years.)
 */

var base = require('./base');
var coord = require('./coord');
var elementequinox = require('./elementequinox');
var nutation = require('./nutation');
var sexa = require('./sexagesimal');

var M = exports;

/**
 * approxAnnualPrecession returns approximate annual precision in right
 * ascension and declination.
 *
 * The two epochs should be within a few hundred years.
 * The declinations should not be too close to the poles.
 *
 * @param {coord.Equatorial} eqFrom
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {Array}
 *  {sexa.HourAngle} seconds of right ascension
 *  {sexa.Angle} seconds of Declination
 */
M.approxAnnualPrecession = function (eqFrom, epochFrom, epochTo) {
  var _mn = mn(epochFrom, epochTo),
      _mn2 = _slicedToArray(_mn, 3),
      m = _mn2[0],
      na = _mn2[1],
      nd = _mn2[2];

  var _base$sincos = base.sincos(eqFrom.ra),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sa = _base$sincos2[0],
      ca = _base$sincos2[1];
  // (21.1) p. 132


  var gDgas = m + na * sa * Math.tan(eqFrom.dec); // seconds of RA
  var gDgds = nd * ca; // seconds of Dec
  var ra = new sexa.HourAngle(false, 0, 0, gDgas).rad();
  var dec = new sexa.Angle(false, 0, 0, gDgds).rad();
  return { ra: ra, dec: dec };
};

/**
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 */
function mn(epochFrom, epochTo) {
  var T = (epochTo - epochFrom) * 0.01;
  var m = 3.07496 + 0.00186 * T;
  var na = 1.33621 - 0.00057 * T;
  var nd = 20.0431 - 0.0085 * T;
  return [m, na, nd];
}
M.mn = mn;

/**
 * ApproxPosition uses ApproxAnnualPrecession to compute a simple and quick
 * precession while still considering proper motion.
 *
 * @param {coord.Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mga - in radians
 * @param {Number} mgd - in radians
 * @returns {coord.Equatorial} eqTo
 */
M.approxPosition = function (eqFrom, epochFrom, epochTo, mga, mgd) {
  var _M$approxAnnualPreces = M.approxAnnualPrecession(eqFrom, epochFrom, epochTo),
      ra = _M$approxAnnualPreces.ra,
      dec = _M$approxAnnualPreces.dec;

  var dy = epochTo - epochFrom;
  var eqTo = new coord.Equatorial();
  eqTo.ra = eqFrom.ra + (ra + mga) * dy;
  eqTo.dec = eqFrom.dec + (dec + mgd) * dy;
  return eqTo;
};

// constants
var d = Math.PI / 180;
var s = d / 3600;

// coefficients from (21.2) p. 134
var gzT = [2306.2181 * s, 1.39656 * s, -0.000139 * s];
var zT = [2306.2181 * s, 1.39656 * s, -0.000139 * s];
var gthT = [2004.3109 * s, -0.8533 * s, -0.000217 * s];
// coefficients from (21.3) p. 134
var gzt = [2306.2181 * s, 0.30188 * s, 0.017998 * s];
var zt = [2306.2181 * s, 1.09468 * s, 0.018203 * s];
var gtht = [2004.3109 * s, -0.42665 * s, -0.041833 * s];

/**
 * Precessor represents precession from one epoch to another.
 *
 * Construct with NewPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */

var Precessor = function () {
  /**
   * constructs a Precessor object and initializes it to precess
   * coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  function Precessor(epochFrom, epochTo) {
    _classCallCheck(this, Precessor);

    // (21.2) p. 134
    var gzCoeff = gzt;
    var zCoeff = zt;
    var gthCoeff = gtht;
    if (epochFrom !== 2000) {
      var T = (epochFrom - 2000) * 0.01;
      gzCoeff = [base.horner(T, gzT), 0.30188 * s - 0.000344 * s * T, 0.017998 * s];
      zCoeff = [base.horner(T, zT), 1.09468 * s + 0.000066 * s * T, 0.018203 * s];
      gthCoeff = [base.horner(T, gthT), -0.42665 * s - 0.000217 * s * T, -0.041833 * s];
    }
    var t = (epochTo - epochFrom) * 0.01;
    this.gz = base.horner(t, gzCoeff) * t;
    this.z = base.horner(t, zCoeff) * t;
    var gth = base.horner(t, gthCoeff) * t;
    this.sgth = Math.sin(gth);
    this.cgth = Math.cos(gth);
  }

  /**
   * Precess precesses coordinates eqFrom, leaving result in eqTo.
   *
   * @param {coord.Equatorial} eqFrom
   * @returns {coord.Equatorial} eqTo
   */


  _createClass(Precessor, [{
    key: 'precess',
    value: function precess(eqFrom) {
      // (21.4) p. 134
      var _base$sincos3 = base.sincos(eqFrom.dec),
          _base$sincos4 = _slicedToArray(_base$sincos3, 2),
          sgd = _base$sincos4[0],
          cgd = _base$sincos4[1];

      var _base$sincos5 = base.sincos(eqFrom.ra + this.gz),
          _base$sincos6 = _slicedToArray(_base$sincos5, 2),
          sgagz = _base$sincos6[0],
          cgagz = _base$sincos6[1];

      var A = cgd * sgagz;
      var B = this.cgth * cgd * cgagz - this.sgth * sgd;
      var C = this.sgth * cgd * cgagz + this.cgth * sgd;
      var eqTo = new coord.Equatorial();
      eqTo.ra = Math.atan2(A, B) + this.z;
      if (C < base.CosSmallAngle) {
        eqTo.dec = Math.asin(C);
      } else {
        eqTo.dec = Math.acos(Math.hypot(A, B)); // near pole
      }
      return eqTo;
    }
  }]);

  return Precessor;
}();

M.Precessor = Precessor;

/**
 * Position precesses equatorial coordinates from one epoch to another,
 * including proper motions.
 *
 * If proper motions are not to be considered or are not applicable, pass 0, 0
 * for mga, mgd
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 * @param {coord.Equatorial} eqFrom
 * @param {coord.Equatorial} eqTo
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mga - in radians
 * @param {Number} mgd - in radians
 * @returns {coord.Equatorial} [eqTo]
 */
M.position = function (eqFrom, epochFrom, epochTo, mga, mgd) {
  var p = new Precessor(epochFrom, epochTo);
  var t = epochTo - epochFrom;
  var eqTo = new coord.Equatorial();
  eqTo.ra = eqFrom.ra + mga * t;
  eqTo.dec = eqFrom.dec + mgd * t;
  return p.precess(eqTo);
};

// coefficients from (21.5) p. 136
var ghT = [47.0029 * s, -0.06603 * s, 0.000598 * s];
var gpT = [174.876384 * d, 3289.4789 * s, 0.60622 * s];
var pT = [5029.0966 * s, 2.22226 * s, -0.000042 * s];
var ght = [47.0029 * s, -0.03302 * s, 0.000060 * s];
var gpt = [174.876384 * d, -869.8089 * s, 0.03536 * s];
var pt = [5029.0966 * s, 1.11113 * s, -0.000006 * s];

/**
 * EclipticPrecessor represents precession from one epoch to another.
 *
 * Construct with NewEclipticPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */

var EclipticPrecessor = function () {
  /**
   * constructs an EclipticPrecessor object and initializes
   * it to precess coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  function EclipticPrecessor(epochFrom, epochTo) {
    _classCallCheck(this, EclipticPrecessor);

    // (21.5) p. 136
    var ghCoeff = ght;
    var gpCoeff = gpt;
    var pCoeff = pt;
    if (epochFrom !== 2000) {
      var T = (epochFrom - 2000) * 0.01;
      ghCoeff = [base.horner(T, ghT), -0.03302 * s + 0.000598 * s * T, 0.000060 * s];
      gpCoeff = [base.horner(T, gpT), -869.8089 * s - 0.50491 * s * T, 0.03536 * s];
      pCoeff = [base.horner(T, pT), 1.11113 * s - 0.000042 * s * T, -0.000006 * s];
    }
    var t = (epochTo - epochFrom) * 0.01;
    this.gp = base.horner(t, gpCoeff);
    this.p = base.horner(t, pCoeff) * t;
    var gh = base.horner(t, ghCoeff) * t;
    this.sgh = Math.sin(gh);
    this.cgh = Math.cos(gh);
  }

  /**
   * EclipticPrecess precesses coordinates eclFrom, leaving result in eclTo.
   *
   * The same struct may be used for eclFrom and eclTo.
   * EclTo is returned for convenience.
   * @param {coord.Ecliptic} eclFrom
   * @param {coord.Ecliptic} eclTo
   * @returns {coord.Ecliptic} [eclTo]
   */


  _createClass(EclipticPrecessor, [{
    key: 'precess',
    value: function precess(eclFrom) {
      // (21.7) p. 137
      var _base$sincos7 = base.sincos(eclFrom.lat),
          _base$sincos8 = _slicedToArray(_base$sincos7, 2),
          sgb = _base$sincos8[0],
          cgb = _base$sincos8[1];

      var _base$sincos9 = base.sincos(this.gp - eclFrom.lon),
          _base$sincos10 = _slicedToArray(_base$sincos9, 2),
          sd = _base$sincos10[0],
          cd = _base$sincos10[1];

      var A = this.cgh * cgb * sd - this.sgh * sgb;
      var B = cgb * cd;
      var C = this.cgh * sgb + this.sgh * cgb * sd;
      var eclTo = new coord.Ecliptic();
      eclTo.lon = this.p + this.gp - Math.atan2(A, B);
      if (C < base.CosSmallAngle) {
        eclTo.lat = Math.asin(C);
      } else {
        eclTo.lat = Math.acos(Math.hypot(A, B)); // near pole
      }
      return eclTo;
    }

    /**
     * ReduceElements reduces orbital elements of a solar system body from one
     * equinox to another.
     *
     * This function is described in chapter 24, but is located in this
     * package so it can be a method of EclipticPrecessor.
     *
     * @param {elementequinox.Elements} eFrom
     * @returns {elementequinox.Elements} eTo
     */

  }, {
    key: 'reduceElements',
    value: function reduceElements(eFrom) {
      var gps = this.gp + this.p;

      var _base$sincos11 = base.sincos(eFrom.inc),
          _base$sincos12 = _slicedToArray(_base$sincos11, 2),
          si = _base$sincos12[0],
          ci = _base$sincos12[1];

      var _base$sincos13 = base.sincos(eFrom.node - this.gp),
          _base$sincos14 = _slicedToArray(_base$sincos13, 2),
          snp = _base$sincos14[0],
          cnp = _base$sincos14[1];

      var eTo = new elementequinox.Elements();
      // (24.1) p. 159
      eTo.inc = Math.acos(ci * this.cgh + si * this.sgh * cnp);
      // (24.2) p. 159
      eTo.node = Math.atan2(si * snp, this.cgh * si * cnp - this.sgh * ci) + gps;
      // (24.3) p. 159
      eTo.peri = Math.atan2(-this.sgh * snp, si * this.cgh - ci * this.sgh * cnp) + eFrom.peri;
      return eTo;
    }
  }]);

  return EclipticPrecessor;
}();

M.EclipticPrecessor = EclipticPrecessor;

/**
 * eclipticPosition precesses ecliptic coordinates from one epoch to another,
 * including proper motions.
 * While eclFrom is given as ecliptic coordinates, proper motions mga, mgd are
 * still expected to be equatorial.  If proper motions are not to be considered
 * or are not applicable, pass 0, 0.
 * Both eclFrom and eclTo must be non-nil, although they may point to the same
 * struct.  EclTo is returned for convenience.
 *
 * @param {coord.Ecliptic} eclFrom,
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {sexa.HourAngle} mga
 * @param {sexa.Angle} mgd
 * @returns {coord.Ecliptic} eclTo
 */
M.eclipticPosition = function (eclFrom, epochFrom, epochTo, mga, mgd) {
  var p = new EclipticPrecessor(epochFrom, epochTo);

  if (mga !== 0 || mgd !== 0) {
    var _M$properMotion = M.properMotion(mga.rad(), mgd.rad(), epochFrom, eclFrom),
        lon = _M$properMotion.lon,
        lat = _M$properMotion.lat;

    var t = epochTo - epochFrom;
    eclFrom.lon += lon * t;
    eclFrom.lat += lat * t;
  }
  return p.precess(eclFrom);
};

/**
 * @param {Number} mga - anual proper motion (ra)
 * @param {Number} mgd - anual proper motion (dec)
 * @param {Number} epoch
 * @param {coord.Ecliptic} ecl
 * @returns {Number[]} [mgl, mgb]
 */
M.properMotion = function (mga, mgd, epoch, ecl) {
  var ge = nutation.meanObliquity(base.JulianYearToJDE(epoch));

  var _base$sincos15 = base.sincos(ge),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      gesin = _base$sincos16[0],
      gecos = _base$sincos16[1];

  var _ecl$toEquatorial = ecl.toEquatorial(ge),
      ra = _ecl$toEquatorial.ra,
      dec = _ecl$toEquatorial.dec;

  var _base$sincos17 = base.sincos(ra),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sga = _base$sincos18[0],
      cga = _base$sincos18[1];

  var _base$sincos19 = base.sincos(dec),
      _base$sincos20 = _slicedToArray(_base$sincos19, 2),
      sgd = _base$sincos20[0],
      cgd = _base$sincos20[1];

  var cgb = Math.cos(ecl.lat);
  var lon = (mgd * gesin * cga + mga * cgd * (gecos * cgd + gesin * sgd * sga)) / (cgb * cgb);
  var lat = (mgd * (gecos * cgd + gesin * sgd * sga) - mga * gesin * cga * cgd) / cgb;
  return new coord.Ecliptic(lon, lat);
};

/**
 * ProperMotion3D takes the 3D equatorial coordinates of an object
 * at one epoch and computes its coordinates at a new epoch, considering
 * proper motion and radial velocity.
 *
 * Radial distance (r) must be in parsecs, radial velocitiy (mr) in
 * parsecs per year.
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 *
 * @param {coord.Equatorial} eqFrom,
 * @param {Number} epochFrom
 * @param {Number} r
 * @param {Number} mr
 * @param {sexa.HourAngle} mga
 * @param {sexa.Angle} mgd
 * @returns {coord.Equatorial} eqTo
 */
M.properMotion3D = function (eqFrom, epochFrom, epochTo, r, mr, mga, mgd) {
  var _base$sincos21 = base.sincos(eqFrom.ra),
      _base$sincos22 = _slicedToArray(_base$sincos21, 2),
      sga = _base$sincos22[0],
      cga = _base$sincos22[1];

  var _base$sincos23 = base.sincos(eqFrom.dec),
      _base$sincos24 = _slicedToArray(_base$sincos23, 2),
      sgd = _base$sincos24[0],
      cgd = _base$sincos24[1];

  var x = r * cgd * cga;
  var y = r * cgd * sga;
  var z = r * sgd;
  var mrr = mr / r;
  var zmgd = z * mgd.rad();
  var mx = x * mrr - zmgd * cga - y * mga.rad();
  var my = y * mrr - zmgd * sga + x * mga.rad();
  var mz = z * mrr + r * mgd.rad() * cgd;
  var t = epochTo - epochFrom;
  var xp = x + t * mx;
  var yp = y + t * my;
  var zp = z + t * mz;
  var eqTo = new coord.Equatorial();
  eqTo.ra = Math.atan2(yp, xp);
  eqTo.dec = Math.atan2(zp, Math.hypot(xp, yp));
  return eqTo;
};