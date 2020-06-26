import assert from 'assert'
import float from './support/float.js'
import { parabolic, julian } from '..'

describe('#parabolic', function () {
  it('anomalyDistance', function () {
    // Example 34.a, p. 243
    var e = new parabolic.Elements(
      julian.CalendarGregorianToJD(1998, 4, 14.4358),
      1.487469
    )
    var j = julian.CalendarGregorianToJD(1998, 8, 5)
    var res = e.anomalyDistance(j)
    assert.strictEqual(float(res.ano * 180 / Math.PI).toFixed(5), 66.78862) // deg
    assert.strictEqual(float(res.dist).toFixed(6), 2.133911) // AU
  })
})
