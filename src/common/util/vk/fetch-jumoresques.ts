import axios from 'axios'
import { Jumoresque, VkResponse } from '../../domain/domain'
import properties from '../../props/properties'

export default async function fetchJumoresques (domain: string): Promise<Jumoresque[]> {
  const awaitedProps = await properties
  const accessToken: string = awaitedProps.vk.accessToken
  const version: string = awaitedProps.vk.apiVersion
  const response = await axios.get<VkResponse>('https://api.vk.com/method/wall.get' +
        `?domain=${domain}` +
        `&access_token=${accessToken}` +
        `&v=${version}` +
        '&count=50')
  return response.data.response.items.map((item) => ({
    text: item.text,
    likes: item.likes.count
  }))
}
