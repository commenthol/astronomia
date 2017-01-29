'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module elementequinox
 */
/**
 * Elementequinox: Chapter 24, Reduction of Ecliptical Elements
 * from one Equinox to another one.
 *
 * See package precess for the method EclipticPrecessor.ReduceElements and
 * associated example.  The method is described in this chapter but located
 * in package precess so that it can be a method of EclipticPrecessor.
 */

var base = require('./base');
var M = exports;

/**
 * Elements are the orbital elements of a solar system object which change
 * from one equinox to another.
 *
 * @param {Number} inc  - inclination
 * @param {Number} node - longitude of ascending node (Ω)
 * @param {Number} peri - argument of perihelion (ω)
 */

var Elements = function Elements(inc, node, peri) {
  _classCallCheck(this, Elements);

  if ((typeof inc === 'undefined' ? 'undefined' : _typeof(inc)) === 'object') {
    node = inc.pode;
    peri = inc.peri;
    inc = inc.inc;
  }
  this.inc = inc || 0;
  this.node = node || 0;
  this.peri = peri || 0;
};

M.Elements = Elements;

// (24.4) p. 161
var S = 0.0001139788;
var C = 0.9999999935;
/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 to J2000.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
M.reduceB1950ToJ2000 = function (eFrom) {
  var W = eFrom.node - 174.298782 * Math.PI / 180;

  var _base$sincos = base.sincos(eFrom.inc),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      si = _base$sincos2[0],
      ci = _base$sincos2[1];

  var _base$sincos3 = base.sincos(W),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sW = _base$sincos4[0],
      cW = _base$sincos4[1];

  var A = si * sW;
  var B = C * si * cW - S * ci;
  var eTo = new Elements();
  eTo.inc = Math.asin(Math.hypot(A, B));
  eTo.node = base.pmod(174.997194 * Math.PI / 180 + Math.atan2(A, B), 2 * Math.PI);
  eTo.peri = base.pmod(eFrom.peri + Math.atan2(-S * sW, C * si - S * ci * cW), 2 * Math.PI);
  return eTo;
};

var Lp = 4.50001688 * Math.PI / 180;
var L = 5.19856209 * Math.PI / 180;
var J = 0.00651966 * Math.PI / 180;

/**
 * ReduceB1950ToJ2000 reduces orbital elements of a solar system body from
 * equinox B1950 in the FK4 system to equinox J2000 in the FK5 system.
 *
 * @param {Elements} eFrom
 * @returns {Elements} eTo
 */
M.reduceB1950FK4ToJ2000FK5 = function (eFrom) {
  var W = L + eFrom.node;

  var _base$sincos5 = base.sincos(eFrom.inc),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      si = _base$sincos6[0],
      ci = _base$sincos6[1];

  var _base$sincos7 = base.sincos(J),
      _base$sincos8 = _slicedToArray(_base$sincos7, 2),
      sJ = _base$sincos8[0],
      cJ = _base$sincos8[1];

  var _base$sincos9 = base.sincos(W),
      _base$sincos10 = _slicedToArray(_base$sincos9, 2),
      sW = _base$sincos10[0],
      cW = _base$sincos10[1];

  var eTo = new Elements();
  eTo.inc = Math.acos(ci * cJ - si * sJ * cW);
  eTo.node = base.pmod(Math.atan2(si * sW, ci * sJ + si * cJ * cW) - Lp, 2 * Math.PI);
  eTo.peri = base.pmod(eFrom.peri + Math.atan2(sJ * sW, si * cJ + ci * sJ * cW), 2 * Math.PI);
  return eTo;
};