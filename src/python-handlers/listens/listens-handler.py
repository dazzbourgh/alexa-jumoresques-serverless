import boto3


def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    count = listen_counter(dynamodb)
    count(event)


def listen_counter(dynamodb):
    def count(event):
        table = dynamodb.Table
        records_count = len(event["Records"])
    return count
