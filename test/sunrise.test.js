/* eslint key-spacing:0 */

import assert from 'assert'
import {sunrise, julian, globe} from '..'

const {Sunrise} = sunrise

describe.disable = function () {}

describe('#Sunrise', function () {
  describe('northern hemisphere', function () {
    var date = new Date('2017-09-24T00:00:00Z')
    var lat = 50.79770 // Brussels
    var lon = 4.35916

    var tests = {
      nightEnd       : '2017-09-24T03:40:27.628Z',
      nauticalDawn   : '2017-09-24T04:20:32.419Z',
      dawn           : '2017-09-24T04:59:12.501Z',
      rise           : '2017-09-24T05:32:00.735Z',
      riseEnd        : '2017-09-24T05:35:23.467Z',
      goldenHourEnd  : '2017-09-24T06:15:27.292Z',
      noon           : '2017-09-23T11:34:31.247Z',
      goldenHourStart: '2017-09-24T16:52:43.104Z',
      setStart       : '2017-09-24T17:32:41.797Z',
      set            : '2017-09-24T17:36:03.983Z',
      dusk           : '2017-09-24T18:08:45.825Z',
      nauticalDusk   : '2017-09-24T18:47:15.177Z',
      nightStart     : '2017-09-24T19:27:03.609Z'
    }

    Object.keys(tests).forEach(function (fnName) {
      it(fnName + ' v1 api', function () {
        var sr = new Sunrise(new julian.Calendar(date), lat, -lon)
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })

      it(fnName, function () {
        var sr = new Sunrise(new julian.Calendar(date), globe.Coord.fromWgs84(lat, lon))
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in northern polar night', function () {
    var date = new Date('2015-01-01T00:00:00Z')
    var lat = 78.22236 // Longyearbyen
    var lon = 15.65257
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : '2015-01-01T06:33:15.233Z',
      nauticalDawn   : '2015-01-01T09:34:35.176Z',
      dawn           : 'always below horizon',
      rise           : 'always below horizon',
      riseEnd        : 'always below horizon',
      goldenHourEnd  : 'always below horizon',
      noon           : 'always below horizon',
      goldenHourStart: 'always below horizon',
      setStart       : 'always below horizon',
      set            : 'always below horizon',
      dusk           : 'always below horizon',
      nauticalDusk   : '2015-01-01T12:27:37.975Z',
      nightStart     : '2015-01-01T15:29:05.472Z'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        try {
          assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
        } catch (e) {
          assert.equal(e.message, tests[fnName])
        }
      })
    })
  })

  describe('in northern polar day', function () {
    var date = new Date('2015-04-16T00:00:00Z')
    var lat = 78.22236 // Longyearbyen
    var lon = 15.65257
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : 'always above horizon',
      nauticalDawn   : 'always above horizon',
      dawn           : 'always above horizon',
      rise           : '2015-04-16T00:33:55.884Z',
      riseEnd        : '2015-04-16T00:57:02.306Z',
      goldenHourEnd  : '2015-04-16T03:41:39.750Z',
      noon           : '2015-04-16T10:57:16.967Z',
      goldenHourStart: '2015-04-16T18:17:19.170Z',
      setStart       : '2015-04-16T21:09:14.378Z',
      set            : '2015-04-16T21:35:30.489Z',
      dusk           : 'always above horizon',
      nauticalDusk   : 'always above horizon',
      nightStart     : 'always above horizon'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        try {
          assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
        } catch (e) {
          assert.equal(e.message, tests[fnName])
        }
      })
    })
  })

  describe('southern hemisphere', function () {
    var date = new Date('2015-02-21T00:00:00Z')
    var lat = -44.7787668 // Camarones
    var lon = -65.7178918
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd        : '2015-02-21T08:00:36.391Z',
      nauticalDawn    : '2015-02-21T08:40:44.091Z',
      dawn            : '2015-02-21T09:18:03.765Z',
      rise            : '2015-02-21T09:48:49.647Z',
      riseEnd         : '2015-02-21T09:51:57.052Z',
      goldenHourEnd   : '2015-02-21T10:28:19.254Z',
      noon            : '2015-02-21T16:36:28.816Z',
      goldenHourStart : '2015-02-21T22:43:53.550Z',
      setStart        : '2015-02-21T23:20:09.240Z',
      set             : '2015-02-21T23:23:15.969Z',
      dusk            : '2015-02-21T23:53:53.996Z',
      nauticalDusk    : '2015-02-21T00:32:57.534Z',
      nightStart      : '2015-02-21T01:13:04.881Z'
    }

    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
      })
    })
  })

  describe('in southern polar day', function () {
    var date = new Date('2015-10-22T00:00:00Z')
    var lat = -77.8460468 // McMurdo Station
    var lon = 166.6753
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : 'always above horizon',
      nauticalDawn   : 'always above horizon',
      dawn           : 'always above horizon',
      rise           : '2015-10-22T13:28:14.308Z',
      riseEnd        : '2015-10-22T14:02:33.462Z',
      goldenHourEnd  : '2015-10-22T17:02:04.350Z',
      noon           : '2015-10-21T00:37:54.219Z',
      goldenHourStart: '2015-10-22T08:10:51.555Z',
      setStart       : '2015-10-22T11:10:52.521Z',
      set            : '2015-10-22T11:45:14.489Z',
      dusk           : 'always above horizon',
      nauticalDusk   : 'always above horizon',
      nightStart     : 'always above horizon'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        try {
          // console.log(sr[fnName]().toDate().toString()) // TZ=Antarctica/McMurdo
          assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
        } catch (e) {
          assert.equal(e.message, tests[fnName])
        }
      })
    })
  })

  describe('in southern polar night', function () {
    var date = new Date('2015-03-10T00:00:00Z')
    var lat = -77.8460468 // McMurdo Station
    var lon = 166.6753
    var sr = new Sunrise(new julian.Calendar(date), lat, -lon)

    var tests = {
      nightEnd       : 'always above horizon',
      nauticalDawn   : 'always above horizon',
      dawn           : '2015-03-10T15:20:27.818Z',
      rise           : '2015-03-10T17:30:14.872Z',
      riseEnd        : '2015-03-10T17:41:15.297Z',
      goldenHourEnd  : '2015-03-10T19:43:35.097Z',
      noon           : '2015-03-09T01:03:46.160Z',
      goldenHourStart: '2015-03-10T06:27:44.137Z',
      setStart       : '2015-03-10T08:29:00.481Z',
      set            : '2015-03-10T08:39:57.367Z',
      dusk           : '2015-03-10T10:49:17.499Z',
      nauticalDusk   : 'always above horizon',
      nightStart     : 'always above horizon'
    }
    Object.keys(tests).forEach(function (fnName) {
      it(fnName, function () {
        try {
          // console.log(sr[fnName]().toDate().toString()) // TZ=Antarctica/McMurdo
          assert.equal(sr[fnName]().toDate().toISOString(), tests[fnName])
        } catch (e) {
          assert.equal(e.message, tests[fnName])
        }
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
