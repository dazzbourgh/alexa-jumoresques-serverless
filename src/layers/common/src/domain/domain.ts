export interface VkResponse {
  response: {
    count: number
    items: Item[]
  }
}

export interface Item {
  id: number
  date: number
  is_pinned: number
  text: string
  likes: {
    count: number
  }
  attachments?: any[]
}

export interface Jumoresque {
  text: string
  likes: number
}

export interface S3Details {
  bucket: {
    name: string
    arn: string
  }
  object: {
    key: string
    size: number
    eTag: string
  }
}

export interface S3Notification {
  Records: [
    {
      s3: S3Details
    }
  ]
}

export interface DynamoItem {
  key: string
  value: string
}

export interface ApiGatewayResponse {
  isBase64Encoded: boolean
  statusCode: number
  headers: { [key: string]: string}
  body: string
}
