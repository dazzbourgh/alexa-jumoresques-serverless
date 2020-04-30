#!/bin/bash

npm install
npm run build
#find ./node_modules -type f -exec touch {} +
mkdir common_layer
mkdir common_layer/nodejs
cp -RL node_modules common_layer/nodejs
aws cloudformation package --template-file infrastructure/template.yml --s3-bucket jumoresques-lambda-bucket --output-template-file packaged-template.yml
aws cloudformation deploy --template-file packaged-template.yml --stack-name alexa-jumoresques-serverless-prod-stack --region us-west-1 --capabilities CAPABILITY_IAM --parameter-overrides Env=production
rm -rf common_layer
rm packaged-template.yml
