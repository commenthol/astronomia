/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jm
 */
/**
 * JM: Chapter 9, Jewish and Moslem Calendars.
 *
 * The Jewish calendar routines are implemented as a monolithic function,
 * because computations of the various results build off of common
 * intermediate results.
 *
 * The Moslem calendar routines break down nicely into some separate functions.
 *
 * Included in these are two functions that convert between Gregorian and
 * Julian calendar days without going through Julian day (JD).  As such,
 * I suppose, these or similar routines are not in chapter 7, Julian Day.
 * Package base might also be a suitable place for these, but I'm not sure
 * they are used anywhere else in the book.  Anyway, they have the quirk
 * that they are not direct inverses:  JulianToGregorian returns the day number
 * of the day of the Gregorian year, but GregorianToJulian wants the Gregorian
 * month and day of month as input.
 */

const base = require('./base')
const julian = require('./julian')

const M = exports
const int = Math.trunc

/**
 * JewishCalendar returns interesting dates and facts about a given year.
 *
 * Input is a Julian or Gregorian year.
 *
 * Outputs:
 *  A:      (int) Year number in the Jewish Calendar
 *  mP:     (int) Month number of Pesach.
 *  dP:     (int) Day number of Pesach.
 *  mNY:    (int) Month number of the Jewish new year.
 *  dNY:    (int) Day number of the Jewish new year.
 *  months: (int) Number of months in this year.
 *  days:   (int) Number of days in this year.
 */
M.JewishCalendar = function (y) {
  let A = y + 3760
  let D = bigD(y)
  let mP = 3
  let dP = D
  if (dP > 31) {
    mP++
    dP -= 31
  }
  // A simplification of Meeus's rule to add 163 days.  Months of Pesach
  // are either March or April with D based off of March.  Months of New
  // year are either September or August so D+163-(days from March to
  // September == 184) = D-21 must be based off of September.
  let mNY = 9
  let dNY = D - 21
  if (dNY > 30) {
    mNY++
    dNY -= 30
  }
  let months = 12
  switch (A % 19) {
    case 0:
    case 3:
    case 6:
    case 8:
    case 11:
    case 14:
    case 17:
      months++
      break
  }
  // Similarly, A simplification of Meeus's rule to take the difference
  // in calendar days from NY of one year to NY of the next.  NY is based
  // on D, so difference in D is difference in day numbers of year.  Result
  // is sum of this number and the number of days in the Western calandar
  // year.
  let y1 = y + 1
  let lf = julian.LeapYearGregorian
  if (y1 < 1583) {
    lf = julian.LeapYearJulian
  }
  let days = 365
  if (lf(y1)) {
    days++
  }
  days += bigD(y1) - D
  return [A, mP, dP, mNY, dNY, months, days]
}

const bigD = function (y) { // (y int)  int
  let C = base.floorDiv(y, 100)
    // var S int
  let S = 0
  if (y >= 1583) {
    S = int(base.floorDiv(3 * C - 5, 4))
  }
  let a = (12 * y + 12) % 19
  let b = y % 4
  let Q = -1.904412361576 + 1.554241796621 * (a) + 0.25 * (b) -
    0.003177794022 * (y) + (S)
  let fq = Math.floor(Q)
  let iq = int(fq)
  let j = (iq + 3 * y + 5 * b + 2 - S) % 7
  let r = Q - fq
    // var D int
  let D
  if (j === 2 || j === 4 || j === 6) {
    D = iq + 23
  } else if (j === 1 && a > 6 && r >= 0.63287037) {
    D = iq + 24
  } else if (j === 0 && a > 11 && r >= 0.897723765) {
    D = iq + 23
  } else {
    D = iq + 22
  }
  return int(D)
}

/**
 * MoslemToJD converts a Moslem calendar date to a Julian Day.
 * @param {Number} y - year in moslem calendar
 * @param {Number} m - month
 * @param {Number} d - day
 * @returns {Number} jd - Julian day
 */
M.MoslemToJD = function (y, m, d) { // (y, m, d int)  (jY, jDN int)
  let N = d + base.floorDiv(295001 * (m - 1) + 9900, 10000)
  let Q = base.floorDiv(y, 30)
  let R = y % 30
  let A = base.floorDiv(11 * R + 3, 30)
  let W = 404 * Q + 354 * R + 208 + A
  let Q1 = base.floorDiv(W, 1461)
  let Q2 = W % 1461
  let G = 621 + 28 * Q + 4 * Q1
  let K = base.floorDiv(Q2 * 10000, 3652422)
  let E = base.floorDiv(3652422 * K, 10000)
  let J = Q2 - E + N - 1
  let X = G + K
  if (J > 366 && X % 4 === 0) {
    J -= 366
    X++
  } else if (J > 365 && X % 4 > 0) {
    J -= 365
    X++
  }
  let jd = base.floorDiv(36525 * (X - 1), 100) + 1721423 + J
  return jd
}

/**
 * MoslemLeapYear returns true if year y of the Moslem calendar is a leap year.
 * @param {Number} year
 * @returns {Boolean} true if leap year
 */
M.MoslemLeapYear = function (year) { // (y int)  bool
  let R = year % 30
  return (11 * R + 3) % 30 > 18
}

/**
 * JulianToMoslem takes a year, month, and day of the Julian calendar and returns the equivalent year, month, and day of the Moslem calendar.
 *
 * @param {Number} y - julian year
 * @param {Number} m - julian month
 * @param {Number} d - julian day
 * @returns {Array} [my, mm, md]
 */
M.JulianToMoslem = function (y, m, d) { // (y, m, d int)  (my, mm, md int)
  let W = 2
  if (y % 4 === 0) {
    W = 1
  }
  let N = base.floorDiv(275 * m, 9) - W * base.floorDiv(m + 9, 12) + d - 30
  let A = int(y - 623)
  let B = base.floorDiv(A, 4)
  let C2 = (function (A) {
    let C = A % 4
    let C1 = 365.25001 * (C)
    let C2 = Math.floor(C1)
    if (C1 - C2 > 0.5) {
      return int(C2) + 1
    }
    return int(C2)
  })(A)
  let Dp = 1461 * B + 170 + C2
  let Q = base.floorDiv(Dp, 10631)
  let R = Dp % 10631
  let J = base.floorDiv(R, 354)
  let K = R % 354
  let O = base.floorDiv(11 * J + 14, 30)
  let my = 30 * Q + J + 1
  let JJ = K - O + N - 1
  let days = 354
  if (M.MoslemLeapYear(y)) {
    days++
  }
  if (JJ > days) {
    JJ -= days
    my++
  }
  let mm
  let md
  if (JJ === 355) {
    mm = 12
    md = 30
  } else {
    let S = base.floorDiv((JJ - 1) * 10, 295)
    mm = 1 + S
    md = base.floorDiv(10 * JJ - 295 * S, 10)
  }
  return {year: my, month: mm, day: md}
}

/**
 * An MMonth specifies a month of the Moslum Calendar (Muharram = 1, ...).
 *
 * Upgraded to Unicode from the spellings given by Meeus.
 * Source: http://en.wikipedia.org/wiki/Islamic_calendar.
 */
const mmonths = [
  '',
  'Muḥarram',
  'Ṣafar',
  'Rabīʿ I',
  'Rabīʿ II',
  'Jumādā I',
  'Jumādā II',
  'Rajab',
  'Shaʿbān',
  'Ramaḍān',
  'Shawwāl',
  'Dhū al-Qaʿda',
  'Dhū al-Ḥijja'
]

/**
 * String returns the Romanization of the month ("Muḥarram", "Ṣafar", ...).
 */
M.moslemMonth = function (m) {
  return mmonths[m]
}
