import assert from 'assert'
import { julian, sidereal, sexagesimal as sexa } from '../src/index.js'

describe('#sidereal', function () {
  it('Mean', function () {
    // Example 12.a, p. 88.
    const jd = 2446895.5
    const s = sidereal.mean(jd)
    const sa = sidereal.apparent(jd)
    assert.strictEqual(new sexa.Time(s).toString(5), '13ʰ10ᵐ46ˢ.36683')
    assert.strictEqual(new sexa.Time(sa).toString(5), '13ʰ10ᵐ46ˢ.13514')
  })

  it('Mean #2', function () {
    // Example 12.b, p. 89.
    const jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0, 0)))
    const s = sidereal.mean(jd)
    assert.strictEqual(new sexa.Time(s).toString(5), '8ʰ34ᵐ57ˢ.08958')
  })
})
