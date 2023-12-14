export interface Argument {
  id:	string,
  subject: string,
  text: string,
  type: string,
  createdAt:	string,
  deletedAt: string | null,
  deletedBy: {
    id: string | null,
    name: string | null
  },
  deletedReasonText: string | null,
  deletedReasonType: string | null,
  showDeletedArgument: boolean | undefined,
  creator: {
    id: string,
    name: string,
    company: string | null,
    email: string | null,
    imageUrl: string | null,
    phoneNumber: string | null,
  },
  edits: any[],
  parent: {
    id: string,
    version: number,
    creator?: {
      id: string,
      name: string,
      company: string | null,
      email: string | null,
      imageUrl: string | null,
      phoneNumber: string | null,
    },
  },
  replies: any,
  report: {
    id: string | null
  },
  updatedAt:	string,
  votes: {
    up:{
      count: number,
      selected: boolean
    },
    down:{
      count: number,
      selected: boolean
    },
    count: number
  },
  showEdits: boolean
}

