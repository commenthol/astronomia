import assert from 'assert'
import float from './support/float.js'
import { jupiter, planetposition } from '../src/index.js'
import data from '../data/index.js'

describe('#jupiter', function () {
  it('physical()', function () {
    const earth = new planetposition.Planet(data.earth)
    const jupiterP = new planetposition.Planet(data.jupiter)
    // Example 43.a, p. 295
    const res = jupiter.physical(2448972.50068, earth, jupiterP)
    // [DS, DE, ω1, ω2, P]
    assert.strictEqual(float(res[0] * 180 / Math.PI).toFixed(2), -2.20)
    assert.strictEqual(float(res[1] * 180 / Math.PI).toFixed(2), -2.48)
    assert.strictEqual(float(res[2] * 180 / Math.PI).toFixed(2), 268.06)
    assert.strictEqual(float(res[3] * 180 / Math.PI).toFixed(2), 72.74)
    assert.strictEqual(float(res[4] * 180 / Math.PI).toFixed(2), 24.80)
  })

  it('physical2()', function () {
    // Example 43.b, p. 299
    const res = jupiter.physical2(2448972.50068)
    // [DS, DE, ω1, ω2]
    assert.strictEqual(float(res[0] * 180 / Math.PI).toFixed(3), -2.194)
    assert.strictEqual(float(res[1] * 180 / Math.PI).toFixed(2), -2.50)
    assert.strictEqual(float(res[2] * 180 / Math.PI).toFixed(2), 268.12)
    assert.strictEqual(float(res[3] * 180 / Math.PI).toFixed(2), 72.79)
  })
})
