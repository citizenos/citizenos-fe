
export interface Discussion {
  id: string,
  question: string,
  creator?: {
    id: string,
    name: string,
    imageUrl: string,
    email: string
  },
  creatorId: string,
  deadline: null | Date
  createdAt: Date,
  updatedAt: Date,
  comments: {
    count: number
  }
}

