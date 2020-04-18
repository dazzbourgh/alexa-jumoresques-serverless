import axios from 'axios'
import properties from 'properties'
import { fetchJumoresques, Jumoresque, VkResponse } from 'common'

jest.mock('axios')
jest.mock('properties', () => ({
  __esModule: true,
  default: Promise.resolve({
    vk: {
      accessToken: '2d523c7a2d523c7a2d523c7a5d2d22249822d522d523c7a7332ad8a1f5a050425ea6a7f',
      apiVersion: '5.103'
    }
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
  const actual = await fetchJumoresques('jumoreski')
  expect(actual).toStrictEqual(jumoresques)
})
