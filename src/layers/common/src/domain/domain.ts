import { Readable } from 'stream'

export interface Jumoresque {
  text: string
  likes: number
}

export interface AudioFileDetails {
  bucket: {
    name: string
  }
  object: {
    key: string
  }
}

export interface S3Notification {
  Records: [
    {
      s3: AudioFileDetails
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

export interface LambdaEvent {
  Records: [{
    body: string
  }]
}

export type Props = any

export interface YandexUploadFileResponse {
  sound: {
    id: string
    skillId: string
    size: number | null
    originalName: string
    error: string | null
  }
}

export interface YandexSkillRequest {
  meta: {
    locale: string
    timezone: string
    client_id: string
  }
  request: {
    command: string
    original_utterance: string
    type: string
    markup: {
      dangerous_context: true
    }
  }
  session: {
    message_id: number
    session_id: string
    skill_id: string
    user_id: string
    user: {
      user_id: string
      access_token: string
    }
    application: {
      application_id: string
    }
    new: boolean
  }
  version: string
}

export interface YandexSkillResponse {
  response: {
    text: string
    tts?: string
    end_session: boolean
  }
  version: string
}

export type BinaryFile = Buffer | Uint8Array | Blob | string | Readable
