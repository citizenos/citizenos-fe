export interface Topic {
  id:	string,
  title: string,
  description: string,
  status: string,
  visibility:	string,
  hashtag: string | null,
  join: {token: string, level: string},
  categories: string[],
  endsAt:	string | null,
  createdAt:	string,
  sourcePartnerId:	string | null,
  sourcePartnerObjectId:	string | null,
  creator: any,
  lastActivity: string | null,
  members: any,
  voteId:	string | null,
  comments: any,
  url	: string
}
