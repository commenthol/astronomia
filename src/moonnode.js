/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonnode
 */
/**
 * Moonnode: Chapter 51, Passages of the Moon through the Nodes.
 */

import base from './base.js'

/**
 * Ascending returns the date of passage of the Moon through an ascending node.
 *
 * @param {Number} year - decimal year specifying a date near the event.
 * @returns {Number} jde of the event nearest the given date.
 */
export function ascending (year) { // (year float64)  float64
  return node(year, 0)
}

/**
 * Descending returns the date of passage of the Moon through a descending node.
 *
 * @param {Number} year - decimal year specifying a date near the event.
 * @returns {Number} jde of the event nearest the given date.
 */
export function descending (year) { // (year float64)  float64
  return node(year, 0.5)
}

/**
 * @private
 */
function node (y, h) { // (y, h float64)  float64
  let k = (y - 2000.05) * 13.4223 // (50.1) p. 355
  k = Math.floor(k - h + 0.5) + h // snap to half orbit
  const p = Math.PI / 180
  const ck = 1 / 1342.23
  const T = k * ck
  const D = base.horner(T, 183.638 * p, 331.73735682 * p / ck,
    0.0014852 * p, 0.00000209 * p, -0.00000001 * p)
  const M = base.horner(T, 17.4006 * p, 26.8203725 * p / ck,
    0.0001186 * p, 0.00000006 * p)
  const m_ = base.horner(T, 38.3776 * p, 355.52747313 * p / ck,
    0.0123499 * p, 0.000014627 * p, -0.000000069 * p)
  const Ω = base.horner(T, 123.9767 * p, -1.44098956 * p / ck,
    0.0020608 * p, 0.00000214 * p, -0.000000016 * p)
  const V = base.horner(T, 299.75 * p, 132.85 * p, -0.009173 * p)
  const P = Ω + 272.75 * p - 2.3 * p * T
  const E = base.horner(T, 1, -0.002516, -0.0000074)
  return base.horner(T, 2451565.1619, 27.212220817 / ck,
    0.0002762, 0.000000021, -0.000000000088) +
    -0.4721 * Math.sin(m_) +
    -0.1649 * Math.sin(2 * D) +
    -0.0868 * Math.sin(2 * D - m_) +
    0.0084 * Math.sin(2 * D + m_) +
    -0.0083 * Math.sin(2 * D - M) * E +
    -0.0039 * Math.sin(2 * D - M - m_) * E +
    0.0034 * Math.sin(2 * m_) +
    -0.0031 * Math.sin(2 * (D - m_)) +
    0.003 * Math.sin(2 * D + M) * E +
    0.0028 * Math.sin(M - m_) * E +
    0.0026 * Math.sin(M) * E +
    0.0025 * Math.sin(4 * D) +
    0.0024 * Math.sin(D) +
    0.0022 * Math.sin(M + m_) * E +
    0.0017 * Math.sin(Ω) +
    0.0014 * Math.sin(4 * D - m_) +
    0.0005 * Math.sin(2 * D + M - m_) * E +
    0.0004 * Math.sin(2 * D - M + m_) * E +
    -0.0003 * Math.sin(2 * (D - M)) * E +
    0.0003 * Math.sin(4 * D - M) * E +
    0.0003 * Math.sin(V) +
    0.0003 * Math.sin(P)
}

export default {
  ascending,
  descending
}
