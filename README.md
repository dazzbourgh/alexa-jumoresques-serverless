# alexa-jumoresques-serverless
A serverless skill for Alexa to find top 5 funny jokes from my favorite communities and read them aloud in a funny voice.

## Infrastructure
The skill is designed to run on AWS infrastructure, a [Cloud Formation manifest](https://github.com/dazzbourgh/alexa-jumoresques-serverless/blob/master/infrastructure/template.yml) can create all the resources. 

## Build & Deployment
All build and deployment actions can be performed with convenient scripts located in [scripts directory](https://github.com/dazzbourgh/alexa-jumoresques-serverless/tree/master/scripts). The scripts will both build code & infrastructure with AWS SDK if any resources are missing.
