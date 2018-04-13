import assert from 'assert'
import {apsis, moonposition, julian, sexagesimal as sexa} from '..'

describe('#apsis', function () {
  it('meanApogee', function () {
    // Example 50.a, p. 357.0
    var res = apsis.meanApogee(1988.75)
    assert.equal(res.toFixed(4), 2447442.8191)
  })

  it('apogee', function () {
    // Example 50.a, p. 357.0
    var j = apsis.apogee(1988.75)
    assert.equal(j.toFixed(4), 2447442.3543) // JDE
    var date = julian.JDEToDate(j)
    assert.equal(date.toISOString(), '1988-10-07T20:29:15.380Z')
  })

  it('apogeeParallax', function () {
    // Example 50.a, p. 357.0
    var p = apsis.apogeeParallax(1988.75)
    assert.equal((p * 180 / Math.PI * 3600).toFixed(3), 3240.679)
    assert.equal(new sexa.Angle(p).toString(3), '0°54′.679″')
  })

  /**
   * Test cases from p. 361.0
   */
  it('perigee', function () {
    var tests = [
      [1997, 12, 9 + 16.9 / 24, 1997.93],
      [1998, 1, 3 + 8.5 / 24, 1998.01],
      [1990, 12, 2 + 10.8 / 24, 1990.92],
      [1990, 12, 30 + 23.8 / 24, 1991]
    ]
    tests.forEach(function (t) {
      var c = { y: t[0], m: t[1], d: t[2], dy: t[3] }
      it('' + c.dy, function () {
        var ref = julian.CalendarGregorianToJD(c.y, c.m, c.d)
        var j = apsis.perigee(c.dy)
        var err = Math.abs(j - ref)
        assert.ok(err < 0.1, 'got' + j + 'expected' + ref)
      })
    })
  })

  it('perigeeParallax', function () {
    var p = apsis.perigeeParallax(1997.93)
    assert.equal((p * 180 / Math.PI * 3600).toFixed(3), 3566.637)
    assert.equal(new sexa.Angle(p).toString(3), '0°59′26.637″')
  })

  it('perigeeDistance', function () {
    var y = 1997.93
    var p = apsis.perigeeParallax(y)
    var d = apsis.distance(p)
    assert.equal(d.toFixed(0), 368877)
    var per = apsis.perigee(y)
    var dist = moonposition.position(per).range
    assert.equal(dist.toFixed(0), 368881)
  })

  it('comparing perigeeParallax with parallax from position', function () {
    var y = 1997.93
    var perPar = apsis.perigeeParallax(y)
    var per = apsis.perigee(y)
    var dist = moonposition.position(per).range
    var par = moonposition.parallax(dist)
    var Δ = Math.abs(perPar - par) / Math.PI * 180 * 3600 // difference in arc seconds
    assert.ok(Δ < 0.1, Δ + ' should be less than 0.1')
  })

  it('apogeeDistance', function () {
    var y = 1997.90
    var p = apsis.apogeeParallax(y)
    var d = apsis.distance(p)
    assert.equal(d.toFixed(0), 404695)
    var apo = apsis.apogee(y)
    var dist = moonposition.position(apo).range
    assert.equal(dist.toFixed(0), 404697)
  })

  it('comparing apogeeParallax with parallax from position', function () {
    var y = 1997.90
    var apoPar = apsis.apogeeParallax(y)
    var apo = apsis.apogee(y)
    var dist = moonposition.position(apo).range
    var par = moonposition.parallax(dist)
    var Δ = Math.abs(apoPar - par) / Math.PI * 180 * 3600 // difference in arc seconds
    assert.ok(Δ < 0.1, Δ + ' should be less than 0.1')
  })
})
