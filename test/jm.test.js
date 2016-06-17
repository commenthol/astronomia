/* eslint one-var: 0 */
/* global describe, it */

'use strict'

var assert = require('assert')
var format = require('util').format

var julian = require('..').julian
var jm = require('..').jm

describe('#jm', function () {
  it('JewishCalendar', function () {
    // Example 9.a, p. 73.0
    var a = jm.JewishCalendar(1990)
    var A = a[0],
      mP = a[1],
      dP = a[2],
      mNY = a[3],
      dNY = a[4],
      months = a[5],
      days = a[6]
    assert.equal(format('Jewish Year: %s', A), 'Jewish Year: 5750')
    assert.equal(format('Pesach: %s %s', mP, dP), 'Pesach: 4 10')
    assert.equal(format('New Year: %s %s', mNY, dNY), 'New Year: 9 20')
    assert.equal(format('Months: %s', months), 'Months: 12')
    assert.equal(format('Days: %s', days), 'Days: 354')
  })

  it('MoslemToJD', function () {
    // Example 9.b, p. 75, conversion to Julian.
    var jd = jm.MoslemToJD(1421, 1, 1)
    var g = julian.isJDCalendarGregorian(jd) // check type of Calendar Julian/ Gregorian
    var d = julian.JDToCalendar(jd, !g)
    assert.deepEqual(d, { year: 2000, month: 4, day: 6.5 })
  })

  it('MoslemLeapYear', function () {
    // Example 9.b, p. 75, indication of leap year.
    var res = jm.MoslemLeapYear(1421)
    assert.ok(!res) // Moslem year 1421 is a common year of 354 days.
    res = jm.MoslemLeapYear(1423)
    assert.ok(res) // Moslem year 1423 is a leap year of 355 days.
  })

  it('JulianToMoslem', function () {
    // Example 9.c, p. 76, final output.
    var j = new julian.CalendarGregorian(1991, 8, 13).toJulian()
    var o = jm.JulianToMoslem(j.year, j.month, Math.floor(j.day))
    var year = o.year,
      month = o.month,
      day = o.day
    var res = format('%s %s of A.H. %s', day, jm.moslemMonth(month), year)
    assert.equal(res, '2 Ṣafar of A.H. 1412')
  })
})
