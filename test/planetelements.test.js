import assert from 'assert'
import {julian, planetelements} from '..'

describe('#planetelements', function () {
  it('mean()', function () {
    var pl = planetelements.mercury
    // Example 31.a, p. 211
    var j = julian.CalendarGregorianToJD(2065, 6, 24)
    var e = new planetelements.Elements()
    planetelements.mean(pl, j, e)
    assert.equal((e.lon * 180 / Math.PI).toFixed(6), 203.494701)
    assert.equal((e.axis).toFixed(9), 0.387098310)
    assert.equal((e.ecc).toFixed(8), 0.20564510)
    assert.equal((e.inc * 180 / Math.PI).toFixed(6), 7.006171)
    assert.equal((e.node * 180 / Math.PI).toFixed(6), 49.107650)
    assert.equal((e.peri * 180 / Math.PI).toFixed(6), 78.475382)
  })

  it('inc(t', function () {
    var pl = planetelements.mercury
    var j = julian.CalendarGregorianToJD(2065, 6, 24)
    var e = planetelements.mean(pl, j)
    assert.equal(planetelements.inc(pl, j), e.inc)
  })

  it('node(t', function () {
    var pl = planetelements.mercury
    var j = julian.CalendarGregorianToJD(2065, 6, 24)
    var e = planetelements.mean(pl, j)
    assert.equal(planetelements.node(pl, j), e.node)
  })
})
