#!/bin/bash

./clean.sh
./build-modules.sh
./prepare-production-dependencies.sh
./deploy.sh
./remove-production-dependencies.sh