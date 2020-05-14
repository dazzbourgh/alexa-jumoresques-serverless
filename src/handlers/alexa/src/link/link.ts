function getAwsLink (props: any): string {
  const bucketUrl = `https://${props.aws.s3.bucketName}.s3-us-west-1.amazonaws.com`
  return `${bucketUrl}/${props.aws.s3.key}`
}

export const linkFactory = {
  createLink: (props: any) => {
    switch (props.provider) {
      case 'aws':
        return getAwsLink(props)
      default:
        return getAwsLink(props)
    }
  }
}
