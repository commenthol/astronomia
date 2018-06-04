import assert from 'assert'
import {julian, moon, data, planetposition} from '..'

var j = julian.CalendarGregorianToJD(1992, 4, 12)
var earth = new planetposition.Planet(data.earth)
var R2D = 180 / Math.PI

describe('#moon', function () {
  it('physical', function () {
    // Example 53.a p374
    var a = moon.physical(j, earth)
    var cMoon = a[0]
    var P = a[1]
    var cSun = a[2]
    assert.equal((cMoon.lon * R2D).toFixed(2), -1.23) // l langitude
    assert.equal((cMoon.lat * R2D).toFixed(2), 4.20) // b latitude
    assert.equal((P * R2D).toFixed(2), 15.08) // P position angle
    assert.equal((cSun.lon * R2D).toFixed(2), 67.90)
    assert.equal((cSun.lat * R2D).toFixed(2), 1.46)
  })

  it('sunAltitude', function () {
    var phy = moon.physical(j, earth)
    var cSun = phy[2]
    var h = moon.sunAltitude(moon.selenographic.copernicus, cSun)
    assert.equal((h * R2D).toFixed(3), 2.318)
  })

  it('sunrise', function () {
    // Example 53.c p377 - sunrise for the crater Copernicus in April 1992
    var j0 = julian.CalendarGregorianToJD(1992, 4, 12)
    var j = moon.sunrise(moon.selenographic.copernicus, j0, earth)
    var date = new julian.CalendarGregorian().fromJD(j)
    assert.deepEqual(date, {
      year: 1992,
      month: 4,
      day: 11.806921077892184
    })
  })
})
