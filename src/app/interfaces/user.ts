export interface User {
  id: string,
  name: string,
  loggedIn: boolean,
  email: string,
  imageUrl: string | null,
  isLoading: true,
  password: string,
  company: string | null,
  preferences: object,
  termsVersion: string | null
}

export interface GroupMemberUser extends User {
  userId?: string,
  phoneNumber?: string | number,
  level?: string,
  groupId: string,
  latestActivity: string
}

export interface TopicMemberUser extends User {
  userId?: string,
  phoneNumber?: string | number,
  level?: string,
  topicId: string,
  latestActivity: string
}
