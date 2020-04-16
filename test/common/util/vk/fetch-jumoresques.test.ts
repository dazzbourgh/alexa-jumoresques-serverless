import axios from 'axios'
import properties from 'properties'
import { fetchJumoresques, Jumoresque, VkResponse } from 'common'

jest.mock('axios')
jest.mock('properties', () => ({
  __esModule: true,
  default: Promise.resolve({
    vk: {}
  })
}))

const mockVkResponse: VkResponse = {
  response: {
    count: 1,
    items: [
      {
        id: 1,
        date: 1,
        is_pinned: 0,
        text: 'some text',
        likes: {
          count: 10
        }
      }
    ]
  }
}

const mockResponse = {
  data: mockVkResponse
}

Object.defineProperty(properties, 'default', {
  get: Promise.resolve
});

const jumoresques: Jumoresque[] = [{
  text: 'some text',
  likes: 10
}]

test('should fetch jumoresques from vk', async () => {
  // @ts-ignore
  axios.get.mockResolvedValue(mockResponse)
  const actual = fetchJumoresques('jumoresques')
  await expect(actual).resolves.toStrictEqual(jumoresques)
})
