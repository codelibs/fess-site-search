#!/bin/sh

cd `dirname $0`

if [ x"$OUTPUT_JS_FILENAME" = "x" ] ; then
  export OUTPUT_JS_FILENAME=fess-ss.min.js
fi
npm run start
