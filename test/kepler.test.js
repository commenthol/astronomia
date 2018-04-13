import assert from 'assert'
import {kepler} from '..'

describe('#kepler', function () {
  it('kepler1', function () {
    // Example 30.a, p. 196
    var err
    try {
      var E = kepler.kepler1(0.1, 5 * Math.PI / 180, 8)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    assert.equal((E * 180 / Math.PI).toFixed(6), 5.554589)
  })

  it('kepler2', function () {
    // Example 30.b, p. 199
    var err
    try {
      var E = kepler.kepler2(0.1, 5 * Math.PI / 180, 11)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    assert.equal((E * 180 / Math.PI).toFixed(9), 5.554589254)
  })

  it('kepler2a', function () {
    // Example data from p. 205
    var err
    try {
      var E = kepler.kepler2a(0.99, 0.2, 14)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    assert.equal(E.toFixed(12), 1.066997365282)
  })

  it('kepler2b', function () {
    // Example data from p. 205
    var err
    try {
      var E = kepler.kepler2b(0.99, 0.2, 14)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    assert.equal(E.toFixed(12), 1.066997365282)
  })

  it('kepler3', function () {
    // Example data from p. 205
    var E = kepler.kepler3(0.99, 0.2)
    assert.equal(E.toFixed(12), 1.066997365282)
  })

  it('kepler4', function () {
    // Input data from example 30.a, p. 196,
    // result from p. 207
    var E = kepler.kepler4(0.1, 5 * Math.PI / 180)
    assert.equal((E * 180 / Math.PI).toFixed(6), 5.554599)
  })
})
