import assert from 'assert'
import {julian, moonnode} from '..'

describe('#moonnode', function () {
  it('ascending', function () {
    // Example 51.a, p. 365.0
    var j = moonnode.ascending(1987.37)
    var date = new julian.CalendarGregorian().fromJD(j).toISOString()
    assert.equal(j.toFixed(5), 2446938.76803)
    assert.equal(date, '1987-05-23T06:25:57.743Z')
  })
})
