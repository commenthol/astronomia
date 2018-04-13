/* eslint
no-multi-spaces: 0,
key-spacing: 0,
standard/array-bracket-even-spacing: 0
*/

import assert from 'assert'
import {base, julian} from '..'

describe('#julian', function () {
  describe('Gregorian', function () {
    var tests = [
      [2000,  1, 1.5,  2451545], // more examples, p. 62
      [1999,  1, 1,    2451179.5],
      [1987,  1, 27,   2446822.5],
      [1987,  6, 19.5, 2446966],
      [1988,  1, 27,   2447187.5],
      [1988,  6, 19.5, 2447332],
      [1900,  1, 1,    2415020.5],
      [1600,  1, 1,    2305447.5],
      [1600, 12, 31,   2305812.5],
      [1582, 10, 15.5, 2299161], // 1st day in Gregorian Calendar
      [1582, 10, 4.5,  2299150],
      [ 333,  1, 27.5, 1842712],
      [-584,  5, 28.62999999988824, 1507906.13]
    ]

    describe('CalendarGregorianToJD', function () {
      it('Sputnik', function () {
        var jd = julian.CalendarGregorianToJD(1957, 10, 4.81)
        assert.equal(jd, 2436116.31)
      })

      it('Halley', function () {
        // Example 7.c, p. 64.
        var jd1 = julian.CalendarGregorianToJD(1910, 4, 20)
        var jd2 = julian.CalendarGregorianToJD(1986, 2, 9)
        assert.equal(jd2 - jd1, 27689)
      })

      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          var jd = julian.CalendarGregorianToJD(test[0], test[1], test[2])
          assert.equal(jd, test[3])
        })
      })
    })

    describe('JDToCalendarGregorian', function () {
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          assert.deepEqual(julian.JDToCalendarGregorian(test[3]), {
            year: test[0],
            month: test[1],
            day: test[2]
          })
        })
      })
    })
  })

  describe('Julian', function () {
    var tests = [
      [-4712,  1, 1.5,   0],
      [-1000,  7, 12.5,  1356001],
      [-1000,  2, 29,    1355866.5],
      [-1001,  8, 17.9,  1355671.4],
      [ -123, 12, 31,    1676496.5],
      [ -122,  1, 1,     1676497.5],
      [ -584,  5, 28.63, 1507900.13],
      [  333,  1, 27.5,  1842713],
      [  837,  4, 10.3,  2026871.8], // more examples, p. 62
      [ 1582, 10, 5.5,   2299161],  // 1st day in Gregorian Calendar => 1582-10-15
      [ 1582, 10, 4.5,   2299160],
      [ 2000, 12, 24,    2451915.5]
    ]

    describe('CalendarJulianToJD', function () {
      it('Sample', function () {
        // Example 7.b, p. 61.
        var jd = julian.CalendarJulianToJD(333, 1, 27.5)
        assert.equal(jd, 1842713.0)
      })

      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join('-')
        it(name, function () {
          var jd = julian.CalendarJulianToJD(test[0], test[1], test[2])
          assert.equal(jd, test[3])
        })
      })
    })

    describe('JDToCalendarJulian', function () {
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          var res = julian.JDToCalendarJulian(test[3])
          res.day = base.round(res.day, 2)
          assert.deepEqual(res, {
            year: test[0],
            month: test[1],
            day: test[2]
          })
        })
      })
    })
  })

  describe('LeapYears', function () {
    describe('LeapYearJulian', function () {
      var tests = [
        [ 900, true],
        [1236, true],
        [ 750, false],
        [1429, false]
      ]

      tests.forEach(function (test) {
        it('' + test[0], function () {
          assert.equal(julian.LeapYearJulian(test[0]), test[1])
        })
      })
    })

    describe('LeapYearGregorian', function () {
      var tests = [
        [1700, false],
        [1800, false],
        [1900, false],
        [2100, false],
        [1600, true],
        [2400, true],
        [2000, true]
      ]

      tests.forEach(function (test) {
        it('' + test[0], function () {
          assert.equal(julian.LeapYearGregorian(test[0]), test[1])
        })
      })
    })
  })

  describe('Date', function () {
    var tests = [
      [base.J2000, new Date('2000-01-01T12:00:00Z')],
      [ 2451915.5, new Date('2001-01-06T00:00:00Z')],
      [2436116.31, new Date('1957-10-04T19:26:24.000Z')],
      [   1842712, new Date('0333-01-27T12:00:00.000Z')],
      [1507900.13, new Date('-000584-05-22T15:07:12.000Z')]
    ]

    describe('JDToDate', function () {
      tests.forEach(function (test) {
        it('' + test[0], function () {
          assert.deepEqual(julian.JDToDate(test[0]), test[1])
        })
      })
    })

    describe('DateToJD', function () {
      tests.forEach(function (test) {
        it(test[1].toISOString(), function () {
          assert.deepEqual(base.round(julian.DateToJD(test[1]), 2), test[0])
        })
      })
    })

    describe('JDEToDate', function () {
      it('conversion', function () {
        // Example 10.a p.78
        var d = new Date('1977-02-18T03:37:40Z') // is in fact a jde
        var jde = julian.DateToJD(d)
        var res = julian.JDEToDate(jde)
        assert.equal(res.toISOString(), '1977-02-18T03:36:52.351Z')
      })
    })
  })

  describe('DayOf', function () {
    it('DayOfWeek', function () {
      // Example 7.e, p. 65.
      var res = julian.DayOfWeek(2434923.5)
      assert.equal(res, 3) // Wednesday
    })

    var tests = [
      [1978, 11, 14, false, 318],
      [1988,  4, 22, true,  113]
    ]

    describe('DayOfYear', function () {
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          // Example 7.f, p. 65.
          var res = julian.DayOfYear(test[0], test[1], test[2], test[3])
          assert.equal(res, test[4])
        })
      })
    })

    describe('DayOfYearToCalendar', function () {
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          // Example 7.f, p. 65.
          var res = julian.DayOfYearToCalendar(test[4], test[3])
          assert.deepEqual(res, { month: test[1], day: test[2] })
        })
      })
    })

    describe('DayOfYearToCalendarGregorian', function () {
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          // Example 7.f, p. 65.
          var res = julian.DayOfYearToCalendarGregorian(test[0], test[4])
          assert.deepEqual(res, { year: test[0], month: test[1], day: test[2] })
        })
      })
    })

    describe('DayOfYearToCalendarJulian', function () {
      var tests = [
        [1978, 11, 14, false, 318],
        [1988,  4, 22, true,  113],
        [1236, 11, 14, true,  319],
        [ 750, 11, 14, false, 318]
      ]
      tests.forEach(function (test) {
        var name = [test[0], test[1], test[2]].join(' ')
        it(name, function () {
          // Example 7.f, p. 65.
          var res = julian.DayOfYearToCalendarJulian(test[0], test[4])
          assert.deepEqual(res, { year: test[0], month: test[1], day: test[2] })
        })
      })
    })

    describe('CalendarGregorian.toYear', function () {
      it('1977-02-14', function () {
        var res = new julian.CalendarGregorian(1977, 2, 14).toYear()
        assert.equal(res.toFixed(5), 1977.12055)
      })
      it('1977-01-01', function () {
        var res = new julian.CalendarGregorian(1977, 1, 1).toYear()
        assert.equal(res.toFixed(5), 1977.0)
      })
      it('1977-12-31', function () {
        var res = new julian.CalendarGregorian(1977, 12, 31.999).toYear()
        assert.equal(res, 1977.999997260274)
      })
    })

    describe('CalendarGregorian.fromYear', function () {
      it('1977-02-14', function () {
        var res = new julian.CalendarGregorian().fromYear(1977.12055)
        assert.deepEqual(res.getDate(), {year: 1977, month: 2, day: 14})
      })
      it('1977-01-01', function () {
        var res = new julian.CalendarGregorian().fromYear(1977.0)
        assert.deepEqual(res.getDate(), {year: 1977, month: 1, day: 1})
      })
      it('1977-12-31', function () {
        var res = new julian.CalendarGregorian().fromYear(1977.999997260274)
        assert.deepEqual(res.getDate(), {year: 1977, month: 12, day: 31})
      })
      it('1977-02-01', function () {
        var y = new julian.CalendarGregorian(1977, 2, 1).toYear()
        var res = new julian.CalendarGregorian().fromYear(y)
        assert.deepEqual(res.getDate(), {year: 1977, month: 2, day: 1})
      })
    })

    describe('CalendarJulian.toYear', function () {
      it('1977-02-14', function () {
        var res = new julian.CalendarJulian(1977, 2, 14).toYear()
        assert.equal(res.toFixed(5), 1977.12055)
      })
    })
  })

  describe('check Gregorian calendar', function () {
    it('1582-10-15 GC', function () {
      var jd = julian.CalendarGregorianToJD(1582, 10, 15)
      var res = julian.isJDCalendarGregorian(jd)
      assert.ok(res)
    })

    it('1582-10-14 GC', function () {
      var jd = julian.CalendarGregorianToJD(1582, 10, 14)
      var res = julian.isJDCalendarGregorian(jd)
      assert.ok(!res)
    })

    it('1582-10-04 JC', function () {
      var jd = julian.CalendarJulianToJD(1582, 10, 4)
      var res = julian.isJDCalendarGregorian(jd)
      assert.ok(!res)
    })

    it('1582-10-05 JC', function () {
      var jd = julian.CalendarJulianToJD(1582, 10, 5)
      var res = julian.isJDCalendarGregorian(jd)
      assert.ok(res)
    })
  })

  describe('Calendar', function () {
    it('can instatiate with year', function () {
      var d = new julian.Calendar(2015)
      assert.equal(d.year, 2015)
      assert.equal(d.month, 1)
      assert.equal(d.day, 1)
    })
    it('can instatiate with Date', function () {
      var d = new julian.Calendar(new Date('2015-10-20T12:00:00Z'))
      assert.equal(d.year, 2015)
      assert.equal(d.month, 10)
      assert.equal(d.day, 20.5)
    })
    it('can convert from Date to JD', function () {
      var d = new julian.Calendar().fromDate(new Date('2000-01-01T12:00:00Z'))
      var jd = d.toJD()
      assert.equal(jd, base.J2000)
    })
    it('can convert from JD to Date', function () {
      var d = new julian.Calendar().fromJD(base.J2000)
      var date = d.toDate()
      assert.equal(date.toISOString(), '2000-01-01T12:00:00.000Z')
    })
    it('can set date to midnight of same day and convert date to iso string', function () {
      var d = new julian.Calendar(2015, 10, 20.4)
      var datestr = d.midnight().toISOString()
      assert.equal(datestr, '2015-10-20T00:00:00.000Z')
    })
    it('can set date to noon of same day', function () {
      var d = new julian.Calendar(2015, 10, 20.4)
      var date = d.noon().toDate()
      assert.equal(date.toISOString(), '2015-10-20T12:00:00.000Z')
    })
    it('can return date', function () {
      var d = new julian.Calendar(2015, 10, 20.4)
      assert.deepEqual(d.getDate(), {year: 2015, month: 10, day: 20})
    })
    it('can return time', function () {
      var d = new julian.Calendar(new Date('2015-10-20T08:00:00.000Z'))
      assert.deepEqual(d.getTime(), {hour: 8, minute: 0, second: 0, millisecond: 0})
    })
    it('can return time 2', function () {
      var d = new julian.Calendar(2015, 10, 20.33333333)
      assert.deepEqual(d.getTime(), {hour: 7, minute: 59, second: 59, millisecond: 999})
    })
    it('can convert to Dynamical Time and back to Universal Time', function () {
      var d = new julian.Calendar(1, 1, 1)
      assert.equal(d.toISOString(), '0001-01-01T00:00:00.000Z')
      d.deltaT() // convert to Dynamical Time
      assert.equal(d.toISOString(), '0001-01-01T02:56:13.459Z')
      d.deltaT(true) // convert back to Universal Time
      assert.equal(d.toISOString(), '0001-01-01T00:00:00.003Z') // 3 ms precision error
    })
    it('can convert to decimal year', function () {
      var d = new julian.Calendar(2000, 7, 2)
      assert.equal(d.toYear(), 2000.5)
    })
    it('can get day of year', function () {
      var d = new julian.Calendar(1400, 12, 24)
      assert.equal(d.dayOfYear(), 359)
    })
    it('can get day of week', function () {
      var d = new julian.Calendar(1400, 12, 24)
      var weekday = 'sun mon tue wed thu fri sat'.split(' ')
      assert.equal(weekday[d.dayOfWeek()], 'fri')
    })
    it('1582-10-15 GC', function () {
      var d = new julian.Calendar(1582, 10, 15)
      assert.equal(d.isGregorian(), true)
    })
    it('1582-10-14 JC', function () {
      var d = new julian.Calendar(1582, 10, 14)
      assert.equal(d.isGregorian(), false)
    })
    it('1582-10-15 GC using Date', function () {
      var d = new julian.Calendar(new Date('1582-10-15T00:00:00Z'))
      assert.equal(d.isGregorian(), true)
    })
  })
  describe('CalendarGregorian', function () {
    it('can convert date to Julian Calendar', function () {
      var d = new julian.CalendarGregorian(1582, 10, 15)
      assert.deepEqual(d.toJulian().getDate(), { year: 1582, month: 10, day: 5 })
    })
  })
  describe('CalendarJulian', function () {
    it('can convert date to Gregorian Calendar', function () {
      var d = new julian.CalendarJulian(1582, 10, 5)
      assert.deepEqual(d.toGregorian().getDate(), { year: 1582, month: 10, day: 15 })
    })
  })
})
