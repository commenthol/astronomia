import assert from 'assert'
import float from './support/float.js'
import { julian, node, perihelion, planetelements } from '../src/index.js'

describe('#node', function () {
  it('EllipticAscending()', function () {
    // Example 39.a, p. 276
    const res = node.ellipticAscending(17.9400782, 0.96727426,
      111.84644 * Math.PI / 180,
      julian.CalendarGregorianToJD(1986, 2, 9.45891))
    const t = res[0]
    const r = res[1]
    const d = julian.JDToCalendar(t)
    assert.strictEqual(d.year, 1985)
    assert.strictEqual(d.month, 11)
    assert.strictEqual(float(d.day).toFixed(2), 9.16)
    assert.strictEqual(float(r).toFixed(4), 1.8045) // AU
  })

  it('EllipticDescending()', function () {
    // Example 39.a, p. 276
    const res = node.ellipticDescending(17.9400782, 0.96727426,
      111.84644 * Math.PI / 180,
      julian.CalendarGregorianToJD(1986, 2, 9.45891)
    )
    const t = res[0]
    const r = res[1]
    const d = julian.JDToCalendar(t)
    assert.strictEqual(d.year, 1986)
    assert.strictEqual(d.month, 3)
    assert.strictEqual(float(d.day).toFixed(2), 10.37)
    assert.strictEqual(float(r).toFixed(4), 0.8493) // AU
  })

  it('parabolicAscending()', function () {
    // Example 29.b, p. 277
    const res = node.parabolicAscending(1.324502,
      154.9103 * Math.PI / 180,
      julian.CalendarGregorianToJD(1989, 8, 20.291)
    )
    const t = res[0]
    const r = res[1]
    const d = julian.JDToCalendar(t)
    assert.strictEqual(d.year, 1977)
    assert.strictEqual(d.month, 9)
    assert.strictEqual(float(d.day).toFixed(1), 17.6)
    assert.strictEqual(float(r).toFixed(2), 28.07) // AU
  })

  it('parabolicDescending()', function () {
    // Example 29.b, p. 277
    const res = node.parabolicDescending(1.324502,
      154.9103 * Math.PI / 180,
      julian.CalendarGregorianToJD(1989, 8, 20.291)
    )
    const t = res[0]
    const r = res[1]
    const d = julian.JDToCalendar(t)
    assert.strictEqual(d.year, 1989)
    assert.strictEqual(d.month, 9)
    assert.strictEqual(float(d.day).toFixed(3), 17.636)
    assert.strictEqual(float(r).toFixed(4), 1.3901) // AU
  })

  it('ellipticAscending_venus()', function () {
    // Example 39.c, p. 278
    const k = planetelements.mean(
      planetelements.venus,
      julian.CalendarGregorianToJD(1979, 1, 1)
    )
    const res = node.ellipticAscending( // eslint-disable-line no-unused-vars
      k.axis, k.ecc,
      k.peri - k.node,
      perihelion.perihelion(perihelion.venus, 1979)
    )
    const t = res[0]
    const d = julian.JDToCalendar(t)
    assert.strictEqual(d.year, 1978)
    assert.strictEqual(d.month, 11)
    assert.strictEqual(float(d.day).toFixed(3), 27.409)
  })
})
