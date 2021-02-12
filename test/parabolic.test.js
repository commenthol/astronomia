import assert from 'assert'
import float from './support/float.js'
import { parabolic, julian } from '../src/index.js'

describe('#parabolic', function () {
  it('anomalyDistance', function () {
    // Example 34.a, p. 243
    const e = new parabolic.Elements(
      julian.CalendarGregorianToJD(1998, 4, 14.4358),
      1.487469
    )
    const j = julian.CalendarGregorianToJD(1998, 8, 5)
    const res = e.anomalyDistance(j)
    assert.strictEqual(float(res.ano * 180 / Math.PI).toFixed(5), 66.78862) // deg
    assert.strictEqual(float(res.dist).toFixed(6), 2.133911) // AU
  })
})
