#!/bin/bash

for dir in "src/layers"/*; do
    if test -d "$dir"; then
        find "$dir"/nodejs/node_modules -type f -exec touch {} +
        npm i --prefix "$dir"/nodejs
        npm run build --prefix "$dir"/nodejs
    fi
done

for dir in "src/handlers"/*; do
    if test -d "$dir"; then
        find "$dir"/node_modules -type f -exec touch {} +
        npm i --prefix "$dir"
        npm run build --prefix "$dir"
    fi
done
