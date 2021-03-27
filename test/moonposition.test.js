import assert from 'assert'
import float from './support/float.js'
import { base, julian, moonposition } from '../src/index.js'

const R2D = 180 / Math.PI

describe('#moonposition', function () {
  it('position', function () {
    // Example 47.a, p. 342.
    const jde = julian.CalendarGregorianToJD(1992, 4, 12)
    const res = moonposition.position(jde)
    assert.strictEqual(float(res.lon * R2D).toFixed(6), 133.162655)
    assert.strictEqual(float(res.lat * R2D).toFixed(6), -3.229126)
    assert.strictEqual(float(res.range).toFixed(1), 368409.7)
  })

  it('parallax', function () {
    // Example 47.a, p. 342.
    const jde = julian.CalendarGregorianToJD(1992, 4, 12)
    const res = moonposition.position(jde)
    const π = moonposition.parallax(res.range)
    assert.strictEqual(float(π * R2D).toFixed(6), 0.991990)
  })

  it('parallax 2', function () {
    // test case from chapter 40, p. 280
    const π = moonposition.parallax(0.37276 * base.AU)
    const got = π * R2D * 60 * 60 // radians to seconds
    const want = 23.592
    assert.ok(Math.abs(got - want) < 0.001)
  })

  describe('test node 0°', function () {
    // Test data p. 344.
    const n0 = [
      julian.CalendarGregorianToJD(1913, 5, 27),
      julian.CalendarGregorianToJD(1932, 1, 6),
      julian.CalendarGregorianToJD(1950, 8, 17),
      julian.CalendarGregorianToJD(1969, 3, 29),
      julian.CalendarGregorianToJD(1987, 11, 8),
      julian.CalendarGregorianToJD(2006, 6, 19),
      julian.CalendarGregorianToJD(2025, 1, 29),
      julian.CalendarGregorianToJD(2043, 9, 10),
      julian.CalendarGregorianToJD(2062, 4, 22),
      julian.CalendarGregorianToJD(2080, 12, 1),
      julian.CalendarGregorianToJD(2099, 7, 13)
    ]
    n0.forEach(function (j) {
      it('' + j, function () {
        const e = Math.abs(base.pmod(moonposition.node(j) + 1, 2 * Math.PI) - 1)
        assert.ok(e < 1e-3)
      })
    })
  })

  describe('test node 180°', function () {
    // Test data p. 344.
    const n180 = [
      julian.CalendarGregorianToJD(1922, 9, 16),
      julian.CalendarGregorianToJD(1941, 4, 27),
      julian.CalendarGregorianToJD(1959, 12, 7),
      julian.CalendarGregorianToJD(1978, 7, 19),
      julian.CalendarGregorianToJD(1997, 2, 27),
      julian.CalendarGregorianToJD(2015, 10, 10),
      julian.CalendarGregorianToJD(2034, 5, 21),
      julian.CalendarGregorianToJD(2052, 12, 30),
      julian.CalendarGregorianToJD(2071, 8, 12),
      julian.CalendarGregorianToJD(2090, 3, 23),
      julian.CalendarGregorianToJD(2108, 11, 3)
    ]
    n180.forEach(function (j) {
      it('' + j, function () {
        const e = Math.abs(moonposition.node(j) - Math.PI)
        assert.ok(e < 1e-3)
      })
    })
  })
})
