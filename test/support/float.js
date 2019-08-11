import assert from 'assert'

const float = (num) => ({
  toFixed: (precision) => {
    assert.ok(typeof num === 'number')
    return parseFloat(num.toFixed(precision), 10)
  }
})
export default float
