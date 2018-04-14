# Migrate from v1 to v2

Affected packages are:

## kepler

`true()` needed to be renamed to `trueAnomaly()` as "true" being a reserved keyword.

## moonphase

`new()` needed to be renamed to `newMoon()` as "new" being a reserved keyword.

## planetposition

class Planet does not accept a string as parameter. Instead use the vsop87b data.
  Reason is to keep bundling size of the package small if no vsop87 data is required at all.

change v1

```js
import {planetposition} from 'astronomia'
const earth = new planetposition.Planet('earth')
```

to v2

```js
import {data, planetposition} from 'astronomia'
const earth = new planetposition.Planet(data.earth)
```

## solar

`true()` needed to be renamed to `trueLongitude()` as "true" being a reserved keyword.
