import axios from 'axios'
import { Jumoresque, VkResponse } from '../../../domain/domain'
import properties from '../../../properties-reader'

const accessToken: string = properties.vk.accessToken
const version: string = properties.vk.apiVersion

export default async function fetchJumoresques (domain: string): Promise<Jumoresque[]> {
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
