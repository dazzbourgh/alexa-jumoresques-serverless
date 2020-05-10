#!/bin/bash

aws cloudformation package --template-file ../infrastructure/template.yml --s3-bucket jumoresques-lambda-bucket --output-template-file ../packaged-template.yml
