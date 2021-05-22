import assert from 'assert'
import float from './support/float.js'
import { planetposition, julian, solardisk } from '../src/index.js'
import data from '../data/index.js'

describe('#solardisk', function () {
  const earth = new planetposition.Planet(data.earth)
  const p = 180 / Math.PI

  it('ephemeris', function () {
    const j = 2448908.50068
    const res = solardisk.ephemeris(j, earth)
    const P = res[0]
    const B0 = res[1]
    const L0 = res[2]
    assert.strictEqual(float(P * p).toFixed(2), 26.27)
    assert.strictEqual(float(B0 * p).toFixed(2), 5.99)
    assert.strictEqual(float(L0 * p).toFixed(2), 238.63)
    // P:  26.27
    // B0: +5.99
    // L0: 238.63
  })

  it('cycle', function () {
    const j = solardisk.cycle(1699)
    const t = new julian.Calendar().fromJD(j)
    assert.strictEqual(float(j).toFixed(4), 2444480.7230)
    assert.strictEqual(t.year, 1980)
    assert.strictEqual(t.month, 8)
    assert.strictEqual(float(t.day).toFixed(2), 29.22)
    // 2444480.7230
    // 1980 August 29.22
  })
})
