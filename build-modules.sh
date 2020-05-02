#!/bin/bash

for dir in "src/layers"/*; do
    if test -d "$dir"; then
        npm i --production --prefix "$dir"/nodejs
        find "$dir"/nodejs/node_modules -type f -exec touch {} +
        npm run build --prefix "$dir"/nodejs
    fi
done

for dir in "src/handlers"/*; do
    if test -d "$dir"; then
        npm i --production --prefix "$dir"
        find "$dir"/node_modules -type f -exec touch {} +
        npm run build --prefix "$dir"
    fi
done
