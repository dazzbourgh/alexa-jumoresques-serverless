import {putObject} from "../../../../../src/common/util/aws/s3/s3";
import properties from "../../../../../src/common/props/properties";

const buffer = new Buffer('some buffer', 'utf8');

const MockS3Client = jest.fn().mockImplementation(() => ({
    putObject: function () {
        return {
            promise: () => Promise.resolve()
        }
    }
}));

const mockS3Client: any = new MockS3Client()

test('should upload to s3', async () => {
    await putObject(mockS3Client)({
        Bucket: properties.aws.s3.bucketName,
        Key: properties.aws.s3.key,
        Body: buffer
    })
    expect(MockS3Client).toHaveBeenCalled()
})
