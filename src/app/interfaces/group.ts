export interface Group {
  id:	string,
  name: string,
  description: string,
  visibility:	string,
  join: {token: string, level: string},
  createdAt:	string,
  updatedAt: string,
  sourcePartnerId:	string | null,
  sourcePartnerObjectId:	string | null,
  permission?: {level: string},
  creator: any,
  lastActivity: string | null,
  members: any,
  userLevel: string | null,
  imageUrl: string | null,
  language: string | null,
  country: string | null,
  categories: string[] | null,
  rules: string[],
  contact: string | null,
  favourite?: boolean | null,
  inviteMessage: string | null | undefined //optional field while creating groups
}

export interface TopicMemberGroup extends Group {
  userId?: string,
  phoneNumber?: string | number,
  level?: string,
  groupId: string,
  latestActivity: string
}
