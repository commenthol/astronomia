import assert from 'assert'
import {julian, sidereal, sexagesimal as sexa} from '..'

describe('#sidereal', function () {
  it('Mean', function () {
    // Example 12.a, p. 88.
    var jd = 2446895.5
    var s = sidereal.mean(jd)
    var sa = sidereal.apparent(jd)
    assert.equal(new sexa.Time(s).toString(5), '13ʰ10ᵐ46ˢ.36683')
    assert.equal(new sexa.Time(sa).toString(5), '13ʰ10ᵐ46ˢ.13514')
  })

  it('Mean #2', function () {
    // Example 12.b, p. 89.
    var jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0, 0)))
    var s = sidereal.mean(jd)
    assert.equal(new sexa.Time(s).toString(5), '8ʰ34ᵐ57ˢ.08958')
  })
})
