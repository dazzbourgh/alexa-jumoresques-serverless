#!/bin/bash

for dir in "src/layers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/nodejs/node_modules
    fi
done

for dir in "src/handlers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules
    fi
done
