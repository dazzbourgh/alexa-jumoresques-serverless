export interface VkResponse {
  response: {
    count: number
    items: [
      {
        id: number
        date: number
        is_pinned: number
        text: string
        likes: {
          count: number
        }
      }
    ]
  }
}

export interface Jumoresque {
  text: string
  likes: number
}
