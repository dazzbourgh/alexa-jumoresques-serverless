import { PutObjectOutput } from 'aws-sdk/clients/s3'
import fetchJumoresques from '../util/vk/fetch-jumoresques'
import { Jumoresque } from '../../domain/domain'
import textToSpeech from '../util/aws/polly/text-to-speech'
import uploadToS3 from '../util/aws/s3/upload-to-s3'

export default async function refreshHandler (): Promise<PutObjectOutput> {
  const jumoresques: Jumoresque[] = await fetchJumoresques('jumoreski')
  const text: string = jumoresques
    .sort((a, b) => a.likes - b.likes)
    .slice(0, 5)
    .reduce((prev, cur) => `${prev}\n\n${cur.text}`, '')
  const audio: Buffer = await textToSpeech(text)
  return await uploadToS3('jumoresques.mp3', audio)
}
