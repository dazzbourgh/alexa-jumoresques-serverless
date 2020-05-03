#!/bin/bash

aws cloudformation package --template-file ../infrastructure/template.yml --s3-bucket jumoresques-lambda-bucket --output-template-file ../packaged-template.yml
aws cloudformation deploy --template-file ../packaged-template.yml --stack-name alexa-jumoresques-serverless-stack --region us-west-1 --capabilities CAPABILITY_IAM --parameter-overrides Env=production
rm ../packaged-template.yml
