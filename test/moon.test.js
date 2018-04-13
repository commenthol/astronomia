import assert from 'assert'
import {base, julian, moon, data, planetposition} from '..'

var j = julian.CalendarGregorianToJD(1992, 4, 12)
var earth = new planetposition.Planet(data.earth)

describe('#moon', function () {
  it('physical', function () {
    var a = moon.physical(j, earth)
    var cMoon = a[0]
    var P = a[1]
    var cSun = a[2]
    assert.equal((cMoon.lon * 180 / Math.PI).toFixed(2), -1.23)
    assert.equal((cMoon.lat * 180 / Math.PI).toFixed(2), 4.20)
    assert.equal((P * 180 / Math.PI).toFixed(2), 15.08)
    assert.equal((cSun.lon * 180 / Math.PI).toFixed(2), 67.90)
    assert.equal((cSun.lat * 180 / Math.PI).toFixed(2), 1.46)
  })

  it('sunAltitude', function () {
    var phy = moon.physical(j, earth)
    var cSun = phy[2]
    var h = moon.sunAltitude(new base.Coord(-20 * Math.PI / 180, 9.7 * Math.PI / 180), cSun)
    assert.equal((h * 180 / Math.PI).toFixed(3), 2.318)
  })

  it('sunrise', function () {
    var j0 = julian.CalendarGregorianToJD(1992, 4, 15)
    var j = moon.sunrise(new base.Coord(-20 * Math.PI / 180, 9.7 * Math.PI / 180), j0, earth)
    var date = new julian.CalendarGregorian().fromJD(j)
    assert.deepEqual(date, {
      year: 1992,
      month: 4,
      day: 11.806928920093924
    })
  })
})
