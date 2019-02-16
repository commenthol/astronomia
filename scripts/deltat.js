#!/usr/bin/env node

/**
 * download dataset first using `./dl.sh`
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { datafile } = require('./src/datafile.js')
const serialize = require('serialize-to-js').serializeToModule
const julian = require('..').julian

const attic = path.resolve(__dirname, '../attic')
const config = {
  fileHist: path.resolve(attic, 'historic_deltat.data'),
  fileData: path.resolve(attic, 'deltat.data'),
  filePreds: path.resolve(attic, 'deltat.preds'),
  fileLeapSecs: path.resolve(attic, 'tai-utc.dat'),
  fileFinals2000A: path.resolve(attic, 'finals2000A.data'),
  fileOut: path.resolve(__dirname, '../data', 'deltat.js'),
  comment: `/**
 * DO NOT EDIT MANUALLY
 * Use \`scripts/deltat.js\` to generate file.
 * Datasets are from <http://maia.usno.navy.mil/ser7>
 */
`
}

function DataSet () {
  this.first = {}
  this.last = {}
  this.data = {}
}
DataSet.prototype = {
  read: function () {
    throw new Error('needs implementation')
  },
  get: function (year, month) {
    if (this.data[year]) {
      return this.data[year][month]
    }
  },
  _add: function (year, month, obj) {
    if (!this.data[year]) this.data[year] = {}
    this.data[year][month] = obj

    if (!this.first.year || this.first.year > year ||
      (this.first.year === year && this.first.month > month)
    ) {
      this.first = {year: year, month: month}
    }
    if (!this.last.year || this.last.year < year ||
      (this.last.year === year && this.last.month < month)
    ) {
      this.last = {year: year, month: month}
    }
  }
}

/**
 * obtains TAI - UTC data from `tai-utc.dat`
 */
function TaiMinusUTC () {
  this.data = []
}
TaiMinusUTC.prototype = {
  /**
   * @param {String} file - filename to `tai-utc.dat`
   * @return {this}
   */
  read: function (file) {
    let months = [ '', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
    let dataSet = fs.readFileSync(file, 'utf8')
    this.data = []
    dataSet.split(/\n/).forEach((row) => {
      if (/^ \d{4}/.test(row)) {
        let year = toFloat(row.substr(1, 4))
        let _month = row.substr(6, 3)
        let month = months.indexOf(_month)
        let taiMinusUtc = toFloat(row.substr(37, 12))
        this.data.push({
          year: year,
          month: month,
          taiMinusUtc: taiMinusUtc,
          decYear: toYear(year, month)
        })
      }
    })
    return this
  },
  get: function (year, month) {
    let i
    let decYear = toYear(year, month)
    for (i in this.data) {
      // console.log(this.data[i].decYear, decYear)
      if (this.data[i].decYear > decYear) {
        i -= 1
        break
      }
    }
    return this.data[i].taiMinusUtc
  }
}

/**
 * calculate DeltaT from `finals2000A.data` and data obtained by `tai-utc.dat`
 * `Delta T = 32.184 s + (TAI - UTC) - (UT1 - UTC)`
 */
function Finals2000A (taiMinusUTC) { /* extends DataSet */
  DataSet.call(this)
  this.taiMinusUTC = taiMinusUTC
  this.data = {}
}
Object.assign(Finals2000A.prototype, DataSet.prototype, {
  read: function (file) {
    const rows = datafile(file, [[0, 2], [2, 4], [4, 6], [58, 68]])
    rows.forEach(row => {
      let [year, month, day, ut1MinusUtc] = row.map(toFloat)
      if (year > 90) {
        year += 1900
      } else {
        year += 2000
      }
      // let type = row.substr(57, 1)
      // let ut1MinusUtc = toFloat(row.substr(58, 10))
      if (year && month && day === 1 && ut1MinusUtc) {
        let tai = this.taiMinusUTC.get(year, month)
        let deltaT = toPrecision(32.184 + tai - ut1MinusUtc, 7)
        this._add(year, month, deltaT)
        // console.log([year, month, deltaT, tai, ut1MinusUtc].join('\t'))
      }
      // }
    })
    return this
  }
})

function Data (finals2000A) { /* extends DataSet */
  DataSet.call(this)
  this.finals2000A = finals2000A
  this._data = {}
}
Object.assign(Data.prototype, DataSet.prototype, {
  read: function (file) {
    const rows = datafile(file, [[0, 5], [5, 8], [13, 20]])
    rows.forEach(row => {
      const [year, month, deltaT] = row.map(toFloat)
      if (year && month && deltaT) {
        this._add(year, month, deltaT)
        // let fdt = this.finals2000A.get(year, month)
        // console.log([year, month, deltaT, fdt, fdt ? deltaT - fdt : ''].join('\t'))
      }
    })
    return this
  },
  mergeFinals: function () {
    var finals = this.finals2000A
    var year
    var month

    year = finals.first.year
    for (month = finals.first.month; month <= 12; month++) {
      this._add(year, month, finals.get(year, month))
    }
    for (year += 1; year < finals.last.year; year++) {
      for (month = 1; month <= 12; month++) {
        this._add(year, month, finals.get(year, month))
      }
    }
    year = finals.last.year
    for (month = 1; month <= finals.last.month; month++) {
      this._add(year, month, finals.get(year, month))
    }

    return this
  },
  toData: function () {
    var _this = this
    var data = {table: []}
    var year
    var month

    data.first = toYear(this.first.year, this.first.month)
    data.firstYM = [this.first.year, this.first.month]
    data.last = toYear(this.last.year, this.last.month)
    data.lastYM = [this.last.year, this.last.month]

    function push (year, month) {
      var dt = _this.get(year, month)
      data.table.push(dt)
      console.log([year, month, dt].join('\t'))
    }

    year = this.first.year
    for (month = this.first.month; month <= 12; month++) {
      push(year, month)
    }
    for (year += 1; year < this.last.year; year++) {
      for (month = 1; month <= 12; month++) {
        push(year, month)
      }
    }
    year = this.last.year
    for (month = 1; month <= this.last.month; month++) {
      push(year, month)
    }
    return data
  }
})

function DataSetDec () {
  this.data = {table: []}
}
DataSetDec.prototype = {
  read: function () {
    throw new Error('need implementation')
  },
  _add: function (year, deltaT) {
    if (!this.data.first) {
      this.data.first = year
    }
    this.data.table.push(deltaT)
    this.data.last = year
  }
}

function Historic () {
  DataSetDec.call(this)
}
Object.assign(Historic.prototype, DataSetDec.prototype, {
  read: function (file) {
    const rows = datafile(file, [[0, 11], [11, 20]])
    rows.forEach((row) => {
      const [year, deltaT] = row.map(toFloat)
      if (year && deltaT) {
        this._add(year, deltaT)
      }
    })
    return this
  }
})

function Prediction () {
  DataSetDec.call(this)
}
Object.assign(Prediction.prototype, DataSetDec.prototype, {
  read: function (file) {
    const rows = datafile(file, [[14, 22], [22, 34], [34, 48]])
    rows.shift() // header row
    rows.forEach((row) => {
      const [year, deltaT] = row.map(toFloat)
      if (year && deltaT) {
        this._add(year, deltaT)
      }
    })
    return this
  }
})

function toPrecision (num, decimals) {
  return parseFloat(num.toFixed(decimals), 10)
}

function toFloat (num) {
  const f = parseFloat(num, 10)
  return !isNaN(f) && f
}

function toYear (year, month) {
  return new julian.CalendarGregorian(year, month, 1).toYear()
}

module.exports = {
  Historic: Historic,
  Data: Data,
  Prediction: Prediction,
  TaiMinusUTC: TaiMinusUTC,
  Finals2000A: Finals2000A
}

function main (config) {
  var taiMinusUTC = new TaiMinusUTC().read(config.fileLeapSecs)
  var finals2000A = new Finals2000A(taiMinusUTC).read(config.fileFinals2000A)

  var dataSet = {
    historic: new Historic().read(config.fileHist).data,
    data: new Data(finals2000A).read(config.fileData).mergeFinals().toData(),
    prediction: new Prediction().read(config.filePreds).data
  }
  let out = config.comment + serialize(dataSet)
  fs.writeFileSync(config.fileOut, out, 'utf8')
}

if (module === require.main) {
  main(config)
}
