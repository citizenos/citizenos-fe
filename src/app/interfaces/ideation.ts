
export interface Ideation {
  id: string,
  question: string,
  creator?: {
    id: string,
    name: string,
    imageUrl: string,
    email: string
  },
  folders:{
    count:
    number
  },
  creatorId: string,
  deadline: null | string
  createdAt: Date,
  updatedAt: Date,
  ideas: {
    count: number
  },
<<<<<<< HEAD
  disableReplies: boolean
=======
  disableReplies: boolean,
  allowAnonymous: boolean
>>>>>>> master
}

