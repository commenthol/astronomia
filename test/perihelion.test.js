/* eslint comma-dangle: 0 */

import assert from 'assert'
import {julian, perihelion, data, planetposition} from '..'

function toObj (props, table) {
  return table.map(function (row) {
    var o = {}
    ;(row || []).forEach(function (v, i) {
      o[props[i]] = v
    })
    return o
  })
}

var slow = function () {}

if (process.env.SLOWTESTS) {
  slow = function (a) { return a }
}

describe('#perihelion', function () {
  it('perihelion', function () {
    // Example 38.a, p. 270
    var j = perihelion.perihelion(perihelion.venus, 1978.79)
    assert.equal(j.toFixed(3), 2443873.704)
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '1978-12-31T04:54:11.688Z'
    )
  })

  it('aphelion', function () {
    // Example 38.b, p. 270
    var j = perihelion.aphelion(perihelion.mars, 2032.5)
    assert.equal(j.toFixed(3), 2463530.456)
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '2032-10-24T22:57:15.702Z'
    )
  })

  it('JS', function () {
    // p. 270
    var j = perihelion.aphelion(perihelion.jupiter, 1981.5)
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '1981-07-19T04:39:38.178Z'
    )
    var s = perihelion.perihelion(perihelion.saturn, 1944.5)
    assert.equal(new julian.CalendarGregorian().fromJD(s).toDate().toISOString(),
      '1944-07-30T04:33:17.683Z'
    )
  })

  it('Earth', function () {
    // p. 273
    var j = perihelion.perihelion(perihelion.embary, 1990)
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '1990-01-03T09:51:19.604Z'
    )
    j = perihelion.perihelion(perihelion.earth, 1990)
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '1990-01-04T16:06:49.591Z'
    )
  })

  it('JS2', function () {
    // p. 270
    var planet = new planetposition.Planet(data.jupiter)
    var j = perihelion.aphelion2(planet, 1981.5, 1)[0]
    assert.equal(new julian.CalendarGregorian().fromJD(j).toDate().toISOString(),
      '1981-07-28T06:08:00.824Z'
    )
    planet = new planetposition.Planet(data.saturn)
    var s = perihelion.perihelion2(planet, 1944.5, 1)[0]
    assert.equal(new julian.CalendarGregorian().fromJD(s).toDate().toISOString(),
      '1944-09-08T02:34:29.611Z'
    )
  })

  describe('Saturn 2 sync', function () {
    var sd = toObj('ap, y, m, d, r'.split(', '),
      [
        ['a', 1929, 11, 11, 10.0467],
        ['p', 1944, 9, 8, 9.0288],
        slow(['a', 1959, 5, 29, 10.0664]),
        slow(['p', 1974, 1, 8, 9.0153]),
        slow(['a', 1988, 9, 11, 10.0444]),
        slow(['p', 2003, 7, 26, 9.0309]),
        slow(['a', 2018, 4, 17, 10.0656]),
        slow(['p', 2032, 11, 28, 9.0149]),
        slow(['a', 2047, 7, 15, 10.0462])
      ]
    )

    // p. 271
    var v = new planetposition.Planet(data.saturn)
    sd
      .filter(function (d) { return d.ap })
      .forEach(function (d) {
        it([d.y, d.m, d.d].join('-'), function () {
          var yf = d.y + (d.m - 0.5) / 12
          var res
          if (d.ap === 'a') {
            res = perihelion.aphelion2(v, yf, 1)
          } else {
            res = perihelion.perihelion2(v, yf, 1)
          }
          var o = julian.JDToCalendar(res[0])
          assert.equal(o.year, d.y)
          assert.equal(o.month, d.m)
          assert.equal(Math.trunc(o.day), d.d)
          assert.ok(Math.abs(res[1] - d.r) < 0.0001, d.r)
        })
      })
  })

  describe('Uranus 2 async', function () {
    this.timeout(5000)

    var sd = toObj('ap, y, m, d, r'.split(', '),
      [
        ['a', 1756, 11, 27, 20.0893],
        ['p', 1798, 3, 3, 18.289],
        slow(['a', 1841, 3, 16, 20.0976]),
        slow(['p', 1882, 3, 23, 18.2807]),
        slow(['a', 1925, 4, 1, 20.0973]),
        slow(['p', 1966, 5, 21, 18.2848]),
        slow(['a', 2009, 2, 27, 20.0989]),
        slow(['p', 2050, 8, 17, 18.283]),
        slow(['a', 2092, 11, 23, 20.0994])
      ]
    )

    var v = new planetposition.Planet(data.uranus)
    sd
      .filter(function (d) { return d.ap })
      .forEach(function (d) {
        it([d.y, d.m, d.d].join('-'), function (done) {
          function cb (res) {
            var o = julian.JDToCalendar(res[0])
            assert.equal(o.year, d.y)
            assert.equal(o.month, d.m)
            assert.equal(Math.trunc(o.day), d.d)
            assert.ok(Math.abs(res[1] - d.r) < 0.0001, d.r)
            done()
          }

          var yf = d.y + (d.m - 0.5) / 12
          if (d.ap === 'a') {
            perihelion.aphelion2(v, yf, 1, cb)
          } else {
            perihelion.perihelion2(v, yf, 1, cb)
          }
        })
      })
  })

  describe('Neptune 2 async', function () {
    this.timeout(25000) // one test takes >15secs

    var sd = toObj('ap, y, m, d, r'.split(', '),
      [
        slow(['p', 1876, 8, 28, 29.8148]), // p. 271
        slow(['a', 1959, 7, 13, 30.3317]), // p. 271
        slow(['p', 2042, 9, 5, 29.8064]) // p. 272
      ]
    )

    var v = new planetposition.Planet(data.neptune)
    sd
      .filter(function (d) { return d.ap })
      .forEach(function (d) {
        it([d.y, d.m, d.d].join('-'), function (done) {
          function cb (res) {
            var o = julian.JDToCalendar(res[0])
            assert.equal(o.year, d.y)
            assert.equal(o.month, d.m)
            assert.equal(Math.trunc(o.day), d.d)
            assert.ok(Math.abs(res[1] - d.r) < 0.0001, d.r)
            done()
          }

          var yf = d.y + (d.m - 0.5) / 12
          if (d.ap === 'a') {
            perihelion.aphelion2(v, yf, 1, cb)
          } else {
            perihelion.perihelion2(v, yf, 1, cb)
          }
        })
      })
  })

  describe('Earth 2 async', function () {
    this.timeout(5000)

    var sd = toObj('ap, y, m, d, h, r'.split(', '),
      [
        ['p', 1991, 1, 3, 3, 0.983281],
        slow(['p', 1992, 1, 3, 15.06, 0.983324]),
        slow(['p', 1993, 1, 4, 3.08, 0.983283]),
        slow(['p', 1994, 1, 2, 5.92, 0.983301]),
        slow(['p', 1995, 1, 4, 11.1, 0.983302]),
        slow(['p', 1996, 1, 4, 7.43, 0.983223]),
        slow(['p', 1997, 1, 1, 23.29, 0.983267]),
        slow(['p', 1998, 1, 4, 21.27, 0.9833]),
        slow(['p', 1999, 1, 3, 13.02, 0.983281]),
        slow(['p', 2000, 1, 3, 5.31, 0.983321]),
        slow(['p', 2001, 1, 4, 8.89, 0.983286]),
        slow(['p', 2002, 1, 2, 14.17, 0.98329]),
        slow(['p', 2003, 1, 4, 5.04, 0.98332]),
        slow(['p', 2004, 1, 4, 17.72, 0.983265]),
        slow(['p', 2005, 1, 2, 0.61, 0.983297]),
        slow(['p', 2006, 1, 4, 15.52, 0.983327]),
        slow(['p', 2007, 1, 3, 19.74, 0.983260]),
        slow(['p', 2008, 1, 2, 23.87, 0.983280]),
        slow(['p', 2009, 1, 4, 15.51, 0.983273]),
        slow(['p', 2010, 1, 3, 0.18, 0.98329]),
        ['a', 1991, 7, 6, 15.46, 1.016703],
        slow(['a', 1992, 7, 3, 12.14, 1.01674]),
        slow(['a', 1993, 7, 4, 22.37, 1.016666]),
        slow(['a', 1994, 7, 5, 19.3, 1.016724]),
        slow(['a', 1995, 7, 4, 2.29, 1.016742]),
        slow(['a', 1996, 7, 5, 19.02, 1.016717]),
        slow(['a', 1997, 7, 4, 19.34, 1.016754]),
        slow(['a', 1998, 7, 3, 23.86, 1.016696]),
        slow(['a', 1999, 7, 6, 22.86, 1.016718]),
        slow(['a', 2000, 7, 3, 23.84, 1.016741]),
        slow(['a', 2001, 7, 4, 13.65, 1.016643]),
        slow(['a', 2002, 7, 6, 3.8, 1.016688]),
        slow(['a', 2003, 7, 4, 5.67, 1.016728]),
        slow(['a', 2004, 7, 5, 10.9, 1.016694]),
        slow(['a', 2005, 7, 5, 4.98, 1.016742]),
        slow(['a', 2006, 7, 3, 23.18, 1.016697]),
        slow(['a', 2007, 7, 6, 23.89, 1.016706]),
        slow(['a', 2008, 7, 4, 7.71, 1.016754]),
        slow(['a', 2009, 7, 4, 1.69, 1.016666]),
        slow(['a', 2010, 7, 6, 11.52, 1.016702])
      ]
    )

    var v = new planetposition.Planet(data.earth)
    sd
      .filter(function (d) { return d.ap })
      .forEach(function (d) {
        it([d.y, d.m, d.d].join('-'), function (done) {
          function cb (res) {
            var o = julian.JDToCalendar(res[0])
            assert.equal(o.year, d.y)
            assert.equal(o.month, d.m)
            assert.equal(Math.trunc(o.day), d.d)
            var hour = (o.day - Math.trunc(o.day)) * 24
            assert.ok(Math.abs(hour - d.h) < 0.01, hour + '!~' + d.h)
            assert.ok(Math.abs(res[1] - d.r) < 0.000001, res[1] + '!~' + d.r)
            done()
          }

          var yf = d.y + (d.m - 0.5) / 12
          if (d.ap === 'a') {
            perihelion.aphelion2(v, yf, 0.0004, cb)
          } else {
            perihelion.perihelion2(v, yf, 0.0004, cb)
          }
        })
      })
  })
})
