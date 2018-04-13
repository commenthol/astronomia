import assert from 'assert'
import {base, julian, planetposition, data, solar, sexagesimal as sexa} from '..'

describe('#solar', function () {
  var jde = julian.CalendarGregorianToJD(1992, 10, 13)
  var T = base.J2000Century(jde)

  it('apparentEquatorialVSOP87', function () {
    // Example 25.b, p. 169, but as this code uses the full VSOP87 theory,
    // results match those at bottom of p. 165.
    var planet = new planetposition.Planet(data.earth)
    var res = solar.apparentEquatorialVSOP87(planet, jde)

    assert.equal(new sexa.RA(res.ra).toString(3), '13ʰ13ᵐ30.749ˢ')
    assert.equal(new sexa.Angle(res.dec).toString(3), '-7°47′1.741″')
    assert.equal(res.range, 0.997608521657578)
  })

  it('Example true', function () {
    // Example 25.a, p. 165.
    var res = solar.true(T)

    assert.equal(jde, 2448908.5)
    assert.equal(T.toFixed(9), -0.072183436)
    assert.equal((res.lon * 180 / Math.PI).toFixed(5), 199.90987)
    assert.equal(res.ano.toFixed(5), 4.83625)
  })

  it('Example meanAnomaly', function () {
    // Example 25.a, p. 165.
    var res = solar.meanAnomaly(T) * 180 / Math.PI
    assert.equal(res.toFixed(5), -2241.00603)
  })

  it('Example eccentricity', function () {
    // Example 25.a, p. 165.
    var res = solar.eccentricity(T)
    assert.equal(res.toFixed(9), 0.016711668)
  })

  it('Example radius', function () {
    // Example 25.a, p. 165.
    var res = solar.radius(T)
    assert.equal(res.toFixed(5), 0.99766) //  AU
  })

  it('Example apparentLongitude', function () {
    // Example 25.a, p. 165.
    var res = solar.apparentLongitude(T)
    assert.equal(new sexa.Angle(res).toString(0), '199°54′32″')
  })

  it('Example apparentEquatorial', function () {
    // Example 25.a, p. 165.
    var res = solar.apparentEquatorial(jde)
    assert.equal(new sexa.RA(res.ra).toString(1), '13ʰ13ᵐ31.4ˢ')
    assert.equal(new sexa.Angle(res.dec).toString(0), '-7°47′6″')
  })
})
