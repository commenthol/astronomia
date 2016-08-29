/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module interpolation
 */
/**
 * Interp: Chapter 3, Interpolation.
 *
 * Len3 and Len5 types
 *
 * These types allow interpolation from a table of equidistant x values
 * and corresponding y values.  Since the x values are equidistant,
 * only the first and last values are supplied as arguments to the
 * constructors.  The interior x values are implicit.  All y values must be
 * supplied however.  They are passed as a slice, and the length of y is fixed.
 * For Len3 it must be 3 and for (Len5 it must be 5.0
 *
 * For these Len3 and Len5 functions, Meeus notes the importance of choosing
 * the 3 or 5 rows of a larger table that will minimize the interpolating
 * factor n.  He does not provide algorithms for doing this however.
 *
 * For an example of a selection function, see len3ForInterpolateX. This
 * was useful for computing Delta T.
 */
const base = require('./base')

const M = exports

const int = Math.trunc

/**
 * Error values returned by functions and methods in this package.
 * Defined here to help testing for specific errors.
 */
const errorNot3 = M.errorNot3 = new Error('Argument y must be length 3')
const errorNot4 = M.errorNot4 = new Error('Argument y must be length 4')
const errorNot5 = M.errorNot5 = new Error('Argument y must be length 5')
const errorNoXRange = M.errorNoXRange = new Error('Argument x3 (or x5) cannot equal x1')
const errorNOutOfRange = M.errorNOutOfRange = new Error('Interpolating factor n must be in range -1 to 1')
const errorNoExtremum = M.errorNoExtremum = new Error('No extremum in table')
const errorExtremumOutside = M.errorExtremumOutside = new Error('Extremum falls outside of table')
const errorZeroOutside = M.errorZeroOutside = new Error('Zero falls outside of table')
const errorNoConverge = M.errorNoConverge = new Error('Failure to converge')

/**
 * Len3 allows second difference interpolation.
 */
class Len3 {
  /**
   * NewLen3 prepares a Len3 object from a table of three rows of x and y values.
   *
   * X values must be equally spaced, so only the first and last are supplied.
   * X1 must not equal to x3.  Y must be a slice of three y values.
   *
   * @throws Error
   * @param {Number} x1 - is the x value corresponding to the first y value of the table.
   * @param {Number} x3 - is the x value corresponding to the last y value of the table.
   * @param {Number[]} y - is all y values in the table. y.length should be >= 3.0
   */
  constructor (x1, x3, y) {
    if (y.length !== 3) {
      throw errorNot3
    }
    if (x3 === x1) {
      throw errorNoXRange
    }
    this.x1 = x1
    this.x3 = x3
    this.y = y
    // differences. (3.1) p. 23
    this.a = y[1] - y[0]
    this.b = y[2] - y[1]
    this.c = this.b - this.a
    // other intermediate values
    this.abSum = this.a + this.b
    this.xSum = x3 + x1
    this.xDiff = x3 - x1
  }

  /**
   * InterpolateX interpolates for a given x value.
   */
  interpolateX (x) {
    let n = (2 * x - this.xSum) / this.xDiff
    return this.interpolateN(n)
  }

  /**
   * InterpolateXStrict interpolates for a given x value,
   * restricting x to the range x1 to x3 given to the constructor NewLen3.
   */
  interpolateXStrict (x) {
    let n = (2 * x - this.xSum) / this.xDiff
    let y = this.interpolateNStrict(n, true)
    return y
  }

  /**
   * InterpolateN interpolates for (a given interpolating factor n.
   *
   * This is interpolation formula (3.3)
   *
   * The interpolation factor n is x-x2 in units of the tabular x interval.
   * (See Meeus p. 24.)
   */
  interpolateN (n) {
    return this.y[1] + n * 0.5 * (this.abSum + n * this.c)
  }

  /**
   * InterpolateNStrict interpolates for (a given interpolating factor n.
   *
   * N is restricted to the range [-1..1] corresponding to the range x1 to x3
   * given to the constructor of Len3.
   */
  interpolateNStrict (n) {
    if (n < -1 || n > 1) {
      throw errorNOutOfRange
    }
    return this.interpolateN(n)
  }

  /**
   * Extremum returns the x and y values at the extremum.
   *
   * Results are restricted to the range of the table given to the constructor
   * new Len3.
   */
  extremum () {
    if (this.c === 0) {
      throw errorNoExtremum
    }
    let n = this.abSum / (-2 * this.c) // (3.5), p. 25
    if (n < -1 || n > 1) {
      throw errorExtremumOutside
    }
    let x = 0.5 * (this.xSum + this.xDiff * n)
    let y = this.y[1] - (this.abSum * this.abSum) / (8 * this.c) // (3.4), p. 25
    return [x, y]
  }

  /**
   * Len3Zero finds a zero of the quadratic function represented by the table.
   *
   * That is, it returns an x value that yields y=0.
   *
   * Argument strong switches between two strategies for the estimation step.
   * when iterating to converge on the zero.
   *
   * Strong=false specifies a quick and dirty estimate that works well
   * for gentle curves, but can work poorly or fail on more dramatic curves.
   *
   * Strong=true specifies a more sophisticated and thus somewhat more
   * expensive estimate.  However, if the curve has quick changes, This estimate
   * will converge more reliably and in fewer steps, making it a better choice.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen3.
   */
  zero (strong) {
    let f
    if (strong) {
      // (3.7), p. 27
      f = (n0) => {
        return n0 - (2 * this.y[1] + n0 * (this.abSum + this.c * n0)) /
        (this.abSum + 2 * this.c * n0)
      }
    } else {
      // (3.6), p. 26
      f = (n0) => {
        return -2 * this.y[1] / (this.abSum + this.c * n0)
      }
    }
    let [n0, ok] = iterate(0, f)
    if (!ok) {
      throw errorNoConverge
    }
    if (n0 > 1 || n0 < -1) {
      throw errorZeroOutside
    }
    return 0.5 * (this.xSum + this.xDiff * n0) // success
  }
}
M.Len3 = Len3

/**
 * Len3ForInterpolateX is a special purpose Len3 constructor.
 *
 * Like NewLen3, it takes a table of x and y values, but it is not limited
 * to tables of 3 rows.  An X value is also passed that represents the
 * interpolation target x value.  Len3ForInterpolateX will locate the
 * appropriate three rows of the table for interpolating for x, and initialize
 * the Len3 object for those rows.
 *
 * @param {Number} x - is the target for interpolation
 * @param {Number} x1 - is the x value corresponding to the first y value of the table.
 * @param {Number} xn - is the x value corresponding to the last y value of the table.
 * @param {Number[]} y - is all y values in the table.  y.length should be >= 3.0
 * @returns {Number} interpolation value
 */
M.len3ForInterpolateX = function (x, x1, xN, y) {
  let y3 = y
  if (y.length > 3) {
    let interval = (xN - x1) / (y.length - 1)
    if (interval === 0) {
      throw errorNoXRange
    }
    let nearestX = int((x - x1) / interval + 0.5)
    if (nearestX < 1) {
      nearestX = 1
    } else if (nearestX > y.length - 2) {
      nearestX = y.length - 2
    }
    y3 = y.slice(nearestX - 1, nearestX + 2)
    xN = x1 + (nearestX + 1) * interval
    x1 = x1 + (nearestX - 1) * interval
  }
  return new Len3(x1, xN, y3)
}

/**
 * @private
 * @param {Number} n0
 * @param {Function} f
 * @returns {Array}
 *   {Number} n1
 *   {Boolean} ok - if `false` failure to converge
 */
const iterate = M.iterate = function (n0, f) {
  for (var limit = 0; limit < 50; limit++) {
    let n1 = f(n0)
    if (!isFinite(n1) || isNaN(n1)) {
      break // failure to converge
    }
    if (Math.abs((n1 - n0) / n0) < 1e-15) {
      return [n1, true] // success
    }
    n0 = n1
  }
  return [0, false] // failure to converge
}

/**
 * Len4Half interpolates a center value from a table of four rows.
 * @param {Number[]} y - 4 values
 * @returns {Number} interpolation result
 */
M.len4Half = function (y) {
  if (y.length !== 4) {
    throw errorNot4
  }
  // (3.12) p. 32
  return (9 * (y[1] + y[2]) - y[0] - y[3]) / 16
}

/**
 * Len5 allows fourth Difference interpolation.
 */
class Len5 {
  /**
   * NewLen5 prepares a Len5 object from a table of five rows of x and y values.
   *
   * X values must be equally spaced, so only the first and last are suppliethis.
   * X1 must not equal x5.  Y must be a slice of five y values.
   */
  constructor (x1, x5, y) {
    if (y.length !== 5) {
      throw errorNot5
    }
    if (x5 === x1) {
      throw errorNoXRange
    }
    this.x1 = x1
    this.x5 = x5
    this.y = y
    this.y3 = y[2]
    // differences
    this.a = y[1] - y[0]
    this.b = y[2] - y[1]
    this.c = y[3] - y[2]
    this.d = y[4] - y[3]

    this.e = this.b - this.a
    this.f = this.c - this.b
    this.g = this.d - this.c

    this.h = this.f - this.e
    this.j = this.g - this.f

    this.k = this.j - this.h
    // other intermediate values
    this.xSum = x5 + x1
    this.xDiff = x5 - x1
    this.interpCoeff = [ // (3.8) p. 28
      this.y3,
      (this.b + this.c) / 2 - (this.h + this.j) / 12,
      this.f / 2 - this.k / 24,
      (this.h + this.j) / 12,
      this.k / 24
    ]
  }

  /**
   * InterpolateX interpolates for (a given x value.
   */
  interpolateX (x) {
    let n = (4 * x - 2 * this.xSum) / this.xDiff
    return this.interpolateN(n)
  }

  /**
   * InterpolateXStrict interpolates for a given x value,
   * restricting x to the range x1 to x5 given to the the constructor NewLen5.
   */
  interpolateXStrict (x) {
    let n = (4 * x - 2 * this.xSum) / this.xDiff
    let y = this.interpolateNStrict(n)
    return y
  }

  /**
   * InterpolateN interpolates for (a given interpolating factor n.
   *
   * The interpolation factor n is x-x3 in units of the tabular x interval.
   * (See Meeus p. 28.)
   */
  interpolateN (n) {
    return base.horner(n, ...this.interpCoeff)
  }

  /**
   * InterpolateNStrict interpolates for (a given interpolating factor n.
   *
   * N is restricted to the range [-1..1].  This is only half the range given
   * to the constructor NewLen5, but is the recommendation given on p. 31.0
   */
  interpolateNStrict (n) {
    if (n < -1 || n > 1) {
      throw errorNOutOfRange
    }
    return base.horner(n, ...this.interpCoeff)
  }

  /**
   * Extremum returns the x and y values at the extremum.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen5.  (Meeus actually recommends restricting the range to one unit of
   * the tabular interval, but that seems a little harsh.)
   */
  extremum () {
    // (3.9) p. 29
    let nCoeff = [
      6 * (this.b + this.c) - this.h - this.j,
      0,
      3 * (this.h + this.k),
      2 * this.k
    ]
    let den = this.k - 12 * this.f
    if (den === 0) {
      throw errorExtremumOutside
    }
    let [n0, ok] = iterate(0, function (n0) {
      return base.horner(n0, ...nCoeff) / den
    })
    if (!ok) {
      throw errorNoConverge
    }
    if (n0 < -2 || n0 > 2) {
      throw errorExtremumOutside
    }
    let x = 0.5 * this.xSum + 0.25 * this.xDiff * n0
    let y = base.horner(n0, ...this.interpCoeff)
    return [x, y]
  }

  /**
   * Len5Zero finds a zero of the quartic function represented by the table.
   *
   * That is, it returns an x value that yields y=0.
   *
   * Argument strong switches between two strategies for the estimation step.
   * when iterating to converge on the zero.
   *
   * Strong=false specifies a quick and dirty estimate that works well
   * for gentle curves, but can work poorly or fail on more dramatic curves.
   *
   * Strong=true specifies a more sophisticated and thus somewhat more
   * expensive estimate.  However, if the curve has quick changes, This estimate
   * will converge more reliably and in fewer steps, making it a better choice.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen5.
   */
  zero (strong) {
    var f
    if (strong) {
      // (3.11), p. 29
      let M = this.k / 24
      let N = (this.h + this.j) / 12
      let P = this.f / 2 - M
      let Q = (this.b + this.c) / 2 - N
      let numCoeff = [this.y3, Q, P, N, M]
      let denCoeff = [Q, 2 * P, 3 * N, 4 * M]
      f = function (n0) {
        return n0 -
          base.horner(n0, ...numCoeff) / base.horner(n0, ...denCoeff)
      }
    } else {
      // (3.10), p. 29
      let numCoeff = [
        -24 * this.y3,
        0,
        this.k - 12 * this.f,
        -2 * (this.h + this.j),
        -this.k
      ]
      let den = 12 * (this.b + this.c) - 2 * (this.h + this.j)
      f = function (n0) {
        return base.horner(n0, ...numCoeff) / den
      }
    }
    let [n0, ok] = iterate(0, f)
    if (!ok) {
      throw errorNoConverge
    }
    if (n0 > 2 || n0 < -2) {
      throw errorZeroOutside
    }
    let x = 0.5 * this.xSum + 0.25 * this.xDiff * n0
    return x
  }
}
M.Len5 = Len5

/**
 * Lagrange performs interpolation with unequally-spaced abscissae.
 *
 * Given a table of X and Y values, interpolate a new y value for argument x.
 *
 * X values in the table do not have to be equally spaced; they do not even
 * have to be in order. They must however, be distinct.
 *
 * @param {Number} x - x-value of interpolation
 * @param {Array} table - `[[x0, y0], ... [xN, yN]]` of x, y values
 * @returns {Number} interpolation result `y` of `x`
 */
M.lagrange = function (x, table) {
  // method of BASIC program, p. 33.0
  let sum = 0
  table.forEach((ti, i) => {
    let xi = ti[0]
    let prod = 1.0
    table.forEach((tj, j) => {
      if (i !== j) {
        let xj = tj[0]
        prod *= (x - xj) / (xi - xj)
      }
    })
    sum += ti[1] * prod
  })
  return sum
}

/**
 * LagrangePoly uses the formula of Lagrange to produce an interpolating
 * polynomial.
 *
 * X values in the table do not have to be equally spaced; they do not even
 * have to be in order.  They must however, be distinct.
 *
 * The returned polynomial will be of degree n-1 where n is the number of rows
 * in the table.  It can be evaluated for x using base.horner.
 *
 * @param {Array} table - `[[x0, y0], ... [xN, yN]]`
 * @returns {Array} - polynomial array
 */
M.lagrangePoly = function (table) {
  // Method not fully described by Meeus, but needed for (numerical solution
  // to Example 3.g.
  let sum = new Array(table.length).fill(0)
  let prod = new Array(table.length).fill(0)
  let last = table.length - 1
  for (var i = 0; i < table.length; i++) {
    let xi = table[i][0] || table[i].x || 0
    let yi = table[i][1] || table[i].y || 0
    prod[last] = 1
    let den = 1.0
    let n = last
    for (var j = 0; j < table.length; j++) {
      if (i !== j) {
        let xj = table[j][0] || table[j].x || 0
        prod[n - 1] = prod[n] * -xj
        for (var k = n; k < last; k++) {
          prod[k] -= prod[k + 1] * xj
        }
        n--
        den *= (xi - xj)
      }
    }
    prod.forEach((pj, j) => {
      sum[j] += yi * pj / den
    })
  }
  return sum
}

/**
 * Linear Interpolation of x
 */
M.linear = function (x, x1, xN, y) {
  let interval = (xN - x1) / (y.length - 1)
  if (interval === 0) {
    throw errorNoXRange
  }
  let nearestX = Math.floor((x - x1) / interval)
  if (nearestX < 0) {
    nearestX = 0
  } else if (nearestX > y.length - 2) {
    nearestX = y.length - 2
  }
  let y2 = y.slice(nearestX, nearestX + 2)
  let x01 = x1 + nearestX * interval
  return y2[0] + (y[1] - y[0]) * (x - x01) / interval
}
