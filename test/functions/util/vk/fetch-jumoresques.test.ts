import fetchJumoresques from '../../../../src/functions/util/vk/fetch-jumoresques'
import { Jumoresque, VkResponse } from '../../../../src/domain/domain'
import axios from 'axios'

jest.mock('axios')

const mockResponse: VkResponse = {
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

const jumoresques: Jumoresque[] = [{
  text: 'some text',
  likes: 10
}]

test('should fetch jumoresques from vk', async () => {
  // @ts-ignore
  axios.get.mockResolvedValue(mockResponse)
  await expect(fetchJumoresques('jumoresques')).resolves.toBe(jumoresques)
})
