#!/bin/bash

aws cloudformation deploy --template-file ../packaged-template.yml --stack-name alexa-jumoresques-serverless-stack-local --region us-west-1 --capabilities CAPABILITY_IAM --parameter-overrides Env=production
rm ../packaged-template.yml
