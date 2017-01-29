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
 * @module julian
 */
/**
 * Julian: Chapter 7, Julian day.
 */

var base = require('./base');
var sexa = require('./sexagesimal');
var deltat = require('./deltat');
var _padstart = require('lodash.padstart');

var M = exports;
var int = Math.trunc;

/** 1582-10-05 Julian Date is 1st Gregorian Date (1582-10-15) */
var GREGORIAN0JD = M.GREGORIAN0JD = 2299160.5;

var DAYS_OF_YEAR = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
var SECS_OF_DAY = 86400; // 24 * 60 * 60

/**
 * Base class for CalendarJulian and CalendarGregorian
 * Respects the start of the Gregorian Calendar at `GREGORIAN0JD`
 */

var Calendar = function () {
  /**
   * @param {number|Date} year - If `Date` is given then year, month, day is taken from that. Shortcut to `new Calendar().fromDate(date)`
   * @param {number} month
   * @param {number} day
   */
  function Calendar(year) {
    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Calendar);

    this.year = year;
    this.month = month;
    this.day = day;
    if (year instanceof Date) {
      this.fromDate(year);
    }
  }

  _createClass(Calendar, [{
    key: 'getDate',
    value: function getDate() {
      return {
        year: this.year,
        month: this.month,
        day: Math.floor(this.day)
      };
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      var t = new sexa.Time(this.day * SECS_OF_DAY);

      var _t$toHMS = t.toHMS(),
          _t$toHMS2 = _slicedToArray(_t$toHMS, 4),
          neg = _t$toHMS2[0],
          h = _t$toHMS2[1],
          m = _t$toHMS2[2],
          _s = _t$toHMS2[3]; // eslint-disable-line no-unused-vars


      var _base$modf = base.modf(_s),
          _base$modf2 = _slicedToArray(_base$modf, 2),
          s = _base$modf2[0],
          ms = _base$modf2[1];

      ms = Math.trunc(ms * 1000);
      return {
        hour: h % 24,
        minute: m,
        second: s,
        millisecond: ms
      };
    }
  }, {
    key: 'toISOString',
    value: function toISOString() {
      var _getDate = this.getDate(),
          year = _getDate.year,
          month = _getDate.month,
          day = _getDate.day;

      var _getTime = this.getTime(),
          hour = _getTime.hour,
          minute = _getTime.minute,
          second = _getTime.second,
          millisecond = _getTime.millisecond;

      return pad(year, 4) + '-' + pad(month) + '-' + pad(day) + 'T' + (pad(hour) + ':' + pad(minute) + ':' + pad(second) + '.' + pad(millisecond, 3) + 'Z');
    }
  }, {
    key: 'isGregorian',
    value: function isGregorian() {
      return M.isCalendarGregorian(this.year, this.month, this.day);
    }

    /**
     * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
     * proleptic Gregorian Calender
     * @param {Date} date - proleptic Gregorian date
     */

  }, {
    key: 'fromDate',
    value: function fromDate(date) {
      this.year = date.getUTCFullYear();
      this.month = date.getUTCMonth() + 1;
      var day = date.getUTCDate();
      var hour = date.getUTCHours();
      var minute = date.getUTCMinutes();
      var second = date.getUTCSeconds();
      var ms = date.getMilliseconds();
      this.day = day + (hour + (minute + (second + ms / 1000) / 60) / 60) / 24;
      return this;
    }

    /**
     * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
     * proleptic Gregorian Calender
     * @returns {Date} proleptic Gregorian date
     */

  }, {
    key: 'toDate',
    value: function toDate() {
      var _base$modf3 = base.modf(this.day),
          _base$modf4 = _slicedToArray(_base$modf3, 2),
          day = _base$modf4[0],
          fhour = _base$modf4[1];

      var _base$modf5 = base.modf(fhour * 24),
          _base$modf6 = _slicedToArray(_base$modf5, 2),
          hour = _base$modf6[0],
          fminute = _base$modf6[1];

      var _base$modf7 = base.modf(fminute * 60),
          _base$modf8 = _slicedToArray(_base$modf7, 2),
          minute = _base$modf8[0],
          fsecond = _base$modf8[1];

      var _base$modf9 = base.modf(fsecond * 60),
          _base$modf10 = _slicedToArray(_base$modf9, 2),
          second = _base$modf10[0],
          fms = _base$modf10[1];

      var date = new Date(Date.UTC(this.year, this.month - 1, day, hour, minute, second, Math.round(fms * 1000)));
      date.setUTCFullYear(this.year);
      return date;
    }

    /**
     * converts a calendar date to decimal year
     * @returns {number} decimal year
     */

  }, {
    key: 'toYear',
    value: function toYear() {
      var _base$modf11 = base.modf(this.day),
          _base$modf12 = _slicedToArray(_base$modf11, 2),
          d = _base$modf12[0],
          f = _base$modf12[1]; // eslint-disable-line no-unused-vars


      var n = this.dayOfYear() - 1 + f;
      var days = this.isLeapYear() ? 366 : 365;
      var decYear = this.year + n / days;
      return decYear;
    }

    /**
     * converts a decimal year to a calendar date
     * @param {number} decimal year
     */

  }, {
    key: 'fromYear',
    value: function fromYear(year) {
      var _base$modf13 = base.modf(year),
          _base$modf14 = _slicedToArray(_base$modf13, 2),
          y = _base$modf14[0],
          f = _base$modf14[1];

      this.year = y;
      var days = this.isLeapYear() ? 366 : 365;
      var dayOfYear = base.round(f * days, 5);
      var m = 12;
      while (m > 0 && DAYS_OF_YEAR[m] > dayOfYear) {
        m--;
      }
      this.month = m;
      this.day = 1 + dayOfYear - DAYS_OF_YEAR[this.month];
      return this;
    }
  }, {
    key: 'isLeapYear',
    value: function isLeapYear() {
      if (this.isGregorian()) {
        return M.LeapYearGregorian(this.year);
      } else {
        return M.LeapYearJulian(this.year);
      }
    }
  }, {
    key: 'toJD',
    value: function toJD() {
      return M.CalendarToJD(this.year, this.month, this.day, !this.isGregorian());
    }
  }, {
    key: 'fromJD',
    value: function fromJD(jd) {
      var isJulian = !M.isJDCalendarGregorian(jd);

      var _M$JDToCalendar = M.JDToCalendar(jd, isJulian),
          year = _M$JDToCalendar.year,
          month = _M$JDToCalendar.month,
          day = _M$JDToCalendar.day;

      this.year = year;
      this.month = month;
      this.day = day;
      return this;
    }
  }, {
    key: 'fromJDE',
    value: function fromJDE(jde) {
      this.fromJD(jde);
      var dT = deltat.deltaT(this.toYear()); // in seconds
      this.day -= dT / 86400;
      return this;
    }
  }, {
    key: 'toJDE',
    value: function toJDE() {
      var dT = deltat.deltaT(this.toYear()); // in seconds
      this.day += dT / 86400;
      return this.toJD();
    }

    /**
     * set date to midnight UTC
     */

  }, {
    key: 'midnight',
    value: function midnight() {
      this.day = Math.floor(this.day);
      return this;
    }

    /**
     * set date to noon UTC
     */

  }, {
    key: 'noon',
    value: function noon() {
      this.day = Math.floor(this.day) + 0.5;
      return this;
    }

    /**
     * @param {Boolean} td - if `true` calendar instance is in TD; date gets converted to UT
     *   true  - `UT = TD - ΔT`
     *   false - `TD = UT + ΔT`
     */

  }, {
    key: 'deltaT',
    value: function deltaT(td) {
      var dT = deltat.deltaT(this.toYear()); // in seconds
      if (td) {
        this.day -= dT / 86400;
      } else {
        this.day += dT / 86400;
      }
      return this;
    }
  }, {
    key: 'dayOfWeek',
    value: function dayOfWeek() {
      return M.DayOfWeek(this.toJD());
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear() {
      if (this.isGregorian()) {
        return M.DayOfYearGregorian(this.year, this.month, this.day);
      } else {
        return M.DayOfYearJulian(this.year, this.month, this.day);
      }
    }
  }]);

  return Calendar;
}();

M.Calendar = Calendar;

var CalendarJulian = function (_Calendar) {
  _inherits(CalendarJulian, _Calendar);

  function CalendarJulian() {
    _classCallCheck(this, CalendarJulian);

    return _possibleConstructorReturn(this, (CalendarJulian.__proto__ || Object.getPrototypeOf(CalendarJulian)).apply(this, arguments));
  }

  _createClass(CalendarJulian, [{
    key: 'toJD',
    value: function toJD() {
      return M.CalendarJulianToJD(this.year, this.month, this.day);
    }
  }, {
    key: 'fromJD',
    value: function fromJD(jd) {
      var _M$JDToCalendarJulian = M.JDToCalendarJulian(jd),
          year = _M$JDToCalendarJulian.year,
          month = _M$JDToCalendarJulian.month,
          day = _M$JDToCalendarJulian.day;

      this.year = year;
      this.month = month;
      this.day = day;
      return this;
    }
  }, {
    key: 'isLeapYear',
    value: function isLeapYear() {
      return M.LeapYearJulian(this.year);
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear() {
      return M.DayOfYearJulian(this.year, this.month, this.day);
    }

    /**
     * toGregorian converts a Julian calendar date to a year, month, and day
     * in the Gregorian calendar.
     * @returns {CalendarGregorian}
     */

  }, {
    key: 'toGregorian',
    value: function toGregorian() {
      var jd = this.toJD();
      return new CalendarGregorian().fromJD(jd);
    }
  }]);

  return CalendarJulian;
}(Calendar);

M.CalendarJulian = CalendarJulian;

var CalendarGregorian = function (_Calendar2) {
  _inherits(CalendarGregorian, _Calendar2);

  function CalendarGregorian() {
    _classCallCheck(this, CalendarGregorian);

    return _possibleConstructorReturn(this, (CalendarGregorian.__proto__ || Object.getPrototypeOf(CalendarGregorian)).apply(this, arguments));
  }

  _createClass(CalendarGregorian, [{
    key: 'toJD',
    value: function toJD() {
      return M.CalendarGregorianToJD(this.year, this.month, this.day);
    }
  }, {
    key: 'fromJD',
    value: function fromJD(jd) {
      var _M$JDToCalendarGregor = M.JDToCalendarGregorian(jd),
          year = _M$JDToCalendarGregor.year,
          month = _M$JDToCalendarGregor.month,
          day = _M$JDToCalendarGregor.day;

      this.year = year;
      this.month = month;
      this.day = day;
      return this;
    }
  }, {
    key: 'isLeapYear',
    value: function isLeapYear() {
      return M.LeapYearGregorian(this.year);
    }
  }, {
    key: 'dayOfYear',
    value: function dayOfYear() {
      return M.DayOfYearGregorian(this.year, this.month, this.day);
    }

    /*
    * toJulian converts a Gregorian calendar date to a year, month, and day
    * in the Julian calendar.
    * @returns {CalendarJulian}
    */

  }, {
    key: 'toJulian',
    value: function toJulian() {
      var jd = this.toJD();
      return new CalendarJulian().fromJD(jd);
    }
  }]);

  return CalendarGregorian;
}(Calendar);

M.CalendarGregorian = CalendarGregorian;

// -----------------------------------------------------------------------------

/**
 * base conversion from calendar date to julian day
 */
M.CalendarToJD = function (y, m, d, isJulian) {
  var b = 0;
  if (m < 3) {
    y--;
    m += 12;
  }
  if (!isJulian) {
    var a = base.floorDiv(y, 100);
    b = 2 - a + base.floorDiv(a, 4);
  }
  // (7.1) p. 61
  var jd = base.floorDiv(36525 * int(y + 4716), 100) + (base.floorDiv(306 * (m + 1), 10) + b) + d - 1524.5;
  return jd;
};

/**
 * CalendarGregorianToJD converts a Gregorian year, month, and day of month
 * to Julian day.
 *
 * Negative years are valid, back to JD 0.  The result is not valid for
 * dates before JD 0.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} jd - Julian day (float)
 */
M.CalendarGregorianToJD = function (y, m, d) {
  return M.CalendarToJD(y, m, d, false);
};

/**
 * CalendarJulianToJD converts a Julian year, month, and day of month to Julian day.
 *
 * Negative years are valid, back to JD 0.  The result is not valid for
 * dates before JD 0.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} jd - Julian day (float)
 */
M.CalendarJulianToJD = function (y, m, d) {
  return M.CalendarToJD(y, m, d, true);
};

/**
 * LeapYearJulian returns true if year y in the Julian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Julian Calendar
 */
M.LeapYearJulian = function (y) {
  return y % 4 === 0;
};

/**
 * LeapYearGregorian returns true if year y in the Gregorian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Gregorian Calendar
 */
M.LeapYearGregorian = function (y) {
  return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
};

/**
 * JDToCalendar returns the calendar date for the given jd.
 *
 * Note that this function returns a date in either the Julian or Gregorian
 * Calendar, as appropriate.
 * @param {number} jd - Julian day (float)
 * @param {boolean} isJulian - set true for Julian Calendar, otherwise Gregorian is used
 * @returns {object} `{ (int) year, (int) month, (float) day }`
 */
M.JDToCalendar = function (jd, isJulian) {
  var _base$modf15 = base.modf(jd + 0.5),
      _base$modf16 = _slicedToArray(_base$modf15, 2),
      z = _base$modf16[0],
      f = _base$modf16[1];

  var a = z;
  if (!isJulian) {
    var α = base.floorDiv(z * 100 - 186721625, 3652425);
    a = z + 1 + α - base.floorDiv(α, 4);
  }
  var b = a + 1524;
  var c = base.floorDiv(b * 100 - 12210, 36525);
  var d = base.floorDiv(36525 * c, 100);
  var e = int(base.floorDiv((b - d) * 1e4, 306001));
  // compute return values
  var year;
  var month;
  var day = int(b - d) - base.floorDiv(306001 * e, 1e4) + f;
  if (e === 14 || e === 15) {
    month = e - 13;
  } else {
    month = e - 1;
  }
  if (month < 3) {
    year = int(c) - 4715;
  } else {
    year = int(c) - 4716;
  }
  return { year: year, month: month, day: day };
};

/**
 * JDToCalendarGregorian returns the calendar date for the given jd in the Gregorian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {object} `{ (int) year, (int) month, (float) day }`
 */
M.JDToCalendarGregorian = function (jd) {
  return M.JDToCalendar(jd, false);
};

/**
 * JDToCalendarJulian returns the calendar date for the given jd in the Julian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {object} { (int) year, (int) month, (float) day }
 */
M.JDToCalendarJulian = function (jd) {
  return M.JDToCalendar(jd, true);
};

/**
 * isJDCalendarGregorian tests if Julian day `jd` falls into the Gregorian calendar
 * @param {number} jd - Julian day (float)
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
M.isJDCalendarGregorian = function (jd) {
  return jd >= GREGORIAN0JD;
};

/**
 * isCalendarGregorian tests if date falls into the Gregorian calendar
 * @param {number} year - julian/gregorian year
 * @param {number} [month] - month of julian/gregorian year
 * @param {number} [day] - day of julian/gregorian year
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
M.isCalendarGregorian = function (year) {
  var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  return year > 1582 || year === 1582 && month > 10 || year === 1582 && month === 10 && day >= 15;
};

/**
 * JDToDate converts a Julian day `jd` to a Date Object (Gregorian Calendar)
 *
 * Note: Javascript uses the the ISO-8601 calendar, which is a proleptic Gregorian
 * calendar, i.e. it acts as if this calendar was always in effect, even before
 * its year of introduction in 1582. Therefore dates between 1582-10-05 and
 * 1582-10-14 exists.
 *
 * @param {number} jd - Julian day (float)
 * @returns {Date}
 */
M.JDToDate = function (jd) {
  return new CalendarGregorian().fromJD(jd).toDate();
};

/**
 * DateToJD converts a proleptic Gregorian Date into a Julian day `jd`
 * @param {Date} date
 * @returns {number} jd - Julian day (float)
 */
M.DateToJD = function (date) {
  return new CalendarGregorian().fromDate(date).toJD();
};

/**
 * JDEToDate converts a Julian ephemeris day `jde` to a Date Object (Gregorian Calendar)
 * To obtain "Universal Time" (UT) from "Dynamical Time" (TD) the correction ΔT (in seconds) gets applied
 * ```
 * UT = TD - ΔT
 * ```
 * If your use case does not require such accuracy converting `jde` using `JDToDate` is fine.
 *
 * Note: Javascript uses the the ISO-8601 calendar, which is a proleptic Gregorian
 * calendar, i.e. it acts as if this calendar was always in effect, even before
 * its year of introduction in 1582. Therefore dates between 1582-10-05 and
 * 1582-10-14 exists.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns {Date} Javascript Date Object
 */
M.JDEToDate = function (jde) {
  return new CalendarGregorian().fromJDE(jde).toDate();
};

/**
 * DateToJDE converts a Date Object (Gregorian Calendar) to a Julian ephemeris day `jde`
 * To obtain "Dynamical Time" (TD) from "Universal Time" (UT) the correction ΔT (in seconds) gets applied
 * ```
 * TD = UT + ΔT
 * ```
 * If your use case does not require such accuracy converting `Date` using `DateToJD` is fine.
 *
 * @param {Date} date - Javascript Date Object
 * @returns {number} jde - Julian ephemeris day (float)
 */
M.DateToJDE = function (date) {
  return new CalendarGregorian().fromDate(date).toJDE();
};

/**
 * converts Modified Julian Day `mjd` to Julian Day `jd`
 * @param {Number} mjd - Modified Julian Day
 * @returns {Number} jd - Julian Day
 */
M.MJDToJD = function (mjd) {
  return mjd - base.JMod;
};

/**
 * converts Julian Day `jd` to Modified Julian Day `mjd`
 * @param {Number} jd - Julian Day
 * @returns {Number} mjd - Modified Julian Day
 */
M.JDToMJD = function (jd) {
  return jd + base.JMod;
};

/**
 * DayOfWeek determines the day of the week for a given JD.
 *
 * The value returned is an integer in the range 0 to 6, where 0 represents
 * Sunday.  This is the same convention followed in the time package of the
 * Javascript standard library.
 * @param {number} jd - Julian day (float)
 * @returns {number} (int) 0 == sunday; ...; 6 == saturday
 */
M.DayOfWeek = function (jd) {
  return int(jd + 1.5) % 7;
};

/**
 * DayOfYearGregorian computes the day number within the year of the Gregorian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
M.DayOfYearGregorian = function (y, m, d) {
  return M.DayOfYear(y, m, int(d), M.LeapYearGregorian(y));
};

/**
 * DayOfYearJulian computes the day number within the year of the Julian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
M.DayOfYearJulian = function (y, m, d) {
  return M.DayOfYear(y, m, int(d), M.LeapYearJulian(y));
};

/**
 * DayOfYear computes the day number within the year.
 *
 * This form of the function is not specific to the Julian or Gregorian
 * calendar, but you must tell it whether the year is a leap year.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @param {boolean} leap - set `true` if `y` is leap year
 * @returns {number} day of year
 */
M.DayOfYear = function (y, m, d, leap) {
  var k = 0;
  if (leap && m > 1) {
    k = 1;
  }
  return k + DAYS_OF_YEAR[m] + int(d);
};

/**
 * DayOfYearToCalendar returns the calendar month and day for a given
 * day of year and leap year status.
 * @param {number} n - day of year (int)
 * @param {boolean} leap - set `true` if `y` is leap year
 * @returns {object} `{ (int) month, (float) day }`
 */
M.DayOfYearToCalendar = function (n, leap) {
  var month;
  var k = 0;
  if (leap) {
    k = 1;
  }
  for (month = 1; month <= 12; month++) {
    if (k + DAYS_OF_YEAR[month] > n) {
      month = month - 1;
      break;
    }
  }
  var day = n - k - DAYS_OF_YEAR[month];
  return { month: month, day: day };
};

/**
 * DayOfYearToCalendarGregorian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarGregorian} { (int) year, (int) month, (float) day }
 */
M.DayOfYearToCalendarGregorian = function (year, n) {
  var _M$DayOfYearToCalenda = M.DayOfYearToCalendar(n, M.LeapYearGregorian(year)),
      month = _M$DayOfYearToCalenda.month,
      day = _M$DayOfYearToCalenda.day;

  return new CalendarGregorian(year, month, day);
};

/**
 * DayOfYearToCalendarJulian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarJulian} { (int) year, (int) month, (float) day }
 */
M.DayOfYearToCalendarJulian = function (year, n) {
  var _M$DayOfYearToCalenda2 = M.DayOfYearToCalendar(n, M.LeapYearJulian(year)),
      month = _M$DayOfYearToCalenda2.month,
      day = _M$DayOfYearToCalenda2.day;

  return new CalendarJulian(year, month, day);
};

function pad(num, len) {
  len = len || 2;
  var neg = num < 0 ? '-' : '';
  num = Math.abs(num);
  return neg + _padstart(num, len, '0');
}