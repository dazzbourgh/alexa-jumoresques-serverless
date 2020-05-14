import { AudioFileDetails, Props, YandexUploadFileResponse, BinaryFile } from 'common'
import { Reader } from 'monet'

export type FunctionEventMapper<T> = (event: T) => AudioFileDetails

export type AudioDownloadFunction = (details: AudioFileDetails) => Promise<BinaryFile>;

export type AudioUploadFunction = (mp3File: BinaryFile) => Promise<YandexUploadFileResponse>

export interface MapperFactory {
  createMapper: <T> (props: Props) => FunctionEventMapper<T>
}

export interface AudioFileOperationsConfig<T> {
  map: FunctionEventMapper<T>
  download: AudioDownloadFunction
  upload: AudioUploadFunction
}

export interface AudioDownloadFunctionFactory {
  createFunction: (platform: Props) => AudioDownloadFunction
}

export const audioFileDetails: <T> (event: T) => Reader<AudioFileOperationsConfig<T>, AudioFileDetails> =
    <T> (event: T) => Reader((config: AudioFileOperationsConfig<T>) => config.map(event))

export const downloadAudioFile: <T> (details: AudioFileDetails) => Reader<AudioFileOperationsConfig<T>, Promise<BinaryFile>> =
    <T> (details: AudioFileDetails) => Reader(async (config: AudioFileOperationsConfig<T>) => await config.download(details))

export const uploadAudioFile: <T> (file: Promise<BinaryFile>) => Reader<AudioFileOperationsConfig<T>, Promise<YandexUploadFileResponse>> =
    <T> (file: Promise<BinaryFile>) => Reader(async (config: AudioFileOperationsConfig<T>) => await config.upload(await file))
