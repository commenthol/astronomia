/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module julian
 */
/**
 * Julian: Chapter 7, Julian day.
 */

const base = require('./base')
const sexa = require('./sexagesimal')
const deltat = require('./deltat')
const _padstart = require('lodash.padstart')

const M = exports
const int = Math.trunc

/** 1582-10-05 Julian Date is 1st Gregorian Date (1582-10-15) */
const GREGORIAN0JD = M.GREGORIAN0JD = 2299160.5

const DAYS_OF_YEAR = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
const SECS_OF_DAY = 86400 // 24 * 60 * 60

/**
 * Base class for CalendarJulian and CalendarGregorian
 * Respects the start of the Gregorian Calendar at `GREGORIAN0JD`
 */
class Calendar {
  /**
   * @param {number|Date} year - If `Date` is given then year, month, day is taken from that. Shortcut to `new Calendar().fromDate(date)`
   * @param {number} month
   * @param {number} day
   */
  constructor (year, month = 1, day = 1) {
    this.year = year
    this.month = month
    this.day = day
    if (year instanceof Date) {
      this.fromDate(year)
    }
  }

  getDate () {
    return {
      year: this.year,
      month: this.month,
      day: Math.floor(this.day)
    }
  }

  getTime () {
    let t = new sexa.Time(this.day * SECS_OF_DAY)
    let [neg, h, m, _s] = t.toHMS() // eslint-disable-line no-unused-vars
    let [s, ms] = base.modf(_s)
    ms = Math.trunc(ms * 1000)
    return {
      hour: h % 24,
      minute: m,
      second: s,
      millisecond: ms
    }
  }

  toISOString () {
    let {year, month, day} = this.getDate()
    let {hour, minute, second, millisecond} = this.getTime()
    return `${pad(year, 4)}-${pad(month)}-${pad(day)}T` +
      `${pad(hour)}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)}Z`
  }

  isGregorian () {
    return M.isCalendarGregorian(this.year, this.month, this.day)
  }

  /**
   * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
   * proleptic Gregorian Calender
   * @param {Date} date - proleptic Gregorian date
   */
  fromDate (date) {
    this.year = date.getUTCFullYear()
    this.month = date.getUTCMonth() + 1
    var day = date.getUTCDate()
    var hour = date.getUTCHours()
    var minute = date.getUTCMinutes()
    var second = date.getUTCSeconds()
    var ms = date.getMilliseconds()
    this.day = day + (hour + ((minute + ((second + ms / 1000) / 60)) / 60)) / 24
    return this
  }

  /**
   * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
   * proleptic Gregorian Calender
   * @returns {Date} proleptic Gregorian date
   */
  toDate () {
    let [day, fhour] = base.modf(this.day)
    let [hour, fminute] = base.modf(fhour * 24)
    let [minute, fsecond] = base.modf(fminute * 60)
    let [second, fms] = base.modf(fsecond * 60)
    let date = new Date(Date.UTC(
      this.year, this.month - 1, day, hour, minute, second, Math.round(fms * 1000)
    ))
    date.setUTCFullYear(this.year)
    return date
  }

  /**
   * converts a calendar date to decimal year
   * @returns {number} decimal year
   */
  toYear () {
    let [d, f] = base.modf(this.day) // eslint-disable-line no-unused-vars
    let n = this.dayOfYear() - 1 + f
    let days = this.isLeapYear() ? 366 : 365
    let decYear = this.year + (n / days)
    return decYear
  }

  /**
   * converts a decimal year to a calendar date
   * @param {number} decimal year
   */
  fromYear (year) {
    let [y, f] = base.modf(year)
    this.year = y
    let days = this.isLeapYear() ? 366 : 365
    let dayOfYear = base.round(f * days, 5)
    let m = 12
    while (m > 0 && DAYS_OF_YEAR[m] > dayOfYear) {
      m--
    }
    this.month = m
    this.day = 1 + dayOfYear - DAYS_OF_YEAR[this.month]
    return this
  }

  isLeapYear () {
    if (this.isGregorian()) {
      return M.LeapYearGregorian(this.year)
    } else {
      return M.LeapYearJulian(this.year)
    }
  }

  toJD () {
    return M.CalendarToJD(this.year, this.month, this.day, !this.isGregorian())
  }

  fromJD (jd) {
    let isJulian = !M.isJDCalendarGregorian(jd)
    let {year, month, day} = M.JDToCalendar(jd, isJulian)
    this.year = year
    this.month = month
    this.day = day
    return this
  }

  fromJDE (jde) {
    this.fromJD(jde)
    let dT = deltat.deltaT(this.toYear()) // in seconds
    this.day -= dT / 86400
    return this
  }

  toJDE () {
    let dT = deltat.deltaT(this.toYear()) // in seconds
    this.day += dT / 86400
    return this.toJD()
  }

  /**
   * set date to midnight UTC
   */
  midnight () {
    this.day = Math.floor(this.day)
    return this
  }

  /**
   * set date to noon UTC
   */
  noon () {
    this.day = Math.floor(this.day) + 0.5
    return this
  }

  /**
   * @param {Boolean} td - if `true` calendar instance is in TD; date gets converted to UT
   *   true  - `UT = TD - ΔT`
   *   false - `TD = UT + ΔT`
   */
  deltaT (td) {
    let dT = deltat.deltaT(this.toYear()) // in seconds
    if (td) {
      this.day -= dT / 86400
    } else {
      this.day += dT / 86400
    }
    return this
  }

  dayOfWeek () {
    return M.DayOfWeek(this.toJD())
  }

  dayOfYear () {
    if (this.isGregorian()) {
      return M.DayOfYearGregorian(this.year, this.month, this.day)
    } else {
      return M.DayOfYearJulian(this.year, this.month, this.day)
    }
  }
}
M.Calendar = Calendar

class CalendarJulian extends Calendar {
  toJD () {
    return M.CalendarJulianToJD(this.year, this.month, this.day)
  }

  fromJD (jd) {
    let {year, month, day} = M.JDToCalendarJulian(jd)
    this.year = year
    this.month = month
    this.day = day
    return this
  }

  isLeapYear () {
    return M.LeapYearJulian(this.year)
  }

  dayOfYear () {
    return M.DayOfYearJulian(this.year, this.month, this.day)
  }

  /**
   * toGregorian converts a Julian calendar date to a year, month, and day
   * in the Gregorian calendar.
   * @returns {CalendarGregorian}
   */
  toGregorian () {
    let jd = this.toJD()
    return new CalendarGregorian().fromJD(jd)
  }
}
M.CalendarJulian = CalendarJulian

class CalendarGregorian extends Calendar {
  toJD () {
    return M.CalendarGregorianToJD(this.year, this.month, this.day)
  }

  fromJD (jd) {
    let {year, month, day} = M.JDToCalendarGregorian(jd)
    this.year = year
    this.month = month
    this.day = day
    return this
  }

  isLeapYear () {
    return M.LeapYearGregorian(this.year)
  }

  dayOfYear () {
    return M.DayOfYearGregorian(this.year, this.month, this.day)
  }

  /*
  * toJulian converts a Gregorian calendar date to a year, month, and day
  * in the Julian calendar.
  * @returns {CalendarJulian}
  */
  toJulian () {
    let jd = this.toJD()
    return new CalendarJulian().fromJD(jd)
  }
}
M.CalendarGregorian = CalendarGregorian

// -----------------------------------------------------------------------------

/**
 * base conversion from calendar date to julian day
 */
M.CalendarToJD = function (y, m, d, isJulian) {
  let b = 0
  if (m < 3) {
    y--
    m += 12
  }
  if (!isJulian) {
    let a = base.floorDiv(y, 100)
    b = 2 - a + base.floorDiv(a, 4)
  }
  // (7.1) p. 61
  let jd = (base.floorDiv(36525 * (int(y + 4716)), 100)) +
    (base.floorDiv(306 * (m + 1), 10) + b) + d - 1524.5
  return jd
}

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
  return M.CalendarToJD(y, m, d, false)
}

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
  return M.CalendarToJD(y, m, d, true)
}

/**
 * LeapYearJulian returns true if year y in the Julian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Julian Calendar
 */
M.LeapYearJulian = function (y) {
  return y % 4 === 0
}

/**
 * LeapYearGregorian returns true if year y in the Gregorian calendar is a leap year.
 * @param {number} y - year (int)
 * @returns {boolean} true if leap year in Gregorian Calendar
 */
M.LeapYearGregorian = function (y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

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
  var [z, f] = base.modf(jd + 0.5)
  var a = z
  if (!isJulian) {
    var α = base.floorDiv(z * 100 - 186721625, 3652425)
    a = z + 1 + α - base.floorDiv(α, 4)
  }
  var b = a + 1524
  var c = base.floorDiv(b * 100 - 12210, 36525)
  var d = base.floorDiv(36525 * c, 100)
  var e = int(base.floorDiv((b - d) * 1e4, 306001))
  // compute return values
  var year
  var month
  var day = (int(b - d) - base.floorDiv(306001 * e, 1e4)) + f
  if (e === 14 || e === 15) {
    month = e - 13
  } else {
    month = e - 1
  }
  if (month < 3) {
    year = int(c) - 4715
  } else {
    year = int(c) - 4716
  }
  return { year, month, day }
}

/**
 * JDToCalendarGregorian returns the calendar date for the given jd in the Gregorian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {object} `{ (int) year, (int) month, (float) day }`
 */
M.JDToCalendarGregorian = function (jd) {
  return M.JDToCalendar(jd, false)
}

/**
 * JDToCalendarJulian returns the calendar date for the given jd in the Julian Calendar.
 *
 * @param {number} jd - Julian day (float)
 * @returns {object} { (int) year, (int) month, (float) day }
 */
M.JDToCalendarJulian = function (jd) {
  return M.JDToCalendar(jd, true)
}

/**
 * isJDCalendarGregorian tests if Julian day `jd` falls into the Gregorian calendar
 * @param {number} jd - Julian day (float)
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
M.isJDCalendarGregorian = function (jd) {
  return (jd >= GREGORIAN0JD)
}

/**
 * isCalendarGregorian tests if date falls into the Gregorian calendar
 * @param {number} year - julian/gregorian year
 * @param {number} [month] - month of julian/gregorian year
 * @param {number} [day] - day of julian/gregorian year
 * @returns {boolean} true for Gregorian, false for Julian calendar
 */
M.isCalendarGregorian = function (year, month = 1, day = 1) {
  return (year > 1582 ||
    (year === 1582 && month > 10) ||
    (year === 1582 && month === 10 && day >= 15)
  )
}

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
  return new CalendarGregorian().fromJD(jd).toDate()
}

/**
 * DateToJD converts a proleptic Gregorian Date into a Julian day `jd`
 * @param {Date} date
 * @returns {number} jd - Julian day (float)
 */
M.DateToJD = function (date) {
  return new CalendarGregorian().fromDate(date).toJD()
}

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
  return new CalendarGregorian().fromJDE(jde).toDate()
}

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
  return new CalendarGregorian().fromDate(date).toJDE()
}

/**
 * converts Modified Julian Day `mjd` to Julian Day `jd`
 * @param {Number} mjd - Modified Julian Day
 * @returns {Number} jd - Julian Day
 */
M.MJDToJD = function (mjd) {
  return mjd - base.JMod
}

/**
 * converts Julian Day `jd` to Modified Julian Day `mjd`
 * @param {Number} jd - Julian Day
 * @returns {Number} mjd - Modified Julian Day
 */
M.JDToMJD = function (jd) {
  return jd + base.JMod
}

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
  return int(jd + 1.5) % 7
}

/**
 * DayOfYearGregorian computes the day number within the year of the Gregorian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
M.DayOfYearGregorian = function (y, m, d) {
  return M.DayOfYear(y, m, int(d), M.LeapYearGregorian(y))
}

/**
 * DayOfYearJulian computes the day number within the year of the Julian
 * calendar.
 * @param {number} y - year (int)
 * @param {number} m - month (int)
 * @param {number} d - day (float)
 * @returns {number} day of year
 */
M.DayOfYearJulian = function (y, m, d) {
  return M.DayOfYear(y, m, int(d), M.LeapYearJulian(y))
}

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
  var k = 0
  if (leap && m > 1) {
    k = 1
  }
  return k + DAYS_OF_YEAR[m] + int(d)
}

/**
 * DayOfYearToCalendar returns the calendar month and day for a given
 * day of year and leap year status.
 * @param {number} n - day of year (int)
 * @param {boolean} leap - set `true` if `y` is leap year
 * @returns {object} `{ (int) month, (float) day }`
 */
M.DayOfYearToCalendar = function (n, leap) {
  var month
  var k = 0
  if (leap) {
    k = 1
  }
  for (month = 1; month <= 12; month++) {
    if (k + DAYS_OF_YEAR[month] > n) {
      month = month - 1
      break
    }
  }
  var day = n - k - DAYS_OF_YEAR[month]
  return {month, day}
}

/**
 * DayOfYearToCalendarGregorian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarGregorian} { (int) year, (int) month, (float) day }
 */
M.DayOfYearToCalendarGregorian = function (year, n) {
  var {month, day} = M.DayOfYearToCalendar(n, M.LeapYearGregorian(year))
  return new CalendarGregorian(year, month, day)
}

/**
 * DayOfYearToCalendarJulian returns the calendar month and day for a given
 * day of year.
 * @param {number} year
 * @param {number} n - day of year (int)
 * @returns {CalendarJulian} { (int) year, (int) month, (float) day }
 */
M.DayOfYearToCalendarJulian = function (year, n) {
  var {month, day} = M.DayOfYearToCalendar(n, M.LeapYearJulian(year))
  return new CalendarJulian(year, month, day)
}

function pad (num, len) {
  len = len || 2
  let neg = num < 0 ? '-' : ''
  num = Math.abs(num)
  return neg + _padstart(num, len, '0')
}
