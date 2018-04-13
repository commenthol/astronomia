import assert from 'assert'
import {fit} from '..'

describe('#fit', function () {
  it('linear', function () {
    // Example 4.a, p. 37.0
    var data = [
      {x: 0.2982, y: 10.92},
      {x: 0.2969, y: 11.01},
      {x: 0.2918, y: 10.99},
      {x: 0.2905, y: 10.78},
      {x: 0.2707, y: 10.87},
      {x: 0.2574, y: 10.80},
      {x: 0.2485, y: 10.75},
      {x: 0.2287, y: 10.14},
      {x: 0.2238, y: 10.21},
      {x: 0.2156, y: 9.97},
      {x: 0.1992, y: 9.69},
      {x: 0.1948, y: 9.57},
      {x: 0.1931, y: 9.66},
      {x: 0.1889, y: 9.63},
      {x: 0.1781, y: 9.65},
      {x: 0.1772, y: 9.44},
      {x: 0.1770, y: 9.44},
      {x: 0.1755, y: 9.32},
      {x: 0.1746, y: 9.20}
    ]
    var res = fit.linear(data)
    var a = res[0]
    var b = res[1]

    assert.equal(a.toFixed(2), 13.67)
    assert.equal(b.toFixed(2), 7.03)
  })

  it('correlationCoefficient', function () {
    // Example 4.b, p. 40.0
    var data = [
      {x: 73, y: 90.4},
      {x: 38, y: 125.3},
      {x: 35, y: 161.8},
      {x: 42, y: 143.4},
      {x: 78, y: 52.5},
      {x: 68, y: 50.8},
      {x: 74, y: 71.5},
      {x: 42, y: 152.8},
      {x: 52, y: 131.3},
      {x: 54, y: 98.5},
      {x: 39, y: 144.8},
      {x: 61, y: 78.1},
      {x: 42, y: 89.5},
      {x: 49, y: 63.9},
      {x: 50, y: 112.1},
      {x: 62, y: 82.0},
      {x: 44, y: 119.8},
      {x: 39, y: 161.2},
      {x: 43, y: 208.4},
      {x: 54, y: 111.6},
      {x: 44, y: 167.1},
      {x: 37, y: 162.1}
    ]
    var res = fit.linear(data)
    var a = res[0].toFixed(2)
    var b = res[1].toFixed(2)
    var s = 'y = ' + a + 'x + ' + b

    assert.equal(s, 'y = -2.49x + 244.18')
    assert.equal(fit.correlationCoefficient(data).toFixed(3), -0.767)
  })

  /**
   * example data p. 40.0
   * useful for testing quadratic and func3
   */
  var qdata = [
    {x: -4, y: -6},
    {x: -3, y: -1},
    {x: -2, y: 2},
    {x: -1, y: 3},
    {x: 0, y: 2},
    {x: 1, y: -1},
    {x: 2, y: -6}
  ]

  it('quadratic', function () {
    var res = fit.quadratic(qdata)
    var exp = [ -1, -2, 2 ]
    assert.deepEqual(res, exp)
  })

  /**
   * Text p. 45 shows quadratic is special case of Func3.
   * This indicates a test case for Func3
   */
  it('func3', function () {
    var f0 = function (x) { return x * x }
    var f1 = function (x) { return x }
    var f2 = function (x) { return 1 }
    var res = fit.func3(qdata, f0, f1, f2)
    var exp = [ -1, -2, 2 ]
    assert.deepEqual(res, exp)
  })

  it('func3 example', function () {
    // Example 4.c, p. 44.0
    var data = [
      {x: 3, y: 0.0433},
      {x: 20, y: 0.2532},
      {x: 34, y: 0.3386},
      {x: 50, y: 0.3560},
      {x: 75, y: 0.4983},
      {x: 88, y: 0.7577},
      {x: 111, y: 1.4585},
      {x: 129, y: 1.8628},
      {x: 143, y: 1.8264},
      {x: 160, y: 1.2431},
      {x: 183, y: -0.2043},
      {x: 200, y: -1.2431},
      {x: 218, y: -1.8422},
      {x: 230, y: -1.8726},
      {x: 248, y: -1.4889},
      {x: 269, y: -0.8372},
      {x: 290, y: -0.4377},
      {x: 303, y: -0.3640},
      {x: 320, y: -0.3508},
      {x: 344, y: -0.2126}
    ]
    // fix up data to have `x` in radians
    for (var i in data) {
      data[i].x *= Math.PI / 180
    }
    var f0 = Math.sin
    var f1 = function (x) { return Math.sin(2 * x) }
    var f2 = function (x) { return Math.sin(3 * x) }
    var res = fit.func3(data, f0, f1, f2)
    // output four decimal places corresponding to precision of Y values.
    assert.equal(res[0].toFixed(4), 1.2000)
    assert.equal(res[1].toFixed(4), -0.7700)
    assert.equal(res[2].toFixed(4), 0.3900)
  })

  it('func1', function () {
    var data = [
      {x: 0, y: 0},
      {x: 1, y: 1.2},
      {x: 2, y: 1.4},
      {x: 3, y: 1.7},
      {x: 4, y: 2.1},
      {x: 5, y: 2.2}
    ]
    var a = fit.func1(data, Math.sqrt)
    assert.equal(a.toFixed(3), 1.016) // y = 1.016√x
  })
})
