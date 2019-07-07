#!/bin/bash -eux

## Python
pip3 install -r requirements.txt

## Node.js
FESS_VERS=("12.7", "current")

SCRIPT_DIR=$(cd $(dirname $0); pwd)

for ver in ${FESS_VERS[@]}; do
  cd ${SCRIPT_DIR}/fss/${ver}/
  npm install
done

echo "Done: install"
