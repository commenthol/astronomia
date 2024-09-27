import assert from 'assert'
import { calculateAscendant, DDtoDMS } from '../src/ascendant.js'
import sexa from '../src/sexagesimal.js'

describe('calculateAscendant', function () {
  it('Ascendant at given location and time', function () {
    const latitude = new sexa.Angle(false, 48, 5, 0)
    const longitude = new sexa.Angle(false, 19, 47, 0)
    const date = new Date(1988, 4, 7, 3, 58)
    assert.strictEqual(calculateAscendant(latitude, longitude, date), 0.17035463316698507)
  })
})

describe('DDtoDMS', function () {
  it('Transform Decimal Degree', function () {
    const DDlatitude = 43.63871944444445
    const DDlongitude = -116.2413513485235
    assert.strictEqual(DDtoDMS(DDlatitude).toString(0), '43°38′19″')
    assert.strictEqual(DDtoDMS(DDlongitude).toString(0), '-116°14′29″')
  })
})
