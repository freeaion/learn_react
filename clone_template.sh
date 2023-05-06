#!/usr/bin/env bash

prj="${1:-}"

cp -fr template "${prj}"
mkdir -p "${prj}"/dist
mv "${prj}"/index.html "${prj}"/dist
