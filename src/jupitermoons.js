/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module jupitermoons
 */
/**
 * Jupitermoons: Chapter 44, Positions of the Satellites of Jupiter.
 */

const base = require('./base')
const planetelements = require('./planetelements')
const solar = require('./solar')

const M = exports

// Moon names in order of position in Array
M.io = 0
M.europa = 1
M.ganymede = 2
M.callisto = 3

const k = [17295, 21819, 27558, 36548]

/**
 * XY used for returning coordinates of moons.
 * @param {number} x - in units of Jupiter radii
 * @param {number} y - in units of Jupiter radii
 */
function XY (x, y) {
  this.x = x
  this.y = y
}

/**
 * Positions computes positions of moons of Jupiter.
 *
 * Returned coordinates are in units of Jupiter radii.
 *
 * @param {Number} jde - Julian ephemeris day
 * @return {Array} x, y - coordinates of the 4 Satellites of jupiter
 */
M.positions = function (jde) {
  let d = jde - base.J2000
  const p = Math.PI / 180
  let V = 172.74 * p + 0.00111588 * p * d
  let M = 357.529 * p + 0.9856003 * p * d
  let sV = Math.sin(V)
  let N = 20.02 * p + 0.0830853 * p * d + 0.329 * p * sV
  let J = 66.115 * p + 0.9025179 * p * d - 0.329 * p * sV
  let [sM, cM] = base.sincos(M)
  let [sN, cN] = base.sincos(N)
  let [s2M, c2M] = base.sincos(2 * M)
  let [s2N, c2N] = base.sincos(2 * N)
  let A = 1.915 * p * sM + 0.02 * p * s2M
  let B = 5.555 * p * sN + 0.168 * p * s2N
  let K = J + A - B
  let R = 1.00014 - 0.01671 * cM - 0.00014 * c2M
  let r = 5.20872 - 0.25208 * cN - 0.00611 * c2N
  let [sK, cK] = base.sincos(K)
  let Δ = Math.sqrt(r * r + R * R - 2 * r * R * cK)
  let ψ = Math.asin(R / Δ * sK)
  let λ = 34.35 * p + 0.083091 * p * d + 0.329 * p * sV + B
  let DS = 3.12 * p * Math.sin(λ + 42.8 * p)
  let DE = DS - 2.22 * p * Math.sin(ψ) * Math.cos(λ + 22 * p) -
    1.3 * p * (r - Δ) / Δ * Math.sin(λ - 100.5 * p)
  let dd = d - Δ / 173
  let u1 = 163.8069 * p + 203.4058646 * p * dd + ψ - B
  let u2 = 358.414 * p + 101.2916335 * p * dd + ψ - B
  let u3 = 5.7176 * p + 50.234518 * p * dd + ψ - B
  let u4 = 224.8092 * p + 21.48798 * p * dd + ψ - B
  let G = 331.18 * p + 50.310482 * p * dd
  let H = 87.45 * p + 21.569231 * p * dd
  let [s212, c212] = base.sincos(2 * (u1 - u2))
  let [s223, c223] = base.sincos(2 * (u2 - u3))
  let [sG, cG] = base.sincos(G)
  let [sH, cH] = base.sincos(H)
  let c1 = 0.473 * p * s212
  let c2 = 1.065 * p * s223
  let c3 = 0.165 * p * sG
  let c4 = 0.843 * p * sH
  let r1 = 5.9057 - 0.0244 * c212
  let r2 = 9.3966 - 0.0882 * c223
  let r3 = 14.9883 - 0.0216 * cG
  let r4 = 26.3627 - 0.1939 * cH
  let sDE = Math.sin(DE)
  let xy = function (u, r) {
    let [su, cu] = base.sincos(u)
    return new XY(r * su, -r * cu * sDE)
  }
  return [xy(u1 + c1, r1), xy(u2 + c2, r2), xy(u3 + c3, r3), xy(u4 + c4, r4)]
}

/**
 * Positions computes positions of moons of Jupiter.
 *
 * High accuracy method based on theory "E5"  Results returned in
 * argument pos, which must not be undefined.  Returned coordinates in units
 * of Jupiter radii.
 *
 * @param {Number} jde - Julian ephemeris day
 * @param {planetposition.Planet} earth - VSOP87 Planet earth
 * @param {planetposition.Planet} jupiter - VSOP87 Planet jupiter
 * @param {Array} [pos] - reference to array of positions (same as return value)
 * @return {Array} x, y - coordinates of the 4 Satellites of jupiter
 */
M.e5 = function (jde, earth, jupiter, pos) {
  pos = pos || new Array(4)

  // variables assigned in following block
  var λ0, β0, t, i
  let Δ = 5.0

  ;(function () {
    let {lon, lat, range} = solar.trueVSOP87(earth, jde)
    let [s, β, R] = [lon, lat, range]
    let [ss, cs] = base.sincos(s)
    let sβ = Math.sin(β)
    let τ = base.lightTime(Δ)
    var x, y, z
    let f = function () {
      let {lon, lat, range} = jupiter.position(jde - τ)
      let [sl, cl] = base.sincos(lon)
      let [sb, cb] = base.sincos(lat)
      x = range * cb * cl + R * cs
      y = range * cb * sl + R * ss
      z = range * sb + R * sβ
      Δ = Math.sqrt(x * x + y * y + z * z)
      τ = base.lightTime(Δ)
    }

    f()
    f()

    λ0 = Math.atan2(y, x)
    β0 = Math.atan(z / Math.hypot(x, y))
    t = jde - 2443000.5 - τ
  })()

  const p = Math.PI / 180
  let l1 = 106.07719 * p + 203.48895579 * p * t
  let l2 = 175.73161 * p + 101.374724735 * p * t
  let l3 = 120.55883 * p + 50.317609207 * p * t
  let l4 = 84.44459 * p + 21.571071177 * p * t
  let π1 = 97.0881 * p + 0.16138586 * p * t
  let π2 = 154.8663 * p + 0.04726307 * p * t
  let π3 = 188.184 * p + 0.00712734 * p * t
  let π4 = 335.2868 * p + 0.00184 * p * t
  let ω1 = 312.3346 * p - 0.13279386 * p * t
  let ω2 = 100.4411 * p - 0.03263064 * p * t
  let ω3 = 119.1942 * p - 0.00717703 * p * t
  let ω4 = 322.6186 * p - 0.00175934 * p * t
  let Γ = 0.33033 * p * Math.sin(163.679 * p + 0.0010512 * p * t) +
    0.03439 * p * Math.sin(34.486 * p - 0.0161731 * p * t)
  let Φλ = 199.6766 * p + 0.1737919 * p * t
  let ψ = 316.5182 * p - 0.00000208 * p * t
  let G = 30.23756 * p + 0.0830925701 * p * t + Γ
  let Gʹ = 31.97853 * p + 0.0334597339 * p * t
  const Π = 13.469942 * p

  let Σ1 = 0.47259 * p * Math.sin(2 * (l1 - l2)) +
    -0.03478 * p * Math.sin(π3 - π4) +
    0.01081 * p * Math.sin(l2 - 2 * l3 + π3) +
    0.00738 * p * Math.sin(Φλ) +
    0.00713 * p * Math.sin(l2 - 2 * l3 + π2) +
    -0.00674 * p * Math.sin(π1 + π3 - 2 * Π - 2 * G) +
    0.00666 * p * Math.sin(l2 - 2 * l3 + π4) +
    0.00445 * p * Math.sin(l1 - π3) +
    -0.00354 * p * Math.sin(l1 - l2) +
    -0.00317 * p * Math.sin(2 * ψ - 2 * Π) +
    0.00265 * p * Math.sin(l1 - π4) +
    -0.00186 * p * Math.sin(G) +
    0.00162 * p * Math.sin(π2 - π3) +
    0.00158 * p * Math.sin(4 * (l1 - l2)) +
    -0.00155 * p * Math.sin(l1 - l3) +
    -0.00138 * p * Math.sin(ψ + ω3 - 2 * Π - 2 * G) +
    -0.00115 * p * Math.sin(2 * (l1 - 2 * l2 + ω2)) +
    0.00089 * p * Math.sin(π2 - π4) +
    0.00085 * p * Math.sin(l1 + π3 - 2 * Π - 2 * G) +
    0.00083 * p * Math.sin(ω2 - ω3) +
    0.00053 * p * Math.sin(ψ - ω2)
  let Σ2 = 1.06476 * p * Math.sin(2 * (l2 - l3)) +
    0.04256 * p * Math.sin(l1 - 2 * l2 + π3) +
    0.03581 * p * Math.sin(l2 - π3) +
    0.02395 * p * Math.sin(l1 - 2 * l2 + π4) +
    0.01984 * p * Math.sin(l2 - π4) +
    -0.01778 * p * Math.sin(Φλ) +
    0.01654 * p * Math.sin(l2 - π2) +
    0.01334 * p * Math.sin(l2 - 2 * l3 + π2) +
    0.01294 * p * Math.sin(π3 - π4) +
    -0.01142 * p * Math.sin(l2 - l3) +
    -0.01057 * p * Math.sin(G) +
    -0.00775 * p * Math.sin(2 * (ψ - Π)) +
    0.00524 * p * Math.sin(2 * (l1 - l2)) +
    -0.0046 * p * Math.sin(l1 - l3) +
    0.00316 * p * Math.sin(ψ - 2 * G + ω3 - 2 * Π) +
    -0.00203 * p * Math.sin(π1 + π3 - 2 * Π - 2 * G) +
    0.00146 * p * Math.sin(ψ - ω3) +
    -0.00145 * p * Math.sin(2 * G) +
    0.00125 * p * Math.sin(ψ - ω4) +
    -0.00115 * p * Math.sin(l1 - 2 * l3 + π3) +
    -0.00094 * p * Math.sin(2 * (l2 - ω2)) +
    0.00086 * p * Math.sin(2 * (l1 - 2 * l2 + ω2)) +
    -0.00086 * p * Math.sin(5 * Gʹ - 2 * G + 52.225 * p) +
    -0.00078 * p * Math.sin(l2 - l4) +
    -0.00064 * p * Math.sin(3 * l3 - 7 * l4 + 4 * π4) +
    0.00064 * p * Math.sin(π1 - π4) +
    -0.00063 * p * Math.sin(l1 - 2 * l3 + π4) +
    0.00058 * p * Math.sin(ω3 - ω4) +
    0.00056 * p * Math.sin(2 * (ψ - Π - G)) +
    0.00056 * p * Math.sin(2 * (l2 - l4)) +
    0.00055 * p * Math.sin(2 * (l1 - l3)) +
    0.00052 * p * Math.sin(3 * l3 - 7 * l4 + π3 + 3 * π4) +
    -0.00043 * p * Math.sin(l1 - π3) +
    0.00041 * p * Math.sin(5 * (l2 - l3)) +
    0.00041 * p * Math.sin(π4 - Π) +
    0.00032 * p * Math.sin(ω2 - ω3) +
    0.00032 * p * Math.sin(2 * (l3 - G - Π))
  let Σ3 = 0.1649 * p * Math.sin(l3 - π3) +
    0.09081 * p * Math.sin(l3 - π4) +
    -0.06907 * p * Math.sin(l2 - l3) +
    0.03784 * p * Math.sin(π3 - π4) +
    0.01846 * p * Math.sin(2 * (l3 - l4)) +
    -0.0134 * p * Math.sin(G) +
    -0.01014 * p * Math.sin(2 * (ψ - Π)) +
    0.00704 * p * Math.sin(l2 - 2 * l3 + π3) +
    -0.0062 * p * Math.sin(l2 - 2 * l3 + π2) +
    -0.00541 * p * Math.sin(l3 - l4) +
    0.00381 * p * Math.sin(l2 - 2 * l3 + π4) +
    0.00235 * p * Math.sin(ψ - ω3) +
    0.00198 * p * Math.sin(ψ - ω4) +
    0.00176 * p * Math.sin(Φλ) +
    0.0013 * p * Math.sin(3 * (l3 - l4)) +
    0.00125 * p * Math.sin(l1 - l3) +
    -0.00119 * p * Math.sin(5 * Gʹ - 2 * G + 52.225 * p) +
    0.00109 * p * Math.sin(l1 - l2) +
    -0.001 * p * Math.sin(3 * l3 - 7 * l4 + 4 * π4) +
    0.00091 * p * Math.sin(ω3 - ω4) +
    0.0008 * p * Math.sin(3 * l3 - 7 * l4 + π3 + 3 * π4) +
    -0.00075 * p * Math.sin(2 * l2 - 3 * l3 + π3) +
    0.00072 * p * Math.sin(π1 + π3 - 2 * Π - 2 * G) +
    0.00069 * p * Math.sin(π4 - Π) +
    -0.00058 * p * Math.sin(2 * l3 - 3 * l4 + π4) +
    -0.00057 * p * Math.sin(l3 - 2 * l4 + π4) +
    0.00056 * p * Math.sin(l3 + π3 - 2 * Π - 2 * G) +
    -0.00052 * p * Math.sin(l2 - 2 * l3 + π1) +
    -0.00050 * p * Math.sin(π2 - π3) +
    0.00048 * p * Math.sin(l3 - 2 * l4 + π3) +
    -0.00045 * p * Math.sin(2 * l2 - 3 * l3 + π4) +
    -0.00041 * p * Math.sin(π2 - π4) +
    -0.00038 * p * Math.sin(2 * G) +
    -0.00037 * p * Math.sin(π3 - π4 + ω3 - ω4) +
    -0.00032 * p * Math.sin(3 * l3 - 7 * l4 + 2 * π3 + 2 * π4) +
    0.0003 * p * Math.sin(4 * (l3 - l4)) +
    0.00029 * p * Math.sin(l3 + π4 - 2 * Π - 2 * G) +
    -0.00028 * p * Math.sin(ω3 + ψ - 2 * Π - 2 * G) +
    0.00026 * p * Math.sin(l3 - Π - G) +
    0.00024 * p * Math.sin(l2 - 3 * l3 + 2 * l4) +
    0.00021 * p * Math.sin(2 * (l3 - Π - G)) +
    -0.00021 * p * Math.sin(l3 - π2) +
    0.00017 * p * Math.sin(2 * (l3 - π3))
  let Σ4 = 0.84287 * p * Math.sin(l4 - π4) +
    0.03431 * p * Math.sin(π4 - π3) +
    -0.03305 * p * Math.sin(2 * (ψ - Π)) +
    -0.03211 * p * Math.sin(G) +
    -0.01862 * p * Math.sin(l4 - π3) +
    0.01186 * p * Math.sin(ψ - ω4) +
    0.00623 * p * Math.sin(l4 + π4 - 2 * G - 2 * Π) +
    0.00387 * p * Math.sin(2 * (l4 - π4)) +
    -0.00284 * p * Math.sin(5 * Gʹ - 2 * G + 52.225 * p) +
    -0.00234 * p * Math.sin(2 * (ψ - π4)) +
    -0.00223 * p * Math.sin(l3 - l4) +
    -0.00208 * p * Math.sin(l4 - Π) +
    0.00178 * p * Math.sin(ψ + ω4 - 2 * π4) +
    0.00134 * p * Math.sin(π4 - Π) +
    0.00125 * p * Math.sin(2 * (l4 - G - Π)) +
    -0.00117 * p * Math.sin(2 * G) +
    -0.00112 * p * Math.sin(2 * (l3 - l4)) +
    0.00107 * p * Math.sin(3 * l3 - 7 * l4 + 4 * π4) +
    0.00102 * p * Math.sin(l4 - G - Π) +
    0.00096 * p * Math.sin(2 * l4 - ψ - ω4) +
    0.00087 * p * Math.sin(2 * (ψ - ω4)) +
    -0.00085 * p * Math.sin(3 * l3 - 7 * l4 + π3 + 3 * π4) +
    0.00085 * p * Math.sin(l3 - 2 * l4 + π4) +
    -0.00081 * p * Math.sin(2 * (l4 - ψ)) +
    0.00071 * p * Math.sin(l4 + π4 - 2 * Π - 3 * G) +
    0.00061 * p * Math.sin(l1 - l4) +
    -0.00056 * p * Math.sin(ψ - ω3) +
    -0.00054 * p * Math.sin(l3 - 2 * l4 + π3) +
    0.00051 * p * Math.sin(l2 - l4) +
    0.00042 * p * Math.sin(2 * (ψ - G - Π)) +
    0.00039 * p * Math.sin(2 * (π4 - ω4)) +
    0.00036 * p * Math.sin(ψ + Π - π4 - ω4) +
    0.00035 * p * Math.sin(2 * Gʹ - G + 188.37 * p) +
    -0.00035 * p * Math.sin(l4 - π4 + 2 * Π - 2 * ψ) +
    -0.00032 * p * Math.sin(l4 + π4 - 2 * Π - G) +
    0.0003 * p * Math.sin(2 * Gʹ - 2 * G + 149.15 * p) +
    0.00029 * p * Math.sin(3 * l3 - 7 * l4 + 2 * π3 + 2 * π4) +
    0.00028 * p * Math.sin(l4 - π4 + 2 * ψ - 2 * Π) +
    -0.00028 * p * Math.sin(2 * (l4 - ω4)) +
    -0.00027 * p * Math.sin(π3 - π4 + ω3 - ω4) +
    -0.00026 * p * Math.sin(5 * Gʹ - 3 * G + 188.37 * p) +
    0.00025 * p * Math.sin(ω4 - ω3) +
    -0.00025 * p * Math.sin(l2 - 3 * l3 + 2 * l4) +
    -0.00023 * p * Math.sin(3 * (l3 - l4)) +
    0.00021 * p * Math.sin(2 * l4 - 2 * Π - 3 * G) +
    -0.00021 * p * Math.sin(2 * l3 - 3 * l4 + π4) +
    0.00019 * p * Math.sin(l4 - π4 - G) +
    -0.00019 * p * Math.sin(2 * l4 - π3 - π4) +
    -0.00018 * p * Math.sin(l4 - π4 + G) +
    -0.00016 * p * Math.sin(l4 + π3 - 2 * Π - 2 * G)
  let L1 = l1 + Σ1
  let L2 = l2 + Σ2
  let L3 = l3 + Σ3
  let L4 = l4 + Σ4

  // variables assigned in following block
  var I
  var X = new Array(5).fill(0)
  var Y = new Array(5).fill(0)
  var Z = new Array(5).fill(0)
  var R

  ;(function () {
    let L = [L1, L2, L3, L4]
    let B = [
      Math.atan(0.0006393 * Math.sin(L1 - ω1) +
        0.0001825 * Math.sin(L1 - ω2) +
        0.0000329 * Math.sin(L1 - ω3) +
        -0.0000311 * Math.sin(L1 - ψ) +
        0.0000093 * Math.sin(L1 - ω4) +
        0.0000075 * Math.sin(3 * L1 - 4 * l2 - 1.9927 * Σ1 + ω2) +
        0.0000046 * Math.sin(L1 + ψ - 2 * Π - 2 * G)),
      Math.atan(0.0081004 * Math.sin(L2 - ω2) +
        0.0004512 * Math.sin(L2 - ω3) +
        -0.0003284 * Math.sin(L2 - ψ) +
        0.0001160 * Math.sin(L2 - ω4) +
        0.0000272 * Math.sin(l1 - 2 * l3 + 1.0146 * Σ2 + ω2) +
        -0.0000144 * Math.sin(L2 - ω1) +
        0.0000143 * Math.sin(L2 + ψ - 2 * Π - 2 * G) +
        0.0000035 * Math.sin(L2 - ψ + G) +
        -0.0000028 * Math.sin(l1 - 2 * l3 + 1.0146 * Σ2 + ω3)),
      Math.atan(0.0032402 * Math.sin(L3 - ω3) +
        -0.0016911 * Math.sin(L3 - ψ) +
        0.0006847 * Math.sin(L3 - ω4) +
        -0.0002797 * Math.sin(L3 - ω2) +
        0.0000321 * Math.sin(L3 + ψ - 2 * Π - 2 * G) +
        0.0000051 * Math.sin(L3 - ψ + G) +
        -0.0000045 * Math.sin(L3 - ψ - G) +
        -0.0000045 * Math.sin(L3 + ψ - 2 * Π) +
        0.0000037 * Math.sin(L3 + ψ - 2 * Π - 3 * G) +
        0.000003 * Math.sin(2 * l2 - 3 * L3 + 4.03 * Σ3 + ω2) +
        -0.0000021 * Math.sin(2 * l2 - 3 * L3 + 4.03 * Σ3 + ω3)),
      Math.atan(-0.0076579 * Math.sin(L4 - ψ) +
        0.0044134 * Math.sin(L4 - ω4) +
        -0.0005112 * Math.sin(L4 - ω3) +
        0.0000773 * Math.sin(L4 + ψ - 2 * Π - 2 * G) +
        0.0000104 * Math.sin(L4 - ψ + G) +
        -0.0000102 * Math.sin(L4 - ψ - G) +
        0.0000088 * Math.sin(L4 + ψ - 2 * Π - 3 * G) +
        -0.0000038 * Math.sin(L4 + ψ - 2 * Π - G))
    ]
    R = [
      5.90569 * (1 +
        -0.0041339 * Math.cos(2 * (l1 - l2)) +
        -0.0000387 * Math.cos(l1 - π3) +
        -0.0000214 * Math.cos(l1 - π4) +
        0.000017 * Math.cos(l1 - l2) +
        -0.0000131 * Math.cos(4 * (l1 - l2)) +
        0.0000106 * Math.cos(l1 - l3) +
        -0.0000066 * Math.cos(l1 + π3 - 2 * Π - 2 * G)),
      9.39657 * (1 +
        0.0093848 * Math.cos(l1 - l2) +
        -0.0003116 * Math.cos(l2 - π3) +
        -0.0001744 * Math.cos(l2 - π4) +
        -0.0001442 * Math.cos(l2 - π2) +
        0.0000553 * Math.cos(l2 - l3) +
        0.0000523 * Math.cos(l1 - l3) +
        -0.0000290 * Math.cos(2 * (l1 - l2)) +
        0.0000164 * Math.cos(2 * (l2 - ω2)) +
        0.0000107 * Math.cos(l1 - 2 * l3 + π3) +
        -0.0000102 * Math.cos(l2 - π1) +
        -0.0000091 * Math.cos(2 * (l1 - l3))),
      14.98832 * (1 +
        -0.0014388 * Math.cos(l3 - π3) +
        -0.0007917 * Math.cos(l3 - π4) +
        0.0006342 * Math.cos(l2 - l3) +
        -0.0001761 * Math.cos(2 * (l3 - l4)) +
        0.0000294 * Math.cos(l3 - l4) +
        -0.0000156 * Math.cos(3 * (l3 - l4)) +
        0.0000156 * Math.cos(l1 - l3) +
        -0.0000153 * Math.cos(l1 - l2) +
        0.000007 * Math.cos(2 * l2 - 3 * l3 + π3) +
        -0.0000051 * Math.cos(l3 + π3 - 2 * Π - 2 * G)),
      26.36273 * (1 +
        -0.0073546 * Math.cos(l4 - π4) +
        0.0001621 * Math.cos(l4 - π3) +
        0.0000974 * Math.cos(l3 - l4) +
        -0.0000543 * Math.cos(l4 + π4 - 2 * Π - 2 * G) +
        -0.0000271 * Math.cos(2 * (l4 - π4)) +
        0.0000182 * Math.cos(l4 - Π) +
        0.0000177 * Math.cos(2 * (l3 - l4)) +
        -0.0000167 * Math.cos(2 * l4 - ψ - ω4) +
        0.0000167 * Math.cos(ψ - ω4) +
        -0.0000155 * Math.cos(2 * (l4 - Π - G)) +
        0.0000142 * Math.cos(2 * (l4 - ψ)) +
        0.0000105 * Math.cos(l1 - l4) +
        0.0000092 * Math.cos(l2 - l4) +
        -0.0000089 * Math.cos(l4 - Π - G) +
        -0.0000062 * Math.cos(l4 + π4 - 2 * Π - 3 * G) +
        0.0000048 * Math.cos(2 * (l4 - ω4)))
    ]
    // p. 311
    let T0 = (jde - 2433282.423) / base.JulianCentury
    let P = (1.3966626 * p + 0.0003088 * p * T0) * T0
    for (i in L) {
      L[i] += P
    }
    ψ += P
    let T = (jde - base.J1900) / base.JulianCentury
    I = 3.120262 * p + 0.0006 * p * T
    for (i in L) {
      let [sLψ, cLψ] = base.sincos(L[i] - ψ)
      let [sB, cB] = base.sincos(B[i])
      X[i] = R[i] * cLψ * cB
      Y[i] = R[i] * sLψ * cB
      Z[i] = R[i] * sB
    }
  })()

  Z[4] = 1
  // p. 312
  let A = new Array(5).fill(0)
  let B = new Array(5).fill(0)
  let C = new Array(5).fill(0)
  let [sI, cI] = base.sincos(I)
  let Ω = planetelements.node(planetelements.jupiter, jde)
  let [sΩ, cΩ] = base.sincos(Ω)
  let [sΦ, cΦ] = base.sincos(ψ - Ω)
  let [si, ci] = base.sincos(planetelements.inc(planetelements.jupiter, jde))
  let [sλ0, cλ0] = base.sincos(λ0)
  let [sβ0, cβ0] = base.sincos(β0)

  for (i in A) {
    let a0, b0
    // step 1
    let a = X[i]
    let b = Y[i] * cI - Z[i] * sI
    let c = Y[i] * sI + Z[i] * cI
    // step 2
    a0 = a * cΦ - b * sΦ
    b = a * sΦ + b * cΦ
    a = a0
    // step 3
    b0 = b * ci - c * si
    c = b * si + c * ci
    b = b0
    // step 4
    a0 = a * cΩ - b * sΩ
    b = a * sΩ + b * cΩ
    a = a0
    // step 5
    a0 = a * sλ0 - b * cλ0
    b = a * cλ0 + b * sλ0
    a = a0
    // step 6
    A[i] = a
    B[i] = c * sβ0 + b * cβ0
    C[i] = c * cβ0 - b * sβ0
  }
  let [sD, cD] = base.sincos(Math.atan2(A[4], C[4]))
  // p. 313
  for (i = 0; i < 4; i++) {
    let x = A[i] * cD - C[i] * sD
    let y = A[i] * sD + C[i] * cD
    let z = B[i]
    // differential light time
    let d = x / R[i]
    x += Math.abs(z) / k[i] * Math.sqrt(1 - d * d)
    // perspective effect
    let W = Δ / (Δ + z / 2095)
    pos[i] = new XY(x * W, y * W)
  }
  return pos
}
