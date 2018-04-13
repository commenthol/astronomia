/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module fit
 */
/**
 * Fit: Chapter 4, Curve Fitting.
 */

/**
 * Linear fits a line to sample data.
 *
 * Argument p is a list of data points.  Results a and b are coefficients
 * of the best fit line y = ax + b.
 */
export function linear (points) { // (p []struct{ X, Y float64 })  (a, b float64)
  let sx = 0
  let sy = 0
  let sx2 = 0
  let sxy = 0
  for (let p of points) {
    const x = p.x
    const y = p.y
    sx += x
    sy += y
    sx2 += x * x
    sxy += x * y
  }
  const n = points.length
  const d = n * sx2 - sx * sx
  // (4.2) p. 36
  const a = (n * sxy - sx * sy) / d
  const b = (sy * sx2 - sx * sxy) / d
  return [a, b]
}

/**
 * CorrelationCoefficient returns a correlation coefficient for sample data.
 */
export function correlationCoefficient (points) { // (p []struct{ X, Y float64 })  float64
  let sx = 0
  let sy = 0
  let sx2 = 0
  let sy2 = 0
  let sxy = 0
  for (let p of points) {
    const x = p.x
    const y = p.y
    sx += x
    sy += y
    sx2 += x * x
    sy2 += y * y
    sxy += x * y
  }
  const n = points.length
  // (4.3) p. 38
  return (n * sxy - sx * sy) / (Math.sqrt(n * sx2 - sx * sx) * Math.sqrt(n * sy2 - sy * sy))
}

/**
 * Quadratic fits y = ax² + bx + c to sample data.
 *
 * Argument p is a list of data points.  Results a, b, and c are coefficients
 * of the best fit quadratic y = ax² + bx + c.
 */
export function quadratic (points) {
  let P = 0
  let Q = 0
  let R = 0
  let S = 0
  let T = 0
  let U = 0
  let V = 0
  for (let p of points) {
    const x = p.x
    const y = p.y
    const x2 = x * x
    P += x
    Q += x2
    R += x * x2
    S += x2 * x2
    T += y
    U += x * y
    V += x2 * y
  }
  const N = points.length
  // (4.5) p. 43
  const D = N * Q * S + 2 * P * Q * R - Q * Q * Q - P * P * S - N * R * R
  // (4.6) p. 43
  const a = (N * Q * V + P * R * T + P * Q * U - Q * Q * T - P * P * V - N * R * U) / D
  const b = (N * S * U + P * Q * V + Q * R * T - Q * Q * U - P * S * T - N * R * V) / D
  const c = (Q * S * T + Q * R * U + P * R * V - Q * Q * V - P * S * U - R * R * T) / D
  return [a, b, c]
}

/**
 * Func3 implements multiple linear regression for a linear combination
 * of three functions.
 *
 * Given sample data and three functions in x, Func3 returns coefficients
 * a, b, and c fitting y = aƒ₀(x) + bƒ₁(x) + cƒ₂(x) to sample data.
 */
export function func3 (points, f0, f1, f2) {
  let M = 0
  let P = 0
  let Q = 0
  let R = 0
  let S = 0
  let T = 0
  let U = 0
  let V = 0
  let W = 0
  for (let p of points) {
    const x = p.x
    const y = p.y
    const y0 = f0(x)
    const y1 = f1(x)
    const y2 = f2(x)
    M += y0 * y0
    P += y0 * y1
    Q += y0 * y2
    R += y1 * y1
    S += y1 * y2
    T += y2 * y2
    U += y * y0
    V += y * y1
    W += y * y2
  }
  // (4.7) p. 44
  const D = M * R * T + 2 * P * Q * S - M * S * S - R * Q * Q - T * P * P
  const a = (U * (R * T - S * S) + V * (Q * S - P * T) + W * (P * S - Q * R)) / D
  const b = (U * (S * Q - P * T) + V * (M * T - Q * Q) + W * (P * Q - M * S)) / D
  const c = (U * (P * S - R * Q) + V * (P * Q - M * S) + W * (M * R - P * P)) / D
  return [a, b, c]
}

/**
 * Func1 fits a linear multiple of a function to sample data.
 *
 * Given sample data and a function in x, Func1 returns coefficient
 * a fitting y = aƒ(x).
 */
export function func1 (points, f) {
  let syf = 0
  let sf2 = 0
  // (4.8) p. 45
  for (let p of points) {
    const fx = f(p.x)
    const y = p.y
    syf += y * fx
    sf2 += fx * fx
  }
  return syf / sf2
}

export default {
  linear,
  correlationCoefficient,
  quadratic,
  func3,
  func1
}
