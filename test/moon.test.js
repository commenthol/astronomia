import assert from 'assert'
import float from './support/float.js'
import { julian, moon, planetposition } from '../src/index.js'
import data from '../data/index.js'

const j = julian.CalendarGregorianToJD(1992, 4, 12)
const earth = new planetposition.Planet(data.earth)
const R2D = 180 / Math.PI

describe('#moon', function () {
  it('physical', function () {
    // Example 53.a p374
    const a = moon.physical(j, earth)
    const cMoon = a[0]
    const P = a[1]
    const cSun = a[2]
    assert.strictEqual(float(cMoon.lon * R2D).toFixed(2), -1.23) // l langitude
    assert.strictEqual(float(cMoon.lat * R2D).toFixed(2), 4.20) // b latitude
    assert.strictEqual(float(P * R2D).toFixed(2), 15.08) // P position angle
    assert.strictEqual(float(cSun.lon * R2D).toFixed(2), 67.90)
    assert.strictEqual(float(cSun.lat * R2D).toFixed(2), 1.46)
  })

  it('sunAltitude', function () {
    const phy = moon.physical(j, earth)
    const cSun = phy[2]
    const h = moon.sunAltitude(moon.selenographic.copernicus, cSun)
    assert.strictEqual(float(h * R2D).toFixed(3), 2.318)
  })

  it('sunrise', function () {
    // Example 53.c p377 - sunrise for the crater Copernicus in April 1992
    const j0 = julian.CalendarGregorianToJD(1992, 4, 12)
    const j = moon.sunrise(moon.selenographic.copernicus, j0, earth)
    const date = new julian.CalendarGregorian().fromJD(j)
    assert.deepStrictEqual(date, new julian.CalendarGregorian(1992, 4, 11.806921077892184))
  })
})
