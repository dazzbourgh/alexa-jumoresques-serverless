import axios from 'axios'
import { vkWallFetcher } from './vk-wall-fetcher'

export const fetchVkWall = vkWallFetcher(axios)
