import fetchJumoresques from '../../../../src/common/util/vk/fetch-jumoresques'
import { Jumoresque, VkResponse } from '../../../../src/common/domain/domain'
import axios from 'axios'

jest.mock('axios')

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
