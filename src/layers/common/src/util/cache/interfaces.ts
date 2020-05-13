import { Reader } from 'monet'
import { Props } from '../../domain'

export interface CacheConfig {
  mapper: (value?: string) => CacheRequest
  service: CacheService
}

export interface CacheRequest {
  tableName: string
  item: { [key: string]: string }
}

export interface CacheService {
  put: (req: CacheRequest) => Promise<void>

  get: (req: CacheRequest) => Promise<string>
}

export interface CacheFactory {
  createCache: (props: Props) => CacheService
}

export const mapToCacheRequest = (value?: string): Reader<CacheConfig, CacheRequest> =>
  Reader(conf => conf.mapper(value))

export const putToCache = (req: CacheRequest): Reader<CacheConfig, Promise<void>> =>
  Reader(async config => await config.service.put(req))

export const getFromCache = (req: CacheRequest): Reader<CacheConfig, Promise<string>> =>
  Reader(async config => await config.service.get(req))
