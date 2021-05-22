import assert from 'assert'
import float from './support/float.js'
import { planetposition, solarxyz } from '../src/index.js'
import data from '../data/index.js'

describe('#solarxyz', function () {
  const earth = new planetposition.Planet(data.earth)

  it('position()', function () {
    // Example 26.a, p. 172.0
    const pos = solarxyz.position(earth, 2448908.5)
    // Meeus result (using appendix III):
    // X = -0.9379952
    // Y = -0.3116544
    // Z = -0.1351215

    assert.strictEqual(float(pos.x).toFixed(7), -0.9379963)
    assert.strictEqual(float(pos.y).toFixed(7), -0.3116537)
    assert.strictEqual(float(pos.z).toFixed(7), -0.1351207)
  })

  it('positionJ2000()', function () {
    // Example 26.b, p. 175 but for output see complete VSOP87
    // results given on p. 176.0
    const pos = solarxyz.positionJ2000(earth, 2448908.5)

    assert.strictEqual(float(pos.x).toFixed(8), -0.93739707)
    assert.strictEqual(float(pos.y).toFixed(8), -0.31316724)
    assert.strictEqual(float(pos.z).toFixed(8), -0.13577841)
  })

  it('positionB1950()', function () {
    // Example 26.b, p. 175
    const pos = solarxyz.positionB1950(earth, 2448908.5)

    assert.strictEqual(float(pos.x).toFixed(8), -0.94148805)
    assert.strictEqual(float(pos.y).toFixed(8), -0.30266488)
    assert.strictEqual(float(pos.z).toFixed(8), -0.13121349)
  })

  it('positionEquinox()', function () {
    // Example 26.b, p. 175
    const pos = solarxyz.positionEquinox(earth, 2448908.5, 2044)

    assert.strictEqual(float(pos.x).toFixed(8), -0.93368100)
    assert.strictEqual(float(pos.y).toFixed(8), -0.32237347)
    assert.strictEqual(float(pos.z).toFixed(8), -0.13977803)
  })
})
