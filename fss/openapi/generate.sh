#!/bin/bash -eux

cd "$(dirname $0)"
base_dir=$(pwd)

usage() {
    echo "sh generate.sh -t {FESS_VERSION}"
}


for OPT in "$@" ; do
    case $OPT in
        -t | --tag)
            FESS_TAG=$2
            shift 2
            ;;
        *)
            if [[ ! -z "$1" ]] && [[ ! "$1" =~ ^-+ ]]; then
                shift 1
            fi
            ;;
    esac
done

if [ -e "$base_dir/work" ] ; then
    echo "Remove old work dir..."
    rm -rf $base_dir/work
fi
echo "Create work dir..."
mkdir $base_dir/work

echo "Clone fess repository."
git clone https://github.com/codelibs/fess.git ./work/fess
if [[ "x$FESS_TAG" != x ]] ; then
    echo "Checkout tat:$FESS_TAG"
    cd $base_dir/work/fess
    git checkout tags/$FESS_TAG
    cd $base_dir
fi

echo "Run OpenApi Generator..."
mkdir $base_dir/work/volume
cp $base_dir/work/fess/src/main/config/openapi/openapi-user.yaml $base_dir/work/volume
docker run --rm \
    -v ${PWD}/work/volume:/local \
    openapitools/openapi-generator-cli:v7.18.0 generate \
    -i /local/openapi-user.yaml \
    -g typescript-axios \
    --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,modelPackage=model,apiPackage=api \
    -o /local/out/typescript

if [[ "x$FESS_TAG" != x ]] ; then
    module_version=$FESS_TAG
else
    module_version="main"
fi
module_dir="$base_dir/../src/openapi/$module_version"

if [ -e "$module_dir" ] ; then
    echo "Remove old code dir..."
    rm -rf $module_dir
fi
echo "Copy generated codes to $module_dir"
mkdir $module_dir
cp -r $base_dir/work/volume/out/typescript/* $module_dir

echo "OpenAPI TypeScript generation complete!"
