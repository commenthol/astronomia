import assert from 'assert'
import {planetposition, data, julian, solardisk} from '..'

describe('#solardisk', function () {
  var earth = new planetposition.Planet(data.earth)
  var p = 180 / Math.PI

  it('ephemeris', function () {
    var j = 2448908.50068
    var res = solardisk.ephemeris(j, earth)
    var P = res[0]
    var B0 = res[1]
    var L0 = res[2]
    assert.equal((P * p).toFixed(2), 26.27)
    assert.equal((B0 * p).toFixed(2), 5.99)
    assert.equal((L0 * p).toFixed(2), 238.63)
    // P:  26.27
    // B0: +5.99
    // L0: 238.63
  })

  it('cycle', function () {
    var j = solardisk.cycle(1699)
    var t = new julian.Calendar().fromJD(j)
    assert.equal(j.toFixed(4), 2444480.7230)
    assert.equal(t.year, 1980)
    assert.equal(t.month, 8)
    assert.equal(t.day.toFixed(2), 29.22)
    // 2444480.7230
    // 1980 August 29.22
  })
})
