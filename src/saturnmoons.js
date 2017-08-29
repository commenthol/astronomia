/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module saturnmoons
 */
/**
 * Saturnmoons: Chapter 46, Positions of the Satellites of Saturn
 */

const base = require('./base')
const coord = require('./coord')
const planetposition = require('./planetposition')
const precess = require('./precess')
const solar = require('./solar')

const M = exports

// array positions of Saturnmoons returned from positions().
M.mimas = 0
M.enceladus = 1
M.tethys = 2
M.dione = 3
M.rhea = 4
M.titan = 5
M.hyperion = 6
M.iapetus = 7

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
 * @param {planetposition.Planet} earth - VSOP87 planet Earth
 * @param {planetposition.Planet} saturn - VSOP87 planet Saturn
 * @return {XY[]} Array of Moon Positions in `XY`
 *   Use `M.mimas ... M.iapetus` to resolve to Moon and its position at `jde`
 */
M.positions = function (jde, earth, saturn) {
  let sol = solar.trueVSOP87(earth, jde)
  let [s, gb, R] = [sol.lon, sol.lat, sol.range]
  let [ss, cs] = base.sincos(s)
  let sgb = Math.sin(gb)
  let gD = 9.0
  var x, y, z, _jde
  let f = function () {
    let gt = base.lightTime(gD)
    _jde = jde - gt
    let {lon, lat, range} = saturn.position(_jde)
    let fk5 = planetposition.toFK5(lon, lat, _jde)
    let [l, b] = [fk5.lon, fk5.lat]
    let [sl, cl] = base.sincos(l)
    let [sb, cb] = base.sincos(b)
    x = range * cb * cl + R * cs
    y = range * cb * sl + R * ss
    z = range * sb + R * sgb
    gD = Math.sqrt(x * x + y * y + z * z)
  }
  f()
  f()
  let gl0 = Math.atan2(y, x)
  let gb0 = Math.atan(z / Math.hypot(x, y))
  let ecl = new coord.Ecliptic(gl0, gb0)
  ecl = precess.eclipticPosition(ecl,
    base.JDEToJulianYear(jde), base.JDEToJulianYear(base.B1950),
    0, 0
  )
  gl0 = ecl.lon
  gb0 = ecl.lat
  let q = new Qs(_jde)
  let s4 = [
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

  var j
  var X = new Array(9).fill(0)
  var Y = new Array(9).fill(0)
  var Z = new Array(9).fill(0)
  for (j = 1; j <= 8; j++) {
    let u = s4[j].gl - s4[j].gw
    let w = s4[j].gw - 168.8112 * d
    let [su, cu] = base.sincos(u)
    let [sw, cw] = base.sincos(w)
    let [sgg, cgg] = base.sincos(s4[j].gg)
    let r = s4[j].r
    X[j] = r * (cu * cw - su * cgg * sw)
    Y[j] = r * (su * cw * cgg + cu * sw)
    Z[j] = r * su * sgg
  }
  Z[0] = 1
  let [sgl0, cgl0] = base.sincos(gl0)
  let [sgb0, cgb0] = base.sincos(gb0)
  var A = new Array(9).fill(0)
  var B = new Array(9).fill(0)
  var C = new Array(9).fill(0)
  for (j in X) {
    let a0
    let a = X[j]
    let b = q.c1 * Y[j] - q.s1 * Z[j]
    let c = q.s1 * Y[j] + q.c1 * Z[j]
    a0 = q.c2 * a - q.s2 * b
    b = q.s2 * a + q.c2 * b
    a = a0

    A[j] = a * sgl0 - b * cgl0
    b = a * cgl0 + b * sgl0

    B[j] = b * cgb0 + c * sgb0
    C[j] = c * cgb0 - b * sgb0
  }

  var pos = new Array(9)
  let D = Math.atan2(A[0], C[0])
  let [sD, cD] = base.sincos(D)
  for (j = 1; j <= 8; j++) {
    X[j] = A[j] * cD - C[j] * sD
    Y[j] = A[j] * sD + C[j] * cD
    Z[j] = B[j]
    let d = X[j] / s4[j].r
    X[j] += Math.abs(Z[j]) / k[j] * Math.sqrt(1 - d * d)
    let W = gD / (gD + Z[j] / 2475)
    pos[j - 1] = new XY(X[j] * W, Y[j] * W)
  }
  return pos
}

var k = [0, 20947, 23715, 26382, 29876, 35313, 53800, 59222, 91820]

function R4 (gl, r, gg, gw) {
  this.gl = gl || 0
  this.r = r || 0
  this.gg = gg || 0
  this.gw = gw || 0
}

function Qs (jde) {
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
M.Qs = Qs

Qs.prototype.mimas = function () {
  let r = new R4()
  let L = 127.64 * d + 381.994497 * d * this.t1 -
    43.57 * d * this.sW0 - 0.72 * d * this.s3W0 - 0.02144 * d * this.s5W0
  let p = 106.1 * d + 365.549 * d * this.t2
  let M = L - p
  let C = 2.18287 * d * Math.sin(M) +
    0.025988 * d * Math.sin(2 * M) + 0.00043 * d * Math.sin(3 * M)
  r.gl = L + C
  r.r = 3.06879 / (1 + 0.01905 * Math.cos(M + C))
  r.gg = 1.563 * d
  r.gw = 54.5 * d - 365.072 * d * this.t2
  return r
}

Qs.prototype.enceladus = function () {
  let r = new R4()
  let L = 200.317 * d + 262.7319002 * d * this.t1 + 0.25667 * d * this.sW1 + 0.20883 * d * this.sW2
  let p = 309.107 * d + 123.44121 * d * this.t2
  let M = L - p
  let C = 0.55577 * d * Math.sin(M) + 0.00168 * d * Math.sin(2 * M)
  r.gl = L + C
  r.r = 3.94118 / (1 + 0.00485 * Math.cos(M + C))
  r.gg = 0.0262 * d
  r.gw = 348 * d - 151.95 * d * this.t2
  return r
}

Qs.prototype.tethys = function () {
  let r = new R4()
  r.gl = 285.306 * d + 190.69791226 * d * this.t1 +
    2.063 * d * this.sW0 + 0.03409 * d * this.s3W0 + 0.001015 * d * this.s5W0
  r.r = 4.880998
  r.gg = 1.0976 * d
  r.gw = 111.33 * d - 72.2441 * d * this.t2
  return r
}

Qs.prototype.dione = function () {
  let r = new R4()
  let L = 254.712 * d + 131.53493193 * d * this.t1 - 0.0215 * d * this.sW1 - 0.01733 * d * this.sW2
  let p = 174.8 * d + 30.82 * d * this.t2
  let M = L - p
  let C = 0.24717 * d * Math.sin(M) + 0.00033 * d * Math.sin(2 * M)
  r.gl = L + C
  r.r = 6.24871 / (1 + 0.002157 * Math.cos(M + C))
  r.gg = 0.0139 * d
  r.gw = 232 * d - 30.27 * d * this.t2
  return r
}

Qs.prototype.rhea = function () {
  let pʹ = 342.7 * d + 10.057 * d * this.t2
  let [spʹ, cpʹ] = base.sincos(pʹ)
  let a1 = 0.000265 * spʹ + 0.001 * this.sW4
  let a2 = 0.000265 * cpʹ + 0.001 * this.cW4
  let e = Math.hypot(a1, a2)
  let p = Math.atan2(a1, a2)
  let N = 345 * d - 10.057 * d * this.t2
  let [sN, cN] = base.sincos(N)
  let glʹ = 359.244 * d + 79.6900472 * d * this.t1 + 0.086754 * d * sN
  let i = 28.0362 * d + 0.346898 * d * cN + 0.0193 * d * this.cW3
  let gw = 168.8034 * d + 0.736936 * d * sN + 0.041 * d * this.sW3
  let a = 8.725924
  return this.subr(glʹ, p, e, a, gw, i)
}

Qs.prototype.subr = function (glʹ, p, e, a, gw, i) {
  let r = new R4()
  let M = glʹ - p
  let e2 = e * e
  let e3 = e2 * e
  let e4 = e2 * e2
  let e5 = e3 * e2
  let C = (2 * e - 0.25 * e3 + 0.0520833333 * e5) * Math.sin(M) +
    (1.25 * e2 - 0.458333333 * e4) * Math.sin(2 * M) +
    (1.083333333 * e3 - 0.671875 * e5) * Math.sin(3 * M) +
    1.072917 * e4 * Math.sin(4 * M) + 1.142708 * e5 * Math.sin(5 * M)
  r.r = a * (1 - e2) / (1 + e * Math.cos(M + C)) // return value
  let g = gw - 168.8112 * d
  let [si, ci] = base.sincos(i)
  let [sg, cg] = base.sincos(g)
  let a1 = si * sg
  let a2 = this.c1 * si * cg - this.s1 * ci
  r.gg = Math.asin(Math.hypot(a1, a2)) // return value
  let u = Math.atan2(a1, a2)
  r.gw = 168.8112 * d + u // return value (w)
  let h = this.c1 * si - this.s1 * ci * cg
  let gps = Math.atan2(this.s1 * sg, h)
  r.gl = glʹ + C + u - g - gps // return value
  return r
}

Qs.prototype.titan = function () {
  let L = 261.1582 * d + 22.57697855 * d * this.t4 + 0.074025 * d * this.sW3
  let iʹ = 27.45141 * d + 0.295999 * d * this.cW3
  let gwʹ = 168.66925 * d + 0.628808 * d * this.sW3
  let [siʹ, ciʹ] = base.sincos(iʹ)
  let [sgwʹW8, cgwʹW8] = base.sincos(gwʹ - this.W8)
  let a1 = this.sW7 * sgwʹW8
  let a2 = this.cW7 * siʹ - this.sW7 * ciʹ * cgwʹW8
  let g0 = 102.8623 * d
  let gps = Math.atan2(a1, a2)
  let s = Math.hypot(a1, a2)
  let g = this.W4 - gwʹ - gps
  var ϖ = 0
  let [s2g0, c2g0] = base.sincos(2 * g0)
  let f = () => {
    ϖ = this.W4 + 0.37515 * d * (Math.sin(2 * g) - s2g0)
    g = ϖ - gwʹ - gps
  }
  f()
  f()
  f()
  let eʹ = 0.029092 + 0.00019048 * (Math.cos(2 * g) - c2g0)
  let qq = 2 * (this.W5 - ϖ)
  let b1 = siʹ * sgwʹW8
  let b2 = this.cW7 * siʹ * cgwʹW8 - this.sW7 * ciʹ
  let gth = Math.atan2(b1, b2) + this.W8
  let [sq, cq] = base.sincos(qq)
  let e = eʹ + 0.002778797 * eʹ * cq
  let p = ϖ + 0.159215 * d * sq
  let u = 2 * this.W5 - 2 * gth + gps
  let [su, cu] = base.sincos(u)
  let h = 0.9375 * eʹ * eʹ * sq + 0.1875 * s * s * Math.sin(2 * (this.W5 - gth))
  let glʹ = L - 0.254744 * d *
    (this.e1 * Math.sin(this.W6) + 0.75 * this.e1 * this.e1 * Math.sin(2 * this.W6) + h)
  let i = iʹ + 0.031843 * d * s * cu
  let gw = gwʹ + 0.031843 * d * s * su / siʹ
  let a = 20.216193
  return this.subr(glʹ, p, e, a, gw, i)
}

Qs.prototype.hyperion = function () {
  let gh = 92.39 * d + 0.5621071 * d * this.t6
  let gz = 148.19 * d - 19.18 * d * this.t8
  let gth = 184.8 * d - 35.41 * d * this.t9
  let gthʹ = gth - 7.5 * d
  let as = 176 * d + 12.22 * d * this.t8
  let bs = 8 * d + 24.44 * d * this.t8
  let cs = bs + 5 * d
  let ϖ = 69.898 * d - 18.67088 * d * this.t8
  let gf = 2 * (ϖ - this.W5)
  let gx = 94.9 * d - 2.292 * d * this.t8
  let [sgh, cgh] = base.sincos(gh)
  let [sgz, cgz] = base.sincos(gz)
  let [s2gz, c2gz] = base.sincos(2 * gz)
  let [s3gz, c3gz] = base.sincos(3 * gz)
  let [sgzpgh, cgzpgh] = base.sincos(gz + gh)
  let [sgzmgh, cgzmgh] = base.sincos(gz - gh)
  let [sgf, cgf] = base.sincos(gf)
  let [sgx, cgx] = base.sincos(gx)
  let [scs, ccs] = base.sincos(cs)
  let a = 24.50601 - 0.08686 * cgh - 0.00166 * cgzpgh + 0.00175 * cgzmgh
  let e = 0.103458 - 0.004099 * cgh - 0.000167 * cgzpgh + 0.000235 * cgzmgh +
    0.02303 * cgz - 0.00212 * c2gz + 0.000151 * c3gz + 0.00013 * cgf
  let p = ϖ + 0.15648 * d * sgx - 0.4457 * d * sgh - 0.2657 * d * sgzpgh - 0.3573 * d * sgzmgh -
    12.872 * d * sgz + 1.668 * d * s2gz - 0.2419 * d * s3gz - 0.07 * d * sgf
  let glʹ = 177.047 * d + 16.91993829 * d * this.t6 + 0.15648 * d * sgx + 9.142 * d * sgh +
    0.007 * d * Math.sin(2 * gh) - 0.014 * d * Math.sin(3 * gh) + 0.2275 * d * sgzpgh +
    0.2112 * d * sgzmgh - 0.26 * d * sgz - 0.0098 * d * s2gz -
    0.013 * d * Math.sin(as) + 0.017 * d * Math.sin(bs) - 0.0303 * d * sgf
  let i = 27.3347 * d + 0.6434886 * d * cgx + 0.315 * d * this.cW3 + 0.018 * d * Math.cos(gth) -
    0.018 * d * ccs
  let gw = 168.6812 * d + 1.40136 * d * cgx + 0.68599 * d * this.sW3 - 0.0392 * d * scs +
    0.0366 * d * Math.sin(gthʹ)
  return this.subr(glʹ, p, e, a, gw, i)
}

Qs.prototype.iapetus = function () {
  let L = 261.1582 * d + 22.57697855 * d * this.t4
  let ϖʹ = 91.796 * d + 0.562 * d * this.t7
  let gps = 4.367 * d - 0.195 * d * this.t7
  let gth = 146.819 * d - 3.198 * d * this.t7
  let gf = 60.47 * d + 1.521 * d * this.t7
  let gF = 205.055 * d - 2.091 * d * this.t7
  let eʹ = 0.028298 + 0.001156 * this.t11
  let ϖ0 = 352.91 * d + 11.71 * d * this.t11
  let gm = 76.3852 * d + 4.53795125 * d * this.t10
  let iʹ = base.horner(this.t11, 18.4602 * d, -0.9518 * d, -0.072 * d, 0.0054 * d)
  let gwʹ = base.horner(this.t11, 143.198 * d, -3.919 * d, 0.116 * d, 0.008 * d)
  let l = gm - ϖ0
  let g = ϖ0 - gwʹ - gps
  let g1 = ϖ0 - gwʹ - gf
  let ls = this.W5 - ϖʹ
  let gs = ϖʹ - gth
  let lT = L - this.W4
  let gT = this.W4 - gF
  let u1 = 2 * (l + g - ls - gs)
  let u2 = l + g1 - lT - gT
  let u3 = l + 2 * (g - ls - gs)
  let u4 = lT + gT - g1
  let u5 = 2 * (ls + gs)
  let [sl, cl] = base.sincos(l)
  let [su1, cu1] = base.sincos(u1)
  let [su2, cu2] = base.sincos(u2)
  let [su3, cu3] = base.sincos(u3)
  let [su4, cu4] = base.sincos(u4)
  let [slu2, clu2] = base.sincos(l + u2)
  let [sg1gT, cg1gT] = base.sincos(g1 - gT)
  let [su52g, cu52g] = base.sincos(u5 - 2 * g)
  let [su5gps, cu5gps] = base.sincos(u5 + gps)
  let [su2gf, cu2gf] = base.sincos(u2 + gf)
  let [s5, c5] = base.sincos(l + g1 + lT + gT + gf)
  let a = 58.935028 + 0.004638 * cu1 + 0.058222 * cu2
  let e = eʹ - 0.0014097 * cg1gT + 0.0003733 * cu52g +
    0.000118 * cu3 + 0.0002408 * cl + 0.0002849 * clu2 + 0.000619 * cu4
  let w = 0.08077 * d * sg1gT + 0.02139 * d * su52g - 0.00676 * d * su3 +
    0.0138 * d * sl + 0.01632 * d * slu2 + 0.03547 * d * su4
  let p = ϖ0 + w / eʹ
  let glʹ = gm - 0.04299 * d * su2 - 0.00789 * d * su1 - 0.06312 * d * Math.sin(ls) -
    0.00295 * d * Math.sin(2 * ls) - 0.02231 * d * Math.sin(u5) + 0.0065 * d * su5gps
  let i = iʹ + 0.04204 * d * cu5gps + 0.00235 * d * c5 + 0.0036 * d * cu2gf
  let wʹ = 0.04204 * d * su5gps + 0.00235 * d * s5 + 0.00358 * d * su2gf
  let gw = gwʹ + wʹ / Math.sin(iʹ)
  return this.subr(glʹ, p, e, a, gw, i)
}
