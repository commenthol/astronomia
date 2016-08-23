# astronomia

> An astronomical library

[![NPM version](https://badge.fury.io/js/astronomia.svg)](https://www.npmjs.com/package/astronomia/)
[![Build Status](https://secure.travis-ci.org/commenthol/astronomia.svg?branch=master)](https://travis-ci.org/commenthol/astronomia)

This library is a translation of [meeus][] from Go to Javascript and contains
selected algorithms from the book "Astronomical Algorithms" by Jean Meeus,
following the second edition, copyright 1998, with corrections as of
August 10, 2009.

## Installation

```
npm install --save astronomia
```

## Usage

For documentation of the different packages please take a look at the source code as well as at the tests.

## Packages

- _angle_: Angular Separation.
- _apparent_: Apparent Place of a Star.
- _apsis_: Perigee and apogee of the Moon.
- _base_: Basic constants and methods
- _binary_: Binary Stars.
- _circle_: Smallest Circle containing three Celestial Bodies.
- _conjunction_: Planetary Conjunctions.
- _coord_: Transformation of Coordinates. Ecliptic, Equatorial, Horizontal, Galactic coordinates.
- _deltat_: Dynamical Time and Universal Time.
- _eclipse_: Eclipses.
- _elliptic_: Elliptic Motion.
- _elementequinox_: Reduction of ecliptical Elements from one Equinox to another one.
- _eqtime_: Equation of time.
- _fit_: Curve Fitting.
- _globe_: Ellipsoid, Globe, Coordinates of Earth Observer.
- _illum_: Illuminated Fraction of the Disk and Magnitude of a Planet.
- _interpolation_: Interpolation of equidistant values (linear, len3, len5); Lagrange Polynoms
- _iterate_: Iteration.
- _jm_: Jewish and Moslem Calendars.
- _julian_: Julian Days, Gregorian, Julian calendar functions.
- _jupiter_: Ephemeris for Physical Observations of Jupiter.
- _jupitermoons_: Positions of the Satellites of Jupiter.
- _kepler_: Equation of Kepler.
- _line_: Bodies in Straight Line
- _mars_: Ephemeris for Physical Observations of Mars.
- _moon_: Ephemeris for Physical Observations of the Moon.
- _moonillum_: Illuminated Fraction of the Moon's Disk.
- _moonmaxdec_: Maximum Declinations of the Moon.
- _moonnode_: Passages of the Moon through the Nodes.
- _moonphase_: Phases of the Moon.
- _moonposition_: Position of the Moon.
- _nearparabolic_: Near-parabolic Motion.
- _node_: Passages through the Nodes.
- _nutation_: Nutation and the Obliquity of the Ecliptic.
- _parabolic_: Parabolic Motion.
- _parallactic_: The Parallactic Angle, and three other Topics.
- _parallax_: Correction for Parallax.
- _perihelion_: Planets in Perihelion and Aphelion.
- _planetelements_: Elements of Planetary Orbits.
- _planetposition_: Ecliptic position of planets by full VSOP87 theory.
- _pluto_: Pluto.
- _precess_: Precession.
- _refraction_: Atmospheric Refraction.
- _rise_: Rising, Transit, and Setting.
- _saturnmoons_: Positions of the Satellites of Saturn.
- _saturnring_: The Ring of Saturn.
- _semidiameter_: Semidiameters of the Sun, Moon, and Planets.
- _sexagesimal_: Sexagesimal classes.
- _sidereal_: Sidereal Time at Greenwich.
- _solar_: Solar Coordinates.
- _solardisk_: Ephemeris for Physical Observations of the Sun.
- _solarxyz_: Rectangular Coordinates of the Sun.
- _solstice_: Equinoxes, Solstices and Solarterms.
- _stellar_: Stellar Magnitudes.
- _sundial_: Calculation of a Planar Sundial.

## Using a single package

If you require a small footprint in your final application, each of the provided
packages can be used as a single one:

```js
// instead of
const base = require('astronomia').base
// use
const base = require('astronomia/lib/base')
```

ES6 Syntax

```js
// instead of
import {base} from 'astronomia'
// use
import base from 'astronomia/lib/base'
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license.

You are also implicitly verifying that all code is your original work or correctly attributed with the source of its origin and licence.

## License

MIT Licensed

See [LICENSE][] for more info.

## References

<!-- !ref -->

* [LICENSE][LICENSE]
* [meeus][meeus]
* [VSOP87 dataset][VSOP87 dataset]

<!-- ref! -->

[meeus]: https://github.com/soniakeys/meeus.git
[LICENSE]: ./LICENSE
[VSOP87 dataset]: ftp://cdsarc.u-strasbg.fr/pub/cats/VI/81
