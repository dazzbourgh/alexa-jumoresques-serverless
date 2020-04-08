import axios from 'axios'
import { Jumoresque, VkResponse } from '../../domain/domain'

const accessToken = process.env.VK_ACCESS_TOKEN
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const version = process.env.VK_API_VERSION || 5.103

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
