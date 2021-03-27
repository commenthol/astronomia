import assert from 'assert'
import float from './support/float.js'
import { apsis, moonposition, julian, sexagesimal as sexa } from '../src/index.js'

describe('#apsis', function () {
  it('meanApogee', function () {
    // Example 50.a, p. 357.0
    const res = apsis.meanApogee(1988.75)
    assert.strictEqual(float(res).toFixed(4), 2447442.8191)
  })

  it('apogee', function () {
    // Example 50.a, p. 357.0
    const j = apsis.apogee(1988.75)
    assert.strictEqual(float(j).toFixed(4), 2447442.3543) // JDE
    const date = julian.JDEToDate(j)
    assert.strictEqual(date.toISOString(), '1988-10-07T20:29:15.380Z')
  })

  it('apogeeParallax', function () {
    // Example 50.a, p. 357.0
    const p = apsis.apogeeParallax(1988.75)
    assert.strictEqual(float(p * 180 / Math.PI * 3600).toFixed(3), 3240.679)
    assert.strictEqual(new sexa.Angle(p).toString(3), '0°54′.679″')
  })

  /**
   * Test cases from p. 361.0
   */
  it('perigee', function () {
    const tests = [
      [1997, 12, 9 + 16.9 / 24, 1997.93],
      [1998, 1, 3 + 8.5 / 24, 1998.01],
      [1990, 12, 2 + 10.8 / 24, 1990.92],
      [1990, 12, 30 + 23.8 / 24, 1991]
    ]
    tests.forEach(function (t) {
      const c = { y: t[0], m: t[1], d: t[2], dy: t[3] }
      it('' + c.dy, function () {
        const ref = julian.CalendarGregorianToJD(c.y, c.m, c.d)
        const j = apsis.perigee(c.dy)
        const err = Math.abs(j - ref)
        assert.ok(err < 0.1, 'got' + j + 'expected' + ref)
      })
    })
  })

  it('perigeeParallax', function () {
    const p = apsis.perigeeParallax(1997.93)
    assert.strictEqual(float(p * 180 / Math.PI * 3600).toFixed(3), 3566.637)
    assert.strictEqual(new sexa.Angle(p).toString(3), '0°59′26.637″')
  })

  it('perigeeDistance', function () {
    const y = 1997.93
    const p = apsis.perigeeParallax(y)
    const d = apsis.distance(p)
    assert.strictEqual(float(d).toFixed(0), 368877)
    const per = apsis.perigee(y)
    const dist = moonposition.position(per).range
    assert.strictEqual(float(dist).toFixed(0), 368881)
  })

  it('comparing perigeeParallax with parallax from position', function () {
    const y = 1997.93
    const perPar = apsis.perigeeParallax(y)
    const per = apsis.perigee(y)
    const dist = moonposition.position(per).range
    const par = moonposition.parallax(dist)
    const Δ = Math.abs(perPar - par) / Math.PI * 180 * 3600 // difference in arc seconds
    assert.ok(Δ < 0.1, Δ + ' should be less than 0.1')
  })

  it('apogeeDistance', function () {
    const y = 1997.90
    const p = apsis.apogeeParallax(y)
    const d = apsis.distance(p)
    assert.strictEqual(float(d).toFixed(0), 404695)
    const apo = apsis.apogee(y)
    const dist = moonposition.position(apo).range
    assert.strictEqual(float(dist).toFixed(0), 404697)
  })

  it('comparing apogeeParallax with parallax from position', function () {
    const y = 1997.90
    const apoPar = apsis.apogeeParallax(y)
    const apo = apsis.apogee(y)
    const dist = moonposition.position(apo).range
    const par = moonposition.parallax(dist)
    const Δ = Math.abs(apoPar - par) / Math.PI * 180 * 3600 // difference in arc seconds
    assert.ok(Δ < 0.1, Δ + ' should be less than 0.1')
  })
})
