import * as AWS from 'aws-sdk';
import {PutObjectOutput, PutObjectRequest} from "aws-sdk/clients/s3";

const bucketName = process.env.BUCKET_NAME;
const s3Client = new AWS.S3();

export default function uploadToS3(key: string, audio: Buffer): Promise<PutObjectOutput> {
    const params: PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: audio
    };

    return new Promise<any>((resolve, reject) =>
        s3Client.putObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    );
}
