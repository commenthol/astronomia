import assert from 'assert'

import {eqtime, data, julian, planetposition, sexagesimal as sexa} from '..'

describe('#eqtime', function () {
  it('e', function () {
    // Example 28.a, p. 184
    var earth = new planetposition.Planet(data.earth)
    var j = julian.CalendarGregorianToJD(1992, 10, 13)
    var eq = eqtime.e(j, earth)
    assert.equal(new sexa.HourAngle(eq).toString(1), '0ʰ13ᵐ42.6ˢ')
  })

  it('eSmart', function () {
    // Example 28.b, p. 185
    var eq = eqtime.eSmart(julian.CalendarGregorianToJD(1992, 10, 13))
    assert.equal(eq.toFixed(7), 0.0598256) // rad
    assert.equal(new sexa.HourAngle(eq).toString(1), '0ʰ13ᵐ42.7ˢ')
  })
})
