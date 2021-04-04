/**
 * @copyright 2020 mdmunir
 * @license MIT
 * @module elpmpp02
 */
/**
 * Converts ELP MPP02 data files to javascript modules
 */

'use strict'

const fs = require('fs')
const path = require('path')
const serialize = require('serialize-to-module')
const { pmod } = require('../lib/base.cjs')

const config = {
  attic: path.resolve(__dirname, '../attic'),
  dirname: path.resolve(__dirname, '../data')
}

const REGMAIN = /^MAIN PROBLEM\.\s+(LONGITUDE|LATITUDE|DISTANCE)\.\s+\d+/
const REGPERT = /^PERTURBATIONS\.\s+(LONGITUDE|LATITUDE|DISTANCE)\.\s+\d+\s+(\d+)/
const SEC2RAD = 1 / 3600 * Math.PI / 180
const TYPE_MAPS = {
  LONGITUDE: 'L',
  LATITUDE: 'B',
  DISTANCE: 'R'
}
const FILES = ['ELP_MAIN.S1', 'ELP_PERT.S1', 'ELP_MAIN.S2', 'ELP_PERT.S2', 'ELP_MAIN.S3', 'ELP_PERT.S3']

const A405 = 384747.961370173
const AELP = 384747.980674318

const PLANETS = [
  [4.4026086342191189, 2608.7903140599633], // Me
  [3.1761344571511088, 1021.3285547385307], // Ve
  [1.7534699468639550, 628.30758504554319], // Earth
  [6.2034995986912955, 334.06124347172772], // Ma
  [0.59954667808842876, 52.969097211191368], // Ju
  [0.87401678344988065, 21.329907977851814], // Sa
  [5.4812276258103312, 7.4781665690567305], // Ur
  [5.3118941049906994, 3.8132918131353413] // Ne
]

// const FIT_TO_LLR = {
//   W1: [3.8103439203219089, 8399.6847302074329, -3.3191992975274604E-005, 3.2017095500473753E-008, -1.5363745554361197E-010],
//   delaunay: [
//     [5.1984668215549963, 7771.3771450919794, -3.3094060611690477E-005, 3.1973462269173895E-008, -1.5436467606527627E-010],
//     [1.6279052447645901, 8433.4661576404869, -6.4021294957029994E-005, -4.9499476841283623E-009, 2.0216730502267630E-011],
//     [2.3555545722519002, 8328.6914247251261, 1.5231275064134825E-004, 2.5041111442988642E-007, -1.1863390776750345E-009],
//     [-4.3125681747878231E-002, 628.30195524848227, -2.6638814929085117E-006, 6.1639211416266408E-010, -5.4439728251789797E-011]
//   ],
//   main_factor: [
//     8.9628483582427190E-011, // FA for distance
//     -3.8811642336884450E-011, // B1
//     -3.8770550078329589E-007, // B2
//     8.6975574391050760E-008, // B3
//     -6.1343475070789580E-007, // B4
//     -8.8963593596961107E-013 // B5
//   ]
// }

const FIT_TO_DE405 = {
  W1: [3.8103440908308803, 8399.6847300719292, -3.3189520425500942E-005, 3.1102494491060616E-008, -2.0328237648922845E-010],
  delaunay: [
    [5.1984667991566038, 7771.3771449908972, -3.3091588061916815E-005, 3.1058861259760758E-008, -2.0400959701089275E-010],
    [1.6279052434071115, 8433.4661574916008, -6.4006165376483609E-005, -5.3452162783369673E-009, -2.9428190443348850E-011],
    [2.3555545503868025, 8328.6914246234501, 1.5229240776232618E-004, 2.5071887415465472E-007, -1.2359839986206508E-009],
    [-4.3125687856530481E-002, 628.30195521406040, -2.6638814929085117E-006, 6.1639211416266408E-010, -5.4439728251789797E-011]
  ],
  main_factor: [
    7.8873681213335793E-011, // FA for distance
    -4.1702915801577361E-011, // B1
    -3.8692979889352060E-007, // B2
    8.6442279341830251E-008, // B3
    -6.1353171344411778E-007, // B4
    -9.5590936888903476E-013 // b5
  ]
}

class ELPMPP02 {
  /**
   * load ELPMPP data from ELP files
   * Data can be obtained from ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02/
   * @throws {Error}
   * @param {String} dirname - folder containing ELP_MPP files
   * @param {Object} [constant]
   * @param {String} name
   */
  constructor (dirname, constant, name) {
    this.dirname = dirname
    this.W1 = [...constant.W1]
    this.main_factor = constant.main_factor
    this.delaunay = constant.delaunay
    this.zeta = [...this.W1]
    this.zeta[1] += (5029.0966 - 0.29965) * SEC2RAD
    this.name = name
  }

  /** sync loading */
  loadSync () {
    const data = []
    const dirname = this.dirname
    FILES.forEach(function (fname) {
      const filename = path.resolve(dirname, fname)
      data.push(fs.readFileSync(filename, 'utf8'))
    })
    this.parse(data.join('\n'))
  }

  /**
   * parse data
   * @param {String} data - content of ELP file
   */
  parse (data) {
    this.data = {}
    const lines = data.split(/\n/)
    let varName
    let ref
    let func

    lines.forEach((line) => {
      if (REGMAIN.test(line)) {
        const [, type] = line.match(REGMAIN)
        varName = TYPE_MAPS[type]
        if (!this.data[varName]) this.data[varName] = {}
        ref = this.data[varName]['0'] = []
        func = 'parseMain'
      } else if (REGPERT.test(line)) {
        const [, type, pos] = line.match(REGPERT)
        varName = TYPE_MAPS[type]
        if (!this.data[varName]) this.data[varName] = {}
        if (!this.data[varName][pos]) this.data[varName][pos] = []
        ref = this.data[varName][pos]
        func = 'parsePert'
      } else if (line.length > 0) {
        ref.push(this[func](varName, line))
      }
    })

    Object.keys(this.data).forEach(varName => {
      const series = this.data[varName]
      Object.keys(series).forEach(pos => {
        series[pos] = series[pos].sort((a, b) => b[0] - a[0])
      })
    })
  }

  parseMain (type, line) {
    // Format line 4i3,2x,f13.5,6f12.2.
    const [FA, FB1, FB2, FB3, FB4, FB5] = this.main_factor

    // D, F, L, L'
    const del = line.substr(0, 12).match(/.{1,3}/g).map(v => parseInt(v.trim()))
    // Amplitudo
    let A = parseFloat(line.substr(14, 27).trim())
    // B1 .. B6
    const B = line.substr(27, 99).match(/.{1,12}/g).map(v => parseFloat(v.trim()))

    if (type === 'R') {
      A -= A * FA
    }
    A += FB1 * B[0] + FB2 * B[1] + FB3 * B[2] + FB4 * B[3] + FB5 * B[4]

    const result = [A, 0, 0, 0, 0, 0]
    for (let t = 0; t <= 4; t++) { // time series
      for (let i = 0; i < 4; i++) { // Delaunay
        result[t + 1] += del[i] * (this.delaunay[i][t] || 0)
      }
    }
    if (type === 'R') {
      result[0] *= A405 / AELP
      result[1] += Math.PI / 2
    }

    if (result[0] < 0) {
      result[0] = -result[0]
      result[1] += Math.PI
    }
    result[1] = pmod(result[1], 2 * Math.PI)
    // format [A, t0, t1, t2, t3, t4]
    return result
  }

  parsePert (type, line) {
    // Formal line 5x,2d20.13,13i3
    const S = parseFloat(line.substr(5, 25).trim().replace('D', 'e'))
    const C = parseFloat(line.substr(25, 45).trim().replace('D', 'e'))
    const A = Math.hypot(S, C)
    let phase = Math.atan2(C, S)
    if (phase < 0) phase += Math.PI * 2

    // D, F, L, L', Me, Ve, Ea, Ma, Ju, Sa, Ur, Ne, zeta
    const row = line.substr(45, 84).match(/.{1,3}/g).map(v => parseInt(v.trim()))

    const result = [A, phase, 0, 0, 0, 0]
    for (let t = 0; t <= 4; t++) {
      for (let i = 0; i < 4; i++) {
        result[t + 1] += row[i] * (this.delaunay[i][t] || 0)
      }
      for (let i = 0; i < 8; i++) {
        result[t + 1] += row[i + 4] * (PLANETS[i][t] || 0)
      }
      result[t + 1] += row[12] * (this.zeta[t] || 0)
    }

    if (type === 'R') {
      result[0] *= A405 / AELP
    }

    result[1] = pmod(result[1], 2 * Math.PI)
    // format [A, t0, t1, t2, t3, t4]
    return result
  }

  /**
   * get parsed data
   * @return {Object}
   * ```js
   * { W1: [<W0>, <W1>, <W2>, ...],
   *   L: { '0': [[<A>, <B>, <C>], ...], '1': [], '2': [], '3': [], '4': [], '5': [] },
   *   B: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] },
   *   R: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] } }
   * ```
   */
  getData () {
    return {
      name: this.name,
      W1: [...this.W1],
      ...this.data
    }
  }

  getTruncateData (treshold) {
    const result = {
      name: this.name,
      W1: [...this.W1],
      L: {},
      B: {},
      R: {}
    }

    Object.keys(this.data).forEach((type) => {
      Object.keys(this.data[type]).forEach((pos) => {
        const limit = (treshold[type] || 0) / Math.pow(treshold.T || 1, parseInt(pos))
        result[type][pos] = this.data[type][pos].filter((row) => Math.abs(row[0]) >= limit)
      })
    })
    return result
  }
}

class ELPMPPDE405 extends ELPMPP02 {
  constructor (dirname) {
    super(dirname, FIT_TO_DE405, 'ElpMppDE405')
  }
}

// class ELPMPPLLR extends ELPMPP02 {
//   constructor (dirname) {
//     super(dirname, FIT_TO_LLR, 'ElpMppLLR')
//   }
// }

main()

function main () {
  const v = new ELPMPPDE405(config.attic)
  v.loadSync()
  let o = v.getData()
  const dataFull = serialize(o, { esm: true })
  fs.writeFileSync(filename('elpMppDeFull.js'), dataFull, 'utf8')

  // truncate version
  o = v.getTruncateData({
    L: 0.001, // second
    B: 0.001, // second
    R: 0.001, // meter
    T: 30 // century
  })
  const data = serialize(o, { esm: true })
  fs.writeFileSync(filename('elpMppDe.js'), data, 'utf8')
}

function filename (name) {
  return path.resolve(config.dirname, name)
}
