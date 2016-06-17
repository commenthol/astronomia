/**
 * Circle: Chapter 20, Smallest Circle containing three Celestial Bodies.
 */
const M = exports

/**
 * Smallest finds the smallest circle containing three points.
 *
 * Arguments should represent coordinates in right ascension and declination
 * or longitude and latitude.  Result Δ is the diameter of the circle, typeI
 * is true if solution is of type I.
 *
 * @param {Number} r1, d1 - ra, dec point 1
 * @param {Number} r2, d2 - ra, dec point 2
 * @param {Number} r3, d3 - ra, dec point 3
 * @returns {Array} [Δ, typeI]
 *  {Number} Δ - diameter of the circle
 *  {Number} typeI - true - Two points on circle, one interior.
 *                   false - All three points on circle.
 */
M.smallest = function (r1, d1, r2, d2, r3, d3) { // (r1, d1, r2, d2, r3, d3 float64)  (Δ float64, typeI bool)
  // Using haversine formula
  let cd1 = Math.cos(d1)
  let cd2 = Math.cos(d2)
  let cd3 = Math.cos(d3)
  let a = 2 * Math.asin(Math.sqrt(hav(d2 - d1) + cd1 * cd2 * hav(r2 - r1)))
  let b = 2 * Math.asin(Math.sqrt(hav(d3 - d2) + cd2 * cd3 * hav(r3 - r2)))
  let c = 2 * Math.asin(Math.sqrt(hav(d1 - d3) + cd3 * cd1 * hav(r1 - r3)))
  if (b > a) {
    [a, b] = noswap(b, a)
  }
  if (c > a) {
    [a, c] = noswap(c, a)
  }
  if (a * a >= b * b + c * c) {
    return [a, true]
  }
  // (20.1) p. 128
  return [2 * a * b * c / Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (a + c - b)), false]
}

const noswap = function (a, b) {
  return [a, b]
}

const hav = function (a) { // (a float64)  float64
  return 0.5 * (1 - Math.cos(a))
}
