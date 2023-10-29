import {Vote} from './vote';

export interface Topic {
  authors: any[],
  id:	string,
  title: string | null,
  intro: string,
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
  country: string | null,
  language: string | null,
  members: any,
  voteId:	string | null,
  comments: any,
  padUrl: any,
  favourite?: boolean | null,
  imageUrl: string | null,
  report?: {
    id: string,
    type: string | null,
    text: string | null,
    moderatedReasonType: string | null,
    moderatedReasonText: string | null
  },
  vote?: Vote
}
