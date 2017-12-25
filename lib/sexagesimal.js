'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sexagesimal
 */
/**
 * Sexagesimal functions
 */

var M = exports;

/**
 * Angle represents a general purpose angle.
 * Unit is radians.
 */

var Angle = function () {
  /**
  * constructs a new Angle value from sign, degree, minute, and second
  * components.
  * __One argument__
  * @param {Number} angle - (float) angle in radians
  * __Four arguments__
  * @param {Boolean} neg - sign, true if negative
  * @param {Number} d - (int) degree
  * @param {Number} m - (int) minute
  * @param {Number} s - (float) second
  */
  function Angle(neg, d, m, s) {
    _classCallCheck(this, Angle);

    if (arguments.length === 1) {
      this.angle = neg;
    } else {
      this.setDMS(neg, d, m, s);
    }
  }

  /**
   * SetDMS sets the value of an FAngle from sign, degree, minute, and second
   * components.
   * The receiver is returned as a convenience.
   * @param {Boolean} neg - sign, true if negative
   * @param {Number} d - (int) degree
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   * @returns {Angle}
   */


  _createClass(Angle, [{
    key: 'setDMS',
    value: function setDMS() {
      var neg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0;

      this.angle = M.DMSToDeg(neg, d, m, s) * Math.PI / 180;
      return this;
    }

    /**
     * sets angle
     * @param {Number} angle - (float) angle in radians
     * @returns {Angle}
     */

  }, {
    key: 'setAngle',
    value: function setAngle(rad) {
      this.angle = rad;
      return this;
    }

    /**
     * Rad returns the angle in radians.
     * @returns {Number} angle in radians
     */

  }, {
    key: 'rad',
    value: function rad() {
      return this.angle;
    }

    /**
     * Deg returns the angle in degrees.
     * @returns {Number} angle in degree
     */

  }, {
    key: 'deg',
    value: function deg() {
      return this.angle * 180 / Math.PI;
    }

    /**
    * toDMS converts to parsed sexagesimal angle component.
    */

  }, {
    key: 'toDMS',
    value: function toDMS() {
      return M.degToDMS(this.deg());
    }

    /**
     * Print angle in degree using `d°m´s.ss″`
     * @param {Number} precision - precision of `s.ss`
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString(precision) {
      var _toDMS = this.toDMS(),
          _toDMS2 = _slicedToArray(_toDMS, 4),
          neg = _toDMS2[0],
          d = _toDMS2[1],
          m = _toDMS2[2],
          s = _toDMS2[3];

      s = round(s, precision).toString().replace(/^0\./, '.');
      var str = (neg ? '-' : '') + (d + '°') + (m + '′') + (s + '″');
      return str;
    }

    /**
     * Print angle in degree using `d°.ff`
     * @param {Number} precision - precision of `.ff`
     * @returns {String}
     */

  }, {
    key: 'toDegString',
    value: function toDegString(precision) {
      var _modf = modf(this.deg()),
          _modf2 = _slicedToArray(_modf, 2),
          i = _modf2[0],
          s = _modf2[1];

      s = round(s, precision).toString().replace(/^0\./, '.');
      var str = i + '°' + s;
      return str;
    }
  }]);

  return Angle;
}();

M.Angle = Angle;

/**
 * HourAngle represents an angle corresponding to angular rotation of
 * the Earth in a specified time.
 *
 * Unit is radians.
 */

var HourAngle = function (_Angle) {
  _inherits(HourAngle, _Angle);

  function HourAngle() {
    _classCallCheck(this, HourAngle);

    return _possibleConstructorReturn(this, (HourAngle.__proto__ || Object.getPrototypeOf(HourAngle)).apply(this, arguments));
  }

  _createClass(HourAngle, [{
    key: 'setDMS',

    /**
    * NewHourAngle constructs a new HourAngle value from sign, hour, minute,
    * and second components.
    * @param {Boolean} neg
    * @param {Number} h - (int)
    * @param {Number} m - (int)
    * @param {Number} s - (float)
    */
    // constructor (neg, h, m, s) {
    // super(neg, h, m, s)
    // }

    /**
     * SetDMS sets the value of an FAngle from sign, degree, minute, and second
     * components.
     * The receiver is returned as a convenience.
     * @param {Boolean} neg - sign, true if negative
     * @param {Number} h - (int) hour
     * @param {Number} m - (int) minute
     * @param {Number} s - (float) second
     * @returns {Angle}
     */
    value: function setDMS() {
      var neg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0;

      this.angle = M.DMSToDeg(neg, h, m, s) * 15 * Math.PI / 180;
      return this;
    }

    /**
     * Hour returns the hour angle as hours of time.
     * @returns hour angle
     */

  }, {
    key: 'hour',
    value: function hour() {
      return this.angle * 12 / Math.PI; // 12 = 180 / 15
    }
  }, {
    key: 'deg',
    value: function deg() {
      return this.hour();
    }

    /**
     * Print angle in `HʰMᵐs.ssˢ`
     * @param {Number} precision - precision of `s.ss`
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString(precision) {
      var _toDMS3 = this.toDMS(),
          _toDMS4 = _slicedToArray(_toDMS3, 4),
          neg = _toDMS4[0],
          h = _toDMS4[1],
          m = _toDMS4[2],
          s = _toDMS4[3];

      s = round(s, precision).toString().replace(/^0\./, '.');
      var str = (neg ? '-' : '') + (h + 'ʰ') + (m + 'ᵐ') + (s + 'ˢ');
      return str;
    }
  }]);

  return HourAngle;
}(Angle);

M.HourAngle = HourAngle;

/**
 * DMSToDeg converts from parsed sexagesimal angle components to decimal
 * degrees.
 * @param {Boolean} neg - sign, true if negative
 * @param {Number} d - (int) degree
 * @param {Number} m - (int) minute
 * @param {Number} s - (float) second
 * @returns {Number} angle in degree
 */
M.DMSToDeg = function (neg, d, m, s) {
  s = ((d * 60 + m) * 60 + s) / 3600;
  if (neg) {
    return -s;
  }
  return s;
};

/**
 * DegToDMS converts from decimal degrees to parsed sexagesimal angle component.
 * @param {Number} deg - angle in degree
 * @returns {Array} [neg, d, m, s]
 *  {Boolean} neg - sign, true if negative
 *  {Number} d - (int) degree
 *  {Number} m - (int) minute
 *  {Number} s - (float) second
 */
M.degToDMS = function (deg) {
  var neg = deg < 0;
  deg = Math.abs(deg);

  var _modf3 = modf(deg % 360),
      _modf4 = _slicedToArray(_modf3, 2),
      d = _modf4[0],
      s = _modf4[1];

  var _modf5 = modf(s * 60),
      _modf6 = _slicedToArray(_modf5, 2),
      m = _modf6[0],
      s1 = _modf6[1];

  s = round(s1 * 60); // may introduce an error < 1e13
  return [neg, d, m, s];
};

/**
 * TODO
 */

var RA = function (_HourAngle) {
  _inherits(RA, _HourAngle);

  /**
   * constructs a new RA value from hour, minute, and second components.
   * Negative values are not supported, RA wraps values larger than 24
   * to the range [0,24) hours.
   * @param {Number} h - (int) hour
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   */
  function RA() {
    var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, RA);

    var _this2 = _possibleConstructorReturn(this, (RA.__proto__ || Object.getPrototypeOf(RA)).call(this));

    var args = [].slice.call(arguments);
    if (args.length === 1) {
      _this2.angle = h;
    } else {
      var hr = M.DMSToDeg(false, h, m, s) % 24;
      _this2.angle = hr * 15 * Math.PI / 180;
    }
    return _this2;
  }

  _createClass(RA, [{
    key: 'hour',
    value: function hour() {
      var h = this.angle * 12 / Math.PI;
      return (24 + h % 24) % 24;
    }
  }]);

  return RA;
}(HourAngle);

M.RA = RA;

/**
 * TODO
 */

var Time = function () {
  /**
   * @param {Boolean} neg - set `true` if negative
   * @param {Number} h - (int) hour
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   */
  function Time(neg, h, m, s) {
    _classCallCheck(this, Time);

    if (arguments.length === 1) {
      this.time = neg;
    } else {
      this.setHMS(neg, h, m, s);
    }
  }

  _createClass(Time, [{
    key: 'setHMS',
    value: function setHMS() {
      var neg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      s += (h * 60 + m) * 60;
      if (neg) {
        s = -s;
      }
      this.time = s;
    }

    /**
     * @returns {Number} time in seconds.
     */

  }, {
    key: 'sec',
    value: function sec() {
      return this.time;
    }

    /**
     * @returns {Number} time in minutes.
     */

  }, {
    key: 'min',
    value: function min() {
      return this.time / 60;
    }

    /**
     * @returns {Number} time in hours.
     */

  }, {
    key: 'hour',
    value: function hour() {
      return this.time / 3600;
    }

    /**
     * @returns {Number} time in days.
     */

  }, {
    key: 'day',
    value: function day() {
      return this.time / 3600 / 24;
    }

    /**
     * @returns {Number} time in radians, where 1 day = 2 Pi radians.
     */

  }, {
    key: 'rad',
    value: function rad() {
      return this.time * Math.PI / 12 / 3600;
    }

    /**
     * convert time to HMS
     * @returns {Array} [neg, h, m, s]
     *  {Boolean} neg - sign, true if negative
     *  {Number} h - (int) hour
     *  {Number} m - (int) minute
     *  {Number} s - (float) second
     */

  }, {
    key: 'toHMS',
    value: function toHMS() {
      var t = this.time;
      var neg = t < 0;
      t = neg ? -t : t;
      var h = Math.trunc(t / 3600);
      t = t - h * 3600;
      var m = Math.trunc(t / 60);
      var s = t - m * 60;
      return [neg, h, m, s];
    }

    /**
     * Print time using `HʰMᵐsˢ.ss`
     * @param {Number} precision - precision of `.ss`
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString(precision) {
      var _toHMS = this.toHMS(),
          _toHMS2 = _slicedToArray(_toHMS, 4),
          neg = _toHMS2[0],
          h = _toHMS2[1],
          m = _toHMS2[2],
          s = _toHMS2[3];

      var _modf7 = modf(s),
          _modf8 = _slicedToArray(_modf7, 2),
          si = _modf8[0],
          sf = _modf8[1];

      if (precision === 0) {
        si = round(s, 0);
        sf = 0;
      } else {
        sf = round(sf, precision).toString().substr(1);
      }
      var str = (neg ? '-' : '') + (h + 'ʰ') + (m + 'ᵐ') + (si + 'ˢ') + (sf || '');
      return str;
    }
  }]);

  return Time;
}();

M.Time = Time;

// units
M.angleFromDeg = function (deg) {
  return deg * Math.PI / 180;
};
M.angleFromMin = function (min) {
  return min / 60 * Math.PI / 180;
};
M.angleFromSec = function (sec) {
  return sec / 3600 * Math.PI / 180;
};
M.degFromAngle = function (angle) {
  return angle * 180 / Math.PI;
};
M.secFromAngle = function (angle) {
  return angle * 3600 * 180 / Math.PI;
};
M.secFromHourAngle = function (ha) {
  return ha * 240 * 180 / Math.PI;
};

/**
 * separate fix `i` from fraction `f`
 * @private
 * @param {Number} float
 * @returns {Array} [i, f]
 *  {Number} i - (int) fix value
 *  {Number} f - (float) fractional portion; always > 1
 */
function modf(float) {
  var i = Math.trunc(float);
  var f = Math.abs(float - i);
  return [i, f];
}

/**
 * Rounds `float` value by precision
 * @private
 * @param {Number} float - value to round
 * @param {Number} precision - (int) number of post decimal positions
 * @return {Number} rounded `float`
 */
function round(float, precision) {
  precision = precision === undefined ? 10 : precision;
  return parseFloat(float.toFixed(precision), 10);
}