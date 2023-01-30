import {Vote} from './vote';

export interface Topic {
  authors: any[],
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
  updatedAt: string,
  sourcePartnerId:	string | null,
  sourcePartnerObjectId:	string | null,
  permission: {level: string, levelGroup?: string},
  creator: any,
  lastActivity: string | null,
  members: any,
  voteId:	string | null,
  comments: any,
  url	: string,
  pinned?: boolean | null,
  imageUrl: string | null,
  report?: {
    id: string,
    type: null | string,
    moderatedReasonType: string | null
  },
  vote?: Vote
}
