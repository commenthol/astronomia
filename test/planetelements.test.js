import assert from 'assert'
import float from './support/float.js'
import { julian, planetelements } from '../src/index.js'

describe('#planetelements', function () {
  it('mean()', function () {
    const pl = planetelements.mercury
    // Example 31.a, p. 211
    const j = julian.CalendarGregorianToJD(2065, 6, 24)
    const e = new planetelements.Elements()
    planetelements.mean(pl, j, e)
    assert.strictEqual(float(e.lon * 180 / Math.PI).toFixed(6), 203.494701)
    assert.strictEqual(float(e.axis).toFixed(9), 0.387098310)
    assert.strictEqual(float(e.ecc).toFixed(8), 0.20564510)
    assert.strictEqual(float(e.inc * 180 / Math.PI).toFixed(6), 7.006171)
    assert.strictEqual(float(e.node * 180 / Math.PI).toFixed(6), 49.107650)
    assert.strictEqual(float(e.peri * 180 / Math.PI).toFixed(6), 78.475382)
  })

  it('inc(t', function () {
    const pl = planetelements.mercury
    const j = julian.CalendarGregorianToJD(2065, 6, 24)
    const e = planetelements.mean(pl, j)
    assert.strictEqual(planetelements.inc(pl, j), e.inc)
  })

  it('node(t', function () {
    const pl = planetelements.mercury
    const j = julian.CalendarGregorianToJD(2065, 6, 24)
    const e = planetelements.mean(pl, j)
    assert.strictEqual(planetelements.node(pl, j), e.node)
  })
})
