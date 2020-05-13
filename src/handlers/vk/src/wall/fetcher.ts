import { AxiosStatic } from 'axios'
import { VkResponse } from 'common'

export function fetcher (axios: AxiosStatic): (properties: any) => Promise<VkResponse> {
  return async (properties: any) => {
    const awaitedProps = await properties
    const accessToken: string = awaitedProps.vk.accessToken
    const version: string = awaitedProps.vk.apiVersion
    const response = await axios.get<VkResponse>('https://api.vk.com/method/wall.get' +
        `?domain=${awaitedProps.vk.domain}` +
        `&access_token=${accessToken}` +
        `&v=${version}` +
        '&count=50')
    return response.data
  }
}
