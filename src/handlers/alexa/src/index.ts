import * as Alexa from 'ask-sdk'
import { HandlerInput } from 'ask-sdk'
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler'
import { CustomSkillErrorHandler } from 'ask-sdk-core/dist/dispatcher/error/handler/CustomSkillErrorHandler'
import properties from 'properties'
import { linkFactory } from './link'

const controller = {
  async play (handlerInput: HandlerInput) {
    const playBehavior = 'REPLACE_ALL'
    const awaitedProps = (await properties)
    const jumoresqueUrl = linkFactory.createLink(awaitedProps)

    const builder = handlerInput.responseBuilder
      .speak('Here are some humoresques:')
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, jumoresqueUrl, jumoresqueUrl, 0)

    return builder.getResponse()
  },
  stop (handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse()
  }
}

const HelpHandler: CustomSkillRequestHandler = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'IntentRequest' &&
        request.intent.name === 'AMAZON.HelpHandler'
  },
  handle (handlerInput) {
    return handlerInput.responseBuilder
      .speak('If you want to hear new humoresques, say "Ask My Favorite Admin to tell jokes"')
      .getResponse()
  }
}

const TellJumoresquesHandler: CustomSkillRequestHandler = {
  canHandle (input: HandlerInput) {
    const request = input.requestEnvelope.request
    return request.type === 'IntentRequest' && request.intent.name === 'JumoresquesIntent'
  },
  async handle (handlerInput: HandlerInput) {
    return await controller.play(handlerInput)
  }
}

const StopHandler: CustomSkillRequestHandler = {
  canHandle (input: HandlerInput): Promise<boolean> | boolean {
    const request = input.requestEnvelope.request
    return request.type === 'IntentRequest' &&
    (request.intent.name === 'AMAZON.StopIntent' ||
            request.intent.name === 'AMAZON.PauseIntent' ||
            request.intent.name === 'AMAZON.CancelIntent')
  },
  handle (input: HandlerInput) {
    return controller.stop(input)
  }
}

const ErrorHandler: CustomSkillErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput: HandlerInput, error: Error) {
    console.error(error)
    const speakOutput = 'No new jokes are available at this moment'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse()
  }
}

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    TellJumoresquesHandler,
    HelpHandler,
    StopHandler
  )
  .addErrorHandlers(
    ErrorHandler
  )
  .lambda()
