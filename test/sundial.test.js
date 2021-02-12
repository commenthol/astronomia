/* global describe, it */

import assert from 'assert'
import float from './support/float.js'
import { sundial } from '../src/index.js'

const p = Math.PI / 180

function toFixed (num, acc) {
  return parseFloat(num.toFixed(acc), 10)
}

function mapPoints (hour, lines) {
  for (const i in lines) {
    const line = lines[i]
    if (line.hour === hour) {
      return line.points.map(function (point) {
        return [toFixed(point.x, 4), toFixed(point.y, 4)]
      })
    }
  }
}

describe('#sundial', function () {
  it('general a', function () {
    // Example 58.a, p. 404.0
    const res = sundial.general(40 * p, 70 * p, 1, 50 * p)

    const hours = res.lines.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    for (const i in res.lines) {
      const l = res.lines[i]
      if (l.hour === 11) {
        assert.strictEqual(float(l.points[2].x).toFixed(4), -2.0007)
        assert.strictEqual(float(l.points[2].y).toFixed(4), -1.1069)
      } else if (l.hour === 14) {
        assert.strictEqual(float(l.points[6].x).toFixed(4), -0.0390)
        assert.strictEqual(float(l.points[6].y).toFixed(4), -0.3615)
      }
    }
    assert.strictEqual(float(res.center.x).toFixed(4), +3.3880)
    assert.strictEqual(float(res.center.y).toFixed(4), -3.1102)
    assert.strictEqual(float(res.angle / p).toFixed(4), 12.2672)
  })

  it('general b', function () {
    // Example 58.b, p. 404.0
    const res = sundial.general(-35 * p, 160 * p, 1, 90 * p)

    const hours = res.lines.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])
    for (const i in res.lines) {
      const l = res.lines[i]
      if (l.hour === 12) {
        assert.strictEqual(float(l.points[5].x).toFixed(4), +0.3640)
        assert.strictEqual(float(l.points[5].y).toFixed(4), -0.7410)
      } else if (l.hour === 15) {
        assert.strictEqual(float(l.points[3].x).toFixed(4), -0.8439)
        assert.strictEqual(float(l.points[3].y).toFixed(4), -0.9298)
      }
    }
    assert.strictEqual(float(res.center.x).toFixed(4), +0.3640)
    assert.strictEqual(float(res.center.y).toFixed(4), +0.7451)
    assert.strictEqual(float(res.length).toFixed(4), 1.2991)
    assert.strictEqual(float(res.angle / p).toFixed(4), 50.3315)
  })

  it('general c', function () {
    // Example 58.c, p. 405.0
    const res = sundial.general(40 * p, 160 * p, 1, 75 * p)
    const hours = res.lines.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [5, 6, 13, 14, 15, 16, 17, 18, 19])
    assert.strictEqual(float(res.center.x).toFixed(4), +0.3041)
    assert.strictEqual(float(res.center.y).toFixed(4), -0.5043)
    assert.strictEqual(float(res.angle / p).toFixed(4), 59.5062)
  })

  it('equatorial', function () {
    const res = sundial.equatorial(40 * p, 1)

    let hours = res.north.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    assert.deepStrictEqual(mapPoints(5, res.north), [
      [2.6324, 0.7053], [2.2279, 0.597]
    ])
    assert.deepStrictEqual(mapPoints(12, res.north), [
      [0, -Infinity], [0, -4.9284], [0, -2.7253], [0, -2.3064]
    ])
    assert.deepStrictEqual(mapPoints(19, res.north), [
      [-2.6324, 0.7053], [-2.2279, 0.597]
    ])

    hours = res.south.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
    assert.deepStrictEqual(mapPoints(7, res.south), [
      [-4.7604, -1.2756]
    ])
    assert.deepStrictEqual(mapPoints(12, res.south), [
      [0, -2.3064], [0, -2.7253], [0, -4.9284]
    ])
    assert.deepStrictEqual(mapPoints(17, res.south), [
      [4.7604, -1.2756]
    ])
  })

  it('horizontal', function () {
    const res = sundial.horizontal(40 * p, 1)

    const hours = res.lines.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    assert.deepStrictEqual(mapPoints(5, res.lines), [
      [-25.6921, -11.9016], [-12.0103, -6.1983]
    ])
    assert.deepStrictEqual(mapPoints(12, res.lines), [
      [0, 2.0004],
      [0, 1.7426],
      [0, 1.2558],
      [0, 0.8391],
      [0, 0.5436],
      [0, 0.361],
      [0, 0.2974]
    ])
    assert.deepStrictEqual(mapPoints(19, res.lines), [
      [25.6921, -11.9016], [12.0103, -6.1983]
    ])
    assert.strictEqual(float(res.center.x).toFixed(4), 0)
    assert.strictEqual(float(res.center.y).toFixed(4), -1.1918)
    assert.strictEqual(float(res.length).toFixed(4), 1.5557)
  })

  it('vertical', function () {
    const res = sundial.vertical(40 * p, 70 * p, 1)

    const hours = res.lines.map(function (l) { return l.hour })
    assert.deepStrictEqual(hours, [11, 12, 13, 14, 15, 16, 17, 18, 19])
    assert.deepStrictEqual(mapPoints(11, res.lines), [
      [-11.8933, -5.5746],
      [-14.339, -7.7214],
      [-36.6711, -27.3239]
    ])
    assert.deepStrictEqual(mapPoints(15, res.lines), [
      [-0.5328, -0.2817],
      [-0.4906, -0.3338],
      [-0.3795, -0.471],
      [-0.226, -0.6606],
      [-0.0511, -0.8766],
      [0.109, -1.0743],
      [0.1796, -1.1615]
    ])
    assert.deepStrictEqual(mapPoints(19, res.lines), [
      [0.995, -0.0498],
      [1.0836, -0.1091]
    ])
    assert.strictEqual(float(res.center.x).toFixed(4), -2.7475)
    assert.strictEqual(float(res.center.y).toFixed(4), 2.4534)
    assert.strictEqual(float(res.length).toFixed(4), 3.8168)
  })
})
