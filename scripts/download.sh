#!/bin/bash

# script to download datasets

curl=curl
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
target=$cwd/../attic

test ! -d $target && mkdir -p $target

## get filename
function file () {
  echo $1 | sed "s/^.*\/\([^\/]*\)$/\1/"
}

## VSOP87 data
function vsop () {
  local url=ftp://cdsarc.u-strasbg.fr/pub/cats/VI/81
  local file="VSOP87B"
  local exts="mer ven ear mar jup sat ura nep"

  for ext in $exts; do
    $curl $url/$file.$ext > $target/$file.$ext
  done
}

## convert VSOP87 data
function vsop_conv () {
  node $cwd/vsop87convert.js
}

## DeltaT data
# primary: ftp://maia.usno.navy.mil
# secondary: ftp://toshi.nofs.navy.mil
function deltat () {
  local server="http://maia.usno.navy.mil/ser7"
  local urls=$(cat << EOS
    $server/deltat.preds
    $server/deltat.data
    $server/historic_deltat.data
    $server/finals2000A.data
    $server/tai-utc.dat
EOS
)
  for url in $urls; do
    f=$(file $url)
    $curl $url > $target/$f
  done
}

## convert DeltaT data
function deltat_conv () {
  node $cwd/deltat.js > $target/deltat.txt
}

function help () {
  cat << EOS

    download dataset for VSOP87 data and/or delta-T

    Usage:

    -t, --deltat    download delta T data
    -v, --vsop      download VSOP87 data
    -h, --help      this help

EOS
}

case $1 in
  -t|--deltat)
    deltat
    deltat_conv
    ;;
  -v|--vsop)
    vsop
    vsop_conv
    ;;
  -a|--all)
    deltat
    deltat_conv
    vsop
    vsop_conv
    ;;
  -h|--help)
    help
    ;;
  *)
    help
    ;;
esac
