import assert from 'assert'
import {julian, moonmaxdec, sexagesimal as sexa} from '..'

describe('moonmaxdec', function () {
  it('north', function () {
    // Example 52.a, p. 370.0
    var max = moonmaxdec.north(1988.95)
    var δ = max.dec
    var date = julian.JDToDate(max.jde)

    assert.equal(max.jde.toFixed(4), 2447518.3346)
    assert.equal(date.toISOString(), '1988-12-22T20:01:53.743Z')
    assert.equal((δ * 180 / Math.PI).toFixed(4), 28.1562)
    assert.equal(new sexa.Angle(δ).toString(0), '28°9′22″')
  })

  it('south', function () {
    // Example 52.b, p. 370.0
    var max = moonmaxdec.south(2049.3)
    var δ = max.dec
    var date = julian.JDToDate(max.jde)

    assert.equal(max.jde.toFixed(4), 2469553.0834)
    assert.equal(date.toISOString(), '2049-04-21T14:00:09.514Z')
    assert.equal((δ * 180 / Math.PI).toFixed(4), -22.1384)
    assert.equal(new sexa.Angle(δ).toString(0), '-22°8′18″')
  })

  it('north c', function () {
    // Example 52.c, p. 370.0
    var max = moonmaxdec.north(-3.8)
    var δ = max.dec
    var date = new julian.CalendarJulian().fromJD(max.jde)

    assert.equal(max.jde.toFixed(4), 1719672.1412)
    assert.equal(date.toISOString(), '-0004-03-16T15:23:23.989Z')
    assert.equal((δ * 180 / Math.PI).toFixed(4), 28.9739)
    assert.equal(new sexa.Angle(δ).toString(0), '28°58′26″')
  })
})
