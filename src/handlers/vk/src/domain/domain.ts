export interface VkResponse {
  response: {
    count: number
    items: Item[]
  }
}

export interface Item {
  id: number
  date: number
  is_pinned: number
  text: string
  likes: {
    count: number
  }
  attachments?: any[]
}
