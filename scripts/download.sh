#!/bin/bash

# script to download datasets

curl=curl
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
target=$cwd/../attic

test ! -d $target && mkdir -p $target

## get filename
file () {
  echo $1 | sed "s/^.*\/\([^\/]*\)$/\1/"
}

## VSOP87 data
vsop () {
  url=ftp://cdsarc.u-strasbg.fr/pub/cats/VI/81
  file="VSOP87B"
  exts="mer ven ear mar jup sat ura nep"

  for ext in $exts; do
    $curl $url/$file.$ext > $target/$file.$ext
  done
}

## DeltaT data
deltat () {
  urls=$(cat << EOS
    http://maia.usno.navy.mil/ser7/deltat.preds
    http://maia.usno.navy.mil/ser7/deltat.data
    http://maia.usno.navy.mil/ser7/historic_deltat.data
EOS
)
  for url in $urls; do
    f=$(file $url)
    $curl $url > $target/$f
  done
}

deltat
vsop
