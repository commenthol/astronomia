import assert from 'assert'
import {julian, node, perihelion, planetelements} from '..'

describe('#node', function () {
  it('EllipticAscending()', function () {
    // Example 39.a, p. 276
    var res = node.ellipticAscending(17.9400782, 0.96727426,
      111.84644 * Math.PI / 180,
      julian.CalendarGregorianToJD(1986, 2, 9.45891))
    var t = res[0]
    var r = res[1]
    var d = julian.JDToCalendar(t)
    assert.equal(d.year, 1985)
    assert.equal(d.month, 11)
    assert.equal(d.day.toFixed(2), 9.16)
    assert.equal(r.toFixed(4), 1.8045) // AU
  })

  it('EllipticDescending()', function () {
    // Example 39.a, p. 276
    var res = node.ellipticDescending(17.9400782, 0.96727426,
      111.84644 * Math.PI / 180,
      julian.CalendarGregorianToJD(1986, 2, 9.45891)
    )
    var t = res[0]
    var r = res[1]
    var d = julian.JDToCalendar(t)
    assert.equal(d.year, 1986)
    assert.equal(d.month, 3)
    assert.equal(d.day.toFixed(2), 10.37)
    assert.equal(r.toFixed(4), 0.8493) // AU
  })

  it('parabolicAscending()', function () {
    // Example 29.b, p. 277
    var res = node.parabolicAscending(1.324502,
      154.9103 * Math.PI / 180,
      julian.CalendarGregorianToJD(1989, 8, 20.291)
    )
    var t = res[0]
    var r = res[1]
    var d = julian.JDToCalendar(t)
    assert.equal(d.year, 1977)
    assert.equal(d.month, 9)
    assert.equal(d.day.toFixed(1), 17.6)
    assert.equal(r.toFixed(2), 28.07) // AU
  })

  it('parabolicDescending()', function () {
    // Example 29.b, p. 277
    var res = node.parabolicDescending(1.324502,
      154.9103 * Math.PI / 180,
      julian.CalendarGregorianToJD(1989, 8, 20.291)
    )
    var t = res[0]
    var r = res[1]
    var d = julian.JDToCalendar(t)
    assert.equal(d.year, 1989)
    assert.equal(d.month, 9)
    assert.equal(d.day.toFixed(3), 17.636)
    assert.equal(r.toFixed(4), 1.3901) // AU
  })

  it('ellipticAscending_venus()', function () {
    // Example 39.c, p. 278
    var k = planetelements.mean(
      planetelements.venus,
      julian.CalendarGregorianToJD(1979, 1, 1)
    )
    var res = node.ellipticAscending( // eslint-disable-line no-unused-vars
      k.axis, k.ecc,
      k.peri - k.node,
      perihelion.perihelion(perihelion.venus, 1979)
    )
    var t = res[0]
    var d = julian.JDToCalendar(t)
    assert.equal(d.year, 1978)
    assert.equal(d.month, 11)
    assert.equal(d.day.toFixed(3), 27.409)
  })
})
