#!/bin/bash

# script to download datasets

curl=curl
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
target=$cwd/../attic

# set -x

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

## ELP MPP data
function elp () {
  local url=ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02
  local files="ELP_MAIN.S1 ELP_MAIN.S2 ELP_MAIN.S3 ELP_PERT.S1 ELP_PERT.S2 ELP_PERT.S3"

  for file in $files; do
    $curl $url/$file > $target/$file
  done
}

## convert ELPMPP data
function elp_conv () {
  node $cwd/elpmpp02convert.js
}

## DeltaT data
# primary:   ftp://maia.usno.navy.mil
# secondary: ftp://toshi.nofs.navy.mil
# iers:      ftp://ftp.iers.org/products/eop/rapid/standard
# As of https://www.usno.navy.mil/USNO server maia.usno.navy.mil is being modernized till summer 2020
function deltat () {
  local server="http://maia.usno.navy.mil/ser7"
  local server2="ftp://ftp.iers.org/products/eop/rapid/standard"
  local urls=(
    $server2/finals2000A.data
    # $server/deltat.preds
    # $server/deltat.data
    # $server/historic_deltat.data
    # $server/finals2000A.data
    # $server/tai-utc.dat
  )

  for url in $urls; do
    f=$(file $url)
    echo downloading $url
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
    -e, --elp       download ELPMPP02 data
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
  -e|--elp)
    elp
    elp_conv
    ;;
  -a|--all)
    deltat
    deltat_conv
    vsop
    vsop_conv
    elp
    elp_conv
    ;;
  -h|--help)
    help
    ;;
  *)
    help
    ;;
esac
