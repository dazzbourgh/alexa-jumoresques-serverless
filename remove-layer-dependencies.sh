#!/bin/bash

for dir in "src/handlers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules/common
        rm -r "$dir"/node_modules/properties
    fi
done
