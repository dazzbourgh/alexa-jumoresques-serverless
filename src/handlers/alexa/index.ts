import * as Alexa from 'ask-sdk'
import { HandlerInput } from 'ask-sdk'
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler'
import { CustomSkillErrorHandler } from 'ask-sdk-core/dist/dispatcher/error/handler/CustomSkillErrorHandler'
import properties from 'properties'

const controller = {
  async play (handlerInput: HandlerInput) {
    const playBehavior = 'REPLACE_ALL'
    const awaitedProps = (await properties).aws.s3
    const url = `https://${awaitedProps.bucketName}.s3-us-west-1.amazonaws.com/${awaitedProps.key}`

    handlerInput.responseBuilder
      .speak('Here are some jumoresques:')
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, url, url, 0)

    return handlerInput.responseBuilder.getResponse()
  },
  stop (handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse()
  }
}

const TellJumoresquesHandler: CustomSkillRequestHandler = {
  canHandle () {
    return true
  },
  async handle (handlerInput: HandlerInput) {
    return await controller.play(handlerInput)
  }
}

const ErrorHandler: CustomSkillErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput: HandlerInput, error: Error) {
    const speakOutput = `${(error.stack ?? '').toString().substring(0, 120)}`

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse()
  }
}

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    TellJumoresquesHandler
  )
  .addErrorHandlers(
    ErrorHandler
  )
  .lambda()
