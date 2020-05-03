#!/bin/bash

for dir in "../src/layers"/*; do
    if test -d "$dir"; then
        npm i --prefix "$dir"
        find "$dir"/node_modules -type f -exec touch {} +
        npm run build --prefix "$dir"
    fi
done

for dir in "../src/handlers"/*; do
    if test -d "$dir"; then
        npm i --prefix "$dir"
        find "$dir"/node_modules -type f -exec touch {} +
        npm run build --prefix "$dir"
    fi
done
