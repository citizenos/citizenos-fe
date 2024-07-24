
export interface Folder {
  id: string
  ideationId: string,
  creator: {
    id: string,
    name: string,
    imageUrl: string,
    email: string}
  ,
  name: string,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  latestActivity: Date,
  ideas: {
    count: number,
    rows: any
  }
}

