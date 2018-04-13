/* eslint key-spacing:0 */

import assert from 'assert'
import {sunrise, julian} from '..'

const {Sunrise} = sunrise

describe.disable = function () {}

describe('#Sunrise', function () {
  describe('northern hemisphere', function () {
    var date = new Date('1935-09-24T00:00:00Z')
    var lat = 50.79770
    var lon = 4.35916
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '1935-09-24T03:38:18.262Z',
      nauticalDawn   : '1935-09-24T04:18:34.713Z',
      dawn           : '1935-09-24T04:57:20.768Z',
      rise           : '1935-09-24T05:30:10.710Z',
      riseEnd        : '1935-09-24T05:33:33.452Z',
      goldenHourEnd  : '1935-09-24T06:13:35.023Z',
      noon           : '1935-09-24T11:34:53.328Z',
      goldenHourStart: '1935-09-24T16:55:19.587Z',
      setStart       : '1935-09-24T17:35:15.569Z',
      set            : '1935-09-24T17:38:37.766Z',
      dusk           : '1935-09-24T18:11:21.681Z',
      nauticalDusk   : '1935-09-24T18:49:58.457Z',
      nightStart     : '1935-09-24T19:30:01.647Z'
    }

    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in northern polar night', function () {
    var date = new Date('2015-01-01T00:00:00Z')
    var lat = 78.22236
    var lon = 15.65257
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-01-01T06:33:13.220Z',
      nauticalDawn   : '2015-01-01T09:34:31.168Z',
      dawn           : '2015-01-31T10:11:44.907Z',
      rise           : '2015-02-16T10:23:28.354Z',
      riseEnd        : '2015-02-18T10:09:44.989Z',
      goldenHourEnd  : '2015-03-07T10:04:07.300Z',
      noon           : '2015-01-01T11:00:48.437Z',
      goldenHourStart: '2014-10-07T11:28:04.511Z',
      setStart       : '2014-10-24T11:30:38.481Z',
      set            : '2014-10-26T11:13:10.669Z',
      dusk           : '2014-11-12T11:01:08.845Z',
      nauticalDusk   : '2015-01-01T12:27:38.115Z',
      nightStart     : '2015-01-01T15:29:02.898Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in northern polar day', function () {
    var date = new Date('2015-06-01T00:00:00Z')
    var lat = 78.22236
    var lon = 15.65257
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-03-04T23:28:52.385Z',
      nauticalDawn   : '2015-03-19T23:42:05.887Z',
      dawn           : '2015-04-03T23:51:59.979Z',
      rise           : '2015-04-17T23:50:12.249Z',
      riseEnd        : '2015-04-19T23:33:48.086Z',
      goldenHourEnd  : '2015-05-10T23:14:34.642Z',
      noon           : '2015-06-01T10:55:10.698Z',
      goldenHourStart: '2015-08-03T22:03:19.928Z',
      setStart       : '2015-08-24T21:50:49.943Z',
      set            : '2015-08-25T22:04:01.888Z',
      dusk           : '2015-09-09T21:40:24.860Z',
      nauticalDusk   : '2015-09-24T21:50:06.675Z',
      nightStart     : '2015-10-10T21:34:35.396Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('southern hemisphere', function () {
    var date = new Date('2015-02-21T00:00:00Z')
    var lat = -44.7787668
    var lon = -65.7178918
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-02-21T08:00:34.926Z',
      nauticalDawn   : '2015-02-21T08:40:43.950Z',
      dawn           : '2015-02-21T09:18:04.318Z',
      rise           : '2015-02-21T09:48:50.431Z',
      riseEnd        : '2015-02-21T09:51:57.843Z',
      goldenHourEnd  : '2015-02-21T10:28:19.885Z',
      noon           : '2015-02-21T16:36:30.110Z',
      goldenHourStart: '2015-02-21T22:43:55.794Z',
      setStart       : '2015-02-21T23:20:11.095Z',
      set            : '2015-02-21T23:23:17.844Z',
      dusk           : '2015-02-21T23:53:56.555Z',
      nauticalDusk   : '2015-02-22T00:31:05.190Z',
      nightStart     : '2015-02-22T01:10:56.478Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in southern polar day', function () {
    var date = new Date('2015-12-21T00:00:00Z')
    var lat = -77.8460468
    var lon = 166.6753
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-09-07T13:33:38.473Z',
      nauticalDawn   : '2015-09-22T13:48:42.893Z',
      dawn           : '2015-10-08T13:29:23.426Z',
      rise           : '2015-10-22T13:26:47.879Z',
      riseEnd        : '2015-10-23T13:40:48.562Z',
      goldenHourEnd  : '2015-11-13T13:19:49.695Z',
      noon           : '2015-12-21T00:51:00.379Z',
      goldenHourStart: '2016-01-29T12:27:53.315Z',
      setStart       : '2016-02-19T12:01:27.640Z',
      set            : '2016-02-20T12:14:26.259Z',
      dusk           : '2016-03-05T12:06:29.863Z',
      nauticalDusk   : '2016-03-20T12:11:04.915Z',
      nightStart     : '2016-04-05T11:51:07.900Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in southern polar night', function () {
    var date = new Date('2015-06-21T00:00:00Z')
    var lat = -77.8460468
    var lon = 166.6753
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-06-20T20:32:23.851Z',
      nauticalDawn   : '2015-06-20T23:32:36.264Z',
      dawn           : '2015-08-01T00:46:43.715Z',
      rise           : '2015-08-19T00:35:21.630Z',
      riseEnd        : '2015-08-21T00:17:34.775Z',
      goldenHourEnd  : '2015-09-08T00:03:13.503Z',
      noon           : '2015-06-21T00:54:55.443Z',
      goldenHourStart: '2015-04-05T01:43:39.589Z',
      setStart       : '2015-04-23T01:19:04.778Z',
      set            : '2015-04-24T01:41:35.328Z',
      dusk           : '2015-05-12T01:25:36.458Z',
      nauticalDusk   : '2015-06-21T02:17:12.851Z',
      nightStart     : '2015-06-21T05:17:24.954Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe.disable('debug', function () {
    it('for each day of year', function () {
      function l (len, str) {
        str += Array(len).fill(' ').join('')
        return str.substr(0, len)
      }
      var j = new julian.Calendar(2015, 1, 1).toJD()
      var last = ''
      for (var i = 0; i < 366; i++) {
        var date = new julian.Calendar().fromJD(j + i)
        var lat = 89.9
        var lon = 0
        var sr = new Sunrise(date, lat, -lon)
        var res
        try {
          res = sr.rise().toDate().toISOString()
        } catch (e) {
          res = 'NaN'
        }
        console.log(l(3, date.dayOfYear()), l(2, date.month), l(2, Math.floor(date.day)), res,
          last.substr(0, 19) === res.substr(0, 19) ? '#' : '')
        last = res
      }
    })
  })
})
