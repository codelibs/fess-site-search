#!/bin/bash -eux

DIR=$(cd $(dirname $0);pwd)
cd $DIR

# Clone Fess as a submodule
git submodule init
git submodule update

# Install webpack
cd ${DIR}/webpack/
npm install

cd ${DIR}
