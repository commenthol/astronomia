import assert from 'assert'
import {jupiter, data, planetposition} from '..'

describe('#jupiter', function () {
  it('physical()', function () {
    var earth = new planetposition.Planet(data.earth)
    var jupiterP = new planetposition.Planet(data.jupiter)
    // Example 43.a, p. 295
    var res = jupiter.physical(2448972.50068, earth, jupiterP)
    // [DS, DE, ω1, ω2, P]
    assert.equal((res[0] * 180 / Math.PI).toFixed(2), -2.20)
    assert.equal((res[1] * 180 / Math.PI).toFixed(2), -2.48)
    assert.equal((res[2] * 180 / Math.PI).toFixed(2), 268.06)
    assert.equal((res[3] * 180 / Math.PI).toFixed(2), 72.74)
    assert.equal((res[4] * 180 / Math.PI).toFixed(2), 24.80)
  })

  it('physical2()', function () {
    // Example 43.b, p. 299
    var res = jupiter.physical2(2448972.50068)
    // [DS, DE, ω1, ω2]
    assert.equal((res[0] * 180 / Math.PI).toFixed(3), -2.194)
    assert.equal((res[1] * 180 / Math.PI).toFixed(2), -2.50)
    assert.equal((res[2] * 180 / Math.PI).toFixed(2), 268.12)
    assert.equal((res[3] * 180 / Math.PI).toFixed(2), 72.79)
  })
})
