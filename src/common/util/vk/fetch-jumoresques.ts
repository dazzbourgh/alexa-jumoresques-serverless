import axios from 'axios'
import { Jumoresque, VkResponse } from '../..'
import properties from 'properties'
import { noAttachments } from '../generic/generic-utils'

export async function fetchJumoresques (domain: string): Promise<Jumoresque[]> {
  const awaitedProps = await properties
  const accessToken: string = awaitedProps.vk.accessToken
  const version: string = awaitedProps.vk.apiVersion
  const response = await axios.get<VkResponse>('https://api.vk.com/method/wall.get' +
        `?domain=${domain}` +
        `&access_token=${accessToken}` +
        `&v=${version}` +
        '&count=50')
  const items = response.data.response.items.filter(noAttachments)
  return items.map((item) => ({
    text: item.text,
    likes: item.likes.count
  }))
}
