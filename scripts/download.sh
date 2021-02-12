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
  local files="VSOP87B VSOP87D"
  local exts="mer ven ear mar jup sat ura nep"

  for file in $files; do
    for ext in $exts; do
      $curl $url/$file.$ext > $target/$file.$ext
    done
  done 
}

## convert VSOP87 data
function vsop_conv () {
  node $cwd/vsop87convert.cjs
}

## ELPMPP data
function elpmpp () {
  local url=ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02
  local files="ELP_MAIN.S1 ELP_MAIN.S2 ELP_MAIN.S3 ELP_PERT.S1 ELP_PERT.S2 ELP_PERT.S3"

  for file in $files; do
    $curl $url/$file > $target/$file
  done
}

## convert ELPMPP data
function elpmpp_conv () {
  node $cwd/elpmppconvert.cjs
}

## DeltaT data
# primary:   ftp://maia.usno.navy.mil
# secondary: ftp://toshi.nofs.navy.mil
# iers:      ftp://ftp.iers.org/products/eop/rapid/standard
# As of https://www.usno.navy.mil/USNO server maia.usno.navy.mil is being modernized till summer 2020
# outdated prediction data is accessible from
# curl -v --ftp-ssl ftp://gdc.cddis.eosdis.nasa.gov/products/iers/deltat.preds
function deltat () {
  local server="ftp://ftp.iers.org/products/eop/rapid/standard"
  local urls=(
    $server/finals2000A.data
  )
  for url in ${urls[@]}; do
    f=$(file $url)
    echo downloading $url
    $curl $url > $target/$f
  done

  local server2="ftp://gdc.cddis.eosdis.nasa.gov/products/iers"
  local urls2=(
    $server2/deltat.preds
    $server2/deltat.data
    $server2/historic_deltat.data
    $server2/tai-utc.dat
  )
  for url in ${urls2[@]}; do
    f=$(file $url)
    echo downloading $url
    $curl --ftp-ssl $url > $target/$f
  done
}

## convert DeltaT data
function deltat_conv () {
  node $cwd/deltat.cjs > $target/deltat.txt
}

function help () {
  cat << EOS

    download dataset for VSOP87 data and/or delta-T

    Usage:

    -t, --deltat    download delta T data
    -v, --vsop      download VSOP87 data
    -e, --elp       download ELPMPP data
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
    elpmpp
    elpmpp_conv
    ;;
  -a|--all)
    deltat
    deltat_conv
    vsop
    vsop_conv
    elpmpp
    elpmpp_conv
    ;;
  -h|--help)
    help
    ;;
  *)
    help
    ;;
esac
