/* eslint
no-multi-spaces: 0,
key-spacing: 0,
standard/array-bracket-even-spacing: 0
*/

import assert from 'assert'
import {julian, planetposition, data, solstice, sexagesimal as sexa} from '..'

describe('#solstice', function () {
  it('Example June', function () {
    // Example 27.a, p. 180
    var res = solstice.june(1962)
    assert.equal(res.toFixed(5), 2437837.39245)
  })

  describe('Approx', function () {
    var tests = (function () {
      var data = {
        mar: [
          [1996, 20,  8,  4,  7],
          [1997, 20, 13, 55, 42],
          [1998, 20, 19, 55, 35],
          [1999, 21,  1, 46, 53],
          [2000, 20,  7, 36, 19],
          [2001, 20, 13, 31, 47],
          [2002, 20, 19, 17, 13],
          [2003, 21,  1,  0, 50],
          [2004, 20,  6, 49, 42],
          [2005, 20, 12, 34, 29]
        ],
        jun: [
          [1996, 21,  2, 24, 46],
          [1997, 21,  8, 20, 59],
          [1998, 21, 14,  3, 38],
          [1999, 21, 19, 50, 11],
          [2000, 21,  1, 48, 46],
          [2001, 21,  7, 38, 48],
          [2002, 21, 13, 25, 29],
          [2003, 21, 19, 11, 32],
          [2004, 21,  0, 57, 57],
          [2005, 21,  6, 47, 12]
        ],
        sep: [
          [1996, 22, 18,  1,  8],
          [1997, 22, 23, 56, 49],
          [1998, 23,  5, 38, 15],
          [1999, 23, 11, 32, 34],
          [2000, 22, 17, 28, 40],
          [2001, 22, 23,  5, 32],
          [2002, 23,  4, 56, 28],
          [2003, 23, 10, 47, 53],
          [2004, 22, 16, 30, 54],
          [2005, 22, 22, 24, 14]
        ],
        dec: [
          [1996, 21, 14,  6, 56],
          [1997, 21, 20,  8,  5],
          [1998, 22,  1, 57, 31],
          [1999, 22,  7, 44, 52],
          [2000, 21, 13, 38, 30],
          [2001, 21, 19, 22, 34],
          [2002, 22,  1, 15, 26],
          [2003, 22,  7,  4, 53],
          [2004, 21, 12, 42, 40],
          [2005, 21, 18, 36,  1]
        ]
      }
      var ret = {}
      Object.keys(data).forEach(function (key) {
        ret[key] = data[key].map(function (test) {
          var o = {}
          ;[ 'y', 'd', 'h', 'm', 's' ].forEach(function (p, i) {
            o[p] = test[i]
          })
          return o
        })
      })
      return ret
    })()

    function t2000 (e, month, fn) {
      var approx = solstice[fn](e.y)
      var vsop87 = julian.CalendarGregorianToJD(e.y, month, e.d) +
        new sexa.Time(false, e.h, e.m, e.s).day()
      var res = Math.abs(vsop87 - approx) < 1.0 / 24 / 60
      // console.log(e.y, res, vsop87, approx)
      assert.ok(res)
    }

    describe('March', function () {
      tests.mar.forEach(function (e) {
        it('' + e.y, function () {
          t2000(e, 3, 'march')
        })
      })
    })
    describe('June', function () {
      tests.jun.forEach(function (e) {
        it('' + e.y, function () {
          t2000(e, 6, 'june')
        })
      })
    })
    describe('September', function () {
      tests.sep.forEach(function (e) {
        it('' + e.y, function () {
          t2000(e, 9, 'september')
        })
      })
    })
    describe('December', function () {
      tests.dec.forEach(function (e) {
        it('' + e.y, function () {
          t2000(e, 12, 'december')
        })
      })
    })
  })

  /**
   * Commented out because results cannot be accurately determined.  The idea was
   * to use table 27.F, p. 182 to test functions over a wider range than the ten
   * years of Test2000.  The low accuracy functions of this package would only
   * agree with table 27.F to .2 day, not too surprising since the stated range
   * of those functions is only years -1000 to +3000.  The high accuracy functions
   * though, only agreed to .02 day, not the given precision of .01 day.  I suspect
   * the reason for this is Meeus using his truncated VSOP87 rather than full VSOP87
   * to construct the table but I have no way of knowing.
   */
  describe('Accurate', function () {
    var planet = new planetposition.Planet(data.earth)
    var tests = (function () {
      // from table 27.F p.182 - meanError < 0.02
      /* var years = [
        [ -4000, 93.55, 89.18, 89.07, 93.44 ],
        [ -3500, 93.83, 89.53, 88.82, 93.07 ],
        [ -3000, 94.04, 89.92, 88.61, 92.67 ],
        [ -2500, 94.20, 90.33, 88.47, 92.25 ],
        [ -2000, 94.28, 90.76, 88.38, 91.81 ],
        [ -1500, 94.30, 91.20, 88.38, 91.37 ],
        [ -1000, 94.25, 91.63, 88.42, 90.94 ],
        [ -500, 94.14, 92.05, 88.53, 90.52 ],
        [ 0, 93.96, 92.45, 88.69, 90.13 ],
        [ 500, 93.73, 92.82, 88.90, 89.78 ],
        [ 1000, 93.44, 93.15, 89.18, 89.47 ],
        [ 1500, 93.12, 93.42, 89.50, 89.20 ],
        [ 2000, 92.76, 93.65, 89.84, 88.99 ],
        [ 2500, 92.37, 93.81, 90.22, 88.84 ],
        [ 3000, 91.97, 93.92, 90.61, 88.74 ],
        [ 3500, 91.57, 93.96, 91.01, 88.71 ],
        [ 4000, 91.17, 93.93, 91.40, 88.73 ],
        [ 4500, 90.79, 93.84, 91.79, 88.82 ],
        [ 5000, 90.44, 93.70, 92.15, 88.96 ],
        [ 5500, 90.11, 93.50, 92.49, 89.15 ],
        [ 6000, 89.82, 93.25, 92.79, 89.38 ],
        [ 6500, 89.58, 92.96, 93.04, 89.66 ]
      ] */
      // computed table to match meanError < 0.01
      var years = [
        [ -4000, 93.543, 89.189, 89.077, 93.433 ],
        [ -3500, 93.813, 89.534, 88.827, 93.066 ],
        [ -3000, 94.041, 89.917, 88.616, 92.670 ],
        [ -2500, 94.195, 90.330, 88.472, 92.242 ],
        [ -2000, 94.287, 90.764, 88.394, 91.804 ],
        [ -1500, 94.298, 91.198, 88.384, 91.365 ],
        [ -1000, 94.250, 91.630, 88.422, 90.941 ],
        [ -500, 94.134, 92.045, 88.534, 90.521 ],
        [ 0, 93.964, 92.450, 88.693, 90.137 ],
        [ 500, 93.726, 92.820, 88.913, 89.780 ],
        [ 1000, 93.449, 93.148, 89.182, 89.466 ],
        [ 1500, 93.117, 93.425, 89.500, 89.201 ],
        [ 2000, 92.759, 93.653, 89.840, 88.995 ],
        [ 2500, 92.372, 93.811, 90.221, 88.839 ],
        [ 3000, 91.976, 93.913, 90.603, 88.749 ],
        [ 3500, 91.571, 93.954, 91.004, 88.706 ],
        [ 4000, 91.178, 93.934, 91.401, 88.729 ],
        [ 4500, 90.788, 93.846, 91.797, 88.816 ],
        [ 5000, 90.432, 93.699, 92.154, 88.960 ],
        [ 5500, 90.110, 93.493, 92.494, 89.144 ],
        [ 6000, 89.827, 93.253, 92.783, 89.382 ],
        [ 6500, 89.579, 92.968, 93.043, 89.652 ]
      ]

      var ret = years.map(function (t) {
        var o = {}
        ;[ 'y', 'sp', 'su', 'au', 'wi' ].forEach(function (p, i) {
          o[p] = t[i]
        })
        return o
      })
      return ret
    })()

    function t10000 (t) {
      var meanError = 0.01
      var s1
      var s2
      var s3
      it('spring', function () {
        var s0 = solstice.march2(t.y, planet)
        s1 = solstice.june2(t.y, planet)
        var sp = s1 - s0
        var err = Math.abs(t.sp - sp)
        assert.ok(err < meanError, 'sp ' + err)
      })
      it('summer', function () {
        s2 = solstice.september2(t.y, planet)
        var su = s2 - s1
        var err = Math.abs(t.su - su)
        assert.ok(err < meanError, 'su ' + err)
      })
      it('autumn', function () {
        s3 = solstice.december2(t.y, planet)
        var au = s3 - s2
        var err = Math.abs(t.au - au)
        assert.ok(err < meanError, 'au ' + err)
      })
      it('winter', function () {
        var s4 = solstice.march2(t.y + 1, planet)
        var wi = s4 - s3
        var err = Math.abs(t.wi - wi)
        assert.ok(err < meanError, 'wi ' + err)
      })
    }

    tests.forEach(function (t) {
      describe('seasons ' + t.y, function () {
        t10000(t)
      })
    })
  })

  describe('Solar terms', function () {
    var planet = new planetposition.Planet(data.vsop87Bearth)

    // Solarterms table for years 2014 - 2017
    // http://www.hko.gov.hk/gts/astron2015/Solar_Term_2014_e.htm
    // http://www.hko.gov.hk/gts/astron2015/Solar_Term_2015_e.htm
    // http://www.hko.gov.hk/gts/astron2016/Solar_Term_2016.htm
    // http://www.hko.gov.hk/gts/astron2017/Solar_Term_2017_e.htm

    // Maxmum calculated deviation from compared data set is 31 seconds.
    // On rounding to minutes, tests fail only for Solar term 2016 75°.

    var tests = [
      // ['Solarterm', 'Longitude', 'Name', 2014, 2015, 2016, 2017],
      [23, 285, 'Moderate Cold',    '2014-01-05T18:24+0800', '2015-01-06T00:21+0800', '2016-01-06T06:08+0800', '2017-01-05T11:56+0800'],
      [24, 300, 'Great Cold',       '2014-01-20T11:51+0800', '2015-01-20T17:43+0800', '2016-01-20T23:27+0800', '2017-01-20T05:24+0800'],
      [ 1, 315, 'Vernal Commences', '2014-02-04T06:03+0800', '2015-02-04T11:58+0800', '2016-02-04T17:46+0800', '2017-02-03T23:34+0800'],
      [ 2, 330, 'Vernal Showers',   '2014-02-19T01:59+0800', '2015-02-19T07:50+0800', '2016-02-19T13:34+0800', '2017-02-18T19:31+0800'],
      [ 3, 345, 'Insects Waken',    '2014-03-06T00:02+0800', '2015-03-06T05:56+0800', '2016-03-05T11:44+0800', '2017-03-05T17:33+0800'],
      [ 4,   0, 'Vernal Equinox',   '2014-03-21T00:57+0800', '2015-03-21T06:45+0800', '2016-03-20T12:30+0800', '2017-03-20T18:29+0800'],
      [ 5,  15, 'Bright and Clear', '2014-04-05T04:47+0800', '2015-04-05T10:39+0800', '2016-04-04T16:28+0800', '2017-04-04T22:17+0800'],
      [ 6,  30, 'Corn Rain',        '2014-04-20T11:56+0800', '2015-04-20T17:42+0800', '2016-04-19T23:29+0800', '2017-04-20T05:27+0800'],
      [ 7,  45, 'Summer Commences', '2014-05-05T21:59+0800', '2015-05-06T03:53+0800', '2016-05-05T09:42+0800', '2017-05-05T15:31+0800'],
      [ 8,  60, 'Corn Forms',       '2014-05-21T10:59+0800', '2015-05-21T16:45+0800', '2016-05-20T22:36+0800', '2017-05-21T04:31+0800'],
      [ 9,  75, 'Corn on Ear',      '2014-06-06T02:03+0800', '2015-06-06T07:58+0800', '2016-06-05T13:49+0800', '2017-06-05T19:37+0800'],
      [10,  90, 'Summer Solstice',  '2014-06-21T18:51+0800', '2015-06-22T00:38+0800', '2016-06-21T06:34+0800', '2017-06-21T12:24+0800'],
      [11, 105, 'Moderate Heat',    '2014-07-07T12:15+0800', '2015-07-07T18:12+0800', '2016-07-07T00:03+0800', '2017-07-07T05:51+0800'],
      [12, 120, 'Great Heat',       '2014-07-23T05:41+0800', '2015-07-23T11:30+0800', '2016-07-22T17:30+0800', '2017-07-22T23:15+0800'],
      [13, 135, 'Autumn Commences', '2014-08-07T22:02+0800', '2015-08-08T04:01+0800', '2016-08-07T09:53+0800', '2017-08-07T15:40+0800'],
      [14, 150, 'End of Heat',      '2014-08-23T12:46+0800', '2015-08-23T18:37+0800', '2016-08-23T00:38+0800', '2017-08-23T06:20+0800'],
      [15, 165, 'White Dew',        '2014-09-08T01:01+0800', '2015-09-08T07:00+0800', '2016-09-07T12:51+0800', '2017-09-07T18:39+0800'],
      [16, 180, 'Autumnal Equinox', '2014-09-23T10:29+0800', '2015-09-23T16:21+0800', '2016-09-22T22:21+0800', '2017-09-23T04:02+0800'],
      [17, 195, 'Cold Dew',         '2014-10-08T16:47+0800', '2015-10-08T22:43+0800', '2016-10-08T04:33+0800', '2017-10-08T10:22+0800'],
      [18, 210, 'First Frost',      '2014-10-23T19:57+0800', '2015-10-24T01:47+0800', '2016-10-23T07:46+0800', '2017-10-23T13:27+0800'],
      [19, 225, 'Winter Commences', '2014-11-07T20:07+0800', '2015-11-08T01:59+0800', '2016-11-07T07:48+0800', '2017-11-07T13:38+0800'],
      [20, 240, 'Light Snow',       '2014-11-22T17:38+0800', '2015-11-22T23:25+0800', '2016-11-22T05:22+0800', '2017-11-22T11:05+0800'],
      [21, 255, 'Heavy Snow',       '2014-12-07T13:04+0800', '2015-12-07T18:53+0800', '2016-12-07T00:41+0800', '2017-12-07T06:33+0800'],
      [22, 270, 'Winter Solstice',  '2014-12-22T07:03+0800', '2015-12-22T12:48+0800', '2016-12-21T18:44+0800', '2017-12-22T00:28+0800']
    ]
    var map = {
      2014: 3,
      2015: 4,
      2016: 5,
      2017: 6
    }

    ;[2014, 2015, 2016, 2017].forEach(function (year) {
      var i = map[year]
      describe('' + year, function () {
        tests.forEach(function (test) {
          var deg = test[1]
          it(deg + '° ' + test[2], function () {
            var dateOfTest = new Date(test[i])
            var y = dateOfTest.getFullYear()
            var lon = deg * Math.PI / 180
            if (deg >= 285) --y
            var jde = solstice.longitude(y, planet, lon)
            var date = julian.JDEToDate(jde)
            var err = Math.abs(date.getTime() - dateOfTest.getTime())
            // console.log(dateOfTest.toISOString(), date.toISOString(), Math.trunc(err / 1000))
            assert.ok(err < 31000, err + ' ' + date) // check if difftime is greater 31 seconds
            // let date1 = new Date(Math.round(+date / 60000) * 60000)
            // assert.equal(dateOfTest.toISOString(), date1.toISOString())
          })
        })
      })
    })
  })
})
