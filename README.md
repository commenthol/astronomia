# astronomia

> An astronomical library

[![NPM version](https://badge.fury.io/js/astronomia.svg)](https://www.npmjs.com/package/astronomia/)
[![Build Status](https://github.com/commenthol/astronomia/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/commenthol/astronomia/actions/workflows/ci.yml?query=branch%3Amaster)


This library is a translation of [meeus][] from Go to Javascript and contains
selected algorithms from the book "Astronomical Algorithms" by Jean Meeus,
following the second edition, copyright 1998, with corrections as of
August 10, 2009.

Additional algorithms not covered in the book have been added.

## Installation

```
npm install --save astronomia
```

## Browser usage

Make sure you add `<meta charset="UTF-8">` to your HTML or at least include your
bundle with `<script src="your-bundle.js" charset="UTF-8"></script>` then
this package runs in modern browsers.

- Chrome: >=45
- Firefox: >= 45
- Safari: >=10
- Mobile Safari: >=10
- Edge: >=13
- IE: >=10 (needs `core-js/es6` polyfill)

## Usage

For documentation of the different packages please take a look at the source code as well as at the tests.

## Packages

- **angle**: Angular Separation.
- **apparent**: Apparent Place of a Star.
- **apsis**: Perigee and apogee of the Moon.
- **base**: Basic constants and methods
- **binary**: Binary Stars.
- **circle**: Smallest Circle containing three Celestial Bodies.
- **conjunction**: Planetary Conjunctions.
- **coord**: Transformation of Coordinates. Ecliptic, Equatorial, Horizontal, Galactic coordinates.
- **deltat**: Dynamical Time and Universal Time.
- **eclipse**: Eclipses.
- **elliptic**: Elliptic Motion.
- **elementequinox**: Reduction of ecliptical Elements from one Equinox to another one.
- **eqtime**: Equation of time.
- **fit**: Curve Fitting.
- **globe**: Ellipsoid, Globe, Coordinates of Earth Observer.
- **illum**: Illuminated Fraction of the Disk and Magnitude of a Planet.
- **interpolation**: Interpolation of equidistant values (linear, len3, len5); Lagrange Polynoms
- **iterate**: Iteration.
- **jm**: Jewish and Moslem Calendars.
- **julian**: Julian Days, Gregorian, Julian calendar functions.
- **jupiter**: Ephemeris for Physical Observations of Jupiter.
- **jupitermoons**: Positions of the Satellites of Jupiter.
- **kepler**: Equation of Kepler.
- **line**: Bodies in Straight Line
- **mars**: Ephemeris for Physical Observations of Mars.
- **moon**: Ephemeris for Physical Observations of the Moon.
- **moonillum**: Illuminated Fraction of the Moon's Disk.
- **moonmaxdec**: Maximum Declinations of the Moon.
- **moonnode**: Passages of the Moon through the Nodes.
- **moonphase**: Phases of the Moon.
- **moonposition**: Position of the Moon.
- **nearparabolic**: Near-parabolic Motion.
- **node**: Passages through the Nodes.
- **nutation**: Nutation and the Obliquity of the Ecliptic.
- **parabolic**: Parabolic Motion.
- **parallactic**: The Parallactic Angle, and three other Topics.
- **parallax**: Correction for Parallax.
- **perihelion**: Planets in Perihelion and Aphelion.
- **planetelements**: Elements of Planetary Orbits.
- **planetposition**: Ecliptic position of planets by full VSOP87 theory.
- **pluto**: Pluto.
- **precess**: Precession.
- **refraction**: Atmospheric Refraction.
- **rise**: Rising, Transit, and Setting.
- **saturnmoons**: Positions of the Satellites of Saturn.
- **saturnring**: The Ring of Saturn.
- **semidiameter**: Semidiameters of the Sun, Moon, and Planets.
- **sexagesimal**: Sexagesimal classes.
- **sidereal**: Sidereal Time at Greenwich.
- **solar**: Solar Coordinates.
- **solardisk**: Ephemeris for Physical Observations of the Sun.
- **solarxyz**: Rectangular Coordinates of the Sun.
- **solstice**: Equinoxes, Solstices and Solarterms.
- **stellar**: Stellar Magnitudes.
- **sundial**: Calculation of a Planar Sundial.
- **sunrise**: Compute rise, noon, set of the Sun for an earth observer.

## Using a single package

If you require a small footprint in your final application, each of the provided
packages can be used as a single one:

```js
// instead of
const base = require('astronomia').base
// use
const base = require('astronomia/base')
```

ES6 Syntax

```js
// instead of
import {base} from 'astronomia'
// use
import base from 'astronomia/base'
```

To access dedicated VSOP87 data sets use e.g.

```js
const {vsop87Bvenus} = require('astronomia').data
// or
const vsop87Bvenus = require('astronomia/data/vsop87Bvenus')
```

## Running tests

    npm test

to even run very long lasting tests, do

    SLOWTESTS=1 npm test

In local browser

    npm run zuul -- --local 3000

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license.

You are also implicitly verifying that all code is your original work or correctly attributed with the source of its origin and licence.

## License

MIT Licensed

See [LICENSE][] for more info.

## References

* [LICENSE][LICENSE]
* [meeus][meeus]
* VSOP87 dataset ftp://cdsarc.u-strasbg.fr/pub/cats/VI/81

[meeus]: https://github.com/soniakeys/meeus.git
[LICENSE]: ./LICENSE
