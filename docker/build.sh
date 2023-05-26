#!/bin/bash
dirLocation=$(dirname "$0")
modules=("server")

if [ $# -eq 0 ]
 then
  echo "You need to pass the module as a parameter"
  echo "Possible names:"
  echo "${modules[@]}"
  exit 1
fi

# shellcheck disable=SC2199
# shellcheck disable=SC2076
# shellcheck disable=SC2082
if [[ ! " ${modules[@]} " =~ " $1 " ]]; then
    echo "Unsupported module name"
    echo "${modules[@]}"
    exit 1
fi

echo "Starting build..."
docker build -t y"docker.endrealm.net/shareover/$1" -f "${dirLocation}/$1.Dockerfile" "${dirLocation}/.."
echo "Ended build..."