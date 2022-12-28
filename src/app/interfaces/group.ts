export interface Group {
  id:	string,
  name: string,
  description: string,
  visibility:	string,
  join: {token: string, level: string},
  createdAt:	string,
  sourcePartnerId:	string | null,
  sourcePartnerObjectId:	string | null,
  permission: {level: string},
  creator: any,
  lastActivity: string | null,
  members: any,
  userLevel: string | null,
  imageUrl: string | null
}
