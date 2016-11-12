'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module rise
 */
/**
 * Rise: Chapter 15, Rising, Transit, and Setting.
 */

var base = require('./base');
var interp = require('./interpolation');
var sexa = require('./sexagesimal');
var sidereal = require('./sidereal');
var deltat = require('./deltat');
var julian = require('./julian');

var M = exports;

var meanRefraction = new sexa.Angle(false, 0, 34, 0).rad();

/**
 * "Standard altitudes" for various bodies.
 *
 * The standard altitude is the geometric altitude of the center of body
 * at the time of apparent rising or setting.
 */
M.Stdh0Stellar = new sexa.Angle(true, 0, 34, 0).rad();
M.Stdh0Solar = new sexa.Angle(true, 0, 50, 0).rad();
M.Stdh0LunarMean = new sexa.Angle(false, 0, 0, 0.125).rad();

/**
 * Stdh0Lunar is the standard altitude of the Moon considering π, the
 * Moon's horizontal parallax.
 */
M.Stdh0Lunar = function (π) {
  // (π float64)  float64
  return new sexa.Angle(false, 0, 0, 0.7275).rad() * π - meanRefraction;
};

/**
 * ErrorCircumpolar returned by Times when the object does not rise and
 * set on the day of interest.
 */
var errorCircumpolar = new Error('Circumpolar');

var SECS_PER_DEGREE = 240; // = 86400 / 360
var SECS_PER_DAY = 86400;
var D2R = Math.PI / 180;

var Rise = function () {
  /**
   * @param {number} lat - geographic latitude in degrees
   * @param {number} lon - geographic longitude in degrees (measured positively westward)
   * @param {number} jd - Julian Day
   * @param {number} h0 - "standard altitude" of the body in radians
   * @param {number|Array<number>} α - right ascension of the body.
   * @param {number|Array<number>} δ - declination of the body.
   */

  function Rise(lat, lon, jd, h0, α, δ) {
    _classCallCheck(this, Rise);

    this.jd = jd;
    lat *= D2R; // convert to radians
    lon *= D2R;
    var Th0 = sidereal.apparent0UT(jd);
    if (this._isArr3(α) && this._isArr3(δ)) {
      var cal = new julian.Calendar().fromJD(jd);
      var ΔT = deltat.deltaT(cal.toYear());
      this._val = M.times({ lat: lat, lon: lon }, ΔT, h0, Th0, α, δ);
    } else {
      this._val = M.approxTimes({ lat: lat, lon: lon }, h0, Th0, α, δ);
    }
  }
  /**
   * @return {number} rise of body in julian days
   */


  _createClass(Rise, [{
    key: 'rise',
    value: function rise() {
      return this._toJD(this._val[0]);
    }
    /**
     * @return {number} transit of body in julian days
     */

  }, {
    key: 'transit',
    value: function transit() {
      return this._toJD(this._val[1]);
    }
    /**
     * @return {number} set of body in julian days
     */

  }, {
    key: 'set',
    value: function set() {
      return this._toJD(this._val[2]);
    }
    /**
     * @private
     */

  }, {
    key: '_isArr3',
    value: function _isArr3(a) {
      return Array.isArray(a) && a.length === 3;
    }
    /**
     * @private
     */

  }, {
    key: '_toJD',
    value: function _toJD(secs) {
      return this.jd + secs / 86400;
    }
  }]);

  return Rise;
}();

M.Rise = Rise;

/**
 * @return {number} local angle in seconds per day `[0, 86400[`
 */
function _H(lat, h0, δ) {
  // approximate local hour angle

  var _base$sincos = base.sincos(lat);

  var _base$sincos2 = _slicedToArray(_base$sincos, 2);

  var sLat = _base$sincos2[0];
  var cLat = _base$sincos2[1];

  var _base$sincos3 = base.sincos(δ);

  var _base$sincos4 = _slicedToArray(_base$sincos3, 2);

  var sδ1 = _base$sincos4[0];
  var cδ1 = _base$sincos4[1];

  var cosH = (Math.sin(h0) - sLat * sδ1) / (cLat * cδ1); // (15.1) p. 102
  if (cosH < -1 || cosH > 1) {
    throw errorCircumpolar;
  }
  var H = Math.acos(cosH) * SECS_PER_DEGREE * 180 / Math.PI; // in degrees per day === seconds
  return H;
}

/**
 * @param {number} lon - longitude in radians
 * @param {number} α - right ascension in radians
 * @param {number} th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @return {number} time of transit in seconds of day `[0, 86400[`
 */
function _mt(lon, α, th0) {
  // let mt = (((lon + α) * 180 / Math.PI - (th0 * 360 / 86400)) * 86400 / 360)
  var mt = (lon + α) * SECS_PER_DEGREE * 180 / Math.PI - th0;
  return mt;
}

/**
 * @param {number} Th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @param {number} m - motion in seconds of day `[0...86400[`
 * @return {number} new siderial time seconds of day `[0...86400[`
 */
function _th0(Th0, m) {
  // in original formula Th0 = 0...360 and m = 0...1 -> return value would be in 0...360 degrees
  // Th0 /= 240
  // m /= 86400
  var th0 = base.pmod(Th0 + m * 360.985647 / 360, SECS_PER_DAY); // p103
  return th0; // 0...86400 in seconds angle
}

/**
 * ApproxTimes computes approximate UT rise, transit and set times for
 * a celestial object on a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * values computed from the day.
 *
 *  p is geographic coordinates of observer.
 *  h0 is "standard altitude" of the body.
 *  Th0 is apparent sidereal time at 0h UT at Greenwich.
 *  α, δ are right ascension and declination of the body.
 *
 * h0 unit is radians.
 *
 * Th0 must be the time on the day of interest, in seconds.
 * See sidereal.apparent0UT.
 *
 * α, δ must be values at 0h dynamical time for the day of interest.
 * Units are radians.
 *
 * Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.approxTimes = function (p, h0, Th0, α, δ) {
  var H0 = _H(p.lat, h0, δ);
  // approximate transit, rise, set times.
  // (15.2) p. 102.0
  var mt = _mt(p.lon, α, Th0);
  var mTransit = base.pmod(mt, SECS_PER_DAY);
  var mRise = base.pmod(mt - H0, SECS_PER_DAY);
  var mSet = base.pmod(mt + H0, SECS_PER_DAY);
  return [mRise, mTransit, mSet];
};

/**
 * Times computes UT rise, transit and set times for a celestial object on
 * a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * a number of values computed from the day.
 *
 * @param {coord.Globe} p - is geographic coordinates of observer.
 * @param {number} ΔT - is delta T in seconds
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {Array<number>} α3 - slices of three right ascensions
 * @param {Array<number>} δ3 - slices of three declinations.
 *        α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 *        and the day after the day of interest.  Units are radians.
 *
 * @return Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
M.times = function (p, ΔT, h0, Th0, α3, δ3) {
  // (p globe.Coord, ΔT, h0, Th0 float64, α3, δ3 []float64)  (mRise, mTransit, mSet float64, err error)

  var _M$approxTimes = M.approxTimes(p, h0, Th0, α3[1], δ3[1]);

  var _M$approxTimes2 = _slicedToArray(_M$approxTimes, 3);

  var mRise = _M$approxTimes2[0];
  var mTransit = _M$approxTimes2[1];
  var mSet = _M$approxTimes2[2];

  var d3α = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, α3);
  var d3δ = new interp.Len3(-SECS_PER_DAY, SECS_PER_DAY, δ3);

  // adjust mTransit
  var ut = mTransit + ΔT;
  var α = d3α.interpolateX(ut);
  var th0 = _th0(Th0, mTransit);
  var H = -1 * _mt(p.lon, α, th0); // in secs // Hmeus = 0...360
  mTransit -= H;

  // adjust mRise, mSet

  var _base$sincos5 = base.sincos(p.lat);

  var _base$sincos6 = _slicedToArray(_base$sincos5, 2);

  var sLat = _base$sincos6[0];
  var cLat = _base$sincos6[1];


  var adjustRS = function adjustRS(m) {
    var ut = m + ΔT;
    var α = d3α.interpolateX(ut);
    var δ = d3δ.interpolateX(ut);
    var th0 = _th0(Th0, m);
    var H = -1 * _mt(p.lon, α, th0);
    var Hrad = H / SECS_PER_DEGREE * D2R;

    var _base$sincos7 = base.sincos(δ);

    var _base$sincos8 = _slicedToArray(_base$sincos7, 2);

    var sδ = _base$sincos8[0];
    var cδ = _base$sincos8[1];

    var h = Math.asin(sLat * sδ + cLat * cδ * Math.cos(Hrad)); // formula 13.6
    var Δm = SECS_PER_DAY * (h - h0) / (cδ * cLat * Math.sin(Hrad) * 2 * Math.PI); // formula p103 3
    return m + Δm;
  };

  mRise = adjustRS(mRise);
  mSet = adjustRS(mSet);

  return [mRise, mTransit, mSet];
};