import {putObject} from "../../../../../src/common/util/aws/s3/s3";
import S3 from "aws-sdk/clients/s3";

const buffer = new Buffer('some buffer', 'utf8');

const mockPut = jest.fn(() => ({
    promise: () => Promise.resolve()
}))

const mockS3 = {
    putObject: mockPut
} as unknown as S3

test('should upload to s3', async () => {
    const result = putObject(mockS3)({
        Bucket: 'some-bucket',
        Key: 'some-key',
        Body: buffer
    })
    await expect(result).resolves.toBeUndefined()
    expect(mockPut).toHaveBeenCalled()
})
