#!/bin/bash

for dir in "../src/handlers"/*; do
    if test -d "$dir"; then
        rm -r "$dir"/dependencies
    fi
done
