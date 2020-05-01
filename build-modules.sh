#!/bin/bash

for dir in "src/layers"/*; do
    if test -d "$dir"; then
        npm run build --prefix "$dir"/nodejs
    fi
done

for dir in "src/handlers"/*; do
    if test -d "$dir"; then
        npm run build --prefix "$dir"
    fi
done
