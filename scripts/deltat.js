/**
 * download dataset first using `./dl.sh`
 */
'use strict'

const fs = require('fs')
const path = require('path')
const serialize = require('serialize-to-js').serializeToModule
const base = require('..').base
const julian = require('..').julian

const config = {
  fileHist: path.resolve(__dirname, '../attic', 'historic_deltat.data'),
  fileData: path.resolve(__dirname, '../attic', 'deltat.data'),
  filePreds: path.resolve(__dirname, '../attic', 'deltat.preds'),
  fileOut: path.resolve(__dirname, '../data', 'deltat.js'),
  comment: `/**
 * DO NOT EDIT MANUALLY
 * Use \`scripts/deltat.js\` to generate file.
 * Datasets are from <http://maia.usno.navy.mil/ser7>
 */
`
}

function historic () {
  let dataSet = fs.readFileSync(config.fileHist, 'utf8')
  let data = { table: [] }
  dataSet.split(/\n/).forEach((row) => {
    row = row.trim()
    if (/^\d{4}/.test(row)) {
      let jyear = toFloat(row.substr(0, 11))
      let dt = toFloat(row.substr(11, 19))
      if (!data.first) {
        data.first = jyear
      }
      data.table.push(dt)
      data.last = jyear
    }
  })
  return data
}

function data () {
  let dataSet = fs.readFileSync(config.fileData, 'utf8')
  let data = { table: [] }
  dataSet.split(/\n/).forEach((row) => {
    row = row.trim()
    if (/^\d{4}/.test(row)) {
      let [year, month, day, dt] = (row || '').trim().split(/\s+/) // eslint-disable-line no-unused-vars
      year = toFloat(year)
      month = toFloat(month)
      dt = toFloat(dt)
      if (!data.first) {
        data.first = toYear(year, month)
      }
      data.table.push(dt)
      data.last = toYear(year, month)
    }
  })
  return data
}

function prediction () {
  let dataSet = fs.readFileSync(config.filePreds, 'utf8')
  let data = { table: [] }
  dataSet.split(/\n/).forEach((row) => {
    row = row.trim()
    if (/^\d{4}/.test(row)) {
      let jyear = toFloat(row.substr(0, 12))
      let dt = toFloat(row.substr(12, 24))
      if (!data.first) {
        data.first = jyear
      }
      data.table.push(dt)
      data.last = jyear
    }
  })
  return data
}

function toFloat (num) {
  return parseFloat(num, 10)
}

function toYear (year, month) {
  return base.JDEToJulianYear(
    julian.CalendarGregorianToJD(year, month, 1)
  )
}

function main () {
  var dataSet = {
    historic: historic(),
    data: data(),
    prediction: prediction()
  }
  let out = config.comment + serialize(dataSet)
  fs.writeFileSync(config.fileOut, out, 'utf8')
}

if (module === require.main) {
  main()
}
