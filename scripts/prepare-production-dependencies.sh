#!/bin/bash

for dir in "../src/layers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules
        rm "$dir"/package-lock.json
        npm i --prefix "$dir" --production
        find "$dir"/node_modules -type f -exec touch {} +
    fi
done

for dir in "../src/handlers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/node_modules
        rm "$dir"/package-lock.json
        npm i --prefix "$dir" --production
        find "$dir"/node_modules -type f -exec touch {} +
        mkdir "$dir"/dependencies
        mkdir "$dir"/dependencies/nodejs
        cp -RL "$dir"/node_modules "$dir"/dependencies/nodejs
    fi
done
