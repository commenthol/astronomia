'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonphase
 */
/**
 * Moonphase: Chapter 49, Phases of the Moon
 */

var base = require('./base');
var M = exports;

var ck = 1 / 1236.85;

/**
 * mean synodial lunar month
 */
M.meanLunarMonth = 29.530588861;

// (49.1) p. 349
function mean(T) {
  return base.horner(T, 2451550.09766, 29.530588861 / ck, 0.00015437, -0.00000015, 0.00000000073);
}

/** snap returns k at specified quarter q nearest year y. */
function snap(y, q) {
  var k = (y - 2000) * 12.3685; // (49.2) p. 350
  return Math.floor(k - q + 0.5) + q;
}

/**
 * MeanNew returns the jde of the mean New Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of New Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.meanNew = function (year) {
  return mean(snap(year, 0) * ck);
};

/**
 * MeanFirst returns the jde of the mean First Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of First Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.meanFirst = function (year) {
  return mean(snap(year, 0.25) * ck);
};

/**
 * MeanFull returns the jde of the mean Full Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Full Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.meanFull = function (year) {
  return mean(snap(year, 0.5) * ck);
};

/**
 * MeanLast returns the jde of the mean Last Quarter Moon nearest the given datthis.
 * The mean date is within 0.5 day of the true date of Last Quarter Moon.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.meanLast = function (year) {
  return mean(snap(year, 0.75) * ck);
};

/**
 * New returns the jde of New Moon nearest the given date.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.new = function (year) {
  var m = new Mp(year, 0);
  return mean(m.T) + m.nfc(nc) + m.a();
};

/**
 * First returns the jde of First Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.first = function (year, month, day) {
  var m = new Mp(year, 0.25);
  return mean(m.T) + m.flc() + m.w() + m.a();
};

/**
 * Full returns the jde of Full Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.full = function (year, month, day) {
  var m = new Mp(year, 0.5);
  return mean(m.T) + m.nfc(fc) + m.a();
};

/**
 * Last returns the jde of Last Quarter Moon nearest the given datthis.
 *
 * @param {Number} year - decimal year
 * @returns {Number} jde
 */
M.last = function (year, month, day) {
  var m = new Mp(year, 0.75);
  return mean(m.T) + m.flc() - m.w() + m.a();
};

var p = Math.PI / 180;

var Mp = function () {
  function Mp(y, q) {
    _classCallCheck(this, Mp);

    this.A = new Array(14);
    this.k = snap(y, q);
    this.T = this.k * ck; // (49.3) p. 350
    this.E = base.horner(this.T, 1, -0.002516, -0.0000074);
    this.M = base.horner(this.T, 2.5534 * p, 29.1053567 * p / ck, -0.0000014 * p, -0.00000011 * p);
    this.M_ = base.horner(this.T, 201.5643 * p, 385.81693528 * p / ck, 0.0107582 * p, 0.00001238 * p, -0.000000058 * p);
    this.F = base.horner(this.T, 160.7108 * p, 390.67050284 * p / ck, -0.0016118 * p, -0.00000227 * p, 0.000000011 * p);
    this.Ω = base.horner(this.T, 124.7746 * p, -1.56375588 * p / ck, 0.0020672 * p, 0.00000215 * p);
    this.A[0] = 299.7 * p + 0.107408 * p * this.k - 0.009173 * this.T * this.T;
    this.A[1] = 251.88 * p + 0.016321 * p * this.k;
    this.A[2] = 251.83 * p + 26.651886 * p * this.k;
    this.A[3] = 349.42 * p + 36.412478 * p * this.k;
    this.A[4] = 84.66 * p + 18.206239 * p * this.k;
    this.A[5] = 141.74 * p + 53.303771 * p * this.k;
    this.A[6] = 207.17 * p + 2.453732 * p * this.k;
    this.A[7] = 154.84 * p + 7.30686 * p * this.k;
    this.A[8] = 34.52 * p + 27.261239 * p * this.k;
    this.A[9] = 207.19 * p + 0.121824 * p * this.k;
    this.A[10] = 291.34 * p + 1.844379 * p * this.k;
    this.A[11] = 161.72 * p + 24.198154 * p * this.k;
    this.A[12] = 239.56 * p + 25.513099 * p * this.k;
    this.A[13] = 331.55 * p + 3.592518 * p * this.k;
  }

  // new or full corrections


  _createClass(Mp, [{
    key: 'nfc',
    value: function nfc(c) {
      return c[0] * Math.sin(this.M_) + c[1] * Math.sin(this.M) * this.E + c[2] * Math.sin(2 * this.M_) + c[3] * Math.sin(2 * this.F) + c[4] * Math.sin(this.M_ - this.M) * this.E + c[5] * Math.sin(this.M_ + this.M) * this.E + c[6] * Math.sin(2 * this.M) * this.E * this.E + c[7] * Math.sin(this.M_ - 2 * this.F) + c[8] * Math.sin(this.M_ + 2 * this.F) + c[9] * Math.sin(2 * this.M_ + this.M) * this.E + c[10] * Math.sin(3 * this.M_) + c[11] * Math.sin(this.M + 2 * this.F) * this.E + c[12] * Math.sin(this.M - 2 * this.F) * this.E + c[13] * Math.sin(2 * this.M_ - this.M) * this.E + c[14] * Math.sin(this.Ω) + c[15] * Math.sin(this.M_ + 2 * this.M) + c[16] * Math.sin(2 * (this.M_ - this.F)) + c[17] * Math.sin(3 * this.M) + c[18] * Math.sin(this.M_ + this.M - 2 * this.F) + c[19] * Math.sin(2 * (this.M_ + this.F)) + c[20] * Math.sin(this.M_ + this.M + 2 * this.F) + c[21] * Math.sin(this.M_ - this.M + 2 * this.F) + c[22] * Math.sin(this.M_ - this.M - 2 * this.F) + c[23] * Math.sin(3 * this.M_ + this.M) + c[24] * Math.sin(4 * this.M_);
    }

    // first or last corrections

  }, {
    key: 'flc',
    value: function flc() {
      return -0.62801 * Math.sin(this.M_) + 0.17172 * Math.sin(this.M) * this.E + -0.01183 * Math.sin(this.M_ + this.M) * this.E + 0.00862 * Math.sin(2 * this.M_) + 0.00804 * Math.sin(2 * this.F) + 0.00454 * Math.sin(this.M_ - this.M) * this.E + 0.00204 * Math.sin(2 * this.M) * this.E * this.E + -0.0018 * Math.sin(this.M_ - 2 * this.F) + -0.0007 * Math.sin(this.M_ + 2 * this.F) + -0.0004 * Math.sin(3 * this.M_) + -0.00034 * Math.sin(2 * this.M_ - this.M) + 0.00032 * Math.sin(this.M + 2 * this.F) * this.E + 0.00032 * Math.sin(this.M - 2 * this.F) * this.E + -0.00028 * Math.sin(this.M_ + 2 * this.M) * this.E * this.E + 0.00027 * Math.sin(2 * this.M_ + this.M) * this.E + -0.00017 * Math.sin(this.Ω) + -0.00005 * Math.sin(this.M_ - this.M - 2 * this.F) + 0.00004 * Math.sin(2 * this.M_ + 2 * this.F) + -0.00004 * Math.sin(this.M_ + this.M + 2 * this.F) + 0.00004 * Math.sin(this.M_ - 2 * this.M) + 0.00003 * Math.sin(this.M_ + this.M - 2 * this.F) + 0.00003 * Math.sin(3 * this.M) + 0.00002 * Math.sin(2 * this.M_ - 2 * this.F) + 0.00002 * Math.sin(this.M_ - this.M + 2 * this.F) + -0.00002 * Math.sin(3 * this.M_ + this.M);
    }
  }, {
    key: 'w',
    value: function w() {
      return 0.00306 - 0.00038 * this.E * Math.cos(this.M) + 0.00026 * Math.cos(this.M_) - 0.00002 * (Math.cos(this.M_ - this.M) - Math.cos(this.M_ + this.M) - Math.cos(2 * this.F));
    }

    // additional corrections

  }, {
    key: 'a',
    value: function a() {
      var _this = this;

      var a = 0;
      ac.forEach(function (c, i) {
        a += c * Math.sin(_this.A[i]);
      });
      return a;
    }
  }]);

  return Mp;
}();

// new coefficients


var nc = [-0.4072, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208, -0.00111, -0.00057, 0.00056, -0.00042, 0.00042, 0.00038, -0.00024, -0.00017, -0.00007, 0.00004, 0.00004, 0.00003, 0.00003, -0.00003, 0.00003, -0.00002, -0.00002, 0.00002];

// full coefficients
var fc = [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209, -0.00111, -0.00057, 0.00056, -0.00042, 0.00042, 0.00038, -0.00024, -0.00017, -0.00007, 0.00004, 0.00004, 0.00003, 0.00003, -0.00003, 0.00003, -0.00002, -0.00002, 0.00002];

// additional corrections
var ac = [0.000325, 0.000165, 0.000164, 0.000126, 0.00011, 0.000062, 0.00006, 0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000035, 0.000023];