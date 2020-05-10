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
