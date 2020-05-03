#!/bin/bash

for dir in "../src/layers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules
        rm "$dir"/package-lock.json
    fi
done

for dir in "../src/handlers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules
        rm "$dir"/package-lock.json
    fi
done
