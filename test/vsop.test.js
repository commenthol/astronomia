import assert from 'assert'
import { VSOP } from '../src/vsop87.js'

it.disable = function () {}

describe('#VSOP87', function () {
  it.disable('can load EARTH data', function (done) {
    // disables as requires VSOP87B.ear in package
    const earth = new VSOP('EARTH', [__dirname, '..', 'attic'].join('/'))
    earth.load(function () {
      assert.strictEqual(typeof earth.data.L, 'object')
      assert.strictEqual(typeof earth.data.B, 'object')
      assert.strictEqual(typeof earth.data.R, 'object')
      assert.strictEqual(earth.data.L[0].length, 623)
      assert.strictEqual(earth.data.L[0][0].length, 3)
      assert.strictEqual(earth.data.L[5].length, 4)
      assert.strictEqual(earth.data.B[0].length, 184)
      assert.strictEqual(earth.data.B[5].length, 2)
      assert.strictEqual(earth.data.R[0].length, 523)
      assert.strictEqual(earth.data.R[5].length, 2)
      done()
    })
  })

  it('throws on unknown planet', function (done) {
    assert.throws(function () {
      new VSOP('vogsphere') // eslint-disable-line no-new
    }, /Invalid planet vogsphere/)
    done()
  })
})
