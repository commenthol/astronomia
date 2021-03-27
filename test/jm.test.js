import assert from 'assert'
import { format } from 'util'
import { julian, jm } from '../src/index.js'

describe('#jm', function () {
  it('JewishCalendar', function () {
    // Example 9.a, p. 73.0
    const a = jm.JewishCalendar(1990)
    const A = a[0]
    const mP = a[1]
    const dP = a[2]
    const mNY = a[3]
    const dNY = a[4]
    const months = a[5]
    const days = a[6]
    assert.strictEqual(format('Jewish Year: %s', A), 'Jewish Year: 5750')
    assert.strictEqual(format('Pesach: %s %s', mP, dP), 'Pesach: 4 10')
    assert.strictEqual(format('New Year: %s %s', mNY, dNY), 'New Year: 9 20')
    assert.strictEqual(format('Months: %s', months), 'Months: 12')
    assert.strictEqual(format('Days: %s', days), 'Days: 354')
  })

  it('MoslemToJD', function () {
    // Example 9.b, p. 75, conversion to Julian.
    const jd = jm.MoslemToJD(1421, 1, 1)
    const g = julian.isJDCalendarGregorian(jd) // check type of Calendar Julian/ Gregorian
    const d = julian.JDToCalendar(jd, !g)
    assert.deepStrictEqual(d, { year: 2000, month: 4, day: 6.5 })
  })

  it('MoslemLeapYear', function () {
    // Example 9.b, p. 75, indication of leap year.
    let res = jm.MoslemLeapYear(1421)
    assert.ok(!res) // Moslem year 1421 is a common year of 354 days.
    res = jm.MoslemLeapYear(1423)
    assert.ok(res) // Moslem year 1423 is a leap year of 355 days.
  })

  it('JulianToMoslem', function () {
    // Example 9.c, p. 76, final output.
    const j = new julian.CalendarGregorian(1991, 8, 13).toJulian()
    const o = jm.JulianToMoslem(j.year, j.month, Math.floor(j.day))
    const year = o.year
    const month = o.month
    const day = o.day
    const res = format('%s %s of A.H. %s', day, jm.moslemMonth(month), year)
    assert.strictEqual(res, '2 Ṣafar of A.H. 1412')
  })
})
