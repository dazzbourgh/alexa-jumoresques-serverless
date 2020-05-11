export interface CacheRequest {
  tableName: string
  item: { [key: string]: string }
}

export interface CacheService {
  put: PutToCache
}

export type RunService = (service: CacheService) => Promise<void>
export type PutToCache = (req: CacheRequest) => Promise<void>
export type CacheMonad = (req: CacheRequest) => RunService

export const putToCache: CacheMonad = (req): RunService =>
  async service => await service.put(req)
