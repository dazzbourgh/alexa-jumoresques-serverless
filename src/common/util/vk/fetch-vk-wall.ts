import axios from 'axios'
import { VkResponse } from '../..'
import properties from 'properties'

export async function fetchVkWall (domain: string): Promise<VkResponse> {
  const awaitedProps = await properties
  const accessToken: string = awaitedProps.vk.accessToken
  const version: string = awaitedProps.vk.apiVersion
  const response = await axios.get<VkResponse>('https://api.vk.com/method/wall.get' +
        `?domain=${domain}` +
        `&access_token=${accessToken}` +
        `&v=${version}` +
        '&count=50')
  return response.data
}
