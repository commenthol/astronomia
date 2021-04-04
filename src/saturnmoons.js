/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnmoons
 */
/**
 * Saturnmoons: Chapter 46, Positions of the Satellites of Saturn
 */

import base from './base.js'
import coord from './coord.js'
import planetposition, { Planet } from './planetposition.js' // eslint-disable-line no-unused-vars
import precess from './precess.js'
import solar from './solar.js'

// array positions of Saturnmoons returned from positions().
export const mimas = 0
export const enceladus = 1
export const tethys = 2
export const dione = 3
export const rhea = 4
export const titan = 5
export const hyperion = 6
export const iapetus = 7

/**
 * XY holds coordinates returned from positions().
 */
function XY (x, y) {
  this.x = x
  this.y = y
}

const d = Math.PI / 180

/**
 * Positions returns positions of the eight major moons of Saturn.
 *
 * Results returned in argument pos, which must not be undefined.
 *
 * Result units are Saturn radii.
 *
 * @param {number} jde - Julian ephemeris day
 * @param {Planet} earth - VSOP87 planet Earth // eslint-disable-line no-unused-vars
 * @param {Planet} saturn - VSOP87 planet Saturn // eslint-disable-line no-unused-vars
 * @return {XY[]} Array of Moon Positions in `XY`
 *   Use `M.mimas ... M.iapetus` to resolve to Moon and its position at `jde`
 */
export function positions (jde, earth, saturn) {
  const sol = solar.trueVSOP87(earth, jde)
  const [s, β, R] = [sol.lon, sol.lat, sol.range]
  const [ss, cs] = base.sincos(s)
  const sβ = Math.sin(β)
  let Δ = 9.0
  let x
  let y
  let z = 0
  let _jde

  const f = function () {
    const τ = base.lightTime(Δ)
    _jde = jde - τ
    const { lon, lat, range } = saturn.position(_jde)
    const fk5 = planetposition.toFK5(lon, lat, _jde) // eslint-disable-line no-unused-vars
    const [l, b] = [fk5.lon, fk5.lat]
    const [sl, cl] = base.sincos(l)
    const [sb, cb] = base.sincos(b)
    x = range * cb * cl + R * cs
    y = range * cb * sl + R * ss
    z = range * sb + R * sβ
    Δ = Math.sqrt(x * x + y * y + z * z)
  }
  f()
  f()

  let λ0 = Math.atan2(y, x)
  let β0 = Math.atan(z / Math.hypot(x, y))
  let ecl = new coord.Ecliptic(λ0, β0)
  ecl = precess.eclipticPosition(ecl, base.JDEToJulianYear(jde), base.JDEToJulianYear(base.B1950))
  λ0 = ecl.lon
  β0 = ecl.lat
  const q = new Qs(_jde)
  const s4 = [
    new R4(), // 0 unused
    q.mimas(),
    q.enceladus(),
    q.tethys(),
    q.dione(),
    q.rhea(),
    q.titan(),
    q.hyperion(),
    q.iapetus()
  ]

  const X = new Array(9).fill(0)
  const Y = new Array(9).fill(0)
  const Z = new Array(9).fill(0)
  for (let j = 1; j <= 8; j++) {
    const u = s4[j].λ - s4[j].Ω
    const w = s4[j].Ω - 168.8112 * d
    const [su, cu] = base.sincos(u)
    const [sw, cw] = base.sincos(w)
    const [sγ, cγ] = base.sincos(s4[j].γ)
    const r = s4[j].r
    X[j] = r * (cu * cw - su * cγ * sw)
    Y[j] = r * (su * cw * cγ + cu * sw)
    Z[j] = r * su * sγ
  }
  Z[0] = 1
  const [sλ0, cλ0] = base.sincos(λ0)
  const [sβ0, cβ0] = base.sincos(β0)
  const A = new Array(9).fill(0)
  const B = new Array(9).fill(0)
  const C = new Array(9).fill(0)
  for (const j in X) {
    let a = X[j]
    let b = q.c1 * Y[j] - q.s1 * Z[j]
    const c = q.s1 * Y[j] + q.c1 * Z[j]
    const a0 = q.c2 * a - q.s2 * b
    b = q.s2 * a + q.c2 * b
    a = a0

    A[j] = a * sλ0 - b * cλ0
    b = a * cλ0 + b * sλ0

    B[j] = b * cβ0 + c * sβ0
    C[j] = c * cβ0 - b * sβ0
  }

  const pos = new Array(9)
  const D = Math.atan2(A[0], C[0])
  const [sD, cD] = base.sincos(D)
  for (let j = 1; j <= 8; j++) {
    X[j] = A[j] * cD - C[j] * sD
    Y[j] = A[j] * sD + C[j] * cD
    Z[j] = B[j]
    const d = X[j] / s4[j].r
    X[j] += Math.abs(Z[j]) / k[j] * Math.sqrt(1 - d * d)
    const W = Δ / (Δ + Z[j] / 2475)
    pos[j - 1] = new XY(X[j] * W, Y[j] * W)
  }
  return pos
}

const k = [0, 20947, 23715, 26382, 29876, 35313, 53800, 59222, 91820]

function R4 (λ, r, γ, Ω) {
  this.λ = λ || 0
  this.r = r || 0
  this.γ = γ || 0
  this.Ω = Ω || 0
}

export function Qs (jde) {
  this.t1 = jde - 2411093
  this.t2 = this.t1 / 365.25
  this.t3 = (jde - 2433282.423) / 365.25 + 1950
  this.t4 = jde - 2411368
  this.t5 = this.t4 / 365.25
  this.t6 = jde - 2415020
  this.t7 = this.t6 / 36525
  this.t8 = this.t6 / 365.25
  this.t9 = (jde - 2442000.5) / 365.25
  this.t10 = jde - 2409786
  this.t11 = this.t10 / 36525
  this.W0 = 5.095 * d * (this.t3 - 1866.39)
  this.W1 = 74.4 * d + 32.39 * d * this.t2
  this.W2 = 134.3 * d + 92.62 * d * this.t2
  this.W3 = 42 * d - 0.5118 * d * this.t5
  this.W4 = 276.59 * d + 0.5118 * d * this.t5
  this.W5 = 267.2635 * d + 1222.1136 * d * this.t7
  this.W6 = 175.4762 * d + 1221.5515 * d * this.t7
  this.W7 = 2.4891 * d + 0.002435 * d * this.t7
  this.W8 = 113.35 * d - 0.2597 * d * this.t7
  this.s1 = Math.sin(28.0817 * d)
  this.c1 = Math.cos(28.0817 * d)
  this.s2 = Math.sin(168.8112 * d)
  this.c2 = Math.cos(168.8112 * d)
  this.e1 = 0.05589 - 0.000346 * this.t7
  this.sW0 = Math.sin(this.W0)
  this.s3W0 = Math.sin(3 * this.W0)
  this.s5W0 = Math.sin(5 * this.W0)
  this.sW1 = Math.sin(this.W1)
  this.sW2 = Math.sin(this.W2)
  this.sW3 = Math.sin(this.W3)
  this.cW3 = Math.cos(this.W3)
  this.sW4 = Math.sin(this.W4)
  this.cW4 = Math.cos(this.W4)
  this.sW7 = Math.sin(this.W7)
  this.cW7 = Math.cos(this.W7)
  return this
}

Qs.prototype.mimas = function () {
  const r = new R4()
  const L = 127.64 * d + 381.994497 * d * this.t1 -
    43.57 * d * this.sW0 - 0.72 * d * this.s3W0 - 0.02144 * d * this.s5W0
  const p = 106.1 * d + 365.549 * d * this.t2
  const M = L - p
  const C = 2.18287 * d * Math.sin(M) +
    0.025988 * d * Math.sin(2 * M) + 0.00043 * d * Math.sin(3 * M)
  r.λ = L + C
  r.r = 3.06879 / (1 + 0.01905 * Math.cos(M + C))
  r.γ = 1.563 * d
  r.Ω = 54.5 * d - 365.072 * d * this.t2
  return r
}

Qs.prototype.enceladus = function () {
  const r = new R4()
  const L = 200.317 * d + 262.7319002 * d * this.t1 + 0.25667 * d * this.sW1 + 0.20883 * d * this.sW2
  const p = 309.107 * d + 123.44121 * d * this.t2
  const M = L - p
  const C = 0.55577 * d * Math.sin(M) + 0.00168 * d * Math.sin(2 * M)
  r.λ = L + C
  r.r = 3.94118 / (1 + 0.00485 * Math.cos(M + C))
  r.γ = 0.0262 * d
  r.Ω = 348 * d - 151.95 * d * this.t2
  return r
}

Qs.prototype.tethys = function () {
  const r = new R4()
  r.λ = 285.306 * d + 190.69791226 * d * this.t1 +
    2.063 * d * this.sW0 + 0.03409 * d * this.s3W0 + 0.001015 * d * this.s5W0
  r.r = 4.880998
  r.γ = 1.0976 * d
  r.Ω = 111.33 * d - 72.2441 * d * this.t2
  return r
}

Qs.prototype.dione = function () {
  const r = new R4()
  const L = 254.712 * d + 131.53493193 * d * this.t1 - 0.0215 * d * this.sW1 - 0.01733 * d * this.sW2
  const p = 174.8 * d + 30.82 * d * this.t2
  const M = L - p
  const C = 0.24717 * d * Math.sin(M) + 0.00033 * d * Math.sin(2 * M)
  r.λ = L + C
  r.r = 6.24871 / (1 + 0.002157 * Math.cos(M + C))
  r.γ = 0.0139 * d
  r.Ω = 232 * d - 30.27 * d * this.t2
  return r
}

Qs.prototype.rhea = function () {
  const pʹ = 342.7 * d + 10.057 * d * this.t2
  const [spʹ, cpʹ] = base.sincos(pʹ)
  const a1 = 0.000265 * spʹ + 0.001 * this.sW4
  const a2 = 0.000265 * cpʹ + 0.001 * this.cW4
  const e = Math.hypot(a1, a2)
  const p = Math.atan2(a1, a2)
  const N = 345 * d - 10.057 * d * this.t2
  const [sN, cN] = base.sincos(N)
  const λʹ = 359.244 * d + 79.6900472 * d * this.t1 + 0.086754 * d * sN
  const i = 28.0362 * d + 0.346898 * d * cN + 0.0193 * d * this.cW3
  const Ω = 168.8034 * d + 0.736936 * d * sN + 0.041 * d * this.sW3
  const a = 8.725924
  return this.subr(λʹ, p, e, a, Ω, i)
}

Qs.prototype.subr = function (λʹ, p, e, a, Ω, i) {
  const r = new R4()
  const M = λʹ - p
  const e2 = e * e
  const e3 = e2 * e
  const e4 = e2 * e2
  const e5 = e3 * e2
  const C = (2 * e - 0.25 * e3 + 0.0520833333 * e5) * Math.sin(M) +
    (1.25 * e2 - 0.458333333 * e4) * Math.sin(2 * M) +
    (1.083333333 * e3 - 0.671875 * e5) * Math.sin(3 * M) +
    1.072917 * e4 * Math.sin(4 * M) + 1.142708 * e5 * Math.sin(5 * M)
  r.r = a * (1 - e2) / (1 + e * Math.cos(M + C)) // return value
  const g = Ω - 168.8112 * d
  const [si, ci] = base.sincos(i)
  const [sg, cg] = base.sincos(g)
  const a1 = si * sg
  const a2 = this.c1 * si * cg - this.s1 * ci
  r.γ = Math.asin(Math.hypot(a1, a2)) // return value
  const u = Math.atan2(a1, a2)
  r.Ω = 168.8112 * d + u // return value (w)
  const h = this.c1 * si - this.s1 * ci * cg
  const ψ = Math.atan2(this.s1 * sg, h)
  r.λ = λʹ + C + u - g - ψ // return value
  return r
}

Qs.prototype.titan = function () {
  const L = 261.1582 * d + 22.57697855 * d * this.t4 + 0.074025 * d * this.sW3
  const iʹ = 27.45141 * d + 0.295999 * d * this.cW3
  const Ωʹ = 168.66925 * d + 0.628808 * d * this.sW3
  const [siʹ, ciʹ] = base.sincos(iʹ)
  const [sΩʹW8, cΩʹW8] = base.sincos(Ωʹ - this.W8)
  const a1 = this.sW7 * sΩʹW8
  const a2 = this.cW7 * siʹ - this.sW7 * ciʹ * cΩʹW8
  const g0 = 102.8623 * d
  const ψ = Math.atan2(a1, a2)
  const s = Math.hypot(a1, a2)
  let g = this.W4 - Ωʹ - ψ
  let ϖ = 0
  const [s2g0, c2g0] = base.sincos(2 * g0)
  const f = () => {
    ϖ = this.W4 + 0.37515 * d * (Math.sin(2 * g) - s2g0)
    g = ϖ - Ωʹ - ψ
  }
  f()
  f()
  f()
  const eʹ = 0.029092 + 0.00019048 * (Math.cos(2 * g) - c2g0)
  const qq = 2 * (this.W5 - ϖ)
  const b1 = siʹ * sΩʹW8
  const b2 = this.cW7 * siʹ * cΩʹW8 - this.sW7 * ciʹ
  const θ = Math.atan2(b1, b2) + this.W8
  const [sq, cq] = base.sincos(qq)
  const e = eʹ + 0.002778797 * eʹ * cq
  const p = ϖ + 0.159215 * d * sq
  const u = 2 * this.W5 - 2 * θ + ψ
  const [su, cu] = base.sincos(u)
  const h = 0.9375 * eʹ * eʹ * sq + 0.1875 * s * s * Math.sin(2 * (this.W5 - θ))
  const λʹ = L - 0.254744 * d *
    (this.e1 * Math.sin(this.W6) + 0.75 * this.e1 * this.e1 * Math.sin(2 * this.W6) + h)
  const i = iʹ + 0.031843 * d * s * cu
  const Ω = Ωʹ + 0.031843 * d * s * su / siʹ
  const a = 20.216193
  return this.subr(λʹ, p, e, a, Ω, i)
}

Qs.prototype.hyperion = function () {
  const η = 92.39 * d + 0.5621071 * d * this.t6
  const ζ = 148.19 * d - 19.18 * d * this.t8
  const θ = 184.8 * d - 35.41 * d * this.t9
  const θʹ = θ - 7.5 * d
  const as = 176 * d + 12.22 * d * this.t8
  const bs = 8 * d + 24.44 * d * this.t8
  const cs = bs + 5 * d
  const ϖ = 69.898 * d - 18.67088 * d * this.t8
  const φ = 2 * (ϖ - this.W5)
  const χ = 94.9 * d - 2.292 * d * this.t8
  const [sη, cη] = base.sincos(η)
  const [sζ, cζ] = base.sincos(ζ)
  const [s2ζ, c2ζ] = base.sincos(2 * ζ)
  const [s3ζ, c3ζ] = base.sincos(3 * ζ)
  const [sζpη, cζpη] = base.sincos(ζ + η)
  const [sζmη, cζmη] = base.sincos(ζ - η)
  const [sφ, cφ] = base.sincos(φ)
  const [sχ, cχ] = base.sincos(χ)
  const [scs, ccs] = base.sincos(cs)
  const a = 24.50601 - 0.08686 * cη - 0.00166 * cζpη + 0.00175 * cζmη
  const e = 0.103458 - 0.004099 * cη - 0.000167 * cζpη + 0.000235 * cζmη +
    0.02303 * cζ - 0.00212 * c2ζ + 0.000151 * c3ζ + 0.00013 * cφ
  const p = ϖ + 0.15648 * d * sχ - 0.4457 * d * sη - 0.2657 * d * sζpη - 0.3573 * d * sζmη -
    12.872 * d * sζ + 1.668 * d * s2ζ - 0.2419 * d * s3ζ - 0.07 * d * sφ
  const λʹ = 177.047 * d + 16.91993829 * d * this.t6 + 0.15648 * d * sχ + 9.142 * d * sη +
    0.007 * d * Math.sin(2 * η) - 0.014 * d * Math.sin(3 * η) + 0.2275 * d * sζpη +
    0.2112 * d * sζmη - 0.26 * d * sζ - 0.0098 * d * s2ζ -
    0.013 * d * Math.sin(as) + 0.017 * d * Math.sin(bs) - 0.0303 * d * sφ
  const i = 27.3347 * d + 0.6434886 * d * cχ + 0.315 * d * this.cW3 + 0.018 * d * Math.cos(θ) -
    0.018 * d * ccs
  const Ω = 168.6812 * d + 1.40136 * d * cχ + 0.68599 * d * this.sW3 - 0.0392 * d * scs +
    0.0366 * d * Math.sin(θʹ)
  return this.subr(λʹ, p, e, a, Ω, i)
}

Qs.prototype.iapetus = function () {
  const L = 261.1582 * d + 22.57697855 * d * this.t4
  const ϖʹ = 91.796 * d + 0.562 * d * this.t7
  const ψ = 4.367 * d - 0.195 * d * this.t7
  const θ = 146.819 * d - 3.198 * d * this.t7
  const φ = 60.47 * d + 1.521 * d * this.t7
  const Φ = 205.055 * d - 2.091 * d * this.t7
  const eʹ = 0.028298 + 0.001156 * this.t11
  const ϖ0 = 352.91 * d + 11.71 * d * this.t11
  const μ = 76.3852 * d + 4.53795125 * d * this.t10
  const iʹ = base.horner(this.t11, 18.4602 * d, -0.9518 * d, -0.072 * d, 0.0054 * d)
  const Ωʹ = base.horner(this.t11, 143.198 * d, -3.919 * d, 0.116 * d, 0.008 * d)
  const l = μ - ϖ0
  const g = ϖ0 - Ωʹ - ψ
  const g1 = ϖ0 - Ωʹ - φ
  const ls = this.W5 - ϖʹ
  const gs = ϖʹ - θ
  const lT = L - this.W4
  const gT = this.W4 - Φ
  const u1 = 2 * (l + g - ls - gs)
  const u2 = l + g1 - lT - gT
  const u3 = l + 2 * (g - ls - gs)
  const u4 = lT + gT - g1
  const u5 = 2 * (ls + gs)
  const [sl, cl] = base.sincos(l)
  const [su1, cu1] = base.sincos(u1)
  const [su2, cu2] = base.sincos(u2)
  const [su3, cu3] = base.sincos(u3)
  const [su4, cu4] = base.sincos(u4)
  const [slu2, clu2] = base.sincos(l + u2)
  const [sg1gT, cg1gT] = base.sincos(g1 - gT)
  const [su52g, cu52g] = base.sincos(u5 - 2 * g)
  const [su5ψ, cu5ψ] = base.sincos(u5 + ψ)
  const [su2φ, cu2φ] = base.sincos(u2 + φ)
  const [s5, c5] = base.sincos(l + g1 + lT + gT + φ)
  const a = 58.935028 + 0.004638 * cu1 + 0.058222 * cu2
  const e = eʹ - 0.0014097 * cg1gT + 0.0003733 * cu52g +
    0.000118 * cu3 + 0.0002408 * cl + 0.0002849 * clu2 + 0.000619 * cu4
  const w = 0.08077 * d * sg1gT + 0.02139 * d * su52g - 0.00676 * d * su3 +
    0.0138 * d * sl + 0.01632 * d * slu2 + 0.03547 * d * su4
  const p = ϖ0 + w / eʹ
  const λʹ = μ - 0.04299 * d * su2 - 0.00789 * d * su1 - 0.06312 * d * Math.sin(ls) -
    0.00295 * d * Math.sin(2 * ls) - 0.02231 * d * Math.sin(u5) + 0.0065 * d * su5ψ
  const i = iʹ + 0.04204 * d * cu5ψ + 0.00235 * d * c5 + 0.0036 * d * cu2φ
  const wʹ = 0.04204 * d * su5ψ + 0.00235 * d * s5 + 0.00358 * d * su2φ
  const Ω = Ωʹ + wʹ / Math.sin(iʹ)
  return this.subr(λʹ, p, e, a, Ω, i)
}

export default {
  mimas,
  enceladus,
  tethys,
  dione,
  rhea,
  titan,
  hyperion,
  iapetus,
  positions,
  Qs
}
